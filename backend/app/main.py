"""
Krida LungVision - FastAPI Main Application
Production-ready AI service for Chest X-Ray classification
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Create FastAPI app
app = FastAPI(
    title="Krida LungVision AI API",
    description="DenseNet121-based Chest X-Ray Pathology Classification Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(router, prefix="/api", tags=["AI Inference"])

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    from .model_service import get_model_service
    logger = logging.getLogger(__name__)
    logger.info("🚀 Krida LungVision API starting...")
    
    try:
        model_service = get_model_service()
        logger.info("✅ Model loaded successfully")
        logger.info(f"📊 Ready for inference on {len(model_service.transform.transforms)} preprocessing steps")
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        raise

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Krida LungVision AI API",
        "status": "running",
        "endpoints": {
            "predict": "/api/predict",
            "health": "/api/health",
            "model_info": "/api/model/info",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
