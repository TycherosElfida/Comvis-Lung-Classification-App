import streamlit as st
import pandas as pd
from PIL import Image
from streamlit_option_menu import option_menu
import json

# --- 1. IMPORT REWORKED UTILITIES ---
from utils.ui import load_css
from utils.logging import log_prediction

# These are now imported from the new model_loader
from utils.model_loader import MODEL, CLASS_NAMES, MODEL_ID, MODEL_VERSION

# This is new, for the multi-page app
from pages import audit_log, model_manager 

# --- 2. PAGE CONFIGURATION ---
st.set_page_config(
    page_title=f"Lung Classifier (v{MODEL_VERSION})", # Dynamic title
    page_icon="🫁",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- 3. LOAD CSS ---
load_css("assets/style.css")

# --- 4. HELPER FUNCTIONS ---
def display_results(results, image):
    """Dynamically displays the prediction results in a modern layout."""
    st.header("Analysis Results")
    with st.container(border=True):
        col1, col2 = st.columns([1, 1.5])
        with col1:
            st.image(image, caption="Uploaded Scan", use_column_width=True)
        with col2:
            tab1, tab2 = st.tabs(["📊 Summary", "📈 All Scores"])
            with tab1:
                st.markdown("##### **Key Findings**")
                THRESHOLD = 0.5 
                sorted_results = sorted(results.items(), key=lambda item: item[1], reverse=True)
                positive_findings = [(name, prob) for name, prob in sorted_results if prob >= THRESHOLD]
                
                if positive_findings:
                    st.warning(f"**Potential Pathologies Detected (>{THRESHOLD*100}% confidence):**")
                    for name, prob in positive_findings:
                        st.markdown(f"- **{name}**: {prob*100:.1f}%")
                else:
                    st.success(f"**No significant pathologies detected (all <{THRESHOLD*100}% confidence).**")
            
            with tab2:
                st.markdown("##### **All 13 Pathology Probabilities**")
                df = pd.DataFrame(sorted_results, columns=["Pathology", "Probability"])
                st.bar_chart(df.set_index("Pathology"), horizontal=True)

def run_classifier_page():
    """Renders the main classifier UI."""
    st.title(f"🫁 Multi-Pathology Lung Classifier")
    st.write(f"Upload a chest X-ray to analyze 13 possible pathologies. (Using Model: **{MODEL_VERSION}**)")
    
    with st.container(border=True):
        uploaded_file = st.file_uploader(
            "Upload your PNG, JPG, or JPEG scan", 
            type=["png", "jpg", "jpeg"]
        )
        
        if uploaded_file:
            image = Image.open(uploaded_file)
            image_bytes = uploaded_file.getvalue()
            
            with st.spinner(f"Model '{MODEL_VERSION}' is analyzing the image..."):
                # Import a function we will create in the *next* step (Phase 4)
                # For now, let's just use the predict function
                
                # --- THIS IS THE OLD LOGIC, to be replaced in Phase 4 ---
                from utils.image_processor import preprocess_image, predict
                image_tensor = preprocess_image(image_bytes)
                results = predict(MODEL, image_tensor)
                # --- End of old logic ---

            if results:
                st.session_state['results'] = results
                st.session_state['uploaded_image'] = image
                
                # --- NEW LOGGING STEP ---
                # Log this prediction to the database in the background
                log_prediction(image_bytes, MODEL_ID, results)
                # -------------------------
                
            else:
                st.error("Model could not process the image. Please try another file.")
                if 'results' in st.session_state: del st.session_state['results']
                if 'uploaded_image' in st.session_state: del st.session_state['uploaded_image']

    if 'results' in st.session_state:
        display_results(
            st.session_state['results'], 
            st.session_state['uploaded_image']
        )

# --- 5. MAIN APP NAVIGATION ---
# We will now use Streamlit's native Multi-Page App feature.
# We create a new "pages" folder and Streamlit handles the navigation.
# This is more robust.
st.sidebar.title("Navigation")
page = st.sidebar.radio("Go to", ["Classifier", "Audit Log", "Model Manager"])

# --- 6. PAGE ROUTING ---
if page == "Classifier":
    run_classifier_page()
elif page == "Audit Log":
    audit_log.run_page()
elif page == "Model Manager":
    model_manager.run_page()