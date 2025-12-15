"""
Model Service - ONNX Runtime Inference with Exact Preprocessing
Replicates Training3.ipynb preprocessing pipeline for production inference
"""
import numpy as np
from PIL import Image
import albumentations as A
from albumentations.pytorch import ToTensorV2
import onnxruntime as ort
from pathlib import Path
from typing import List, Dict, Tuple
import io

# Exact labels from Training3.ipynb (13 classes)
LABELS = [
    'Atelectasis', 'Cardiomegaly', 'Consolidation', 'Edema', 'Effusion', 
    'Emphysema', 'Fibrosis', 'Infiltration', 'Mass', 
    'Nodule', 'Pleural_Thickening', 'Pneumonia', 'Pneumothorax'
]

# ImageNet normalization stats (from Training3.ipynb)
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

# Clinical Urgency Tiers - Based on medical severity, not just AI confidence
# This mapping reflects conditions requiring immediate attention vs routine findings
URGENCY_TIERS = {
    # CRITICAL: Life-threatening conditions requiring immediate intervention
    'Pneumothorax': 'critical',      # Collapsed lung - emergency
    'Mass': 'critical',              # Potential malignancy - urgent oncology
    'Edema': 'critical',             # Pulmonary edema - cardiac emergency
    
    # MODERATE: Significant findings requiring prompt attention
    'Pneumonia': 'moderate',         # Infection - needs treatment
    'Consolidation': 'moderate',     # Active lung disease
    'Infiltration': 'moderate',      # Abnormal substance in lungs
    'Effusion': 'moderate',          # Fluid accumulation
    
    # ROUTINE: Chronic or less urgent findings
    'Nodule': 'routine',             # Often benign, needs monitoring
    'Fibrosis': 'routine',           # Chronic scarring
    'Atelectasis': 'routine',        # Partial collapse, often positional
    'Cardiomegaly': 'routine',       # Enlarged heart, chronic condition
    'Emphysema': 'routine',          # Chronic lung disease
    'Pleural_Thickening': 'routine', # Often old scarring
}

# Urgency priority for sorting (lower = more urgent)
URGENCY_PRIORITY = {
    'critical': 0,
    'moderate': 1,
    'routine': 2,
}

class ModelService:
    def __init__(self, model_path: str = "models/best_model.onnx"):
        """
        Initialize ONNX Runtime session with the converted model
        
        Args:
            model_path: Path to ONNX model file
        """
        self.model_path = Path(model_path)
        if not self.model_path.exists():
            raise FileNotFoundError(f"Model not found: {model_path}")
        
        print(f"[ModelService] Loading ONNX model from {model_path}")
        
        # Create ONNX Runtime session (CPU/GPU agnostic)
        self.session = ort.InferenceSession(
            str(self.model_path),
            providers=['CPUExecutionProvider']  # Add 'CUDAExecutionProvider' for GPU
        )
        
        # Get model input/output names
        self.input_name = self.session.get_inputs()[0].name
        self.output_name = self.session.get_outputs()[0].name
        
        # Create preprocessing transform (EXACT replica of Training3.ipynb validation transform)
        self.transform = A.Compose([
            A.Resize(224, 224),  # DenseNet121 input size
            A.Normalize(
                mean=IMAGENET_MEAN,
                std=IMAGENET_STD
            ),
            ToTensorV2()
        ])
        
        print(f"[ModelService] Model loaded successfully")
        print(f"[ModelService] Input: {self.input_name} | Output: {self.output_name}")
        print(f"[ModelService] Ready for inference on {len(LABELS)} classes")
    
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """
        Preprocess image bytes using exact Training3.ipynb pipeline
        
        Args:
            image_bytes: Raw image bytes (PNG/JPG)
            
        Returns:
            Preprocessed numpy array (1, 3, 224, 224)
        """
        # Load image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB (handle grayscale X-rays)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        image_np = np.array(image)
        
        # Apply albumentations transforms (Resize + Normalize)
        transformed = self.transform(image=image_np)
        image_tensor = transformed['image']
        
        # Convert PyTorch tensor to numpy and add batch dimension
        # Shape: (3, 224, 224) → (1, 3, 224, 224)
        image_np_batch = np.expand_dims(image_tensor.numpy(), axis=0)
        
        return image_np_batch.astype(np.float32)
    
    def predict(self, image_bytes: bytes, threshold: float = 0.5) -> Tuple[List[Dict[str, any]], str]:
        """
        Run ONNX inference and return predictions with clinical urgency classification
        
        Args:
            image_bytes: Raw image bytes
            threshold: Minimum confidence score to include in results
            
        Returns:
            Tuple of (predictions list, overall_urgency_tier)
        """
        # Preprocess image
        input_array = self.preprocess_image(image_bytes)
        
        # Run ONNX inference
        outputs = self.session.run(
            [self.output_name],
            {self.input_name: input_array}
        )
        
        # Get raw logits and apply sigmoid for multi-label classification
        logits = outputs[0][0]  # Shape: (13,)
        probabilities = self._sigmoid(logits)
        
        # Build predictions with clinical urgency
        predictions = []
        highest_urgency = 'routine'  # Default if no findings
        
        for idx, (label, score) in enumerate(zip(LABELS, probabilities)):
            if score >= threshold:
                severity = self._classify_severity(score)
                urgency_tier = URGENCY_TIERS.get(label, 'routine')
                
                predictions.append({
                    "label": label,
                    "score": float(score),
                    "severity": severity,
                    "urgency_tier": urgency_tier,
                    "confidence_pct": float(round(score * 100, 2))
                })
                
                # Track highest urgency for case-level triage
                if URGENCY_PRIORITY.get(urgency_tier, 2) < URGENCY_PRIORITY.get(highest_urgency, 2):
                    highest_urgency = urgency_tier
        
        # Sort by urgency first, then by score (descending)
        predictions.sort(
            key=lambda x: (URGENCY_PRIORITY.get(x['urgency_tier'], 2), -x['score'])
        )
        
        return predictions, highest_urgency
    
    @staticmethod
    def _sigmoid(x: np.ndarray) -> np.ndarray:
        """Apply sigmoid activation to logits"""
        return 1 / (1 + np.exp(-x))
    
    @staticmethod
    def _classify_severity(score: float) -> str:
        """
        Classify severity based on confidence score
        
        Returns:
            'high' | 'medium' | 'low'
        """
        if score >= 0.75:
            return 'high'
        elif score >= 0.50:
            return 'medium'
        else:
            return 'low'
    
    def get_model_info(self) -> Dict[str, any]:
        """Return model metadata"""
        return {
            "model_type": "DenseNet121",
            "num_classes": len(LABELS),
            "labels": LABELS,
            "input_shape": "(1, 3, 224, 224)",
            "framework": "ONNX Runtime",
            "preprocessing": {
                "resize": "224x224",
                "normalization": "ImageNet (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])"
            }
        }


# Singleton instance
_model_service = None

def get_model_service() -> ModelService:
    """Get or create ModelService singleton"""
    global _model_service
    if _model_service is None:
        _model_service = ModelService()
    return _model_service
