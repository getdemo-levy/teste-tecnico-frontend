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
  saving: 0,
  error: null,
};

interface UpdateFramePayload {
  id_demo: string;
  id_frame: string;
  html: string;
}

export const fetchDemoData = createAsyncThunk(
  'demo/fetchDemoData',
  async (id: string, { rejectWithValue }) => {
    try {
      const detailsResponse = await axios.get<ResponseApi<Demo>>(`${apiUrl}/demos/${id}`);
      const framesResponse = await axios.get<ResponseApi<Frame[]>>(`${apiUrl}/demos/${id}/frames`);

      const frames = framesResponse.data.data
        .map(f => ({ ...f, isModified: false }))
        .toSorted((a, b) => a.order - b.order);

      return {
        demoDetails: detailsResponse.data.data,
        frames
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFrame = createAsyncThunk(
  'demo/updateFrame',
  async (
    { id_demo, id_frame, html }: UpdateFramePayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<ResponseApi<any>>(
        `${apiUrl}/demos/${id_demo}/frames/${id_frame}`,
        { html }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao salvar alterações');
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
    saveHtmlAction(state, action: PayloadAction<string>) {
      if (!state.selectedFrame) return;
      const updatedFrame: Frame = {
        ...state.selectedFrame,
        html: action.payload,
        isModified: true,
      };
      state.frames = state.frames.map(frame =>
        frame.id === state.selectedFrame!.id ? updatedFrame : frame
      );
      state.selectedFrame = updatedFrame;
      state.hasUnsavedChanges = state.frames.some(f => f.isModified);
    },
    clearUnsavedChanges(state) {
      state.frames = state.frames.map(frame => ({
        ...frame,
        isModified: false
      }));
      state.hasUnsavedChanges = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDemoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDemoData.fulfilled, (state, action) => {
        state.loading = false;
        state.demoDetails = action.payload.demoDetails;
        state.frames = action.payload.frames;
        state.selectedFrame = action.payload.frames[0] || null;
        state.hasUnsavedChanges = false;
      })
      .addCase(fetchDemoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateFrame.pending, (state) => {
        state.saving += 1;
        state.error = null;
      })
      .addCase(updateFrame.fulfilled, (state, action: PayloadAction<ResponseApi<any>, string, { arg: UpdateFramePayload }>) => {
        state.saving -= 1;
        const { id_frame } = action.meta.arg;

        state.frames = state.frames.map(frame => {
          if (frame.id === id_frame) {
            return {
              ...frame,
              html: action.meta.arg.html,
              isModified: false
            };
          }
          return frame;
        });

        if (state.selectedFrame?.id === id_frame) {
          state.selectedFrame = state.frames.find(f => f.id === id_frame) || null;
        }

        state.hasUnsavedChanges = state.frames.some(f => f.isModified);
      })
      .addCase(updateFrame.rejected, (state, action) => {
        state.saving -= 1;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedFrame,
  saveHtmlAction,
  clearUnsavedChanges
} = demoSlice.actions;
export default demoSlice.reducer;