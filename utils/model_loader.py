import streamlit as st
import torch
import torch.nn as nn
from torchvision import models
import os

# --- 1. USER CONFIGURATION ---
# IMPORTANT: You must update these two variables.
# 
# 1. Update this list with the names of your lung disease classes,
#    in the exact order your model was trained on.
CLASS_NAMES = [
    "Class 1", 
    "Class 2", 
    "Class 3", 
    "Class 4"
]
NUM_CLASSES = len(CLASS_NAMES)
# -----------------------------

@st.cache_resource
def load_model(model_path):
    """
    Loads and caches the DenseNet-121 model from a .pth state_dict file.
    
    Args:
        model_path (str): The path to the model file.
    
    Returns:
        torch.nn.Module: The loaded PyTorch model.
    """
    try:
        # Check if the model file exists
        if not os.path.exists(model_path):
            st.error(f"Model file not found at: {model_path}")
            return None

        # 1. Initialize the DenseNet-121 model architecture
        # We use 'weights=None' because we are loading our own custom weights
        model = models.densenet121(weights=None)

        # 2. Modify the final classifier layer
        # The 'state_dict' keys show you saved the *entire* model,
        # including the final layer. We must replace the default 
        # classifier with one that matches your number of classes.
        
        # Get the number of input features for the default classifier
        num_ftrs = model.classifier.in_features
        
        # Create a new, untrained classifier layer
        model.classifier = nn.Linear(num_ftrs, NUM_CLASSES)
        
        # 3. Load the saved weights (state_dict)
        # Load the dictionary of weights
        state_dict = torch.load(model_path, map_location=torch.device('cpu'))
        
        # Load the weights into our new model structure
        model.load_state_dict(state_dict)
        
        # 4. Set the model to evaluation mode
        # This is essential for consistent predictions
        model.eval()
        
        print("Model loaded successfully.") # For debugging
        return model

    except Exception as e:
        st.error(f"Error loading model: {e}")
        st.error(
            "This often happens if 'NUM_CLASSES' is not set correctly, "
            "or if the model architecture is not a DenseNet-121. "
            "Please check your 'CLASS_NAMES' list in 'utils/model_loader.py'."
        )
        return None