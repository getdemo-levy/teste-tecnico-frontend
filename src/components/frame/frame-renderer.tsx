import React from 'react';
import EditorToolbar from '../editor-toolbar';
import { useIframeEditing } from '@/hooks/use-iframe-editing.hook';
import { FrameRendererProps } from '@/interfaces/frame-renderer-props';

const FrameRenderer: React.FC<FrameRendererProps> = ({ html, onSave, onCancel }) => {
  const { iframeRef, editedHtml, isEditing, handleSave, handleCancel } = useIframeEditing(html);

  const handleSaveClick = () => {
    const newHtml = handleSave();
    onSave(newHtml);
  };

  const handleCancelClick = () => {
    handleCancel();
    onCancel();
  };

  return (
    <div className="relative">
      <iframe
        ref={iframeRef}
        srcDoc={editedHtml}
        className={`w-full h-96 border-0 ${isEditing ? 'cursor-text' : ''}`}
        title="Frame Renderer"
        sandbox="allow-same-origin allow-scripts"
        loading="lazy"
      />
      
      {isEditing && (
        <EditorToolbar onSave={handleSaveClick} onCancel={handleCancelClick} />
      )}
    </div>
  );
};

export default FrameRenderer;
