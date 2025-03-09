export interface FrameRendererProps {
  onSave?: (html: string) => void;
  onCancel?: (options?: { preserveCurrentFrame?: boolean }) => void;
  html?: string;
}
