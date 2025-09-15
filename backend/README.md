# Backend API Server

FastAPI-based backend server for Turkish Sign Language recognition using PyTorch.

## Features

- Real-time video frame processing
- Turkish Sign Language (TID) gloss recognition
- RESTful API endpoints
- CORS support for frontend integration
- Mock CNN model for demonstration

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Usage

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint with API info
- `GET /health` - Health check endpoint
- `POST /predict` - Upload image file for prediction
- `POST /predict-base64` - Send base64 encoded image for prediction
- `GET /glosses` - Get available Turkish sign language glosses

## Model

Currently uses a mock CNN model for demonstration. In production, this would be replaced with a pretrained model trained on the AUTSL (Turkish Sign Language) dataset.

## Supported Glosses

The system recognizes common Turkish sign language words including:
- Greetings: merhaba, günaydın, iyi akşamlar
- Courtesy: teşekkür ederim, lütfen, özür dilerim
- Family: anne, baba, kardeş, arkadaş
- Objects: su, yemek, ev, kitap, telefon
- And more...