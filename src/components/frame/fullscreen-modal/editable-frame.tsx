import { EditableIframeProps } from '@/interfaces/frame/fullscreen-modal/editable-iframe-props.interface';
import { motion } from 'framer-motion';

export const EditableIframe = ({
  iframeRef,
  selectedFrameId,
  originalHtml
}: EditableIframeProps) => (
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
        title="Frame Html"
        key={selectedFrameId}
        srcDoc={originalHtml}
        className="w-full h-full border-none"
        sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
      />
    </motion.div>
  </div>
);