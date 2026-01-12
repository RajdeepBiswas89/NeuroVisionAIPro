# NeuroVisionAI Pro - Brain Tumor Detection Platform

A comprehensive AI-powered brain tumor detection platform using Vision Transformer (ViT) models with additional healthcare services including medicine ordering and UPI payment integration.

## Features

- **AI-Powered Detection**: Advanced Vision Transformer model for brain tumor detection from MRI scans
- **Real-time Medicine Ordering**: Find and order medicines at competitive prices
- **UPI Payment Gateway**: Secure Indian UPI payment integration with commission system
- **Google Maps Integration**: Pharmacy location and distance tracking
- **Voice Commands**: Hands-free navigation and control
- **3D Medical Visualization**: Interactive 3D brain models and medical avatars
- **Real-time Analytics**: Order tracking and business insights

## Tech Stack

### Frontend
- React with TypeScript
- Vite build tool
- Tailwind CSS for styling
- Framer Motion for animations (mocked for compatibility)
- Three.js for 3D visualizations

### Backend
- FastAPI for REST API
- PyTorch for deep learning model
- SQLite for order database
- Python for backend services

### AI Model
- Vision Transformer (ViT) model
- Pre-trained on brain tumor datasets
- 4-class classification (Glioma, Meningioma, No Tumor, Pituitary)

## Installation

### Frontend Setup
```bash
cd BRAIN-TUMOR-DETECTION-USING-VIT-MODEL
npm install
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in the frontend root with:
```
VITE_API_URL=http://localhost:8000  # Backend API URL
GEMINI_API_KEY=your_api_key_here    # Google Gemini API key
```

## Running the Application

### Backend (API Server)
```bash
cd backend
python main.py
```

### Frontend (Development Server)
```bash
cd BRAIN-TUMOR-DETECTION-USING-VIT-MODEL
npm run dev
```

## Deployment

### Frontend on Vercel
The frontend is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel.

### Backend on Render
The backend includes a `render.yaml` configuration file for easy deployment on Render.

## Medicine Ordering System

The platform includes a comprehensive medicine ordering system that:
1. Searches for medicines across multiple pharmacies
2. Compares prices in real-time
3. Calculates optimal delivery routes
4. Processes UPI payments
5. Automatically sends 5% commission to the platform owner's UPI ID: `rajdeepbiswas403-1@okhdfcbank`

## API Endpoints

### Brain Tumor Detection
- `POST /predict` - Upload MRI image for tumor detection
- `GET /` - API health check

### Medicine Ordering
- `GET /api/medicine/search/{query}` - Search for medicines
- `POST /api/medicine/order` - Place medicine order
- `GET /api/medicine/order/{order_id}` - Get order status
- `GET /api/medicine/analytics` - Get business analytics

## Project Structure

```
BRAIN-TUMOR-DETECTION-USING-VIT-MODEL/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main API server
│   ├── predictor_module.py # AI model predictor
│   ├── download_model.py   # Model download script
│   └── requirements.txt    # Python dependencies
├── components/             # React components
│   ├── layout/             # Layout components
│   ├── AIAvatar.tsx        # AI assistant avatar
│   ├── Brain3D.tsx         # 3D brain visualization
│   └── ...                 # Other UI components
├── pages/                  # React pages
├── public/                 # Static assets
├── package.json            # Frontend dependencies
└── README.md               # This file
```

## Final Year Project

This project represents a comprehensive solution for brain tumor detection with additional healthcare services, demonstrating advanced concepts in:
- Deep learning and computer vision
- Full-stack web development
- Real-time payment processing
- 3D visualization
- Voice command systems
- Mobile-responsive design

## License

This project is for academic purposes as part of a final year project.