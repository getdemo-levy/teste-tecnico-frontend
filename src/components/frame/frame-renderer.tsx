import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  updateHtml,
  setEditing,
  saveEditing,
  cancelEditing,
} from '@/store/iframe-editing.slice';
import EditorToolbar from '../editor-toolbar';
import { FrameRendererProps } from '@/interfaces/frame-renderer-props';

const FrameRenderer: React.FC<FrameRendererProps> = ({ html, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const { editedHtml, isEditing } = useSelector((state: RootState) => state.iframeEditing);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    dispatch(updateHtml(html));
  }, [html, dispatch]);

  const handleDoubleClick = useCallback((event: MouseEvent) => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

    const target = event.target as HTMLElement;
    const editableElements = ['P', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'LI'];

    if (editableElements.includes(target.tagName)) {
      target.contentEditable = 'true';
      target.focus();
      target.style.outline = '2px solid #3B82F6';
      target.style.minHeight = '1em';
      dispatch(setEditing(true));

      const blurHandler = () => {
        dispatch(updateHtml(iframeDoc.documentElement.outerHTML));
      };

      target.removeEventListener('blur', blurHandler);
      target.addEventListener('blur', blurHandler);
    }
  }, [dispatch]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const loadHandler = () => {
      iframe.contentDocument?.addEventListener('dblclick', handleDoubleClick);
    };

    iframe.addEventListener('load', loadHandler);
    if (iframe.contentDocument) {
      iframe.contentDocument.addEventListener('dblclick', handleDoubleClick);
    }

    return () => {
      iframe.removeEventListener('load', loadHandler);
      iframe.contentDocument?.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [handleDoubleClick]);

  useEffect(() => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    const updateIframe = () => {
      iframe.srcdoc = editedHtml;
    };

    setTimeout(updateIframe, 0);
  }, [editedHtml]);


  const handleSaveClick = () => {
    dispatch(saveEditing());
    onSave(editedHtml);
  };

  const handleCancelClick = () => {
    dispatch(cancelEditing());
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
