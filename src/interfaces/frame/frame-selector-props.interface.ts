import { Frame } from "./frame.interface";

export interface FrameSelectorProps {
  frames: Frame[];
  selectedFrame: Frame | null;
  onSelect: (frame: Frame) => void;
}