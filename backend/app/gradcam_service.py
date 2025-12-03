"""
Grad-CAM Explainable AI Service for Lung Pathology Detection
Generates gradient-based class activation maps to visualize model attention
"""
import torch
import torch.nn as nn
import torchvision.models as models
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
import numpy as np
import cv2
from PIL import Image
import io
import base64
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

# Same labels as ONNX model
LABELS = [
    "Atelectasis", "Cardiomegaly", "Effusion", "Infiltration",
    "Mass", "Nodule", "Pneumonia", "Pneumothorax",
    "Consolidation", "Edema", "Emphysema", "Fibrosis", "Pleural_Thickening"
]

class GradCAMService:
    """Service for generating Grad-CAM heatmaps using PyTorch model"""
    
    def __init__(self, model_path: str = "models/best_model_finetuned.pth"):
        """
        Initialize Grad-CAM service with PyTorch model
        
        Args:
            model_path: Path to PyTorch .pth model file
        """
        # Force CPU to avoid CUDA kernel errors
        self.device = torch.device("cpu")
        # self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Initializing Grad-CAM service on device: {self.device}")
        
        # Load DenseNet121 architecture
        self.model = models.densenet121(weights=None)
        
        # Modify final layer to match 13 classes
        num_features = self.model.classifier.in_features
        self.model.classifier = nn.Linear(num_features, 13)
        
        # Load trained weights
        try:
            checkpoint = torch.load(model_path, map_location=self.device)
            if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
                self.model.load_state_dict(checkpoint['model_state_dict'])
            else:
                self.model.load_state_dict(checkpoint)
            logger.info(f"Loaded PyTorch model from {model_path}")
        except Exception as e:
            logger.error(f"Failed to load PyTorch model: {str(e)}")
            raise
        
        self.model.to(self.device)
        self.model.eval()
        
        # Target layer for Grad-CAM (last conv layer in DenseNet121)
        self.target_layers = [self.model.features.denseblock4]
        
        # Initialize Grad-CAM
        self.cam = GradCAM(model=self.model, target_layers=self.target_layers)
        
        logger.info("Grad-CAM service initialized successfully")
    
    def preprocess_image(self, image_bytes: bytes) -> tuple:
        """
        Preprocess image for PyTorch model and Grad-CAM
        
        Returns:
            Tuple of (input_tensor, rgb_img_for_cam)
        """
        # Load image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Resize to 224x224
        image = image.resize((224, 224), Image.BILINEAR)
        
        # Convert to numpy for Grad-CAM visualization
        rgb_img = np.array(image).astype(np.float32) / 255.0
        
        # Normalize for model (ImageNet stats)
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        normalized = (rgb_img - mean) / std
        
        # Convert to tensor [1, 3, 224, 224]
        input_tensor = torch.from_numpy(normalized).permute(2, 0, 1).unsqueeze(0)
        input_tensor = input_tensor.to(self.device).float()
        
        return input_tensor, rgb_img
    
    def generate_gradcam(
        self,
        image_bytes: bytes,
        target_class_idx: Optional[int] = None,
        target_class_name: Optional[str] = None
    ) -> Dict:
        """
        Generate Grad-CAM heatmap for specified class
        
        Args:
            image_bytes: Raw image bytes
            target_class_idx: Index of target class (0-12)
            target_class_name: Name of target class (alternative to idx)
            
        Returns:
            Dict with heatmap image (base64), target class info
        """
        try:
            # Preprocess image
            input_tensor, rgb_img = self.preprocess_image(image_bytes)
            
            # Get predictions to determine target if not specified
            with torch.no_grad():
                outputs = self.model(input_tensor)
                probabilities = torch.sigmoid(outputs)[0]
            
            # Determine target class
            if target_class_name:
                target_class_idx = LABELS.index(target_class_name)
            elif target_class_idx is None:
                # Use highest probability class
                target_class_idx = probabilities.argmax().item()
            
            target_class = LABELS[target_class_idx]
            confidence = float(probabilities[target_class_idx])
            
            # Generate Grad-CAM
            targets = [ClassifierOutputTarget(target_class_idx)]
            grayscale_cam = self.cam(input_tensor=input_tensor, targets=targets)
            grayscale_cam = grayscale_cam[0, :]  # Get first image from batch
            
            # Create visualization
            cam_image = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)
            
            # Convert to base64
            pil_image = Image.fromarray(cam_image)
            buffered = io.BytesIO()
            pil_image.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            return {
                "heatmap_base64": f"data:image/png;base64,{img_base64}",
                "target_class": target_class,
                "target_class_idx": target_class_idx,
                "confidence": round(confidence, 4),
                "all_predictions": {
                    label: float(prob) 
                    for label, prob in zip(LABELS, probabilities)
                }
            }
            
        except Exception as e:
            logger.error(f"Grad-CAM generation failed: {str(e)}")
            raise

# Singleton instance
_gradcam_service = None

def get_gradcam_service() -> GradCAMService:
    """Get or create singleton Grad-CAM service instance"""
    global _gradcam_service
    if _gradcam_service is None:
        _gradcam_service = GradCAMService()
    return _gradcam_service
