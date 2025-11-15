import streamlit as st

# Set the page configuration for this specific page
st.set_page_config(
    page_title="About",
    page_icon="ℹ️",
    layout="wide"
)

# We can call this again to hide the sidebar navigation that Streamlit adds automatically
# This keeps the focus on our custom top navigation bar
st.markdown("<style> ul[data-testid='st-PageLink-list'] {display: none;} </style>", unsafe_allow_html=True)

st.title("ℹ️ About the Project")
st.info("This page provides details about the model, the dataset, and its intended use.")

# --- 1. Model Details ---
st.header("Model Architecture")
st.markdown("""
This application uses a **DenseNet-121** model, a state-of-the-art convolutional neural network (CNN) architecture.
* The model was pre-trained on the ImageNet dataset.
* It was then fine-tuned on a large-scale chest X-ray dataset to recognize 13 different pathologies.
* The model was built and trained using the `timm` (PyTorch Image Models) library.
""")

# --- 2. Dataset Information ---
st.header("Dataset")
st.markdown("""
The model was trained on a (private/public) dataset containing thousands of chest X-ray images. The 13 pathologies it can identify are:
* Atelectasis
* Cardiomegaly
* Consolidation
* Edema
* Effusion
* Emphysema
* Fibrosis
* Infiltration
* Mass
* Nodule
* Pleural Thickening
* Pneumonia
* Pneumothorax
""")

# --- 3. IMPORTANT: Disclaimer ---
st.header("Disclaimer")
st.warning("""
**This is a demonstration project and not a medical device.**
The predictions from this model are for informational purposes only and are **not** a substitute for professional medical diagnosis. 
Do not use this tool to make medical decisions. Please consult a qualified healthcare professional for any medical concerns.
""")