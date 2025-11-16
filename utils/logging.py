import streamlit as st
from .supabase_client import get_supabase_client
import uuid
import json

def log_prediction(image_bytes, model_id, results_json):
    """
    1. Uploads the image to Supabase Storage.
    2. Logs the prediction metadata to the 'predictions' table.
    """
    client = get_supabase_client()
    if not client or not model_id:
        st.error("Logging failed: Supabase client not initialized or no model ID.")
        return None
    
    try:
        # 1. Upload image to 'xray-images' bucket
        # We use a unique ID (UUID) for the filename to prevent conflicts
        file_name = f"upload_{uuid.uuid4()}.jpg"
        
        # Uploads the file
        client.storage.from_('xray-images').upload(
            file=image_bytes, 
            path=file_name, 
            file_options={"content-type": "image/jpeg"}
        )
        
        # 2. Get the public URL for the uploaded image
        public_url = client.storage.from_('xray-images').get_public_url(file_name)
        
        # 3. Log the prediction to the 'predictions' table
        log_data = {
            "model_id": model_id,
            "image_url": public_url,
            "results_json": json.dumps(results_json) # Store results as a JSON string
        }
        
        response = client.table('predictions').insert(log_data).execute()
        
        if response.data:
            print(f"Prediction logged successfully: {response.data[0]['id']}")
            return response.data[0]['id'] # Return the new log ID
        
    except Exception as e:
        st.error(f"Error logging prediction: {e}")
        
    return None