import os
import torch
from app.model_service import ModelService

# Path to the model
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/best_model_finetuned.pth"))

print(f"Testing model at: {MODEL_PATH}")

try:
    service = ModelService(MODEL_PATH)
    if service.model:
        print("Model loaded successfully!")
    else:
        print("Failed to load model.")
        exit(1)

    # Create a dummy image (3 channels, 256x256)
    # We need bytes for the predict method
    from PIL import Image
    import io

    img = Image.new('RGB', (256, 256), color = 'red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_bytes = img_byte_arr.getvalue()

    print("Running prediction on dummy image...")
    predictions = service.predict(img_bytes)
    print("Predictions:", predictions)

except Exception as e:
    print(f"Caught exception: {e}")
    import traceback
    traceback.print_exc()
