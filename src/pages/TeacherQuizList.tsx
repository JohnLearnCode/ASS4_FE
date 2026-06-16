import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { deleteQuiz, clearMessages } from '../store/quizSlice';
import type { AppDispatch, RootState } from '../store';

const PAGE_SIZE = 10;

export default function TeacherQuizList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { successMessage } = useSelector((s: RootState) => s.quiz);
  const { user } = useSelector((s: RootState) => s.auth);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchMyQuizzes = async () => {
    try {
      setLoading(true);
      const { data: res } = await api.get('/quizzes/my/list');
      setQuizzes(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyQuizzes(); }, []);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => dispatch(clearMessages()), 3000);
      fetchMyQuizzes();
      return () => clearTimeout(t);
    }
  }, [successMessage, dispatch]);

  const filtered = useMemo(() => {
    if (!search.trim()) return quizzes;
    const q = search.toLowerCase().trim();
    return quizzes.filter((quiz) => quiz.title.toLowerCase().includes(q));
  }, [quizzes, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => { setPage(1); }, [search]);

  function goToPage(p: number) { if (p >= 1 && p <= totalPages) setPage(p); }

  function renderPageNumbers() {
    const pages: React.ReactNode[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    if (start > 1) {
      pages.push(<li key={1} className="page-item"><button className="page-link" onClick={() => goToPage(1)}>1</button></li>);
      if (start > 2) pages.push(<li key="dots1" className="page-item disabled"><span className="page-link">...</span></li>);
    }
    for (let i = start; i <= end; i++)
      pages.push(<li key={i} className={`page-item${i === page ? ' active' : ''}`}><button className="page-link" onClick={() => goToPage(i)}>{i}</button></li>);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<li key="dots2" className="page-item disabled"><span className="page-link">...</span></li>);
      pages.push(<li key={totalPages} className="page-item"><button className="page-link" onClick={() => goToPage(totalPages)}>{totalPages}</button></li>);
    }
    return pages;
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Xoá quiz "${title}"?`)) return;
    try {
      await dispatch(deleteQuiz(id)).unwrap();
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch { setError('Xoá quiz thất bại'); }
  };

  if (user?.role !== 'teacher') {
    return <div className="text-center text-danger py-5">Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard')}>←</button>
          <h1 className="fs-4 fw-bold mb-0">📝 Quiz của tôi</h1>
        </div>
        <button className="btn btn-warning text-white btn-sm fw-medium" onClick={() => navigate('/teacher/quizzes/create')}>
          + Tạo Quiz
        </button>
      </div>

      {successMessage && <div className="alert alert-success py-2 small">{successMessage}</div>}
      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {!loading && (
        <div className="position-relative mb-3" style={{ maxWidth: 360 }}>
          <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ pointerEvents: 'none' }}>🔍</span>
          <input className="form-control ps-5" type="text" placeholder="Tìm kiếm quiz..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {loading ? (
        <div className="d-flex flex-column gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card border"><div className="card-body d-flex align-items-center gap-3">
              <div className="skeleton flex-shrink-0" style={{ width: 48, height: 48, borderRadius: 12 }} />
              <div className="flex-fill"><div className="skeleton" style={{ width: '50%', height: 14, marginBottom: 6 }} /><div className="skeleton" style={{ width: '80%', height: 12 }} /></div>
            </div></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: 48 }}>{search ? '🔍' : '📭'}</div>
          <h5 className="mt-2">{search ? 'Không tìm thấy quiz' : 'Bạn chưa tạo quiz nào'}</h5>
          {search ? (
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setSearch('')}>Xoá bộ lọc</button>
          ) : (
            <button className="btn btn-warning text-white btn-sm mt-2" onClick={() => navigate('/teacher/quizzes/create')}>+ Tạo Quiz đầu tiên</button>
          )}
        </div>
      ) : (
        <>
          <div className="d-flex flex-column gap-2">
            {paginated.map((q) => (
              <div key={q._id} className="card border admin-quiz-card">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-3" style={{ width: 48, height: 48, background: 'rgba(234,88,12,0.08)', fontSize: 22 }}>📄</div>
                  <div className="flex-fill min-w-0">
                    <div className="fw-semibold text-truncate">{q.title}</div>
                    <div className="text-muted text-truncate small">{q.description}</div>
                    <div className="small text-secondary">
                      📄 {q.question?.length || 0} câu hỏi
                      {q.createdAt && ` • ${new Date(q.createdAt).toLocaleDateString('vi-VN')}`}
                    </div>
                  </div>
                  <div className="d-flex gap-1 flex-shrink-0">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/teacher/quizzes/${q._id}/edit`)}>✏️ Sửa</button>
                    <button className="btn btn-outline-success btn-sm" onClick={() => navigate(`/teacher/quizzes/${q._id}/edit?addQuestion=1`)}>+ Câu hỏi</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(q._id, q.title)}>🗑️ Xoá</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item${page <= 1 ? ' disabled' : ''}`}><button className="page-link" onClick={() => goToPage(page - 1)}>← Trước</button></li>
                {renderPageNumbers()}
                <li className={`page-item${page >= totalPages ? ' disabled' : ''}`}><button className="page-link" onClick={() => goToPage(page + 1)}>Sau →</button></li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
