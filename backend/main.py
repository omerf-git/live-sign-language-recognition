from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
import base64
import random
from typing import List
import uvicorn

app = FastAPI(title="Turkish Sign Language Recognition API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Turkish Sign Language glosses (TID dataset words)
TID_GLOSSES = [
    "merhaba", "teşekkür", "ederim", "günaydın", "iyi", "akşamlar", "görüşürüz",
    "evet", "hayır", "lütfen", "özür", "dilerim", "nasılsın", "iyiyim",
    "su", "yemek", "ev", "okul", "iş", "araba", "kitap", "telefon",
    "anne", "baba", "kardeş", "arkadaş", "öğretmen", "doktor", "polis"
]

def mock_predict(image_data: bytes) -> tuple:
    """Mock prediction function that returns random results"""
    # For demo purposes, return random predictions
    predicted_class = random.randint(0, len(TID_GLOSSES) - 1)
    confidence = random.uniform(0.4, 0.95)
    
    # 30% chance to show "no sign detected"
    if random.random() < 0.3:
        return "no_sign_detected", 0.1
    
    return TID_GLOSSES[predicted_class], confidence

def preprocess_frame(image_data: bytes) -> bool:
    """Simple preprocessing to validate image"""
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to standard size
        image = image.resize((224, 224))
        
        return True
    except Exception as e:
        print(f"Preprocessing error: {e}")
        return False

@app.get("/")
async def root():
    return {"message": "Turkish Sign Language Recognition API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict")
async def predict_sign(file: UploadFile = File(...)):
    """Predict sign language from uploaded image frame"""
    try:
        # Read image data
        image_data = await file.read()
        
        # Preprocess the frame
        if not preprocess_frame(image_data):
            raise HTTPException(status_code=400, detail="Invalid image data")
        
        # Run mock prediction
        predicted_gloss, confidence = mock_predict(image_data)
        
        return JSONResponse({
            "success": True,
            "predicted_gloss": predicted_gloss,
            "confidence": round(confidence, 3),
            "timestamp": str(random.randint(1000000000, 9999999999))
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict-base64")
async def predict_sign_base64(data: dict):
    """Predict sign language from base64 encoded image"""
    try:
        # Extract base64 image data
        image_base64 = data.get("image", "")
        if not image_base64:
            raise HTTPException(status_code=400, detail="No image data provided")
        
        # Remove data URL prefix if present
        if "data:image" in image_base64:
            image_base64 = image_base64.split(",")[1]
        
        # Decode base64 to bytes
        image_data = base64.b64decode(image_base64)
        
        # Preprocess the frame
        if not preprocess_frame(image_data):
            raise HTTPException(status_code=400, detail="Invalid image data")
        
        # Run mock prediction
        predicted_gloss, confidence = mock_predict(image_data)
        
        return JSONResponse({
            "success": True,
            "predicted_gloss": predicted_gloss,
            "confidence": round(confidence, 3),
            "timestamp": str(random.randint(1000000000, 9999999999))
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/glosses")
async def get_available_glosses():
    """Get list of available Turkish sign language glosses"""
    return {"glosses": TID_GLOSSES}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)