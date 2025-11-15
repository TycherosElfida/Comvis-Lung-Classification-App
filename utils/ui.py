import streamlit as st
import os

def load_css(file_name):
    """
    Loads a local CSS file into the Streamlit app.
    
    Args:
        file_name (str): The path to the CSS file (e.g., "assets/style.css")
    """
    if not os.path.exists(file_name):
        st.warning(f"CSS file not found: {file_name}")
        return
        
    try:
        with open(file_name) as f:
            css = f.read()
        st.markdown(f'<style>{css}</style>', unsafe_allow_html=True)
    except Exception as e:
        st.error(f"Error loading CSS: {e}")