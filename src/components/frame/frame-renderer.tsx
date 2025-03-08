import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
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
  const [showNotification, setShowNotification] = useState(false);

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
        borderRadius: '4px',
        boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)',
        minHeight: '32px',
        transition: 'all 0.2s ease',
        padding: '4px 8px',
        margin: '2px'
      });
      
      dispatch(setEditing(true));

      const blurHandler = () => {
        Object.assign(target.style, {
          outline: '',
          borderRadius: '',
          boxShadow: '',
          minHeight: '',
          transition: '',
          padding: '',
          margin: ''
        });
        
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

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

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
        srcDoc={editedHtml}
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
      
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 max-w-md">
          <div className="flex items-center">
            <div className="py-1">
              <svg className="h-6 w-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">Frame salvo com sucesso!</p>
              <p>Lembre-se de clicar em &rdquo;Salvar todas alterações&rdquo; no topo da página quando terminar de editar todos os frames.</p>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default FrameRenderer;