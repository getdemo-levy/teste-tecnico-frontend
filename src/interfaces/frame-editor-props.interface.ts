import { Frame } from "./frame.interface";

export interface FrameEditorProps {
  selectedFrame: Frame| null;
  onSave: (newHtml: string) => void;
}
