import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { Quiz, QuizWithQuestions, Question, Result } from '../types';

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: QuizWithQuestions | null;
  loading: boolean;
  successMessage: string | null;
  error: string | null;
  submitting: boolean;
  lastResult: Result | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  loading: false,
  successMessage: null,
  error: null,
  submitting: false,
  lastResult: null,
};

export const fetchQuizzes = createAsyncThunk<Quiz[]>('quiz/fetchAll', async () => {
  const { data: res } = await api.get('/quizzes');
  return res.data as Quiz[];
});

export const fetchQuizById = createAsyncThunk<QuizWithQuestions, string>('quiz/fetchById', async (id) => {
  const { data: res } = await api.get(`/quizzes/${id}`);
  return res.data as QuizWithQuestions;
});

export const createQuiz = createAsyncThunk<Quiz, { title: string; description: string }>(
  'quiz/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data: res } = await api.post('/quizzes', payload);
      return res.data as Quiz;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Tạo quiz thất bại');
    }
  }
);

export const updateQuiz = createAsyncThunk<Quiz, { id: string; title?: string; description?: string }>(
  'quiz/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data: res } = await api.put(`/quizzes/${id}`, payload);
      return res.data as Quiz;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Cập nhật quiz thất bại');
    }
  }
);

export const deleteQuiz = createAsyncThunk<string, string>(
  'quiz/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quizzes/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Xoá quiz thất bại');
    }
  }
);

export const createQuestion = createAsyncThunk<
  Question,
  { quizId: string; questionText: string; options: string[]; correctAnswerIndex: number; explanation: string }
>(
  'quiz/createQuestion',
  async ({ quizId, ...payload }, { rejectWithValue }) => {
    try {
      const { data: res } = await api.post(`/quizzes/${quizId}/question`, payload);
      return res.data as Question;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Tạo câu hỏi thất bại');
    }
  }
);

export const updateQuestion = createAsyncThunk<
  Question,
  { questionId: string; data: Partial<{ questionText: string; options: string[]; correctAnswerIndex: number; explanation: string }> }
>(
  'quiz/updateQuestion',
  async ({ questionId, data: payload }, { rejectWithValue }) => {
    try {
      const { data: res } = await api.put(`/questions/${questionId}`, payload);
      return res.data as Question;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Cập nhật câu hỏi thất bại');
    }
  }
);

export const deleteQuestion = createAsyncThunk<string, string>(
  'quiz/deleteQuestion',
  async (questionId, { rejectWithValue }) => {
    try {
      await api.delete(`/questions/${questionId}`);
      return questionId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Xoá câu hỏi thất bại');
    }
  }
);

export const submitQuizResult = createAsyncThunk<Result, { quizId: string; answers: { questionId: string; selectedIndex: number }[] }>(
  'quiz/submitResult',
  async (payload, { rejectWithValue }) => {
    try {
      const { data: res } = await api.post('/results', payload);
      return res.data as Result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Nộp bài thất bại');
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
    clearLastResult(state) {
      state.lastResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchQuizzes.fulfilled, (state, action) => { state.loading = false; state.quizzes = action.payload; })
      .addCase(fetchQuizzes.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Thất bại'; })

      .addCase(fetchQuizById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchQuizById.fulfilled, (state, action) => { state.loading = false; state.currentQuiz = action.payload; })
      .addCase(fetchQuizById.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Thất bại'; })

      .addCase(createQuiz.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes.push(action.payload);
        state.successMessage = 'Tạo quiz thành công';
      })
      .addCase(createQuiz.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(updateQuiz.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.quizzes.findIndex((q) => q._id === action.payload._id);
        if (idx !== -1) state.quizzes[idx] = action.payload;
        if (state.currentQuiz && state.currentQuiz._id === action.payload._id) {
          state.currentQuiz = { ...state.currentQuiz, title: action.payload.title, description: action.payload.description };
        }
        state.successMessage = 'Cập nhật quiz thành công';
      })
      .addCase(updateQuiz.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(deleteQuiz.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
        state.successMessage = 'Xoá quiz thành công';
      })
      .addCase(deleteQuiz.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(createQuestion.pending, (state) => { state.error = null; })
      .addCase(createQuestion.fulfilled, (state, action) => {
        if (state.currentQuiz) {
          state.currentQuiz = {
            ...state.currentQuiz,
            question: [...state.currentQuiz.question, action.payload],
          };
        }
        state.successMessage = 'Thêm câu hỏi thành công';
      })
      .addCase(createQuestion.rejected, (state, action) => { state.error = action.payload as string; })

      .addCase(updateQuestion.pending, (state) => { state.error = null; })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        if (state.currentQuiz) {
          state.currentQuiz = {
            ...state.currentQuiz,
            question: state.currentQuiz.question.map((q) =>
              q._id === action.payload._id ? action.payload : q
            ),
          };
        }
        state.successMessage = 'Cập nhật câu hỏi thành công';
      })
      .addCase(updateQuestion.rejected, (state, action) => { state.error = action.payload as string; })

      .addCase(deleteQuestion.pending, (state) => { state.error = null; })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        if (state.currentQuiz) {
          state.currentQuiz = {
            ...state.currentQuiz,
            question: state.currentQuiz.question.filter((q) => q._id !== action.payload),
          };
        }
        state.successMessage = 'Xoá câu hỏi thành công';
      })
      .addCase(deleteQuestion.rejected, (state, action) => { state.error = action.payload as string; })

      .addCase(submitQuizResult.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(submitQuizResult.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastResult = action.payload;
      })
      .addCase(submitQuizResult.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages, clearLastResult } = quizSlice.actions;
export default quizSlice.reducer;
