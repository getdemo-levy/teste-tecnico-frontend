import React, { useRef, useEffect, useCallback, useMemo } from 'react';
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

  const editableElements = useMemo(() => ['P', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'LI'], []);

  useEffect(() => {
    dispatch(updateHtml(html));
  }, [html, dispatch]);

  const handleDoubleClick = useCallback((event: MouseEvent) => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

    const target = event.target as HTMLElement;
    
    if (editableElements.includes(target.tagName)) {
      target.contentEditable = 'true';
      target.focus();
      Object.assign(target.style, {
        outline: '2px solid #3B82F6',
        minHeight: '1em',
      });
      
      dispatch(setEditing(true));

      const blurHandler = () => {
        dispatch(updateHtml(iframeDoc.documentElement.outerHTML));
        target.removeEventListener('blur', blurHandler);
      };

      target.addEventListener('blur', blurHandler);
    }
  }, [dispatch, editableElements]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const loadHandler = () => {
      iframe.contentDocument?.addEventListener('dblclick', handleDoubleClick);
    };

    iframe.addEventListener('load', loadHandler);
    return () => {
      iframe.removeEventListener('load', loadHandler);
    };
  }, [handleDoubleClick]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentDocument?.documentElement.outerHTML !== editedHtml) {
      iframe.srcdoc = editedHtml;
    }
  }, [editedHtml]);

  const removeOutline = () => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (iframeDoc) {
      const editableElements = iframeDoc.querySelectorAll('[contenteditable="true"]');
      editableElements.forEach((element) => {
        (element as HTMLElement).style.outline = '';
      });
    }
  };

  const handleSaveClick = () => {
    dispatch(saveEditing());
    onSave(editedHtml);
    dispatch(setEditing(false));
    removeOutline();
  };

  const handleCancelClick = () => {
    dispatch(cancelEditing());
    onCancel();
    removeOutline();
  };

  return (
    <div className="relative">
      <iframe
        ref={iframeRef}
        srcDoc={editedHtml}
        className={`w-full h-96 border-0 ${isEditing ? 'cursor-text' : ''}`}
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
    </div>
  );
};

export default FrameRenderer;