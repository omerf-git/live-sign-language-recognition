# Turkish Sign Language Recognition

Real-time Turkish Sign Language recognition web application with React.js frontend and FastAPI backend, using deep learning models for TID (Turkish Sign Language) gloss recognition.

## 🌟 Features

- **Real-time Recognition**: Live webcam video processing and sign language detection
- **Turkish Interface**: Full Turkish language support in the UI
- **RESTful API**: Clean FastAPI backend with comprehensive endpoints
- **Modern UI**: Responsive React.js frontend with TailwindCSS
- **Video Processing**: Real-time frame capture and analysis
- **Prediction History**: Track and display recognition results over time

## 🏗️ Project Structure

```
├── backend/           # FastAPI server with PyTorch model
│   ├── main.py       # Main API server
│   ├── requirements.txt
│   └── README.md
├── frontend/          # React.js web application
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ and npm (for frontend)
- Webcam-enabled device

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The API server will start at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The web application will be available at `http://localhost:3000`

## 🎯 Usage

1. **Start Backend**: Run the FastAPI server first
2. **Start Frontend**: Launch the React development server
3. **Allow Camera Access**: Grant webcam permissions when prompted
4. **Begin Recognition**: Click "Kamerayı Başlat" to start the camera
5. **Perform Signs**: Make Turkish sign language gestures in front of the camera
6. **View Results**: See real-time predictions and history in the interface

## 🤖 Supported Turkish Sign Language Glosses

The system recognizes common TID glosses including:

- **Greetings**: merhaba, günaydın, iyi akşamlar, görüşürüz
- **Courtesy**: teşekkür ederim, lütfen, özür dilerim
- **Basic Responses**: evet, hayır, iyiyim, nasılsın
- **Family**: anne, baba, kardeş, arkadaş
- **Professions**: öğretmen, doktor, polis
- **Objects**: su, yemek, ev, okul, kitap, telefon, araba

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for APIs
- **PyTorch**: Deep learning framework for model inference
- **OpenCV**: Computer vision library for image processing
- **Pillow**: Python imaging library
- **Uvicorn**: ASGI server for FastAPI

### Frontend
- **React.js 18**: Modern JavaScript library for UI
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: Promise-based HTTP client
- **HTML5 Canvas**: Video frame processing

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and status |
| GET | `/health` | Health check endpoint |
| POST | `/predict` | Upload image file for prediction |
| POST | `/predict-base64` | Base64 image prediction |
| GET | `/glosses` | Get available TID glosses |

## 📱 Browser Requirements

- Modern browser with HTML5 support
- Webcam access permissions
- JavaScript enabled
- Canvas API support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Turkish Sign Language (TID) research community
- AUTSL dataset contributors
- Open source libraries and frameworks used in this project
