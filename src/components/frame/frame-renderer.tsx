import React from 'react';

interface FrameRendererProps {
  html: string;
}

const FrameRenderer: React.FC<FrameRendererProps> = ({ html }) => {
  return (
    <iframe
      srcDoc={html}
      className="w-full h-96 border-0"
      title="Frame Renderer"
      sandbox="allow-same-origin allow-scripts"
      loading="lazy"
    />
  );
};

export default FrameRenderer;