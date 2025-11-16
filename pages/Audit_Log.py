import streamlit as st
import pandas as pd
from utils.supabase_client import get_supabase_client
from utils.ui import load_css
from utils.auth import check_password  # <-- IMPORT FROM NEW AUTH FILE
import json

st.set_page_config(
    page_title="Audit Log",
    page_icon="📋",
    layout="wide"
)

load_css("assets/style.css") # Load dark mode CSS

# The check_password function is now removed from this file

@st.cache_data(ttl=300) # Cache data for 5 minutes
def fetch_audit_log():
    """Fetches the prediction log, joining with the model version."""
    client = get_supabase_client()
    if not client:
        return pd.DataFrame() # Return empty dataframe on error
        
    try:
        # Use the correct PostgREST JOIN syntax
        response = client.table('predictions').select(
            'created_at, image_url, results_json, models(version_name)'
        ).order('created_at', desc=True).execute()
        
        if response.data:
            df = pd.DataFrame(response.data)
            
            # Flatten the nested JSON from the JOIN
            df['version_name'] = df['models'].apply(lambda x: x['version_name'] if isinstance(x, dict) else 'N/A')
            df.drop(columns=['models'], inplace=True) # Drop the nested dict column
            
            return df
        else:
            return pd.DataFrame()
            
    except Exception as e:
        st.error(f"Error fetching log: {e}")
        return pd.DataFrame()

# --- Main Page UI ---
st.title("📋 Prediction Audit Log")

# Call the imported function with a UNIQUE suffix
if check_password(key_suffix="log_page"):
    st.write("This page shows a complete log of all predictions made by the application.")
    
    with st.container(border=True):
        df = fetch_audit_log()
        
        if not df.empty:
            st.write(f"Displaying **{len(df)}** most recent predictions.")
            
            st.data_editor(
                df,
                column_config={
                    "created_at": st.column_config.DatetimeColumn("Timestamp", format="YYYY-MM-DD HH:mm"),
                    "image_url": st.column_config.LinkColumn("Image Link", width="medium"),
                    "results_json": st.column_config.Column("Results (JSON)"),
                    "version_name": st.column_config.TextColumn("Model Version"),
                },
                width='stretch', # <-- FIX 3: Deprecation warning
                hide_index=True
            )
        else:
            st.info("No predictions found in the database.")