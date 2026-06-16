import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createQuiz, clearMessages } from '../store/quizSlice';
import type { AppDispatch, RootState } from '../store';

export default function CreateQuiz() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((s: RootState) => s.quiz);
  const { user } = useSelector((s: RootState) => s.auth);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (successMessage) {
      dispatch(clearMessages());
      navigate(user?.role === 'teacher' ? '/teacher/quizzes' : '/admin/quizzes');
    }
  }, [successMessage, dispatch, navigate, user]);

  useEffect(() => { dispatch(clearMessages()); }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createQuiz({ title, description }));
  };

  const canAccess = user?.role === 'admin' || user?.role === 'teacher';
  if (!canAccess) {
    return <div className="text-center text-danger py-5">Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(user?.role === 'teacher' ? '/teacher/quizzes' : '/admin/quizzes')}>←</button>
        <h1 className="fs-4 fw-bold mb-0">📝 Tạo Quiz mới</h1>
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="card border p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-medium text-secondary">Tiêu đề <span className="text-danger">*</span></label>
            <input className="form-control" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="VD: Toán cao cấp" />
            <div className="form-text small">Đặt tên ngắn gọn, dễ hiểu cho quiz.</div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-medium text-secondary">Mô tả <span className="text-danger">*</span></label>
            <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Mô tả nội dung quiz, kiến thức sẽ kiểm tra..." rows={4} />
            <div className="form-text small">Mô tả giúp người làm hiểu rõ nội dung quiz.</div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(user?.role === 'teacher' ? '/teacher/quizzes' : '/admin/quizzes')}>Huỷ</button>
            <button type="submit" className="btn btn-warning text-white" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Đang tạo...</> : 'Tạo Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
