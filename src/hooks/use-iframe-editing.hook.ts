import { useCallback, useEffect, useRef, useState } from 'react';

export const useIframeEditing = (initialHtml: string) => {
  const [editedHtml, setEditedHtml] = useState<string>(initialHtml);
  const [originalHtml, setOriginalHtml] = useState<string>(initialHtml);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentEditElement, setCurrentEditElement] = useState<HTMLElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setOriginalHtml(initialHtml);
    setEditedHtml(initialHtml);
  }, [initialHtml]);

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

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      setTimeout(() => {
        iframe.srcdoc = editedHtml;
      }, 0);
    }
  }, [editedHtml]);

  const handleSave = () => {
    if (currentEditElement) {
      currentEditElement.contentEditable = 'false';
      currentEditElement.style.outline = '';
      setCurrentEditElement(null);
    }
    setIsEditing(false);
    return editedHtml;
  };

  const handleCancel = () => {
    if (currentEditElement) {
      currentEditElement.contentEditable = 'false';
      currentEditElement.style.outline = '';
      setCurrentEditElement(null);
    }
    setEditedHtml(originalHtml);
    setIsEditing(false);
  };

  return { iframeRef, editedHtml, isEditing, handleSave, handleCancel };
};
