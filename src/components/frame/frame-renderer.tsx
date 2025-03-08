import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setEditing, saveEditing, cancelEditing, updateHtml } from '@/store/iframe-editing.slice';
import EditorToolbar from '../editor-toolbar';
import { FrameRendererProps } from '@/interfaces/frame-renderer-props';
import { useIframeEditor } from '@/hooks/use-iframe-editor';
import SuccessNotification from '../success-notification';
import { useNotification } from '@/hooks/use-notification';

const FrameRenderer: React.FC<FrameRendererProps> = ({ html, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const { editedHtml, isEditing } = useSelector((state: RootState) => state.iframeEditing);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showNotification, setShowNotification] = useState(false);

  const { removeOutline } = useIframeEditor(iframeRef, dispatch);
  
  useNotification(showNotification, setShowNotification);

  useEffect(() => {
    dispatch(updateHtml(html));
  }, [html, dispatch]);

  useEffect(() => {
    if (iframeRef.current && editedHtml) {
      iframeRef.current.srcdoc = editedHtml;
    }
  }, [editedHtml]);

  const handleSaveClick = () => {
    dispatch(saveEditing());
    onSave(editedHtml);
    dispatch(setEditing(false));
    removeOutline();
    setShowNotification(true);
  };

  const handleCancelClick = () => {
    dispatch(cancelEditing());
    removeOutline();
    
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
    }
    
    if (typeof onCancel === 'function') {
      onCancel({ preserveCurrentFrame: true });
    }
  };

  return (
    <div className="relative">
      <iframe
        ref={iframeRef}
        srcDoc={editedHtml || html}
        className={`w-full h-[50vh] border-0 ${isEditing ? 'cursor-text' : ''}`}
        title="Frame Renderer"
        sandbox="allow-same-origin allow-scripts allow-forms"
        loading="lazy"
      />
      
      {isEditing && (
        <EditorToolbar 
          onSave={handleSaveClick} 
          onCancel={handleCancelClick} 
        />
      )}
      
      {showNotification && <SuccessNotification />}
    </div>
  );
};

export default FrameRenderer;