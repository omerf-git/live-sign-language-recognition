from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import torch
import torch.nn as nn
import cv2
import numpy as np
from PIL import Image
import io
import base64
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

class SimpleCNN(nn.Module):
    """Simple CNN model for sign language recognition simulation"""
    def __init__(self, num_classes=len(TID_GLOSSES)):
        super(SimpleCNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, 3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(128 * 28 * 28, 512)
        self.fc2 = nn.Linear(512, num_classes)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        
    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = self.pool(self.relu(self.conv3(x)))
        x = x.view(x.size(0), -1)
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

# Initialize model (in production, load pretrained weights)
model = SimpleCNN()
model.eval()

def preprocess_frame(image_data: bytes) -> torch.Tensor:
    """Preprocess image frame for model input"""
    # Convert bytes to PIL Image
    image = Image.open(io.BytesIO(image_data))
    
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to model input size (224x224)
    image = image.resize((224, 224))
    
    # Convert to numpy array and normalize
    img_array = np.array(image) / 255.0
    
    # Convert to torch tensor and add batch dimension
    tensor = torch.FloatTensor(img_array).permute(2, 0, 1).unsqueeze(0)
    
    return tensor

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
        input_tensor = preprocess_frame(image_data)
        
        # Run inference
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][predicted_class].item()
        
        # Get predicted gloss
        predicted_gloss = TID_GLOSSES[predicted_class]
        
        # For demo purposes, add some randomness to make it more realistic
        # In production, this would be the actual model prediction
        import random
        if random.random() < 0.3:  # 30% chance to show "no sign detected"
            predicted_gloss = "no_sign_detected"
            confidence = 0.1
        
        return JSONResponse({
            "success": True,
            "predicted_gloss": predicted_gloss,
            "confidence": round(confidence, 3),
            "all_predictions": [
                {
                    "gloss": gloss,
                    "confidence": round(probabilities[0][i].item(), 3)
                }
                for i, gloss in enumerate(TID_GLOSSES[:5])  # Top 5 predictions
            ]
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
        input_tensor = preprocess_frame(image_data)
        
        # Run inference
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][predicted_class].item()
        
        # Get predicted gloss
        predicted_gloss = TID_GLOSSES[predicted_class]
        
        # For demo purposes, add some randomness
        import random
        if random.random() < 0.3:
            predicted_gloss = "no_sign_detected"
            confidence = 0.1
        
        return JSONResponse({
            "success": True,
            "predicted_gloss": predicted_gloss,
            "confidence": round(confidence, 3),
            "timestamp": str(np.datetime64('now'))
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/glosses")
async def get_available_glosses():
    """Get list of available Turkish sign language glosses"""
    return {"glosses": TID_GLOSSES}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)