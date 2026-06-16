import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { Result } from '../types';

interface ResultStats {
  totalQuizzesDone: number;
  averageScore: number;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  averageScore: number;
  totalQuizzes: number;
}

interface PaginationInfo {
  total: number;
  page: number;
  totalPages: number;
}

interface ResultState {
  stats: ResultStats;
  statsLoading: boolean;
  statsError: string | null;
  results: Result[];
  resultsLoading: boolean;
  resultsError: string | null;
  pagination: PaginationInfo;
  leaderboard: LeaderboardEntry[];
  leaderboardLoading: boolean;
}

const initialState: ResultState = {
  stats: { totalQuizzesDone: 0, averageScore: 0 },
  statsLoading: false,
  statsError: null,
  results: [],
  resultsLoading: false,
  resultsError: null,
  pagination: { total: 0, page: 1, totalPages: 1 },
  leaderboard: [],
  leaderboardLoading: false,
};

export const fetchUserStats = createAsyncThunk<ResultStats>('result/fetchStats', async () => {
  const { data: res } = await api.get('/results/stats');
  return res.data as ResultStats;
});

interface FetchMyResultsResponse {
  results: Result[];
  total: number;
  page: number;
  totalPages: number;
}

export const fetchLeaderboard = createAsyncThunk<LeaderboardEntry[]>('result/fetchLeaderboard', async () => {
  const { data: res } = await api.get('/results/leaderboard');
  return res.data as LeaderboardEntry[];
});

export const fetchMyResults = createAsyncThunk<FetchMyResultsResponse, { page: number; limit: number }>(
  'result/fetchMyResults',
  async ({ page, limit }) => {
    const { data: res } = await api.get('/results/me', { params: { page, limit } });
    if (Array.isArray(res.data)) {
      return { results: res.data as Result[], total: res.data.length, page: 1, totalPages: 1 };
    }
    return res.data as FetchMyResultsResponse;
  }
);

const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => { state.statsLoading = true; state.statsError = null; })
      .addCase(fetchUserStats.fulfilled, (state, action) => { state.statsLoading = false; state.stats = action.payload; })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.error.message || 'Lấy thống kê thất bại';
      })
      .addCase(fetchLeaderboard.pending, (state) => { state.leaderboardLoading = true; })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => { state.leaderboardLoading = false; state.leaderboard = action.payload; })
      .addCase(fetchLeaderboard.rejected, (state) => { state.leaderboardLoading = false; })
      .addCase(fetchMyResults.pending, (state) => { state.resultsLoading = true; state.resultsError = null; })
      .addCase(fetchMyResults.fulfilled, (state, action) => {
        state.resultsLoading = false;
        state.results = action.payload.results;
        state.pagination = { total: action.payload.total, page: action.payload.page, totalPages: action.payload.totalPages };
      })
      .addCase(fetchMyResults.rejected, (state, action) => {
        state.resultsLoading = false;
        state.resultsError = action.error.message || 'Lấy lịch sử thất bại';
      });
  },
});

export default resultSlice.reducer;
