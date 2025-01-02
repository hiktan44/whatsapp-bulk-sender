import React from 'react';
import { AlertCircle, CheckCircle, XCircle, InfoIcon } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      icon: <XCircle className="h-5 w-5 text-red-600" />
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      icon: <InfoIcon className="h-5 w-5 text-blue-600" />
    }
  };

  const style = styles[type];

  return (
    <div className={`rounded-md p-4 ${style.bg} ${style.text} flex items-center`}>
      <div className="flex-shrink-0 mr-3">{style.icon}</div>
      <div className="flex-1">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-3 focus:outline-none"
        >
          <XCircle className="h-5 w-5 opacity-50 hover:opacity-75" />
        </button>
      )}
    </div>
  );
};

export default Alert;