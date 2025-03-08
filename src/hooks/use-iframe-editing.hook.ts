import { setInitialHtml, setEditing, updateHtml, saveEditing, cancelEditing } from '@/store/iframe-editing-slice';
import { RootState } from '@/store';
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useIframeEditing = (initialHtml: string) => {
  const dispatch = useDispatch();
  const { editedHtml, isEditing } = useSelector((state: RootState) => state.iframeEditing);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    dispatch(setInitialHtml(initialHtml));
  }, [initialHtml, dispatch]);

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
    const iframe = iframeRef.current;
    if (iframe) {
      setTimeout(() => {
        iframe.srcdoc = editedHtml;
      }, 0);
    }
  }, [editedHtml]);

  const handleSave = () => {
    dispatch(saveEditing());
    return editedHtml;
  };

  const handleCancel = () => {
    dispatch(cancelEditing());
  };

  return { iframeRef, editedHtml, isEditing, handleSave, handleCancel };
};
