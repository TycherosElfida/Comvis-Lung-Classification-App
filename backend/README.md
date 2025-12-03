# Krida LungVision - Backend

Docker-based FastAPI backend for Chest X-Ray pathology classification using ONNX Runtime.

## ✅ Completed Features

### Model Conversion
- ✅ **PyTorch → ONNX**: `best_model_finetuned.pth` → `best_model.onnx` (786KB + 28MB weights)
- ✅ **Validation**: Output shape verified (batch, 13 classes)
- ✅ **Test Inference**: Passed with dummy input

### AI Service (`app/model_service.py`)
- ✅ **Exact Preprocessing**: Replica of `Training3.ipynb` validation pipeline
  - Resize to 224x224
  - ImageNet normalization (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
  - ToTensor conversion
- ✅ **ONNX Runtime Integration**: CPU/GPU agnostic inference
- ✅ **Multi-Label Classification**: Sigmoid activation for 13 pathologies
- ✅ **Severity Scoring**: High (≥75%), Medium (≥50%), Low (<50%)

### API Endpoints (`app/api.py`)
- ✅ **POST `/api/predict`**: Image upload → predictions with confidence scores
- ✅ **GET `/api/health`**: Docker health check
- ✅ **GET `/api/model/info`**: Model metadata

### Main Application (`app/main.py`)
- ✅ **CORS Configuration**: Allows frontend connections
- ✅ **Startup Event**: Model preloading
- ✅ **Auto-documentation**: `/docs` (Swagger UI)

## Running the Backend

### Option 1: Direct Python (Development)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Option 2: Docker (Production)
```bash
docker build -t krida-lungvision-backend .
docker run -p 8000:8000 -v $(pwd)/models:/app/models krida-lungvision-backend
```

## API Usage

### Test Health Endpoint
```bash
curl http://localhost:8000/api/health
```

### Predict Chest X-Ray
```bash
curl -X POST "http://localhost:8000/api/predict?threshold=0.3" \
  -F "file=@sample_xray.png"
```

**Expected Response:**
```json
{
  "success": true,
  "predictions": [
    {
      "label": "Pneumonia",
      "score": 0.85,
      "confidence_pct": 85.0,
      "severity": "high"
    },
    {
      "label": "Infiltration",
      "score": 0.42,
      "confidence_pct": 42.0,
      "severity": "low"
    }
  ],
  "model_info": {
    "name": "DenseNet121",
    "num_classes": 13,
    "threshold": 0.3
  }
}
```

## 13 Pathology Labels
1. Atelectasis
2. Cardiomegaly
3. Consolidation
4. Edema
5. Effusion
6. Emphysema
7. Fibrosis
8. Infiltration
9. Mass
10. Nodule
11. Pleural_Thickening
12. Pneumonia
13. Pneumothorax

## Model Architecture
- **Base**: DenseNet121 (pretrained on ImageNet)
- **Output Layer**: Linear(1024 → 13) for multi-label classification
- **Activation**: Sigmoid (per-class probabilities)
- **Input Shape**: (batch, 3, 224, 224)
- **Output Shape**: (batch, 13)

## Dependencies
See `requirements.txt`:
- `onnxruntime` - Model inference
- `albumentations` - Preprocessing
- `fastapi` - API framework
- `uvicorn` - ASGI server
