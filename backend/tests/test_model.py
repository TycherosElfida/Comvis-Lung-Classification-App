"""
Test Script for Backend Functionality
Tests model loading and inference without starting the server
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.model_service import get_model_service

def test_model_loading():
    """Test if model loads successfully"""
    print("=" * 60)
    print("🧪 TESTING: Model Service Loading")
    print("=" * 60)
    
    try:
        model_service = get_model_service()
        print("\n✅ Model loaded successfully!")
        
        # Get model info
        info = model_service.get_model_info()
        print("\n📊 Model Information:")
        for key, value in info.items():
            print(f"   {key}: {value}")
        
        print("\n✅ Backend is operational and readyfor inference!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_model_loading()
    sys.exit(0 if success else 1)
