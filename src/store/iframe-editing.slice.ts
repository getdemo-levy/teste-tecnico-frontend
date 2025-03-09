import { IframeEditingState } from "@/interfaces/iframe-editing-state.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    updateHtml(state, action: PayloadAction<string>) {
      if (action.payload !== state.editedHtml) {
        state.editedHtml = action.payload;
      }
    },
    resetFrame(state) {
      state.editedHtml = state.originalHtml;
      state.isEditing = false;
    },
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    }
  },
});

export const {
  setFullscreen,
  initializeFrame,
  updateHtml,
  resetFrame,
  setEditing
} = iframeEditingSlice.actions;
export default iframeEditingSlice.reducer;