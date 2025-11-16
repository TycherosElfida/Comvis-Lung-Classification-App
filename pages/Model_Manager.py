import streamlit as st
import pandas as pd
from utils.supabase_client import get_supabase_client
from utils.ui import load_css
from pages.Audit_Log import check_password

st.set_page_config(
    page_title="Model Manager",
    page_icon="🛠️",
    layout="wide"
)

load_css("assets/style.css") # Load dark mode CSS

@st.cache_data(ttl=60) # Cache for 1 minute
def fetch_models():
    """Fetches the list of all models from the database."""
    client = get_supabase_client()
    if not client: return pd.DataFrame()
    try:
        response = client.table('models').select('*').order('created_at', desc=True).execute()
        return pd.DataFrame(response.data) if response.data else pd.DataFrame()
    except Exception as e:
        st.error(f"Error fetching models: {e}")
        return pd.DataFrame()

def set_active_model(model_id):
    """Sets a model to active and all others to inactive."""
    client = get_supabase_client()
    if not client: return
    try:
        # Step 1: Set all models to inactive
        client.table('models').update({'is_active': False}).neq('id', -1).execute() # 'neq' is a trick for "all"
        
        # Step 2: Set the selected model to active
        client.table('models').update({'is_active': True}).eq('id', model_id).execute()
        
        st.success(f"Model {model_id} is now the active model! Caches will update shortly.")
        
        # Clear the caches so the app picks up the new model
        st.cache_data.clear()
        st.cache_resource.clear()
        
    except Exception as e:
        st.error(f"Error setting active model: {e}")

# --- Main Page UI ---
st.title("🛠️ MLOps Model Manager")

if check_password(): # Use the same password check
    st.write("Manage the model versions used in the application. Only one model can be active at a time.")
    
    with st.container(border=True):
        models_df = fetch_models()
        
        if not models_df.empty:
            # We will add a "Activate" button to the dataframe
            models_df['Activate'] = [False] * len(models_df)
            
            st.info("Click the checkbox in the 'Activate' column to set the production model.")
            
            # Use st.data_editor to make the dataframe interactive
            edited_df = st.data_editor(
                models_df,
                column_config={
                    "id": st.column_config.TextColumn("Model ID"),
                    "version_name": st.column_config.TextColumn("Version"),
                    "is_active": st.column_config.CheckboxColumn("Is Active?"),
                    "accuracy_auroc": st.column_config.NumberColumn("AUROC", format="%.4f"),
                    "created_at": st.column_config.DatetimeColumn("Registered On", format="YYYY-MM-DD"),
                    "storage_path": st.column_config.TextColumn("Storage Path"),
                    "class_names": None, # Hide this complex column
                    "Activate": st.column_config.CheckboxColumn("Set Active")
                },
                use_container_width=True,
                hide_index=True,
                key="model_editor"
            )
            
            # Check if an "Activate" button was clicked
            for i, (original, edited) in enumerate(zip(models_df.to_dict('records'), edited_df.to_dict('records'))):
                if edited['Activate'] and not original['Activate']:
                    model_id_to_activate = edited['id']
                    set_active_model(model_id_to_activate)
                    st.rerun() # Rerun the page to show the change
                    
        else:
            st.warning("No models found in the database. Please seed the 'models' table in Supabase.")