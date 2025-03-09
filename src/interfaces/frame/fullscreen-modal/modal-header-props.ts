export interface ModalHeaderProps {
  onShowTooltip: () => void;
  onSave: () => void;
  onCancel: () => void;
  onClose: () => void;
  hasChanges: boolean;
}
