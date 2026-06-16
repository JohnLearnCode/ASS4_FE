import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyResults } from '../store/resultSlice';
import type { AppDispatch, RootState } from '../store';

const PAGE_SIZE = 10;

const scoreConfig = [
  { min: 80, color: '#16a34a', bg: 'rgba(22,163,74,0.1)', icon: '🌟', label: 'Xuất sắc' },
  { min: 50, color: '#f97316', bg: 'rgba(249,115,22,0.1)', icon: '📄', label: 'Đạt' },
  { min: 0, color: '#dc2626', bg: 'rgba(220,38,38,0.1)', icon: '😞', label: 'Cần cố gắng' },
];

function getScoreMeta(score: number) {
  return scoreConfig.find((c) => score >= c.min) || scoreConfig[2];
}

export default function QuizHistory() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { results, resultsLoading: loading } = useSelector((s: RootState) => s.result);
  const [page, setPage] = useState(1);

  useEffect(() => { dispatch(fetchMyResults({ page: 1, limit: 100 })); }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return results.slice().sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(start, start + PAGE_SIZE);
  }, [results, page]);

  useEffect(() => { setPage(1); }, []);

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <h1 className="fs-4 fw-bold mb-0">📚 Lịch sử làm bài</h1>
        {results.length > 0 && (
          <span className="badge bg-body-tertiary text-secondary fw-normal px-3 py-2">
            {results.length} bài làm
          </span>
        )}
      </div>

      {loading ? (
        <div className="row g-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-12 col-sm-6 col-xl-4">
              <div className="card border" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="d-flex gap-3">
                    <div className="skeleton flex-shrink-0" style={{ width: 52, height: 52, borderRadius: 14 }} />
                    <div className="flex-fill">
                      <div className="skeleton" style={{ width: '70%', height: 15, marginBottom: 8, borderRadius: 6 }} />
                      <div className="skeleton" style={{ width: '40%', height: 12, borderRadius: 6 }} />
                    </div>
                    <div className="skeleton flex-shrink-0" style={{ width: 56, height: 36, borderRadius: 10 }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-5" style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>📭</div>
          <h5 className="fw-bold mt-3">Chưa có lịch sử làm bài</h5>
          <p className="text-muted small mb-4">Hãy làm một quiz để xem kết quả tại đây!</p>
          <button className="btn btn-warning text-white btn-sm px-4" onClick={() => navigate('/quizzes')}>
            🚀 Khám phá Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="row g-3">
            {paginated.map((r: any) => {
              const meta = getScoreMeta(r.score);
              const safeAnswers = Array.isArray(r.answers) ? r.answers : [];
              const correct = safeAnswers.filter((a: any) => a.isCorrect).length;
              const total = safeAnswers.length;
              return (
                <div key={r._id} className="col-12 col-sm-6 col-xl-4">
                  <div
                    className="card border h-100 history-card"
                    onClick={() => navigate(`/history/${r._id}`)}
                    style={{ cursor: 'pointer', borderRadius: 14, overflow: 'hidden' }}
                  >
                    <div className="card-body d-flex flex-column p-4 gap-3">
                      <div className="d-flex align-items-start justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3 min-w-0">
                          <div
                            className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-3"
                            style={{ width: 52, height: 52, background: meta.bg, fontSize: 24 }}
                          >
                            {meta.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="fw-semibold text-truncate" style={{ fontSize: 15 }}>
                              {r.quizId?.title || 'Không có tiêu đề'}
                            </div>
                            <div className="text-muted small">
                              {r.createdAt && new Date(r.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-end flex-shrink-0">
                          <div className="fw-bold fs-4 lh-1" style={{ color: meta.color }}>{r.score}%</div>
                          <div className="text-muted small mt-1">{correct}/{total} câu</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <div className="flex-fill" style={{ height: 6, background: 'var(--bs-border-color)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${r.score}%`, height: '100%', background: meta.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                        </div>
                        <span className="small fw-medium flex-shrink-0" style={{ color: meta.color }}>{meta.label}</span>
                      </div>

                      <div className="d-flex align-items-center justify-content-between pt-1">
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <span>📊 {r.answers?.length || 0} câu hỏi</span>
                        </div>
                        <span className="small fw-medium" style={{ color: 'var(--orange-500)' }}>
                          Xem chi tiết →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center gap-1 mb-0">
                <li className={`page-item${page <= 1 ? ' disabled' : ''}`}>
                  <button className="page-link rounded-3" onClick={() => setPage(page - 1)}>← Trước</button>
                </li>
                {(() => {
                  const pages: React.ReactNode[] = [];
                  const maxVisible = 5;
                  let start = Math.max(1, page - Math.floor(maxVisible / 2));
                  let end = Math.min(totalPages, start + maxVisible - 1);
                  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
                  if (start > 1) {
                    pages.push(<li key={1} className="page-item"><button className="page-link rounded-3" onClick={() => setPage(1)}>1</button></li>);
                    if (start > 2) pages.push(<li key="dots1" className="page-item disabled"><span className="page-link rounded-3 border-0 bg-transparent">...</span></li>);
                  }
                  for (let i = start; i <= end; i++)
                    pages.push(<li key={i} className={`page-item${i === page ? ' active' : ''}`}><button className="page-link rounded-3" onClick={() => setPage(i)}>{i}</button></li>);
                  if (end < totalPages) {
                    if (end < totalPages - 1) pages.push(<li key="dots2" className="page-item disabled"><span className="page-link rounded-3 border-0 bg-transparent">...</span></li>);
                    pages.push(<li key={totalPages} className="page-item"><button className="page-link rounded-3" onClick={() => setPage(totalPages)}>{totalPages}</button></li>);
                  }
                  return pages;
                })()}
                <li className={`page-item${page >= totalPages ? ' disabled' : ''}`}>
                  <button className="page-link rounded-3" onClick={() => setPage(page + 1)}>Sau →</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
