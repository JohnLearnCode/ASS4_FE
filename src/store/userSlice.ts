import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { User } from '../types';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchUsers = createAsyncThunk<User[]>('users/fetchAll', async () => {
  const { data: res } = await api.get('/users');
  return res.data as User[];
});

export const createUser = createAsyncThunk<User, { email: string; name: string; password: string; role?: string }>(
  'users/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data: res } = await api.post('/users', payload);
      return res.data as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Tạo user thất bại');
    }
  }
);

export const updateUser = createAsyncThunk<User, { id: string; email?: string; name?: string; password?: string; role?: string }>(
  'users/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data: res } = await api.put(`/users/${id}`, Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined && v !== '')
      ));
      return res.data as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Cập nhật user thất bại');
    }
  }
);

export const deleteUser = createAsyncThunk<string, string>(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Xoá user thất bại');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Thất bại'; })

      .addCase(createUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.successMessage = 'Tạo user thành công';
      })
      .addCase(createUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(updateUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.users.findIndex((u) => (u._id || u.id) === (action.payload._id || action.payload.id));
        if (idx !== -1) state.users[idx] = action.payload;
        state.successMessage = 'Cập nhật user thành công';
      })
      .addCase(updateUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(deleteUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => (u._id || u.id) !== action.payload);
        state.successMessage = 'Xoá user thành công';
      })
      .addCase(deleteUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { clearUserMessages } = userSlice.actions;
export default userSlice.reducer;
