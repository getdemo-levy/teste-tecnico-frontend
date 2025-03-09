import { Frame } from "../frame.interface";

export interface ModalHeaderProps {
  onShowTooltip: () => void;
  onSave: () => void;
  onCancel: () => void;
  onClose: () => void;
  hasChanges: boolean;
  frames: Frame[];
  currentFrameIndex: number;
  onSelectFrame: (index: number) => void;
}