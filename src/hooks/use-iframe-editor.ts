import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { updateHtml, setEditing } from '@/store/iframe-editing.slice';

// Modificando o tipo do parâmetro para aceitar RefObject com valor null
export const useIframeEditor = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  dispatch: ReturnType<typeof useDispatch>
) => {
  const editableElements = useMemo(() => ['P', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'LI'], []);

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
  }, [handleDoubleClick, iframeRef]);

  const removeOutline = useCallback(() => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (iframeDoc) {
      const editableElements = iframeDoc.querySelectorAll('[contenteditable="true"]');
      editableElements.forEach((element) => {
        (element as HTMLElement).style.outline = '';
      });
    }
  }, [iframeRef]);

  return { handleDoubleClick, removeOutline };
};