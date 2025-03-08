import React, { useCallback, useEffect, useRef, useState } from 'react';

interface FrameRendererProps {
  html: string;
  onSave: (html: string) => void;
  onCancel: () => void;
}

const FrameRenderer: React.FC<FrameRendererProps> = ({ html, onSave, onCancel }) => {
  const [editedHtml, setEditedHtml] = useState<string>(html);
  const [originalHtml, setOriginalHtml] = useState<string>(html);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentEditElement, setCurrentEditElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setOriginalHtml(html);
    setEditedHtml(html);
  }, [html]);

  const handleDoubleClick = useCallback((event: MouseEvent) => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

    const target = event.target as HTMLElement;
    
    const editableElements = ['P', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'LI'];
    if (editableElements.includes(target.tagName)) {
      if (currentEditElement && currentEditElement !== target) {
        currentEditElement.contentEditable = 'false';
        currentEditElement.style.outline = '';
      }
      
      target.contentEditable = 'true';
      target.focus();
      target.style.outline = '2px solid #3B82F6';
      target.style.minHeight = '1em';
      setIsEditing(true);
      setCurrentEditElement(target);
      
      const blurHandler = () => {
        setEditedHtml(iframeDoc.documentElement.outerHTML);
      };
      
      target.removeEventListener('blur', blurHandler);
      target.addEventListener('blur', blurHandler);
    }
  }, [currentEditElement]);

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

  const handleSave = () => {
    if (currentEditElement) {
      currentEditElement.contentEditable = 'false';
      currentEditElement.style.outline = '';
      setCurrentEditElement(null);
    }
    
    setIsEditing(false);
    onSave(editedHtml);
  };

  const handleCancel = () => {
    if (currentEditElement) {
      currentEditElement.contentEditable = 'false';
      currentEditElement.style.outline = '';
      setCurrentEditElement(null);
    }
    
    setEditedHtml(originalHtml);
    setIsEditing(false);
    onCancel();
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      setTimeout(() => {
        iframe.srcdoc = editedHtml;
      }, 0);
    }
  }, [editedHtml]);

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
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Salvar
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default FrameRenderer;