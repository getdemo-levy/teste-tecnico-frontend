export interface FrameRendererProps {
  html: string;
  onSave: (html: string) => void;
  onCancel: (options?: { preserveCurrentFrame?: boolean }) => void;
}

export interface EditorHookProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  dispatch: any;
}