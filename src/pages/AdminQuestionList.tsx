import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';

export default function AdminQuestionList() {
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);

  if (user?.role !== 'admin') {
    return <div className="text-center text-danger py-5">Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard')}>←</button>
        <h1 className="fs-4 fw-bold mb-0">❓ Quản lý Câu Hỏi</h1>
      </div>

      <div className="card border text-center p-5" style={{ maxWidth: 500, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
        <h5 className="fw-bold mb-2">Câu hỏi được quản lý theo từng Quiz</h5>
        <p className="text-muted small mb-3" style={{ lineHeight: 1.6 }}>
          Để thêm, sửa hoặc xoá câu hỏi, bạn vui lòng vào{' '}
          <a href="#" className="text-decoration-none fw-medium" onClick={(e) => { e.preventDefault(); navigate('/admin/quizzes'); }}
            style={{ color: 'var(--orange-500, #f97316)' }}>Quản lý Quiz</a>
          {' '}→ chọn quiz cần chỉnh sửa → tại đó bạn có thể quản lý câu hỏi trực tiếp.
        </p>
        <button className="btn btn-warning text-white fw-medium" onClick={() => navigate('/admin/quizzes')}>
          Đi đến Quản lý Quiz →
        </button>
      </div>
    </div>
  );
}
