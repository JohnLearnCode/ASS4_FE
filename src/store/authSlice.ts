import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { AuthResponse, User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const extractMessage = (err: any): string => {
  return err.response?.data?.message || err.message || 'Có lỗi xảy ra';
};

export const fetchCurrentUser = createAsyncThunk<User>('auth/fetchCurrent', async () => {
  const { data: res } = await api.get('/auth/me');
  return res.data as User;
});

export const login = createAsyncThunk<AuthResponse, { email: string; password: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data: res } = await api.post('/auth/login', credentials);
      const result = res.data as AuthResponse;
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      return result;
    } catch (err: any) {
      return rejectWithValue(extractMessage(err));
    }
  }
);

export const register = createAsyncThunk<AuthResponse, { email: string; name: string; password: string; role?: string }>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data: res } = await api.post('/auth/register', credentials);
      const result = res.data as AuthResponse;
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      return result;
    } catch (err: any) {
      return rejectWithValue(extractMessage(err));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(fetchCurrentUser.rejected, (state) => { state.loading = false; state.user = null; })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = (action.payload as string) || 'Đăng nhập thất bại'; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = (action.payload as string) || 'Đăng ký thất bại'; });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
