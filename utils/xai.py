import numpy as np
import torch
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

def generate_grad_cam(model, image_tensor, image_pil, target_class_index):
    """
    Generates a Grad-CAM heatmap for a specific target class.
    
    Args:
        model: The loaded DenseNet model.
        image_tensor (torch.Tensor): The preprocessed, normalized tensor [1, C, H, W].
        image_pil (PIL.Image): The *original* uploaded PIL image (for overlay).
        target_class_index (int): The index of the class to explain (0-12).
        
    Returns:
        np.array: The heatmap overlayed on the original image.
    """
    
    # 1. Define the target layer to hook into
    # For densenet121, the last convolutional layer is in `features.denseblock4.denselayer16.conv2`
    target_layer = [model.features.denseblock4.denselayer16.conv2]

    # 2. Convert original PIL image to numpy array [0, 255] for overlay
    # We must resize it to match the model's input size (256x256)
    rgb_img = image_pil.convert('RGB').resize((256, 256))
    rgb_img = np.array(rgb_img) / 255.0 # Convert to [0, 1] float
    
    # 3. Define the target for Grad-CAM
    # We want to explain a *single class* from the multi-label output
    targets = [ClassifierOutputTarget(target_class_index)]

    # 4. Initialize Grad-CAM
    # We use .cuda() if available, else it defaults to CPU
    use_cuda = torch.cuda.is_available()
    cam = GradCAM(model=model, target_layers=target_layer, use_cuda=use_cuda)
    
    # 5. Generate the heatmap
    grayscale_cam = cam(input_tensor=image_tensor, targets=targets)
    
    # Get the first (and only) heatmap
    grayscale_cam = grayscale_cam[0, :]
    
    # 6. Create the overlay
    visualization = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)
    
    return visualization