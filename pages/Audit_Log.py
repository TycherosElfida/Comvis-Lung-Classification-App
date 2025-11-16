import streamlit as st
import pandas as pd
from utils.supabase_client import get_supabase_client
from utils.ui import load_css
import json

st.set_page_config(
    page_title="Audit Log",
    page_icon="📋",
    layout="wide"
)

load_css("assets/style.css") # Load dark mode CSS

def check_password():
    """Returns True if the password is correct."""
    try:
        admin_password = st.secrets["admin"]["password"]
    except KeyError:
        st.error("Admin password not set in st.secrets.toml. Please contact the administrator.")
        return False

    if "password_correct" not in st.session_state:
        st.session_state["password_correct"] = False

    if not st.session_state["password_correct"]:
        password = st.text_input("Enter Admin Password:", type="password", key="admin_pass_input")
        if st.button("Submit", key="admin_pass_button"):
            if password == admin_password:
                st.session_state["password_correct"] = True
                st.rerun()
            else:
                st.error("The password you entered is incorrect.")
        return False
    else:
        return True

@st.cache_data(ttl=300) # Cache data for 5 minutes
def fetch_audit_log():
    """Fetches the prediction log, joining with the model version."""
    client = get_supabase_client()
    if not client:
        return pd.DataFrame() # Return empty dataframe on error
        
    try:
        # --- THIS IS THE CORRECTED QUERY ---
        # This is the standard PostgREST way to do a JOIN.
        # It selects columns from 'predictions' and specifies the
        # foreign key 'models' and which columns to bring from it.
        response = client.table('predictions').select(
            'created_at, image_url, results_json, models(version_name)'
        ).order('created_at', desc=True).execute()
        # ------------------------------------
        
        if response.data:
            df = pd.DataFrame(response.data)
            
            # The JOIN creates a nested dictionary, e.g., {'models': {'version_name': 'v1'}}
            # We must "flatten" this for the dataframe.
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

if check_password():
    st.write("This page shows a complete log of all predictions made by the application.")
    
    with st.container(border=True):
        df = fetch_audit_log()
        
        if not df.empty:
            st.write(f"Displaying **{len(df)}** most recent predictions.")
            
            # --- Display the Log ---
            st.data_editor(
                df,
                column_config={
                    "created_at": st.column_config.DatetimeColumn("Timestamp", format="YYYY-MM-DD HH:mm"),
                    "image_url": st.column_config.LinkColumn("Image Link", width="medium"),
                    "results_json": st.column_config.Column("Results (JSON)"),
                    "version_name": st.column_config.TextColumn("Model Version"),
                },
                use_container_width=True,
                hide_index=True
            )
        else:
            st.info("No predictions found in the database.")