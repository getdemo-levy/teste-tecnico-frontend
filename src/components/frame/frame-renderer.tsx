import React from 'react';

interface FrameRendererProps {
  html: string;
}

const FrameRenderer: React.FC<FrameRendererProps> = ({ html }) => {
  return (
    <iframe
      srcDoc={html}
      className="w-full h-96 border"
      title="Frame Renderer"
    />
  );
};

export default FrameRenderer;
  