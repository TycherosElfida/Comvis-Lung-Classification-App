from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from .model_service import ModelService

router = APIRouter()

# Initialize model service
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../models/best_model_finetuned.pth"))
print(f"Initializing ModelService with path: {MODEL_PATH}")
model_service = ModelService(MODEL_PATH)

# Create a thread pool executor
executor = ThreadPoolExecutor(max_workers=1)

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    print(f"Received prediction request for file: {file.filename}")
    if not model_service.model:
        print("Error: Model not loaded")
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        image_bytes = await file.read()
        print(f"Read {len(image_bytes)} bytes from file")
        
        # Run prediction in a separate thread to avoid blocking the event loop
        loop = asyncio.get_event_loop()
        predictions = await loop.run_in_executor(executor, model_service.predict, image_bytes)
        
        print("Prediction successful")
        return {"predictions": predictions}
    except Exception as e:
        print(f"Error processing request: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
