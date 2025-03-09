export interface EditableIframeProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  selectedFrameId?: string;
  originalHtml: string;
}