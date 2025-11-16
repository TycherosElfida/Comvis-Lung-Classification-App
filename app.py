import streamlit as st
import pandas as pd
from PIL import Image
import json

# --- 1. IMPORT REWORKED UTILITIES ---
from utils.ui import load_css
from utils.logging import log_prediction
from utils.model_loader import MODEL, CLASS_NAMES, MODEL_ID, MODEL_VERSION
from utils.image_processor import preprocess_image, predict
from utils.xai import generate_grad_cam

# --- 2. PAGE CONFIGURATION ---
# This config applies to this page.
st.set_page_config(
    page_title="Lung Classifier",
    page_icon="🫁",
    layout="wide"
)

# --- 3. LOAD CSS ---
load_css("assets/style.css") # Your dark mode CSS

# --- 4. HELPER FUNCTION ---
def display_results(results, image): # image is now the PIL Image object
    """Dynamically displays the prediction results in a modern layout."""
    st.header("Analysis Results")
    
    with st.container(border=True): # Styled by your CSS
        col1, col2 = st.columns([1, 1.5])
        
        with col1:
            st.image(image, caption="Uploaded Scan", use_column_width=True)
        
        with col2:
            # Add the new "Explainability" tab
            tab1, tab2, tab3 = st.tabs(["📊 Summary", "📈 All Scores", "🔬 Explainability (XAI)"])
            
            # --- Tab 1: Summary ---
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
            
            # --- Tab 2: All Scores ---
            with tab2:
                st.markdown("##### **All 13 Pathology Probabilities**")
                df = pd.DataFrame(sorted_results, columns=["Pathology", "Probability"])
                st.bar_chart(df.set_index("Pathology"), horizontal=True)

            # --- Tab 3: XAI (Grad-CAM) ---
            with tab3:
                st.markdown("##### **Model Explainability (Grad-CAM)**")
                st.write("See which parts of the image the model used to make its prediction.")
                
                # Get the class names from the results dictionary
                class_names = list(results.keys())
                
                # Dropdown to select which pathology to explain
                selected_class = st.selectbox("Select a pathology to explain:", class_names)
                
                # Slider for heatmap opacity
                opacity = st.slider("Heatmap Opacity", 0.2, 1.0, 0.7)
                
                if st.button(f"Generate Heatmap for {selected_class}", use_container_width=True):
                    with st.spinner(f"Generating Grad-CAM for {selected_class}..."):
                        
                        # We need the preprocessed tensor
                        image_tensor = preprocess_image(st.session_state['image_bytes'])
                        
                        # Get the index of the selected class
                        class_index = class_names.index(selected_class)
                        
                        # Generate the heatmap
                        heatmap_image = generate_grad_cam(
                            model=MODEL,
                            image_tensor=image_tensor,
                            image_pil=image, # The original PIL image
                            target_class_index=class_index
                        )
                        
                        st.image(
                            heatmap_image, 
                            caption=f"Grad-CAM for {selected_class}", 
                            use_column_width=True
                        )

# --- 5. MAIN PAGE UI ---
st.title(f"🫁 Multi-Pathology Lung Classifier")
st.write(f"Upload a chest X-ray to analyze 13 possible pathologies. (Using Model: **{MODEL_VERSION}**)")

with st.container(border=True): # Styled by your CSS
    uploaded_file = st.file_uploader(
        "Upload your PNG, JPG, or JPEG scan", 
        type=["png", "jpg", "jpeg"]
    )
    
    if uploaded_file:
        image = Image.open(uploaded_file)
        image_bytes = uploaded_file.getvalue()
        
        with st.spinner(f"Model '{MODEL_VERSION}' is analyzing the image..."):
            image_tensor = preprocess_image(image_bytes)
            results = predict(MODEL, image_tensor)

        if results:
            st.session_state['results'] = results
            st.session_state['uploaded_image'] = image
            
            # --- LOGGING STEP ---
            log_prediction(image_bytes, MODEL_ID, results)
            
        else:
            st.error("Model could not process the image. Please try another file.")
            if 'results' in st.session_state: del st.session_state['results']
            if 'uploaded_image' in st.session_state: del st.session_state['uploaded_image']

if 'results' in st.session_state:
    display_results(
        st.session_state['results'], 
        st.session_state['uploaded_image']
    )