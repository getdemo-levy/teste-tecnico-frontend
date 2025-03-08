import { IframeEditingState } from '@/interfaces/iframe-editing-state.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IframeEditingState = {
  editedHtml: '',
  originalHtml: '',
  isEditing: false,
};

const iframeEditingSlice = createSlice({
  name: 'iframeEditing',
  initialState,
  reducers: {
    setInitialHtml(state, action: PayloadAction<string>) {
      state.originalHtml = action.payload;
      state.editedHtml = action.payload;
    },
    updateHtml(state, action: PayloadAction<string>) {
      state.editedHtml = action.payload;
    },
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
      state.originalHtml = state.editedHtml;
    },
    saveEditing(state) {
      state.isEditing = false;
      state.originalHtml = state.editedHtml;
    },
    cancelEditing(state) {
      state.isEditing = false;
      state.editedHtml = state.originalHtml;
    }
  },
});

export const { setInitialHtml, updateHtml, setEditing, saveEditing, cancelEditing } = iframeEditingSlice.actions;
export default iframeEditingSlice.reducer;
