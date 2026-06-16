import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizHistory from './pages/QuizHistory';
import QuizHistoryDetail from './pages/QuizHistoryDetail';
import QuizList from './pages/QuizList';
import QuizDetail from './pages/QuizDetail';
import QuizTaking from './pages/QuizTaking';
import AdminQuizList from './pages/AdminQuizList';
import AdminQuestionList from './pages/AdminQuestionList';
import AdminUserList from './pages/AdminUserList';
import TeacherQuizList from './pages/TeacherQuizList';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<QuizHistory />} />
            <Route path="/history/:id" element={<QuizHistoryDetail />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quizzes/:id" element={<QuizDetail />} />
            <Route path="/quizzes/:id/take" element={<QuizTaking />} />
            <Route path="/admin/quizzes" element={<AdminQuizList />} />
            <Route path="/admin/quizzes/create" element={<CreateQuiz />} />
            <Route path="/admin/quizzes/:id/edit" element={<EditQuiz />} />
            <Route path="/admin/questions" element={<AdminQuestionList />} />
            <Route path="/admin/users" element={<AdminUserList />} />
            <Route path="/teacher/quizzes" element={<TeacherQuizList />} />
            <Route path="/teacher/quizzes/create" element={<CreateQuiz />} />
            <Route path="/teacher/quizzes/:id/edit" element={<EditQuiz />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
