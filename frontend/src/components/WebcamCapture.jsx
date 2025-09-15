import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

const WebcamCapture = ({ onPrediction, isConnected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stream]);

  const startWebcam = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCapturing(true);
      
      // Start sending frames for prediction
      startPrediction();
    } catch (err) {
      setError('Kameraya erişim izni verilmedi veya kamera bulunamadı.');
      console.error('Error accessing webcam:', err);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsCapturing(false);
    onPrediction(null);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const sendFrameForPrediction = async () => {
    if (!isConnected || !isCapturing) return;
    
    const frameDataUrl = captureFrame();
    if (!frameDataUrl) return;

    try {
      const response = await axios.post('http://localhost:8000/predict-base64', {
        image: frameDataUrl
      }, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onPrediction(response.data);
      }
    } catch (error) {
      console.error('Error sending frame for prediction:', error);
      // Don't show error to user for individual frame failures
    }
  };

  const startPrediction = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Send frame every 1 second for prediction
    intervalRef.current = setInterval(sendFrameForPrediction, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="video-container relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-auto max-h-96 object-cover"
          style={{ display: isCapturing ? 'block' : 'none' }}
        />
        
        {!isCapturing && (
          <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">📹</div>
              <p className="text-gray-600">Kamera başlatılmadı</p>
            </div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>

      <div className="flex justify-center space-x-4">
        {!isCapturing ? (
          <button
            onClick={startWebcam}
            disabled={!isConnected}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <span>📹</span>
            <span>Kamerayı Başlat</span>
          </button>
        ) : (
          <button
            onClick={stopWebcam}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <span>⏹</span>
            <span>Kamerayı Durdur</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!isConnected && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Backend sunucusuna bağlantı yok. Lütfen backend sunucusunun çalıştığından emin olun.
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;