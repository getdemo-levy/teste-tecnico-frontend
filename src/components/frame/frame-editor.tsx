import React from 'react';
import FrameRenderer from '@/components/frame/frame-renderer';
import { FrameEditorProps } from '@/interfaces/frame-editor-props.interface';

const FrameEditor: React.FC<FrameEditorProps> = ({ selectedFrame, onSave, onCancel }) => {
  if (!selectedFrame) return null;
  
  const handleCancel = (options = {}) => {
    console.log("Edição cancelada", options);
    if (typeof onCancel === 'function') {
      onCancel(options);
    }
  };

  return (
    <div className="p-4">
      <div className="border border-gray-200 rounded-md w-full">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex space-x-1 mr-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <p className="text-xs text-gray-600 truncate">
              {selectedFrame.id || `Frame`}
            </p>
          </div>
          <p className="text-xs text-gray-500">Dica: clique duas vezes em um texto para editá-lo</p>
        </div>
        <div className="w-full">
          <FrameRenderer 
            html={selectedFrame.html} 
            onSave={onSave} 
            onCancel={handleCancel} 
          />
        </div>
      </div>
    </div>
  );
};

export default FrameEditor;