import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertTriangle } from 'lucide-react';
import { RootState } from '@/store';
import { setFullscreen, initializeFrame, resetFrame } from '@/store/iframe-editing.slice';
import SuccessNotification from '../success-notification';
import { useNotification } from '@/hooks/use-notification';
import { FullscreenProps } from '@/interfaces/fullscreen-props.interface';
import { clearUnsavedChanges } from '@/store/demo.slice';
import { useIframeEditor } from '@/hooks/use-iframe-editor';

const FullscreenModal: React.FC<FullscreenProps> = ({ selectedFrame, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const {
    isFullscreen,
    editedHtml,
    originalHtml,
    currentFrameId
  } = useSelector((state: RootState) => state.iframeEditing);
  const [showNotification, setShowNotification] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { resetEditableState } = useIframeEditor(iframeRef, isFullscreen);

  useIframeEditor(iframeRef, isFullscreen);

  const hasChanges = editedHtml !== originalHtml;

  useNotification(showNotification, setShowNotification);

  useEffect(() => {
    if (isFullscreen) {
      setShowTooltip(true);
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (selectedFrame && selectedFrame.id !== currentFrameId) {
      dispatch(initializeFrame({
        html: selectedFrame.html,
        frameId: selectedFrame.id
      }));
    }
  }, [selectedFrame, currentFrameId, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTooltip]);

  const handleSaveConfirmed = async () => {
    try {
      resetEditableState();
      const finalHtml = iframeRef.current?.contentDocument?.documentElement.outerHTML || editedHtml;
      
      await onSave(finalHtml);
      dispatch(initializeFrame({
        html: finalHtml,
        frameId: selectedFrame!.id
      }));
      setShowNotification(true);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
    setShowSaveConfirmation(false);
  };

  const handleCancelConfirmed = () => {
    resetEditableState();
    dispatch(resetFrame());
    dispatch(clearUnsavedChanges());
    onCancel();
    setShowCancelConfirmation(false);
  };

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
          <AnimatePresence>
            {showSaveConfirmation && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-yellow-600" size={24} />
                    <h3 className="text-xl font-semibold">Confirmar Salvamento</h3>
                  </div>
                  <p className="mb-6 text-gray-600">
                    Deseja salvar as alterações feitas neste frame?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowSaveConfirmation(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveConfirmed}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCancelConfirmation && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-red-600" size={24} />
                    <h3 className="text-xl font-semibold">Confirmar Cancelamento</h3>
                  </div>
                  <p className="mb-6 text-gray-600">
                    Todas as alterações não salvas serão perdidas. Deseja continuar?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowCancelConfirmation(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleCancelConfirmed}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-0 left-0 w-full bg-gray-900 text-white px-5 py-2 flex justify-between items-center shadow-md z-10">
            <button
              onClick={() => setShowTooltip(true)}
              className="text-white p-2 rounded-lg hover:bg-gray-700 transition-all"
            >
              <Info size={24} />
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => hasChanges ? setShowSaveConfirmation(true) : handleSaveConfirmed()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                Salvar
              </button>
              <button
                onClick={() => hasChanges ? setShowCancelConfirmation(true) : handleCancelConfirmed()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => dispatch(setFullscreen(false))}
                className="text-white p-2 rounded-lg hover:bg-red-700 transition-all"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showTooltip && (
              <motion.div
                ref={tooltipRef}
                className="absolute top-12 left-4 bg-white text-gray-800 p-4 rounded-lg shadow-lg max-w-sm text-sm z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-2">
                  <strong>Dica:</strong> Dê um <strong>duplo clique</strong> em um texto para editá-lo.
                  Use o botão <strong className="text-green-400">Salvar</strong> para confirmar as alterações,
                  ou <strong className="text-red-400">Cancelar</strong> para desfazer.
                </p>
                <button
                  onClick={() => setShowTooltip(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs mt-2"
                >
                  Entendi
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative w-full h-full flex justify-center items-center pt-[50px]">
            <motion.div
              className="w-[90%] h-[calc(100%-50px)] bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <iframe
                ref={iframeRef}
                title={'Frame Html'}
                key={editedHtml}
                srcDoc={editedHtml}
                className="w-full h-full border-none"
                sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
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