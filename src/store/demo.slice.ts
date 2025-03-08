/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ResponseApi } from '@/interfaces/response-api.interface';
import { Demo } from '@/interfaces/demo.interface';
import { Frame } from '@/interfaces/frame.interface';
import { DemoState } from '@/interfaces/demo-state.interface';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const initialState: DemoState = {
  demoDetails: null,
  frames: [],
  selectedFrame: null,
  hasUnsavedChanges: false,
  loading: false,
  error: null,
};

export const fetchDemoData = createAsyncThunk(
  'demo/fetchDemoData',
  async (id: string, { rejectWithValue }) => {
    try {
      const detailsResponse = await axios.get<ResponseApi<Demo>>(`${apiUrl}/demos/${id}`);
      const framesResponse = await axios.get<ResponseApi<Frame[]>>(`${apiUrl}/demos/${id}/frames`);

      const frames = framesResponse.data.dados.toSorted((a, b) => a.order - b.order);
      return { demoDetails: detailsResponse.data.dados, frames };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const demoSlice = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    setSelectedFrame(state, action: PayloadAction<Frame>) {
      state.selectedFrame = action.payload;
    },
    handleSaveHtml(state, action: PayloadAction<string>) {
      if (!state.selectedFrame) return;
      const updatedFrame: Frame = { ...state.selectedFrame, html: action.payload };
      state.frames = state.frames.map(frame =>
        frame.id === state.selectedFrame!.id ? updatedFrame : frame
      );
      state.selectedFrame = updatedFrame;
      state.hasUnsavedChanges = true;
    },
    clearUnsavedChanges(state) {
      state.hasUnsavedChanges = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDemoData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDemoData.fulfilled, (state, action) => {
      state.loading = false;
      state.demoDetails = action.payload.demoDetails;
      state.frames = action.payload.frames;
      state.selectedFrame = action.payload.frames[0] || null;
    });
    builder.addCase(fetchDemoData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedFrame, handleSaveHtml, clearUnsavedChanges } = demoSlice.actions;
export default demoSlice.reducer;
