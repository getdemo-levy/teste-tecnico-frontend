import { ErrorAlertProps } from '@/interfaces/error-alert-props.interface';
import React from 'react';

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onBack }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md my-6">
      <div className="flex items-center">
        <div className="text-red-500 text-2xl mr-4">⚠️</div>
        <div>
          <p className="font-medium text-red-800">Ocorreu um erro</p>
          <p className="text-red-700">{message}</p>
        </div>
      </div>
      <button 
        onClick={onBack} 
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
      >
        Voltar para a lista de demos
      </button>
    </div>
  );
};

export default ErrorAlert;
