import React, { useRef } from 'react';
import { FrameRendererProps } from '@/interfaces/frame/frame-renderer-props';

const FrameRenderer: React.FC<FrameRendererProps> = ({ html }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  if (!html) return null;

  const sanitizedHtml = html.replace(/contenteditable=["']?true["']?/gi, '');
  
  return (
    <div className="relative">
      <iframe
        ref={iframeRef}
        srcDoc={sanitizedHtml}
        className={`w-full h-[40vh] border-0`}
        title="Frame Renderer"
        sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
        loading="lazy"
      />
      
    </div>
  );
};

export default FrameRenderer;