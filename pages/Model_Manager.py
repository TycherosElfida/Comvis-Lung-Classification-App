import streamlit as st
import torch
import torch.nn as nn
import timm
import io
import os
# from .supabase_client import get_supabase_client # Commented out for local-only

# --- 1. HARD-CODED LOCAL MODEL CONFIGURATION ---
# This is the list from your training notebook
CLASS_NAMES = [
    'Atelectasis', 'Cardiomegaly', 'Consolidation', 'Edema', 'Effusion',
    'Emphysema', 'Fibrosis', 'Infiltration', 'Mass', 'Nodule',
    'Pleural_Thickening', 'Pneumonia', 'Pneumothorax'
]
NUM_CLASSES = len(CLASS_NAMES)

LOCAL_MODEL_PATH = "models/Model_v1.pth" 

LOCAL_MODEL_ID = 1
LOCAL_MODEL_VERSION = f"local_densenet121_v1"

# --- 2. NEW LOCAL MODEL LOADER ---
@st.cache_resource
def load_model_local(model_path):
    """
    Loads the model from a local .pth file.
    This function is cached, so the model only loads once.
    """
    print(f"Loading local model from: {model_path}")
    if not os.path.exists(model_path):
        st.error(f"Local model file not found at: {model_path}")
        st.error("Please make sure 'best_model.pth' is inside the 'models' folder.")
        return None, []

    try:
        # 1. Initialize the densenet121 model architecture
        model = timm.create_model(
            'densenet121', 
            pretrained=False, 
            in_chans=3
        )
        
        # 2. Replace the classifier head
        n_features = model.classifier.in_features
        model.classifier = nn.Linear(n_features, NUM_CLASSES)

        # 3. Load the weights from the local file
        state_dict = torch.load(model_path, map_location=torch.device('cpu'))
        model.load_state_dict(state_dict)
        model.eval()
        
        print("Local model loaded successfully.")
        return model, CLASS_NAMES

    except Exception as e:
        st.error(f"Error loading local model: {e}")
        return None, []
        
# --- 3. COMMENT OUT SUPABASE FUNCTIONS ---
# These are kept for your future reference

# @st.cache_data(ttl=600) # Cache for 10 minutes
# def get_active_model_info():
#     """
#     Queries the database to find the model marked as 'is_active'.
#     Caches the result for 10 minutes to avoid constant DB calls.
#     """
#     print("Querying database for active model info...")
#     client = get_supabase_client()
#     if client:
#         try:
#             response = client.table('models').select('*').eq('is_active', True).limit(1).execute()
#             if response.data:
#                 return response.data[0] # Return the first active model found
#             else:
#                 st.error("No active model found in the database!")
#                 return None
#         except Exception as e:
#             st.error(f"Error querying models table: {e}")
#             return None
#     return None

# @st.cache_resource
# def load_model(_model_info):
#     """
#     Downloads the active model from storage and loads it into memory.
#     This is cached as a resource, so the model stays in memory.
#     """
#     if _model_info is None:
#         return None, [] # Return no model and no class names

#     model_path = _model_info['storage_path']
#     class_names = _model_info['class_names']
#     num_classes = len(class_names)
    
#     print(f"Loading model '{model_path}' from storage...")
#     client = get_supabase_client()
#     if client:
#         try:
#             model_bytes = client.storage.from_('models').download(model_path)
#             model = timm.create_model(
#                 'densenet121', 
#                 pretrained=False, 
#                 in_chans=3
#             )
#             n_features = model.classifier.in_features
#             model.classifier = nn.Linear(n_features, num_classes)
#             state_dict = torch.load(io.BytesIO(model_bytes), map_location=torch.device('cpu'))
#             model.load_state_dict(state_dict)
#             model.eval()
#             print("Model loaded successfully.")
#             return model, class_names
#         except Exception as e:
#             st.error(f"Error loading model from storage: {e}")
#             return None, []
            
#     return None, []

# --- 4. EXPORT LOCAL MODEL AND VARS ---
# These are the variables that the rest of your app imports.
# We are now populating them from our local function and hard-coded values.
MODEL, _ = load_model_local(LOCAL_MODEL_PATH)
MODEL_ID = LOCAL_MODEL_ID
MODEL_VERSION = LOCAL_MODEL_VERSION