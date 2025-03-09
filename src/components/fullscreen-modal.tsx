import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setFullscreen } from '@/store/iframe-editing.slice';

const FullscreenModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isFullscreen, editedHtml } = useSelector((state: RootState) => state.iframeEditing);

  if (!isFullscreen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <span className="text-lg font-bold">Visualização Completa</span>
        <button
          onClick={() => dispatch(setFullscreen(false))}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Fechar
        </button>
      </div>

      <div className="flex-1">
        <iframe
          srcDoc={editedHtml}
          className="w-full h-full border-0"
          title="Visualização Fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
    </div>
  );
};

export default FullscreenModal;
