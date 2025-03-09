import { ConfirmationModalProps } from '@/interfaces/frame/fullscreen-modal/confirmation-modal-props.interface';
import { motion, AnimatePresence } from 'framer-motion';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  icon,
  confirmButtonStyle
}: ConfirmationModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
          <p className="mb-6 text-gray-600">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg ${confirmButtonStyle}`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);