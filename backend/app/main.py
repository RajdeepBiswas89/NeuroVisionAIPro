
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.config import settings
from app.db.base import get_db, Order
from app.services.inference_service import inference_service
from app.services.arbitrage_service import arbitrage_service

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers (Inline for simplicity, can be moved to separate files usually) ---

@app.get("/")
def root():
    return {"message": "NeuroVision Enterprise API Running"}

@app.post("/api/predict")
async def predict_tumor(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(400, detail="Invalid file type")
    
    contents = await file.read()
    try:
        result = inference_service.predict(contents)
        return result
    except Exception as e:
        raise HTTPException(500, detail=str(e))

@app.get("/api/medicine/search")
async def search_medicine(query: str):
    return await arbitrage_service.find_cheapest_medicine(query)

@app.post("/api/medicine/order")
async def place_order(
    order_data: dict,
    db: Session = Depends(get_db)
):
    try:
        order = await arbitrage_service.create_order(
            db,
            user_id=order_data.get("user_id", "guest"),
            items=order_data.get("medicines", []),
            total_amount=order_data.get("total_amount", 0),
            delivery_address=order_data.get("delivery_address", "")
        )
        return {"success": True, "order_id": order.order_id, "message": "Order placed via Arbitrage Engine"}
    except Exception as e:
        raise HTTPException(500, detail=str(e))

# --- Real-Time Dispatch & WebSocket ---
from fastapi import WebSocket, WebSocketDisconnect
from app.services.websocket_manager import manager
from app.services.dispatch_service import dispatch_service
import asyncio

@app.websocket("/ws/dispatch")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial state
        await websocket.send_json({
            "type": "INIT_FLEET",
            "data": dispatch_service.get_all_ambulances()
        })
        
        while True:
            data = await websocket.receive_json()
            # Handle incoming requests (e.g. Booking)
            if data['type'] == 'REQUEST_RIDE':
               ride_req = data['data']
               amb_id = dispatch_service.find_nearest_ambulance(
                   ride_req['pickup']['lat'], 
                   ride_req['pickup']['lng'],
                   ride_req.get('requiredType')
               )
               
               if amb_id:
                   dispatch_service.dispatch_ambulance(
                       amb_id, 
                       ride_req['pickup']['lat'], 
                       ride_req['pickup']['lng']
                   )
                   await manager.broadcast({
                       "type": "RIDE_ASSIGNED",
                       "bookingId": ride_req.get('id'),
                       "ambulanceId": amb_id
                   })
               else:
                   await websocket.send_json({"type": "NO_AMBULANCE_AVAILABLE"})

    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Background task to broadcast updates
@app.on_event("startup")
async def start_broadcast_loop():
    asyncio.create_task(broadcast_state())

async def broadcast_state():
    while True:
        await asyncio.sleep(1) # Broadcast every second
        fleet_state = dispatch_service.get_all_ambulances()
        await manager.broadcast({
            "type": "FLEET_UPDATE",
            "data": fleet_state
        })


from app.services.pricing_service import pricing_service

@app.get("/api/pricing/quote")
async def get_pricing_quote(urgency: str = "URGENT"):
    return pricing_service.get_sla_quote(urgency)

# --- Pre-Decision Field (PDF) Endpoints ---
from app.services.topology_field import topology_field
from app.services.bias_injector import bias_injector
from app.services.entropy_daemon import entropy_daemon

@app.get("/api/field/topology")
async def get_field_topology():
    return topology_field.get_field_snapshot()

@app.post("/api/field/bias")
async def inject_bias(data: dict):
    # data: {lat, lng, type}
    bias_injector.inject_bias(data['lat'], data['lng'])
    return {"status": "BIAS_INJECTED"}

@app.get("/api/field/entropy")
async def get_system_entropy():
    return entropy_daemon.measure_system_stress()



from app.services.llm_service import llm_service

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    response = await llm_service.get_chat_response(request.message, request.context)
    return {"response": response}

@app.get("/api/analytics")
async def get_analytics(db: Session = Depends(get_db)):
    total_orders = db.query(Order).count()
    total_commission = db.query(Order).with_entities(Order.commission).all()
    commission_sum = sum([c[0] for c in total_commission if c[0]])
    
    return {
        "orders": total_orders,
        "revenue": commission_sum,
        "model_accuracy": "96.4%" # Static for now
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
