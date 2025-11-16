import streamlit as st
import pandas as pd
from utils.supabase_client import get_supabase_client
from utils.ui import load_css

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
    except:
        st.error("Admin password not set in st.secrets.toml. Please contact the administrator.")
        return False

    if "password_correct" not in st.session_state:
        # First run, show password input
        password = st.text_input("Enter Admin Password:", type="password")
        if st.button("Submit"):
            if password == admin_password:
                st.session_state["password_correct"] = True
                st.rerun()
            else:
                st.error("The password you entered is incorrect.")
        return False
    elif not st.session_state["password_correct"]:
        # Subsequent runs, if password was wrong
        password = st.text_input("Enter Admin Password:", type="password")
        if st.button("Submit"):
            if password == admin_password:
                st.session_state["password_correct"] = True
                st.rerun()
            else:
                st.error("The password you entered is incorrect.")
        return False
    else:
        # Password is correct
        return True

@st.cache_data(ttl=300) # Cache data for 5 minutes
def fetch_audit_log():
    """Fetches the prediction log, joining with the model version."""
    client = get_supabase_client()
    if not client:
        return pd.DataFrame() # Return empty dataframe on error
        
    try:
        # This SQL query joins the predictions table with the models table
        # to get the human-readable model version_name.
        query = """
            SELECT 
                p.created_at, 
                p.image_url, 
                p.results_json, 
                m.version_name 
            FROM 
                predictions p
            JOIN 
                models m ON p.model_id = m.id
            ORDER BY
                p.created_at DESC
        """
        response = client.rpc('execute_sql', {'sql_query': query}).execute()
        
        if response.data:
            df = pd.DataFrame(response.data)
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
            # We use st.data_editor to get a modern, interactive table
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