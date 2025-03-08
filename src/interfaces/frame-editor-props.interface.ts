import { Frame } from "./frame.interface";

export interface FrameEditorProps {
  selectedFrame: Frame | null;
  onSave: (html: string) => void;
  onCancel?: (options?: { preserveCurrentFrame?: boolean }) => void;
}