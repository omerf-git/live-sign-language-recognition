import React from 'react';

const Header = ({ isConnected, onReconnect }) => {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Türk İşaret Dili Tanıma Sistemi
            </h1>
            <p className="text-gray-600 mt-1">
              Gerçek zamanlı işaret dili tanıma uygulaması
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Bağlı' : 'Bağlantı Yok'}
              </span>
            </div>
            
            {!isConnected && (
              <button
                onClick={onReconnect}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Yeniden Bağlan
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;