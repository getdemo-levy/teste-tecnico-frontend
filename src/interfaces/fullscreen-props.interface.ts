import { Frame } from "./frame.interface";

export interface FullscreenProps {
  onSave: (html: string) => Promise<void>;
  onCancel: (options?: { preserveCurrentFrame?: boolean }) => void;
  selectedFrame: Frame | null;
}
