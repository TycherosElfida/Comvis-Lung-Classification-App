import streamlit as st
import pandas as pd
from PIL import Image
from utils.model_loader import load_model
from utils.image_processor import preprocess_image, predict

# --- 1. LOAD THE CACHED MODEL ---
# This will be instant after the first run
model = load_model("models/best_model.pth")

# --- 2. SETUP PAGE LAYOUT ---
# We create two columns:
# - col1 will have the file uploader and image display
# - col2 will show the prediction results
col1, col2 = st.columns([1, 1.5]) # Give more space to the results column

# --- 3. COLUMN 1: UPLOADER & IMAGE DISPLAY ---
with col1:
    st.header("Upload Image")
    
    # The file uploader widget
    uploaded_file = st.file_uploader(
        "Upload a chest X-ray...", 
        type=["png", "jpg", "jpeg"]
    )
    
    if uploaded_file:
        # If a file is uploaded, display the image
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded X-Ray", use_column_width=True)
        
        # Store the image bytes in session state for prediction
        st.session_state['image_bytes'] = uploaded_file.getvalue()

# --- 4. COLUMN 2: PREDICTION & RESULTS DISPLAY ---
with col2:
    st.header("Analysis Results")
    
    if 'image_bytes' in st.session_state:
        # If an image has been uploaded, run the prediction
        
        with st.spinner("Model is analyzing the image..."):
            # Preprocess the image
            image_tensor = preprocess_image(st.session_state['image_bytes'])
            
            # Run prediction
            # This returns our dictionary: {'Atelectasis': 0.05, 'Cardiomegaly': 0.1, ...}
            results = predict(model, image_tensor)
        
        if results:
            # --- This is the new multi-label display ---
            
            st.subheader("Pathology Predictions")
            
            # Define a threshold for "positive" prediction
            THRESHOLD = 0.5 
            
            # Convert results dictionary to a sorted list of tuples
            sorted_results = sorted(results.items(), key=lambda item: item[1], reverse=True)
            
            # Find all pathologies that are "positive"
            positive_findings = [f"{name} ({prob*100:.1f}%)" for name, prob in sorted_results if prob >= THRESHOLD]
            
            # Display summary of findings
            if positive_findings:
                st.warning(f"**Potential Findings (>{THRESHOLD*100}% confidence):**")
                for finding in positive_findings:
                    st.markdown(f"- {finding}")
            else:
                st.success(f"**No significant pathologies detected (all <{THRESHOLD*100}% confidence).**")
            
            st.divider() # Adds a horizontal line
            
            # --- Display all 13 probabilities in a chart ---
            st.subheader("All Pathology Scores")
            
            # Convert dictionary to a Pandas DataFrame for easy charting
            df = pd.DataFrame(
                sorted_results, 
                columns=["Pathology", "Probability"]
            )
            
            # Create a horizontal bar chart
            st.bar_chart(
                df.set_index("Pathology"),
                horizontal=True
            )
            
        else:
            st.error("Model could not process the image. Please try another file.")

    else:
        # Default state before any upload
        st.info("Upload an image on the left to see the analysis.")