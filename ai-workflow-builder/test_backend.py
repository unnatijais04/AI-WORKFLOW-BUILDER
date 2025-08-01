#!/usr/bin/env python3

import sys
import os

# Add server directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'server'))

def test_imports():
    """Test if all required modules can be imported"""
    print("Testing imports...")
    
    try:
        import fastapi
        print("✅ FastAPI imported successfully")
    except Exception as e:
        print(f"❌ FastAPI import failed: {e}")
        return False
    
    try:
        import uvicorn
        print("✅ Uvicorn imported successfully")
    except Exception as e:
        print(f"❌ Uvicorn import failed: {e}")
        return False
    
    try:
        from dotenv import load_dotenv
        print("✅ python-dotenv imported successfully")
    except Exception as e:
        print(f"❌ python-dotenv import failed: {e}")
        return False
    
    return True

def test_main_import():
    """Test if main.py can be imported"""
    print("\nTesting main.py import...")
    
    try:
        import main
        print("✅ main.py imported successfully")
        return True
    except Exception as e:
        print(f"❌ main.py import failed: {e}")
        return False

def test_app_creation():
    """Test if the FastAPI app can be created"""
    print("\nTesting app creation...")
    
    try:
        import main
        app = main.app
        print("✅ FastAPI app created successfully")
        return True
    except Exception as e:
        print(f"❌ App creation failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing AI Workflow Builder Backend")
    print("=" * 40)
    
    success = True
    
    if not test_imports():
        success = False
    
    if not test_main_import():
        success = False
    
    if not test_app_creation():
        success = False
    
    print("\n" + "=" * 40)
    if success:
        print("🎉 All tests passed! Backend is ready to run.")
        print("\nTo start the backend:")
        print("cd server && source venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        sys.exit(1)