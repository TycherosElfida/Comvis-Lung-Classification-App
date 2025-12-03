"""
DenseNet121 → ONNX Conversion Script
Converts the trained PyTorch model to ONNX format for production inference
"""
import torch
import torch.onnx
from torch import nn
from torchvision import models
import onnx
from pathlib import Path

# Exact label configuration from Training3.ipynb
LABELS = [
    'Atelectasis', 'Cardiomegaly', 'Consolidation', 'Edema', 'Effusion', 
    'Emphysema', 'Fibrosis', 'Infiltration', 'Mass', 
    'Nodule', 'Pleural_Thickening', 'Pneumonia', 'Pneumothorax'
]
NUM_CLASSES = len(LABELS)  # 13

def create_model_architecture():
    """
    Recreate the exact DenseNet121 architecture used in training
    """
    model = models.densenet121(pretrained=False)
    # Replace final layer for multi-label classification
    num_features = model.classifier.in_features
    model.classifier = nn.Linear(num_features, NUM_CLASSES)
    return model

def convert_to_onnx(
    pytorch_model_path: str = "models/best_model_finetuned.pth",
    onnx_model_path: str = "models/best_model.onnx",
    opset_version: int = 14
):
    """
    Convert PyTorch .pth model to ONNX format
    
    Args:
        pytorch_model_path: Path to .pth file
        onnx_model_path: Output path for .onnx file
        opset_version: ONNX opset version (14 for broad compatibility)
    """
    print(f"[1/4] Loading PyTorch model from {pytorch_model_path}")
    
    # Create model architecture
    model = create_model_architecture()
    
    # Load trained weights
    checkpoint = torch.load(pytorch_model_path, map_location=torch.device('cpu'))
    model.load_state_dict(checkpoint)
    model.eval()
    
    print(f"[2/4] Model loaded successfully. Output classes: {NUM_CLASSES}")
    
   # Create dummy input matching training specs (batch, channels, height, width)
    dummy_input = torch.randn(1, 3, 224, 224)
    
    print(f"[3/4] Converting to ONNX (opset {opset_version})...")
    
    # Export to ONNX
    torch.onnx.export(
        model,
        dummy_input,
        onnx_model_path,
        export_params=True,
        opset_version=opset_version,
        do_constant_folding=True,  # Optimization
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size'},
            'output': {0: 'batch_size'}
        }
    )
    
    print(f"[4/4] Validating ONNX model...")
    
    # Validate ONNX model
    onnx_model = onnx.load(onnx_model_path)
    onnx.checker.check_model(onnx_model)
    
    # Print model info
    print("\n✅ ONNX Conversion Successful!")
    print(f"   Output path: {onnx_model_path}")
    print(f"   Input shape: (batch, 3, 224, 224)")
    print(f"   Output shape: (batch, {NUM_CLASSES})")
    print(f"   Labels: {', '.join(LABELS)}")
    
    # Test inference
    print("\n[TEST] Running inference test...")
    import onnxruntime as ort
    
    session = ort.InferenceSession(onnx_model_path)
    test_input = dummy_input.numpy()
    outputs = session.run(None, {'input': test_input})
    
    print(f"   Test output shape: {outputs[0].shape}")
    assert outputs[0].shape == (1, NUM_CLASSES), "Output shape mismatch!"
    print("   ✅ Inference test passed")

if __name__ == "__main__":
    import sys
    
    # Use best_model_finetuned.pth as source
    pth_path = "best_model_finetuned.pth" if Path("best_model_finetuned.pth").exists() else "models/best_model_finetuned.pth"
    
    if not Path(pth_path).exists():
        print(f"❌ Error: Model file not found at {pth_path}")
        sys.exit(1)
    
    # Ensure models directory exists
    Path("models").mkdir(exist_ok=True)
    
    convert_to_onnx(
        pytorch_model_path=pth_path,
        onnx_model_path="models/best_model.onnx"
    )
