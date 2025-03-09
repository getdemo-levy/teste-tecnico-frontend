import { ModalHeaderProps } from '@/interfaces/frame/fullscreen-modal/modal-header-props.interface';
import { Info, X } from 'lucide-react';

export const ModalHeader = ({
  onShowTooltip,
  onSave,
  onCancel,
  onClose,
}: ModalHeaderProps) => (
  <div className="absolute top-0 left-0 w-full bg-gray-900 text-white px-5 py-2 flex justify-between items-center shadow-md z-10">
    <button
      onClick={onShowTooltip}
      className="text-white p-2 rounded-lg hover:bg-gray-700 transition-all"
    >
      <Info size={24} />
    </button>

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
      <button
        onClick={onClose}
        className="text-white p-2 rounded-lg hover:bg-red-700 transition-all"
      >
        <X size={24} />
      </button>
    </div>
  </div>
);