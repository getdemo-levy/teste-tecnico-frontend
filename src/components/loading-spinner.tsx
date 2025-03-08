import { LoadingSpinnerProps } from '@/interfaces/loading-spinner-props.interface';
import React from 'react';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 mb-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        {message && <p className="text-gray-600 font-medium">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
