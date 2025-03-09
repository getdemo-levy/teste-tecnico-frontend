import { setEditing, updateHtml } from "@/store/iframe-editing.slice";
import { RootState } from '@/store';
import { useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useIframeEditor = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  isFullscreen: boolean
) => {
  const dispatch = useDispatch();
  const editableElements = useMemo(() => ['P', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'LI'], []);
  const { editedHtml } = useSelector((state: RootState) => state.iframeEditing);

  
  const handleDoubleClick = useCallback((event: MouseEvent) => {
    if (!isFullscreen) return;

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

      const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
          const newHtml = iframeDoc.documentElement.outerHTML;
          if (newHtml !== editedHtml) {
            dispatch(updateHtml({
              html: newHtml,
              frameId: iframeDoc.documentElement.id
              }));
          }
        });
      });

      observer.observe(iframeDoc.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true
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
        target.removeEventListener('blur', blurHandler);
      };

      target.addEventListener('blur', blurHandler);
    }
  }, [dispatch, editableElements, isFullscreen, iframeRef]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const loadHandler = () => {
      iframe.contentDocument?.addEventListener('dblclick', handleDoubleClick);
    };

    iframe.addEventListener('load', loadHandler);
    return () => {
      iframe.removeEventListener('load', loadHandler);
      iframe.contentDocument?.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [handleDoubleClick, iframeRef]);

  return { handleDoubleClick };
};