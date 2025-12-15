"""
FastAPI Endpoints for Krida LungVision AI Service
"""
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Dict
from .model_service import get_model_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Allowed image MIME types
ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/predict", response_model=Dict)
async def predict_xray(
    file: UploadFile = File(...),
    threshold: float = 0.3  # Lower threshold to show more predictions
):
    """
    Chest X-Ray Pathology Classification Endpoint
    
    Args:
        file: Uploaded image file (JPG/PNG)
        threshold: Minimum confidence score (default: 0.3)
        
    Returns:
        JSON response with predictions array containing:
        - label: Pathology name
        - score: Confidence score (0-1)
        - confidence_pct: Percentage (0-100)
        - severity: Classification (high/medium/low)
        - urgency_tier: Clinical urgency (critical/moderate/routine)
    """
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_TYPES)}"
        )
    
    # Read file bytes
    try:
        image_bytes = await file.read()
        
        # Validate file size
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024)}MB"
            )
        
        # Get model service and run inference
        model_service = get_model_service()
        
        # Measure inference time
        import time
        start_time = time.time()
        predictions, overall_urgency = model_service.predict(image_bytes, threshold=threshold)
        inference_time_ms = (time.time() - start_time) * 1000
        
        # Build response with clinical urgency
        return {
            "success": True,
            "predictions": predictions,
            "urgency_tier": overall_urgency,  # Case-level urgency for triage
            "inference_time_ms": round(inference_time_ms, 2),
            "model_info": {
                "name": "DenseNet121",
                "num_classes": 13,
                "threshold": threshold
            }
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Inference failed: {str(e)}"
        )


@router.post("/predict-with-gradcam", response_model=Dict)
async def predict_with_gradcam(
    file: UploadFile = File(...),
    threshold: float = 0.3,
    target_class: str = None
):
    """
    Chest X-Ray Classification with Grad-CAM Heatmap (Combined endpoint)
    
    Args:
        file: Uploaded image file (JPG/PNG)
        threshold: Minimum confidence score (default: 0.3)
        target_class: Optional specific class for Grad-CAM (default: highest confidence)
        
    Returns:
        JSON with predictions + Grad-CAM heatmap visualization
    """
    from .gradcam_service import get_gradcam_service
    
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_TYPES)}"
        )
    
    try:
        image_bytes = await file.read()
        
        # Validate file size
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024)}MB"
            )
        
        # Get predictions from ONNX model (fast)
        import time
        start_time = time.time()
        
        model_service = get_model_service()
        predictions, overall_urgency = model_service.predict(image_bytes, threshold=threshold)
        
        # Generate Grad-CAM heatmap (slower but informative)
        gradcam_service = get_gradcam_service()
        gradcam_result = gradcam_service.generate_gradcam(
            image_bytes,
            target_class_name=target_class
        )
        
        inference_time_ms = (time.time() - start_time) * 1000
        
        return {
            "success": True,
            "predictions": predictions,
            "urgency_tier": overall_urgency,
            "inference_time_ms": round(inference_time_ms, 2),
            "gradcam": gradcam_result,
            "model_info": {
                "name": "DenseNet121",
                "num_classes": 13,
                "threshold": threshold
            }
        }
        
    except Exception as e:
        logger.error(f"Grad-CAM prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Grad-CAM inference failed: {str(e)}"
        )


@router.post("/gradcam", response_model=Dict)
async def generate_gradcam_only(
    file: UploadFile = File(...),
    target_class: str = None
):
    """
    On-Demand Grad-CAM Heatmap Generation
    
    This endpoint generates ONLY the Grad-CAM heatmap without running full inference.
    Use this when you already have predictions and want to visualize a specific finding.
    
    Args:
        file: Uploaded image file (JPG/PNG)
        target_class: Specific pathology to visualize (e.g., "Pneumonia")
        
    Returns:
        JSON with Grad-CAM heatmap only
    """
    from .gradcam_service import get_gradcam_service
    
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_TYPES)}"
        )
    
    try:
        image_bytes = await file.read()
        
        # Validate file size
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024)}MB"
            )
        
        import time
        start_time = time.time()
        
        # Generate Grad-CAM heatmap only
        gradcam_service = get_gradcam_service()
        gradcam_result = gradcam_service.generate_gradcam(
            image_bytes,
            target_class_name=target_class
        )
        
        generation_time_ms = (time.time() - start_time) * 1000
        
        return {
            "success": True,
            "gradcam": gradcam_result,
            "generation_time_ms": round(generation_time_ms, 2)
        }
        
    except Exception as e:
        logger.error(f"Grad-CAM generation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Grad-CAM generation failed: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Health check endpoint for Docker health monitoring
    """
    try:
        model_service = get_model_service()
        model_info = model_service.get_model_info()
        
        return {
            "status": "healthy",
            "service": "Krida LungVision AI Backend",
            "model": model_info
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e)
            }
        )


@router.get("/model/info")
async def get_model_info():
    """
    Get detailed model metadata
    """
    try:
        model_service = get_model_service()
        return model_service.get_model_info()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get model info: {str(e)}"
        )
