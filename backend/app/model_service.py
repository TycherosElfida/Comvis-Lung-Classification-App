import torch
import torch.nn as nn
import timm
import io
from PIL import Image
import torchvision.transforms as transforms
import os

class ModelService:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.class_names = [
            "Atelectasis",
            "Cardiomegaly",
            "Consolidation",
            "Edema",
            "Effusion",
            "Emphysema",
            "Fibrosis",
            "Infiltration",
            "Mass",
            "Nodule",
            "Pleural_Thickening",
            "Pneumonia",
            "Pneumothorax"
        ]
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_path):
            print(f"Error: Model file not found at {self.model_path}")
            return

        try:
            print(f"Loading model from {self.model_path}...")
            # Initialize DenseNet121
            self.model = timm.create_model(
                'densenet121',
                pretrained=False,
                in_chans=3
            )
            
            # Replace classifier head
            n_features = self.model.classifier.in_features
            self.model.classifier = nn.Linear(n_features, len(self.class_names))
            
            # Load weights
            state_dict = torch.load(self.model_path, map_location=self.device)
            self.model.load_state_dict(state_dict)
            self.model.to(self.device)
            self.model.eval()
            print("Model loaded successfully.")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None

    def _get_transforms(self):
        mean = [0.485, 0.456, 0.406]
        std = [0.229, 0.224, 0.225]
        return transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize(mean=mean, std=std)
        ])

    def predict(self, image_bytes: bytes):
        if self.model is None:
            raise Exception("Model not loaded")

        try:
            image = Image.open(io.BytesIO(image_bytes))
            if image.mode != "RGB":
                image = image.convert("RGB")

            transform = self._get_transforms()
            image_tensor = transform(image).unsqueeze(0).to(self.device)

            with torch.no_grad():
                outputs = self.model(image_tensor)
                probabilities = torch.sigmoid(outputs).squeeze()
                
                results = []
                for i, prob in enumerate(probabilities):
                    results.append({
                        "label": self.class_names[i],
                        "score": round(prob.item(), 4),
                        # Mock bounding box for now as the model is classification only
                        "box": [0.1, 0.1, 0.2, 0.2] if prob.item() > 0.5 else None 
                    })
                
                # Filter out None boxes if needed, or handle in frontend
                # For this specific frontend requirement, we might need to adjust structure
                return results

        except Exception as e:
            print(f"Error during prediction: {e}")
            raise e
