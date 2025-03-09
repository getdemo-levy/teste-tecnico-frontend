import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/store';
import { setFullscreen } from '@/store/iframe-editing.slice';

const FullscreenModal: React.FC = () => {
  const dispatch = useDispatch();
  const isFullscreen = useSelector((state: RootState) => state.iframeEditing.isFullscreen);
  const editedHtml = useSelector((state: RootState) => state.iframeEditing.editedHtml);

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
          <div className="relative w-full h-full flex justify-center items-center">
            <motion.div
              className="w-[90%] h-[90%] bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <iframe 
                srcDoc={editedHtml} 
                className="w-full h-full border-none"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </motion.div>
            
            <button
              onClick={() => dispatch(setFullscreen(false))}
              className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullscreenModal;
