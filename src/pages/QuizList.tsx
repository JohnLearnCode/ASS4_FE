import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes } from '../store/quizSlice';
import type { AppDispatch, RootState } from '../store';

const PAGE_SIZE = 10;

export default function QuizList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { quizzes, loading, error } = useSelector((s: RootState) => s.quiz);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { dispatch(fetchQuizzes()); }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search.trim()) return quizzes;
    const q = search.toLowerCase().trim();
    return quizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(q) ||
        quiz.description.toLowerCase().includes(q)
    );
  }, [quizzes, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => { setPage(1); }, [search]);

  function goToPage(p: number) {
    if (p >= 1 && p <= totalPages) setPage(p);
  }

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
    for (let i = start; i <= end; i++) {
      pages.push(
        <li key={i} className={`page-item${i === page ? ' active' : ''}`}>
          <button className="page-link" onClick={() => goToPage(i)}>{i}</button>
        </li>
      );
    }
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<li key="dots2" className="page-item disabled"><span className="page-link">...</span></li>);
      pages.push(
        <li key={totalPages} className="page-item">
          <button className="page-link" onClick={() => goToPage(totalPages)}>{totalPages}</button>
        </li>
      );
    }
    return pages;
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="fs-4 fw-bold mb-0">📝 Khám phá Quiz</h1>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
      </div>

      <div className="position-relative mb-3" style={{ maxWidth: 400 }}>
        <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ pointerEvents: 'none' }}>🔍</span>
        <input className="form-control ps-5" type="text" placeholder="Tìm kiếm quiz..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {loading ? (
        <div className="row g-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="quiz-skeleton">
                <div className="quiz-skeleton-icon" />
                <div className="quiz-skeleton-line short" />
                <div className="quiz-skeleton-line" />
                <div className="quiz-skeleton-line long" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: 48 }}>{search ? '🔍' : '📭'}</div>
          <h5 className="mt-2">{search ? 'Không tìm thấy quiz' : 'Chưa có quiz nào'}</h5>
          <p className="small">{search ? 'Thử tìm kiếm với từ khoá khác.' : 'Hiện tại chưa có bài quiz nào để làm.'}</p>
          {search && <button className="btn btn-outline-secondary btn-sm" onClick={() => setSearch('')}>Xoá bộ lọc</button>}
        </div>
      ) : (
        <>
          <div className="row g-3">
            {paginated.map((q) => (
              <div key={q._id} className="col-md-6 col-lg-4">
                <div className="card border quiz-card h-100" onClick={() => navigate(`/quizzes/${q._id}`)}>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <div className="quiz-card-icon">📄</div>
                      <span className="quiz-card-badge">{q.question?.length || 0} câu</span>
                    </div>
                    <div className="quiz-card-title">{q.title}</div>
                    <div className="quiz-card-desc mb-2">{q.description}</div>
                    <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                      <div className="d-flex gap-2">
                        <span className="text-muted" style={{ fontSize: 12 }}>📄 {q.question?.length || 0} câu hỏi</span>
                        {q.createdAt && <span className="text-muted" style={{ fontSize: 12 }}>📅 {new Date(q.createdAt).toLocaleDateString('vi-VN')}</span>}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--orange-500, #f97316)' }}>Làm ngay →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item${page <= 1 ? ' disabled' : ''}`}>
                  <button className="page-link" onClick={() => goToPage(page - 1)}>← Trước</button>
                </li>
                {renderPageNumbers()}
                <li className={`page-item${page >= totalPages ? ' disabled' : ''}`}>
                  <button className="page-link" onClick={() => goToPage(page + 1)}>Sau →</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
