
import torch
import torchvision.transforms as transforms
from PIL import Image
import os
import sys
from app.core.config import settings

# Original Model Classes (Preserved)
import torch.nn as nn
import torchvision

class BrainTumorViT(nn.Module):
    def __init__(self, num_classes=4):
        super(BrainTumorViT, self).__init__()
        self.vit = torchvision.models.vit_b_16(pretrained=False)
        self.vit.heads = nn.Sequential(
            nn.Linear(self.vit.heads.head.in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )
        
    def forward(self, x):
        return self.vit(x)

class InferenceService:
    _instance = None
    
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.classes = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = InferenceService()
        return cls._instance
        
    def load_model(self):
        if self.model is not None:
            return

        if not os.path.exists(settings.MODEL_PATH):
             # Fallback logic or error logging if model missing
             print(f"Server Warning: Model not found at {settings.MODEL_PATH}")
             return

        try:
            checkpoint = torch.load(settings.MODEL_PATH, map_location=self.device)
            self.model = BrainTumorViT(num_classes=4) # Assuming 4 classes always
            
            # Handle different checkpoint formats if necessary
            if 'model_state_dict' in checkpoint:
                self.model.load_state_dict(checkpoint['model_state_dict'])
            else:
                self.model.load_state_dict(checkpoint)
                
            self.model.to(self.device)
            self.model.eval()
            print(f"✅ Model loaded on {self.device}")
        except Exception as e:
            print(f"❌ Failed to load model: {e}")
            raise e

    def predict(self, image_bytes: bytes):
        if self.model is None:
            self.load_model()
            
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            input_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                outputs = self.model(input_tensor)
                probabilities = torch.softmax(outputs, dim=1)
                confidence, prediction = torch.max(probabilities, 1)
                
            return {
                'prediction': self.classes[prediction.item()],
                'confidence': float(confidence.item()),
                'probabilities': {
                    cls: float(prob.item()) for cls, prob in zip(self.classes, probabilities[0])
                }
            }
        except Exception as e:
            print(f"Inference Error: {e}")
            raise e


import io
inference_service = InferenceService.get_instance()
