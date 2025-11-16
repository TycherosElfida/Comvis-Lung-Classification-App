import streamlit as st
import torch
import torch.nn as nn
import timm
import io
from .supabase_client import get_supabase_client

# This will be loaded from the database now
CLASS_NAMES = [] 
NUM_CLASSES = 0

@st.cache_data(ttl=600) # Cache for 10 minutes
def get_active_model_info():
    """
    Queries the database to find the model marked as 'is_active'.
    Caches the result for 10 minutes to avoid constant DB calls.
    """
    print("Querying database for active model info...")
    client = get_supabase_client()
    if client:
        try:
            response = client.table('models').select('*').eq('is_active', True).limit(1).execute()
            if response.data:
                return response.data[0] # Return the first active model found
            else:
                st.error("No active model found in the database!")
                return None
        except Exception as e:
            st.error(f"Error querying models table: {e}")
            return None
    return None

@st.cache_resource
def load_model(_model_info):
    """
    Downloads the active model from storage and loads it into memory.
    This is cached as a resource, so the model stays in memory.
    """
    if _model_info is None:
        return None, [] # Return no model and no class names

    model_path = _model_info['storage_path']
    class_names = _model_info['class_names']
    num_classes = len(class_names)
    
    print(f"Loading model '{model_path}' from storage...")
    client = get_supabase_client()
    if client:
        try:
            # 1. Download the model file from Supabase Storage
            model_bytes = client.storage.from_('models').download(model_path)
            
            # 2. Initialize the densenet121 model architecture
            model = timm.create_model(
                'densenet121', 
                pretrained=False, 
                in_chans=3
            )
            
            # 3. Replace the classifier head
            n_features = model.classifier.in_features
            model.classifier = nn.Linear(n_features, num_classes)

            # 4. Load the weights from the downloaded bytes
            state_dict = torch.load(io.BytesIO(model_bytes), map_location=torch.device('cpu'))
            model.load_state_dict(state_dict)
            model.eval()
            
            print("Model loaded successfully.")
            return model, class_names

        except Exception as e:
            st.error(f"Error loading model from storage: {e}")
            return None, []
            
    return None, []

# --- Main functions to be called by the app ---
model_info = get_active_model_info()
MODEL, CLASS_NAMES = load_model(model_info)
MODEL_ID = model_info['id'] if model_info else None
MODEL_VERSION = model_info['version_name'] if model_info else "Unknown"

# Update the global variables
NUM_CLASSES = len(CLASS_NAMES)