import React from 'react';
import FrameRenderer from '@/components/frame/frame-renderer';
import { FrameEditorProps } from '@/interfaces/frame/frame-editor-props.interface';

const FramePreview: React.FC<FrameEditorProps> = ({ selectedFrame }) => {
  if (!selectedFrame) return null;
  return (
    <div className="p-2">
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
        </div>
        <div className="w-full">
          <FrameRenderer 
            html={selectedFrame.html} 
          />
        </div>
      </div>
    </div>
  );
};

export default FramePreview;