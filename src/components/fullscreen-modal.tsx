import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react'; // Importando o ícone de "X"
import { RootState } from '@/store';
import { setFullscreen } from '@/store/iframe-editing.slice';
import SuccessNotification from './success-notification';
import { useNotification } from '@/hooks/use-notification';
import { FullscreenProps } from '@/interfaces/fullscreen-props.interface';

const FullscreenModal: React.FC<FullscreenProps> = ({ selectedFrame, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const isFullscreen = useSelector((state: RootState) => state.iframeEditing.isFullscreen);
  const editedHtml = useSelector((state: RootState) => state.iframeEditing.editedHtml);

  const [showNotification, setShowNotification] = useState(false);

  useNotification(showNotification, setShowNotification);

  if (!selectedFrame) return null;

  return (
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="absolute top-0 left-0 w-full bg-gray-900 text-white px-5 py-2 flex justify-end gap-3 shadow-md z-10">
            <button
              onClick={() => onSave(editedHtml)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg transition-all"
            >
              Salvar
            </button>
            <button
              onClick={() => onCancel()}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() => dispatch(setFullscreen(false))}
              className="text-white p-2 rounded-lg hover:bg-red-700 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative w-full h-full flex justify-center items-center pt-[50px]">
            <motion.div
              className="w-[90%] h-[calc(100%-50px)] bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <iframe
                srcDoc={selectedFrame.html || ''}
                className="w-full h-full border-none"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
      {showNotification && <SuccessNotification />}
    </AnimatePresence>
  );
};

export default FullscreenModal;
