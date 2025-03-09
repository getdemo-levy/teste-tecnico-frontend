import { setEditing, updateHtml } from "@/store/iframe-editing.slice";
import { RootState } from '@/store';
import { useMemo, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useIframeEditor = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  isFullscreen: boolean
) => {
  const dispatch = useDispatch();
  const currentEditingElement = useRef<HTMLElement | null>(null);
  const observer = useRef<MutationObserver | null>(null);
  const editableElements = useMemo(() => ['P', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'A', 'BUTTON', 'LABEL', 'STRONG', 'EM'], []);
  const { currentFrameId } = useSelector((state: RootState) => state.iframeEditing);

  
  const cleanupEditableElements = useCallback(() => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }

    const editableNodes = iframeDoc.querySelectorAll('[contenteditable="true"]');
    editableNodes.forEach((node) => {
      const element = node as HTMLElement;
      Object.assign(element.style, {
        outline: '',
        borderRadius: '',
        boxShadow: '',
        minHeight: '',
        transition: '',
        padding: '',
        margin: ''
      });
      element.contentEditable = 'false';
    });

    currentEditingElement.current = null;
    dispatch(setEditing(false));
  }, [dispatch, iframeRef]);

  
  const startEditing = useCallback((element: HTMLElement) => {
    if (!element || !isFullscreen || !iframeRef.current?.contentDocument) return;
    
    const iframeDoc = iframeRef.current.contentDocument;
    
    cleanupEditableElements();
    
    element.contentEditable = 'true';
    Object.assign(element.style, {
      outline: '2px solid #3B82F6',
      borderRadius: '4px',
      boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)',
      minHeight: '32px',
      transition: 'all 0.2s ease',
      padding: '4px 8px',
      margin: '2px'
    });
    
    currentEditingElement.current = element;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new MutationObserver(() => {
      if (iframeDoc && currentFrameId) {
        const newHtml = iframeDoc.documentElement.outerHTML;
        dispatch(updateHtml({
          html: newHtml,
          frameId: currentFrameId
        }));
      }
    });
    
    observer.current.observe(element, {
      childList: true,
      characterData: true,
      subtree: true
    });
    
    dispatch(setEditing(true));
    
    setTimeout(() => {
      element.focus();
      
      try {
        const range = document.createRange();
        const sel = iframeDoc.getSelection();

        if (element.childNodes.length > 0) {
          const lastNode = element.childNodes[element.childNodes.length - 1];
          const length = lastNode.textContent?.length || 0;
          range.setStart(lastNode, length);
          range.setEnd(lastNode, length);
          sel?.removeAllRanges();
          sel?.addRange(range);
        } else {
          
          const textNode = iframeDoc.createTextNode('');
          element.appendChild(textNode);
          range.setStart(textNode, 0);
          range.setEnd(textNode, 0);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      } catch (e) {
        console.warn('Erro ao posicionar cursor:', e);
      }
    }, 100);

  }, [cleanupEditableElements, dispatch, isFullscreen, iframeRef, currentFrameId]);

  
  const handleDoubleClick = useCallback((event: MouseEvent) => {
    if (!isFullscreen) return;

    const target = event.target as HTMLElement;

    if (editableElements.includes(target.tagName)) {
      event.preventDefault();
      event.stopPropagation();

      
      startEditing(target);
    }
  }, [editableElements, isFullscreen, startEditing]);

  const handleDocumentClick = useCallback((event: MouseEvent) => {
    if (!currentEditingElement.current) return;

    const target = event.target as Node;
    const editingEl = currentEditingElement.current;
    
    if (target !== editingEl && !editingEl.contains(target)) {
      
      cleanupEditableElements();
    }
  }, [cleanupEditableElements]);

  const setupEventListeners = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const iframeDoc = iframe.contentDocument;

    iframeDoc.removeEventListener('dblclick', handleDoubleClick);
    iframeDoc.removeEventListener('mousedown', handleDocumentClick);
    
    iframeDoc.addEventListener('dblclick', handleDoubleClick);
    iframeDoc.addEventListener('mousedown', handleDocumentClick);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentEditingElement.current) {
        
        e.stopPropagation();
      }
    };

    iframeDoc.removeEventListener('keydown', handleKeyDown);
    iframeDoc.addEventListener('keydown', handleKeyDown);

  }, [handleDoubleClick, handleDocumentClick, iframeRef]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setupEventListeners();
    };

    iframe.addEventListener('load', handleLoad);
    
    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      setupEventListeners();
    }

    return () => {
      iframe.removeEventListener('load', handleLoad);

      if (iframe.contentDocument) {
        iframe.contentDocument.removeEventListener('dblclick', handleDoubleClick);
        iframe.contentDocument.removeEventListener('mousedown', handleDocumentClick);
      }

      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleDoubleClick, handleDocumentClick, iframeRef, setupEventListeners]);

  const resetEditableState = useCallback(() => {
    cleanupEditableElements();
  }, [cleanupEditableElements]);

  return {
    handleDoubleClick,
    resetEditableState,
    setupEventListeners,
    startEditing
  };
};