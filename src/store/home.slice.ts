/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ResponseApi } from '@/interfaces/response-api.interface';
import { Demo } from '@/interfaces/demo.interface';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface HomeState {
  demos: Demo[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  demos: [],
  loading: false,
  error: null,
};

export const fetchDemos = createAsyncThunk(
  'home/fetchDemos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResponseApi<Demo[]>>(`${apiUrl}/demos`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Erro ao carregar demos'
      );
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDemos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDemos.fulfilled, (state, action) => {
        state.loading = false;
        state.demos = action.payload;
      })
      .addCase(fetchDemos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.demos = []; 
      });
  },
});

export default homeSlice.reducer;