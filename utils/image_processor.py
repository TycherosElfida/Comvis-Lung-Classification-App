import torch
import torchvision.transforms as transforms
from PIL import Image
import io
from .model_loader import CLASS_NAMES

# --- 1. IMAGE PREPROCESSING ---

def get_data_transforms():
    """
    Returns the image transformation pipeline.
    This is based on the CONFIG['IMAGE_SIZE'] = 256 from your notebook.
    """
    # Using ImageNet normalization stats as seen in your notebook
    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]
    
    return transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
        transforms.Normalize(mean=mean, std=std)
    ])

def preprocess_image(image_bytes):
    """
    Preprocesses the uploaded image bytes.
    
    Args:
        image_bytes (bytes): The raw bytes of the image from st.file_uploader.
    
    Returns:
        torch.Tensor or None: The preprocessed image tensor, or None if an error occurs.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB (matches cv2.cvtColor(image, cv2.COLOR_BGR2RGB) in notebook)
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        data_transforms = get_data_transforms()
        image_tensor = data_transforms(image)
        
        # Add the "batch" dimension [1, C, H, W]
        return image_tensor.unsqueeze(0)
    
    except Exception as e:
        # Log the error to the console for debugging
        print(f"Error preprocessing image: {e}")
        return None # Return None instead of st.error

# --- 2. PREDICTION FUNCTION (Multi-Label) ---

def predict(model, image_tensor):
    """
    Runs the multi-label model prediction on the preprocessed image tensor.
    
    Args:
        model (torch.nn.Module): The loaded PyTorch model.
        image_tensor (torch.Tensor): The preprocessed image tensor.
    
    Returns:
        dict or None: A dictionary of {class_name: confidence_score}, or None if an error occurs.
    """
    if model is None or image_tensor is None:
        return None
        
    try:
        model.eval()
        
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.sigmoid(outputs).squeeze()
            
            results = {
                CLASS_NAMES[i]: probabilities[i].item() 
                for i in range(len(CLASS_NAMES))
            }
            
            return results
    
    except Exception as e:
        # Log the error to the console for debugging
        print(f"Error during prediction: {e}")
        return None # Return None instead of st.error