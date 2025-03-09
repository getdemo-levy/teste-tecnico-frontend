import { setEditing, updateHtml } from "@/store/iframe-editing.slice";
import { RootState } from '@/store';
import { useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useIframeEditor = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  isFullscreen: boolean
) => {
  const dispatch = useDispatch();
  const editableElements = useMemo(() => ['P', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'A', 'BUTTON', 'LABEL', 'STRONG', 'EM'], []);
  const { currentFrameId } = useSelector((state: RootState) => state.iframeEditing);

  const cleanupEditableElements = useCallback(() => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

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

    dispatch(setEditing(false));
  }, [dispatch, iframeRef]);

  const handleDoubleClick = useCallback((event: MouseEvent) => {
    if (!isFullscreen) return;

    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

    cleanupEditableElements();

    const target = event.target as HTMLElement;

    if (editableElements.includes(target.tagName)) {
      event.preventDefault();

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

      const observer = new MutationObserver(() => {
        const newHtml = iframeDoc.documentElement.outerHTML;
        dispatch(updateHtml({
          html: newHtml,
          frameId: currentFrameId || ''
        }));
      });

      observer.observe(target, {
        childList: true,
        attributes: false,
        characterData: true,
        subtree: true
      });

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

        target.contentEditable = 'false';
        observer.disconnect();
        dispatch(setEditing(false));
        target.removeEventListener('blur', blurHandler);
      };

      target.addEventListener('blur', blurHandler);
    }
  }, [dispatch, editableElements, isFullscreen, iframeRef, currentFrameId, cleanupEditableElements]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupEventListeners = () => {
      const iframeDocument = iframe.contentDocument;
      if (iframeDocument) {
        iframeDocument.removeEventListener('dblclick', handleDoubleClick);
        iframeDocument.addEventListener('dblclick', handleDoubleClick);
      }
    };

    iframe.addEventListener('load', setupEventListeners);

    if (iframe.contentDocument) {
      setupEventListeners();
    }

    return () => {
      iframe.removeEventListener('load', setupEventListeners);
      if (iframe.contentDocument) {
        iframe.contentDocument.removeEventListener('dblclick', handleDoubleClick);
      }
    };
  }, [handleDoubleClick, iframeRef, isFullscreen]);

  const resetEditableState = useCallback(() => {
    cleanupEditableElements();
  }, [cleanupEditableElements]);

  return { handleDoubleClick, resetEditableState };
};