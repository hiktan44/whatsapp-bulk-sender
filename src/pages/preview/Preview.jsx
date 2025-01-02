import React from 'react';
import { useParams } from 'react-router-dom';

const Preview = () => {
  const { mediaUrl } = useParams();
  
  if (!mediaUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-red-500">Medya bulunamadı</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mt-4">
          <img 
            src={decodeURIComponent(mediaUrl)}
            alt="Preview"
            className="max-w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Preview; 