import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateHtml } from '@/store/iframe-editing.slice';

export const useSyncIframe = (
  iframeRef: React.RefObject<HTMLIFrameElement>,
  html: string,
  editedHtml: string
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateHtml(html));
  }, [html, dispatch]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentDocument?.documentElement.outerHTML !== editedHtml) {
      iframe.srcdoc = editedHtml;
    }
  }, [editedHtml, iframeRef]);

  return { updateIframeContent: (content: string) => dispatch(updateHtml(content)) };
};