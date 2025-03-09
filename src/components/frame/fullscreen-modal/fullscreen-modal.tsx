import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { RootState } from '@/store';
import { setFullscreen, initializeFrame, resetFrame } from '@/store/iframe-editing.slice';
import { clearUnsavedChanges } from '@/store/demo.slice';
import { useIframeEditor } from '@/hooks/use-iframe-editor';
import SuccessNotification from '@/components/success-notification';
import { useNotification } from '@/hooks/use-notification';
import { FullscreenProps } from '@/interfaces/frame/fullscreen-modal/fullscreen-props.interface';
import { ConfirmationModal } from './confirmation-modal';
import { EditableIframe } from './editable-frame';
import { ModalHeader } from './modal-header';
import { Tooltip } from './tooltip';

export const FullscreenModal: React.FC<FullscreenProps> = ({
  selectedFrame,
  frames,
  onSave,
  onCancel,
  onSelectFrame,
}) => {
  const dispatch = useDispatch();
  const { isFullscreen, editedHtml, originalHtml, currentFrameId } = useSelector(
    (state: RootState) => state.iframeEditing
  );
  
  const [showNotification, setShowNotification] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { resetEditableState, setupEventListeners } = useIframeEditor(iframeRef, isFullscreen);
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

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const timeoutId = setTimeout(() => {
        setupEventListeners();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [editedHtml, setupEventListeners]);

  const handleSaveConfirmed = async () => {
    try {
      resetEditableState();
      const finalHtml = iframeRef.current?.contentDocument?.documentElement.outerHTML || originalHtml;
      
      await onSave(finalHtml);
      dispatch(initializeFrame({
        html: finalHtml,
        frameId: selectedFrame!.id
      }));
      setShowNotification(true);
      
      setTimeout(() => {
        setupEventListeners();
      }, 100);
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
    
    setTimeout(() => {
      setupEventListeners();
    }, 100);
  };

  if (!selectedFrame) return null;

  const currentFrameIndex = frames.findIndex(f => f.id === selectedFrame?.id);

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
          <ConfirmationModal
            isOpen={showSaveConfirmation}
            onClose={() => setShowSaveConfirmation(false)}
            onConfirm={handleSaveConfirmed}
            title="Confirmar Salvamento"
            message="Deseja salvar as alterações feitas neste frame?"
            icon={<AlertTriangle className="text-yellow-600" size={24} />}
            confirmButtonStyle="bg-green-600 hover:bg-green-700"
          />

          <ConfirmationModal
            isOpen={showCancelConfirmation}
            onClose={() => setShowCancelConfirmation(false)}
            onConfirm={handleCancelConfirmed}
            title="Confirmar Cancelamento"
            message="Todas as alterações não salvas serão perdidas. Deseja continuar?"
            icon={<AlertTriangle className="text-red-600" size={24} />}
            confirmButtonStyle="bg-red-600 hover:bg-red-700"
          />

          <ModalHeader
            onShowTooltip={() => setShowTooltip(true)}
            onSave={() => hasChanges ? setShowSaveConfirmation(true) : handleSaveConfirmed()}
            onCancel={() => hasChanges ? setShowCancelConfirmation(true) : handleCancelConfirmed()}
            onClose={() => dispatch(setFullscreen(false))}
            hasChanges={hasChanges}
            frames={frames}
            currentFrameIndex={currentFrameIndex}
            onSelectFrame={onSelectFrame}
          />

          <Tooltip
            isVisible={showTooltip}
            onClose={() => setShowTooltip(false)}
            tooltipRef={tooltipRef}
          />

          <EditableIframe
            iframeRef={iframeRef}
            selectedFrameId={selectedFrame?.id}
            originalHtml={originalHtml}
          />

          {showNotification && <SuccessNotification />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};