import { Frame } from "./frame.interface";

export interface FullscreenProps {
  onSave: (html: string) => void;
  onCancel: (options?: { preserveCurrentFrame?: boolean }) => void;
  selectedFrame: Frame | null;
}
