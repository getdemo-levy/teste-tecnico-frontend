import { AnimatePresence, motion } from 'framer-motion';

interface TooltipProps {
  isVisible: boolean;
  onClose: () => void;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
}

export const Tooltip = ({ isVisible, onClose, tooltipRef }: TooltipProps) => (
  <AnimatePresence>
    {isVisible && (
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
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs mt-2"
        >
          Entendi
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);