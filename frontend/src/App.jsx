import React, { useState, useEffect } from 'react';
import WebcamCapture from './components/WebcamCapture';
import PredictionDisplay from './components/PredictionDisplay';
import Header from './components/Header';

function App() {
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Check backend connection on app load
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected(false);
    }
  };

  const handlePrediction = (prediction) => {
    setCurrentPrediction(prediction);
    
    // Add to history if it's a valid prediction
    if (prediction && prediction.predicted_gloss !== 'no_sign_detected') {
      setPredictionHistory(prev => {
        const newHistory = [prediction, ...prev].slice(0, 10); // Keep last 10 predictions
        return newHistory;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header isConnected={isConnected} onReconnect={checkBackendConnection} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Webcam Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Kamera Görüntüsü
              </h2>
              <WebcamCapture 
                onPrediction={handlePrediction}
                isConnected={isConnected}
              />
              
              {/* Current Prediction Overlay */}
              {currentPrediction && (
                <div className="mt-4 p-4 bg-indigo-100 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                    Anlık Tanıma:
                  </h3>
                  <div className="text-2xl font-bold text-indigo-600">
                    {currentPrediction.predicted_gloss === 'no_sign_detected' 
                      ? 'İşaret algılanmadı' 
                      : currentPrediction.predicted_gloss
                    }
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Güven: {(currentPrediction.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prediction Display Section */}
          <div className="lg:col-span-1">
            <PredictionDisplay 
              predictions={predictionHistory}
              currentPrediction={currentPrediction}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;