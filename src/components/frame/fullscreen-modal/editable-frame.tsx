import DOMPurify from 'dompurify';
import { EditableIframeProps } from '@/interfaces/frame/fullscreen-modal/editable-iframe-props.interface';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const EditableIframe = ({
  iframeRef,
  selectedFrameId,
  originalHtml
}: EditableIframeProps) => {
  const [sanitizedHtml, setSanitizedHtml] = useState('');
  
  useEffect(() => {
    DOMPurify.setConfig({
      ADD_TAGS: ['iframe', 'script', 'style', 'link', 'meta'],
      ADD_ATTR: ['srcDoc', 'sandbox', 'allow', 'frameborder', 'scrolling', 'target'],
      ALLOW_DATA_ATTR: true,
      FORCE_BODY: true,
      KEEP_CONTENT: true,
      WHOLE_DOCUMENT: true
    });

    const sanitized = DOMPurify.sanitize(originalHtml);
    setSanitizedHtml(sanitized);
  }, [originalHtml]);

  return (
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
          srcDoc={sanitizedHtml}
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups"
          allow="fullscreen"
        />
      </motion.div>
    </div>
  );
};