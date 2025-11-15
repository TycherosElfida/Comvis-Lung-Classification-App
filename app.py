import streamlit as st
from streamlit_option_menu import option_menu
from utils.ui import load_css

# --- 1. PAGE CONFIGURATION ---
# Set the basic configuration for your app
st.set_page_config(
    page_title="Lung Disease Classifier",
    page_icon="🫁", # An emoji for the browser tab
    layout="wide",   # Use the full screen width
    initial_sidebar_state="auto" # Keep sidebar, but allow auto-hide
)

load_css("assets/style.css")

# --- 2. MODERN NAVIGATION BAR ---
# This replaces the default Streamlit sidebar navigation
selected_page = option_menu(
    menu_title=None, # required, but can be None
    options=["Classifier", "About the Project"], # Page names
    icons=["lungs", "info-circle"], # Icons from bootstrap-icons
    menu_icon="cast", # Main menu icon
    default_index=0, # Start on the first page
    orientation="horizontal",
    styles={
        "container": {"padding": "0!important", "background-color": "#fafafa"},
        "icon": {"color": "black", "font-size": "20px"}, 
        "nav-link": {
            "font-size": "20px",
            "text-align": "left",
            "margin":"0px", 
            "--hover-color": "#eee"
        },
        "nav-link-selected": {"background-color": "#02ab21"},
    }
)

# --- 3. PAGE ROUTING ---
# This part is a placeholder. Streamlit's new multipage app 
# feature (using the /pages folder) will handle this automatically.
# We're just setting up the title and header.

if selected_page == "Classifier":
    st.title("🫁 Multi-Pathology Lung Classifier")
    st.subheader("Upload a chest X-ray to analyze 13 possible pathologies.")
elif selected_page == "About the Project":
    st.title("ℹ️ About the Project")