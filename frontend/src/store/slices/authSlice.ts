import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api, setAuthToken } from '@/shared/api/client';

export type User = {
  id: number;
  email: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const TOKEN_KEY = 'healthtracker_token';

function readStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function storeToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrap',
  async (_, { rejectWithValue }) => {
    try {
      const token = readStoredToken();
      if (!token) return { token: null, user: null as User | null };

      setAuthToken(token);
      const { data } = await api.get('/api/auth/me');
      return { token, user: data.user as User };
    } catch (e: any) {
      // token invalid -> cleanup
      storeToken(null);
      setAuthToken(null);
      return rejectWithValue(e?.response?.data?.error?.message || 'Auth bootstrap failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/login', payload);
      return data as { token: string; user: User };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.error?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { email: string; username: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/register', payload);
      return data as { token: string; user: User };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.error?.message || 'Registration failed');
    }
  }
);

const initialState: AuthState = {
  token: null,
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      storeToken(null);
      setAuthToken(null);
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        if (action.payload.token) {
          storeToken(action.payload.token);
          setAuthToken(action.payload.token);
        }
      })
      .addCase(bootstrapAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.token = null;
        state.user = null;
        state.error = String(action.payload || action.error.message || 'Auth bootstrap failed');
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        storeToken(action.payload.token);
        setAuthToken(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload || action.error.message || 'Login failed');
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        storeToken(action.payload.token);
        setAuthToken(action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload || action.error.message || 'Registration failed');
      });
  },
});

// Keep both granular exports and a grouped alias used by UI.
export const authActions = authSlice.actions;

// Backwards-compatible thunk export names used by the Auth page.
export const loginThunk = login;
export const registerThunk = register;

export const { clearError, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
