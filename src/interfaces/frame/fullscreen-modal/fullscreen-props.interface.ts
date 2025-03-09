import { Frame } from "../frame.interface";

export interface FullscreenProps {
  selectedFrame: Frame | null;
  frames: Frame[];
  onSave: (html: string) => Promise<void>;
  onCancel: () => void;
  onSelectFrame: (index: number) => void;
}