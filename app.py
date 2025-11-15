import streamlit as st
import pandas as pd
from PIL import Image
from streamlit_option_menu import option_menu

# Import your custom utility functions
from utils.ui import load_css
from utils.model_loader import load_model
from utils.image_processor import preprocess_image, predict, CLASS_NAMES

# --- 1. PAGE CONFIGURATION ---
st.set_page_config(
    page_title="Lung Disease Classifier",
    page_icon="🫁",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- 2. LOAD CSS AND MODEL ---
load_css("assets/style.css")
model = load_model("models/best_model.pth")

# --- 3. HELPER FUNCTIONS (No changes here, logic is perfect) ---

def display_results(results, image):
    """Dynamically displays the prediction results in a modern layout."""
    
    st.header("Analysis Results")
    
    with st.container(border=True): # The CSS will style this "card"
        col1, col2 = st.columns([1, 1.5])
        
        with col1:
            st.image(image, caption="Uploaded Scan", use_container_width=True)
        
        with col2:
            tab1, tab2 = st.tabs(["📊 Summary", "📈 All Scores"])
            
            with tab1:
                st.markdown("##### **Key Findings**")
                THRESHOLD = 0.5 
                sorted_results = sorted(results.items(), key=lambda item: item[1], reverse=True)
                positive_findings = [
                    (name, prob) for name, prob in sorted_results if prob >= THRESHOLD
                ]
                
                if positive_findings:
                    st.warning(f"**Potential Pathologies Detected (>{THRESHOLD*100}% confidence):**")
                    for name, prob in positive_findings:
                        st.markdown(f"- **{name}**: {prob*100:.1f}%")
                else:
                    st.success(f"**No significant pathologies detected (all <{THRESHOLD*100}% confidence).**")
            
            with tab2:
                st.markdown("##### **All 13 Pathology Probabilities**")
                df = pd.DataFrame(
                    sorted_results, 
                    columns=["Pathology", "Probability"]
                )
                st.bar_chart(
                    df.set_index("Pathology"),
                    horizontal=True
                )

def run_classifier_page(model):
    """Renders the main classifier UI."""
    st.title("🫁 Multi-Pathology Lung Classifier")
    st.write("Upload a chest X-ray to analyze 13 possible pathologies using a deep learning model.")
    
    with st.container(border=True): # The CSS will style this "card"
        uploaded_file = st.file_uploader(
            "Upload your PNG, JPG, or JPEG scan", 
            type=["png", "jpg", "jpeg"]
        )
        
        if uploaded_file:
            image = Image.open(uploaded_file)
            image_bytes = uploaded_file.getvalue()
            
            with st.spinner("Model is analyzing the image..."):
                image_tensor = preprocess_image(image_bytes)
                results = predict(model, image_tensor)
            
            if results:
                st.session_state['results'] = results
                st.session_state['uploaded_image'] = image
            else:
                st.error("Model could not process the image. Please try another file.")
                if 'results' in st.session_state:
                    del st.session_state['results']
                if 'uploaded_image' in st.session_state:
                    del st.session_state['uploaded_image']

    if 'results' in st.session_state:
        display_results(
            st.session_state['results'], 
            st.session_state['uploaded_image']
        )

def run_about_page():
    """Renders the static 'About' page content."""
    st.title("ℹ️ About the Project")
    
    with st.container(border=True): # The CSS will style this "card"
        st.markdown("""
        This application uses a **DenseNet-121** model, a state-of-the-art convolutional neural network (CNN) architecture.
        * The model was built using the `timm` library and trained on a large-scale chest X-ray dataset.
        * It is a **multi-label classifier** capable of identifying 13 different pathologies from a single scan.
        """)
        
        st.subheader("Dataset & Classes")
        st.markdown("The model identifies the following pathologies:")
        col1, col2, col3 = st.columns(3)
        for i, name in enumerate(CLASS_NAMES):
            if i % 3 == 0:
                col1.markdown(f"- {name}")
            elif i % 3 == 1:
                col2.markdown(f"- {name}")
            else:
                col3.markdown(f"- {name}")
        
        st.subheader("Disclaimer")
        st.warning("""
        **This is a demonstration project and not a medical device.**
        The predictions from this model are for informational purposes only and are **not** a substitute for professional medical diagnosis. 
        Please consult a qualified healthcare professional for any medical concerns.
        """)

# --- 4. MAIN APP NAVIGATION (STYLES UPDATED FOR DARK MODE) ---
selected_page = option_menu(
    menu_title=None,
    options=["Classifier", "About the Project"],
    icons=["lungs", "info-circle"],
    menu_icon="cast",
    default_index=0,
    orientation="horizontal",
    styles={
        "container": {
            "padding": "0!important", 
            "background-color": "var(--bg-color-main)", # Match main background
            "border-bottom": "1px solid var(--border-color-card)",
            "margin-bottom": "20px"
        },
        "icon": {
            "color": "var(--font-color-muted)", 
            "font-size": "22px"
        }, 
        "nav-link": {
            "font-family": "var(--font-family)",
            "font-size": "18px",
            "font-weight": "500",
            "text-align": "left",
            "margin": "0px",
            "color": "var(--font-color-muted)",
            "--hover-color": "var(--bg-color-card)" # Use card background for hover
        },
        "nav-link-selected": {
            "background-color": "var(--bg-color-card)",
            "color": "var(--accent-color)", # Use accent color for selected text
            "border-bottom": "2px solid var(--accent-color)"
        },
    }
)

# --- 5. PAGE ROUTING ---
if selected_page == "Classifier":
    run_classifier_page(model)
elif selected_page == "About the Project":
    run_about_page()