import streamlit as st
from supabase import create_client, Client

@st.cache_resource
def get_supabase_client():
    """
    Returns a cached Supabase client instance.
    """
    try:
        url = st.secrets["supabase"]["url"]
        key = st.secrets["supabase"]["key"]
        client = create_client(url, key)
        return client
    except Exception as e:
        st.error(f"Error connecting to Supabase: {e}")
        return None