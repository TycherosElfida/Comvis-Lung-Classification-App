import streamlit as st
import torch
import torch.nn as nn
import timm
import os

CLASS_NAMES = [
    'Atelectasis', 'Cardiomegaly', 'Consolidation', 'Edema', 'Effusion',
    'Emphysema', 'Fibrosis', 'Infiltration', 'Mass', 'Nodule',
    'Pleural_Thickening', 'Pneumonia', 'Pneumothorax'
]
NUM_CLASSES = len(CLASS_NAMES)

@st.cache_resource
def load_model(model_path):
    """
    Loads and caches the DenseNet-121 model from a .pth state_dict file
    using the timm library, matching the training script.
    
    Args:
        model_path (str): The path to the model file (e.g., "models/best_model.pth").
    
    Returns:
        torch.nn.Module: The loaded PyTorch model.
    """
    try:
        if not os.path.exists(model_path):
            st.error(f"Model file not found at: {model_path}")
            return None

        # 1. Initialize the densenet121 model using timm
        # We use pretrained=False because we are about to load our own weights.
        model = timm.create_model(
            'densenet121', 
            pretrained=False, 
            in_chans=3
        )

        # 2. Replace the classifier head to match your 13 classes
        # This must be done *before* loading the state_dict.
        n_features = model.classifier.in_features
        model.classifier = nn.Linear(n_features, NUM_CLASSES)

        # 3. Load the saved weights (state_dict)
        state_dict = torch.load(model_path, map_location=torch.device('cpu'))
        
        # 4. Load the weights into the model structure
        model.load_state_dict(state_dict)
        
        # 5. Set the model to evaluation mode
        model.eval()
        
        print("Model loaded successfully using timm.") # For debugging
        return model

    except Exception as e:
        st.error(f"Error loading model: {e}")
        st.error(
            "This likely means your 'best_model.pth' file does not match the 'densenet121' "
            "architecture from 'timm'. Please double-check the notebook."
        )
        return None