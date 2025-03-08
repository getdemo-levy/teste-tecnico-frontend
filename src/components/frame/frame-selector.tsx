import { FrameSelectorProps } from '@/interfaces/frame-selector-props.interface';
import React from 'react';

const FrameSelector: React.FC<FrameSelectorProps> = ({ frames, selectedFrame, onSelect }) => {
  return (
    <div className="border-b border-gray-200 p-4 bg-gray-50">
      <label htmlFor="frame-select" className="block text-sm font-medium text-gray-700 mb-2">
        Selecione o frame:
      </label>
      <div className="relative">
        <select
          id="frame-select"
          onChange={(e) => {
            const frame = frames.find((f) => f.id === e.target.value);
            if (frame) onSelect(frame);
          }}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm appearance-none"
          value={selectedFrame?.id}
        >
          {frames.map((frame, index) => (
            <option key={frame.id} value={frame.id}>
              Frame {index + 1} {frame.id && `- ${frame.id}`}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FrameSelector;
