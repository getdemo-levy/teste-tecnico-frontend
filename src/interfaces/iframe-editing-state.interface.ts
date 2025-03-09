export interface IframeEditingState {
  editedHtml: string;
  originalHtml: string;
  isEditing: boolean;
  isFullscreen: boolean;
  currentFrameId: string | null;
}
