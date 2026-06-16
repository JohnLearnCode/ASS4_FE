import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizById, clearMessages } from '../store/quizSlice';
import type { AppDispatch, RootState } from '../store';

export default function QuizDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentQuiz, loading, error } = useSelector((s: RootState) => s.quiz);
  const { user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    if (id) dispatch(fetchQuizById(id));
    dispatch(clearMessages());
  }, [dispatch, id]);

  if (loading) return <p className="text-center text-muted py-5">Đang tải...</p>;
  if (error) return <p className="text-center text-danger py-5">{error}</p>;
  if (!currentQuiz) return <p className="text-center text-muted py-5">Không tìm thấy quiz</p>;

  const questions = currentQuiz.question || [];
  const total = questions.length;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="quiz-detail-header">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h1 className="fs-4 fw-bold mb-0">{currentQuiz.title}</h1>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => navigate('/quizzes')}>
            ← Quay lại
          </button>
        </div>
        <div className="d-flex gap-3" style={{ fontSize: 13, opacity: 0.85 }}>
          <span>📄 {total} câu hỏi</span>
          {currentQuiz.createdAt && <span>📅 {new Date(currentQuiz.createdAt).toLocaleDateString('vi-VN')}</span>}
        </div>
        {currentQuiz.description && <p className="mt-2 mb-0" style={{ opacity: 0.9, lineHeight: 1.5 }}>{currentQuiz.description}</p>}
      </div>

      <div className="card border-0 shadow-sm text-center p-4 mb-4">
        <div style={{ fontSize: 48 }}>📋</div>
        <h2 className="fs-5 fw-bold mt-2">{currentQuiz.title}</h2>
        <p className="text-muted small mb-3" style={{ maxWidth: 500, margin: '0 auto' }}>{currentQuiz.description}</p>

        <div className="d-flex justify-content-center gap-4 mb-4">
          <div className="text-center">
            <div className="fw-bold fs-5">{total}</div>
            <div className="text-muted" style={{ fontSize: 12 }}>Câu hỏi</div>
          </div>
          <div className="text-center">
            <div className="fw-bold fs-5">{user?.name || '---'}</div>
            <div className="text-muted" style={{ fontSize: 12 }}>Người làm</div>
          </div>
        </div>

        <button className="btn btn-warning text-white fw-medium px-5 py-3" style={{ fontSize: 16 }} onClick={() => navigate(`/quizzes/${id}/take`)}>
          🚀 Bắt đầu làm bài
        </button>
      </div>

      {total > 0 && (
        <p className="text-center text-muted small mb-0">📄 Gồm <strong>{total}</strong> câu hỏi</p>
      )}
    </div>
  );
}
