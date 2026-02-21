import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api, setAuthToken } from '@/shared/api/client';

export type Mood = {
  id: number;
  ownerId: number;
  date: string;
  sleepHours: number;
  stressLevel: number;
  moodScore: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type MoodState = {
  mood: Mood | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export const getMood = createAsyncThunk(
  'mood/getMood',
  async (moodDate: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/mood-entries/by-date/${moodDate}`);
      return res.data.data as Mood | null; 
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.error?.message || 'Get mood failed');
    }
  }
);
const initialState: MoodState = {
  mood: null,
  status: "idle",
  error: null
};

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMood.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getMood.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.mood = action.payload;
      })
      .addCase(getMood.rejected, (state, action) => {
        state.status = 'failed';
        state.mood = null;
        state.error = String(action.payload || action.error.message || 'Get mood failed');
      })
  
  },
});
export const moodActions = moodSlice.actions;
export const { clearError } = moodSlice.actions;
export default moodSlice.reducer;
