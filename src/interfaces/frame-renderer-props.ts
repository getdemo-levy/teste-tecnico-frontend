export interface FrameRendererProps {
  html: string;
  onSave: (html: string) => void;
  onCancel?: (options?: { preserveCurrentFrame?: boolean }) => void;
}