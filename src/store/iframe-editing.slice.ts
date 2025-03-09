import { IframeEditingState } from "@/interfaces/iframe-editing-state.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

const initialState: IframeEditingState = {
  editedHtml: '',
  originalHtml: '',
  isEditing: false,
  isFullscreen: false,
  currentFrameId: null,
};

const iframeEditingSlice = createSlice({
  name: 'iframeEditing',
  initialState,
  reducers: {
    setFullscreen(state, action: PayloadAction<boolean>) {
      state.isFullscreen = action.payload;
    },
    initializeFrame(state, action: PayloadAction<{ html: string; frameId: string }>) {
      state.originalHtml = action.payload.html;
      state.editedHtml = action.payload.html;
      state.currentFrameId = action.payload.frameId;
    },
    updateHtml(state, action: PayloadAction<{ html: string; frameId: string }>) { // Corrigido o payload
      if (action.payload.frameId === state.currentFrameId &&
        action.payload.html !== state.editedHtml) {
        state.editedHtml = action.payload.html;
      }
    },
    resetFrame(state) {
      state.editedHtml = state.originalHtml;
      state.isEditing = false;

      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentDocument) {
        iframe.contentDocument.open();
        iframe.contentDocument.write(state.originalHtml);
        iframe.contentDocument.close();
      }
    },
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    }
  },
});

export const selectIframeEditing = (state: RootState) => state.iframeEditing;
export const selectEditedHtml = (state: RootState) => state.iframeEditing.editedHtml;
export const selectIsFullscreen = (state: RootState) => state.iframeEditing.isFullscreen;

export const {
  setFullscreen,
  initializeFrame,
  updateHtml, // Export corrigido
  resetFrame,
  setEditing
} = iframeEditingSlice.actions;
export default iframeEditingSlice.reducer;