import React from 'react';

interface FrameRendererProps {
  src: string;
}

const FrameRenderer: React.FC<FrameRendererProps> = ({ src }) => {
  return (
    <iframe
      src={src}
      className="w-full h-96 border"
      title="Frame Renderer"
    />
  );
};

export default FrameRenderer;
  