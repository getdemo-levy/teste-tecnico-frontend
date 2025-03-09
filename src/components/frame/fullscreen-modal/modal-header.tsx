import { ModalHeaderProps } from '@/interfaces/frame/fullscreen-modal/modal-header-props.interface';
import { Info, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const ModalHeader = ({
  onShowTooltip,
  onSave,
  onCancel,
  onClose,
  hasChanges,
  frames,
  currentFrameIndex,
  onSelectFrame,
}: ModalHeaderProps) => {
  const handlePrevFrame = () => {
    if (currentFrameIndex > 0) {
      onSelectFrame(currentFrameIndex - 1);
    }
  };

  const handleNextFrame = () => {
    if (currentFrameIndex < frames.length - 1) {
      onSelectFrame(currentFrameIndex + 1);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full bg-gray-900 text-white px-5 py-2 flex justify-between items-center shadow-md z-10">
      <button
        onClick={onShowTooltip}
        className="text-white p-2 rounded-lg hover:bg-gray-700 transition-all"
      >
        <Info size={24} />
      </button>

      <div className="flex items-center gap-4">
        {/* Setas de navegação */}
        <div className="flex gap-2">
          <button
            onClick={handlePrevFrame}
            disabled={currentFrameIndex === 0}
            className="text-white p-2 rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNextFrame}
            disabled={currentFrameIndex === frames.length - 1}
            className="text-white p-2 rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Contador de frames */}
        <div className="text-sm font-medium">
          Frame {currentFrameIndex + 1} de {frames.length}
        </div>
      </div>

      <div className="flex gap-3">
        {hasChanges && (
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              Salvar
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              Cancelar
            </button>
          </div>
        )}
        <button
          onClick={onClose}
          className="text-white p-2 rounded-lg hover:bg-red-700 transition-all"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};