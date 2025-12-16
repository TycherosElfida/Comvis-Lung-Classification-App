# Krida LungVision — Backend

FastAPI backend for Chest X-Ray pathology classification using ONNX Runtime with Grad-CAM explainability.

## ✨ Features

### AI Inference
- **ONNX Runtime** — CPU/GPU agnostic, production-optimized inference
- **Multi-Label Classification** — Detects 13 concurrent lung pathologies
- **Grad-CAM XAI** — Explainable AI heatmap generation
- **Clinical Triage** — Automatic urgency classification (Critical/Moderate/Routine)

### API
- **RESTful Design** — Clean, documented endpoints
- **CORS Enabled** — Ready for frontend integration
- **Health Checks** — Docker-ready health monitoring
- **Auto-Documentation** — Swagger UI at `/docs`

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | FastAPI 0.115 |
| **Server** | Uvicorn |
| **ML Runtime** | ONNX Runtime |
| **Image Processing** | Albumentations, Pillow, OpenCV |
| **Deep Learning** | PyTorch (for Grad-CAM) |

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI application entry
│   ├── config.py         # Configuration & constants
│   ├── inference.py      # ONNX inference engine
│   └── gradcam.py        # Grad-CAM implementation
├── models/
│   ├── best_model.onnx   # ONNX model for inference
│   └── best_model_finetuned.pth  # PyTorch model for Grad-CAM
├── tests/
│   └── test_api.py       # API tests
├── convert_model.py      # PyTorch → ONNX converter
├── requirements.txt      # Python dependencies
└── README.md             # This file
```

## Getting Started

### Prerequisites
- Python 3.11+
- pip

### Installation

```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate
# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Server

```bash
# Development (with auto-reload)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Server runs at `http://localhost:8000`

### Docker (Production)

```bash
docker build -t krida-lungvision-backend .
docker run -p 8000:8000 -v $(pwd)/models:/app/models krida-lungvision-backend
```

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "model": "DenseNet121"
}
```

### Predict Chest X-Ray
```bash
curl -X POST "http://localhost:8000/api/predict?threshold=0.3" \
  -F "file=@chest_xray.png"
```

**Response:**
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
  "triage": {
    "urgency": "critical",
    "critical_count": 1,
    "top_finding": "Pneumonia"
  },
  "model_info": {
    "name": "DenseNet121",
    "num_classes": 13,
    "threshold": 0.3
  }
}
```

### Generate Grad-CAM Heatmap
```bash
curl -X POST "http://localhost:8000/api/gradcam" \
  -F "file=@chest_xray.png" \
  -F "target_class=Pneumonia"
```

**Response:**
```json
{
  "success": true,
  "gradcam": {
    "target_class": "Pneumonia",
    "heatmap_base64": "data:image/png;base64,..."
  }
}
```

## 13 Pathology Labels

| ID | Pathology | ID | Pathology |
|----|-----------|----|-----------| 
| 1 | Atelectasis | 8 | Nodule |
| 2 | Cardiomegaly | 9 | Pleural Thickening |
| 3 | Consolidation | 10 | Pneumonia |
| 4 | Edema | 11 | Pneumothorax |
| 5 | Effusion | 12 | Emphysema |
| 6 | Hernia | 13 | Fibrosis |
| 7 | Infiltration | | |

## Model Architecture

| Property | Value |
|----------|-------|
| **Base Model** | DenseNet121 (ImageNet pretrained) |
| **Output Layer** | Linear(1024 → 13) |
| **Activation** | Sigmoid (multi-label) |
| **Input Size** | 224 × 224 × 3 |
| **Output Size** | 13 (probabilities) |

### Preprocessing Pipeline
1. Resize to 224×224
2. Convert to RGB (if needed)
3. Normalize with ImageNet stats:
   - Mean: [0.485, 0.456, 0.406]
   - Std: [0.229, 0.224, 0.225]

## Triage Logic

Cases are classified by urgency based on detected pathologies:

| Urgency | Condition |
|---------|-----------|
| **Critical** | Pneumothorax >50% OR any critical finding >75% |
| **Moderate** | Any finding between 50-75% |
| **Routine** | All findings <50% |

**Critical Pathologies**: Pneumothorax, Pneumonia, Consolidation, Edema

## Running Tests

```bash
pytest tests/ -v
```

## Dependencies

See `requirements.txt`:
- `fastapi` — Web framework
- `uvicorn` — ASGI server
- `onnxruntime` — ONNX inference
- `albumentations` — Image preprocessing
- `torch` — For Grad-CAM
- `opencv-python-headless` — Image operations
- `pillow` — Image handling
- `python-multipart` — File uploads

## License

Educational and research purposes only.
