import React from 'react';

const PredictionDisplay = ({ predictions, currentPrediction }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Tanıma Sonuçları
      </h2>
      
      {/* Current Prediction */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Şu Anki Tahmin:
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 min-h-20 flex items-center justify-center">
          {currentPrediction ? (
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {currentPrediction.predicted_gloss === 'no_sign_detected' 
                  ? '—' 
                  : currentPrediction.predicted_gloss
                }
              </div>
              {currentPrediction.predicted_gloss !== 'no_sign_detected' && (
                <div className="text-sm text-gray-600 mt-1">
                  Güven: {(currentPrediction.confidence * 100).toFixed(1)}%
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-2xl mb-2">🤲</div>
              <p>İşaret bekleniyor...</p>
            </div>
          )}
        </div>
      </div>

      {/* Prediction History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Geçmiş Tahminler:
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {predictions.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              <p>Henüz tahmin yapılmadı</p>
            </div>
          ) : (
            predictions.map((prediction, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 border-l-4 border-indigo-500"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {prediction.predicted_gloss}
                    </div>
                    <div className="text-sm text-gray-600">
                      Güven: {(prediction.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(prediction.timestamp || Date.now()).toLocaleTimeString('tr-TR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Nasıl Kullanılır:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Kamerayı başlatın</li>
          <li>• Kamera önünde Türk İşaret Dili işaretleri yapın</li>
          <li>• Sistem her saniye bir tahmin yapacaktır</li>
          <li>• Tanınan kelimeler burada görüntülenecektir</li>
        </ul>
      </div>
    </div>
  );
};

export default PredictionDisplay;