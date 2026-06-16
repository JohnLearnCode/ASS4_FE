import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function QuizHistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQ, setActiveQ] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await api.get(`/results/${id}`);
        setResult(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải kết quả');
      } finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return (
    <div style={{ maxWidth: 900, margin: '40px auto' }}>
      <div className="skeleton" style={{ width: 140, height: 36, borderRadius: 10, marginBottom: 24 }} />
      <div className="skeleton" style={{ width: '100%', height: 240, borderRadius: 18, marginBottom: 24 }} />
      <div className="skeleton" style={{ width: 200, height: 24, borderRadius: 8, marginBottom: 16 }} />
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton mb-3" style={{ width: '100%', height: 120, borderRadius: 14 }} />
      ))}
    </div>
  );
  if (error) return (
    <div className="text-center py-5" style={{ maxWidth: 400, margin: '40px auto' }}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <h5 className="mt-3 fw-bold">Có lỗi xảy ra</h5>
      <p className="text-muted small">{error}</p>
      <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => navigate('/history')}>
        ← Quay lại lịch sử
      </button>
    </div>
  );
  if (!result) return (
    <div className="text-center py-5">
      <div style={{ fontSize: 48 }}>📭</div>
      <p className="text-muted mt-2">Không tìm thấy kết quả</p>
      <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/history')}>← Quay lại</button>
    </div>
  );

  const { quizId, answers, score = 0, createdAt } = result;
  const questions = quizId?.question || [];
  const total = questions.length;
  const safeAnswers = Array.isArray(answers) ? answers : [];
  const correct = safeAnswers.filter((a: any) => a.isCorrect).length;
  const wrong = total - correct;
  const quizIdStr = quizId?._id || '';

  const answerByQuestionId = new Map<string, any>();
  safeAnswers.forEach((a: any) => answerByQuestionId.set(a.questionId, a));

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <button className="btn btn-outline-secondary btn-sm rounded-3" onClick={() => navigate('/history')}>
          ← Quay lại
        </button>
        {quizIdStr && (
          <Link to={`/quizzes/${quizIdStr}/take`} className="btn btn-warning text-white btn-sm rounded-3">
            🔄 Làm lại quiz này
          </Link>
        )}
      </div>

      {/* Score Hero */}
      <div className="card border-0 mb-4 overflow-hidden" style={{ borderRadius: 18 }}>
        <div style={{
          background: score >= 80
            ? 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)'
            : score >= 50
              ? 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #f59e0b 100%)'
              : 'linear-gradient(135deg, #7c2d12 0%, #dc2626 50%, #ef4444 100%)',
          color: '#fff',
        }}>
          <div className="p-4 text-center">
            <div style={{ fontSize: 56, lineHeight: 1 }}>
              {score >= 80 ? '🏆' : score >= 50 ? '🎉' : '💪'}
            </div>
            <h3 className="fw-bold mt-2 mb-1" style={{ color: '#fff', fontSize: 20 }}>
              {quizId?.title || 'Không có tiêu đề'}
            </h3>
            {quizId?.description && (
              <p className="mb-0 small" style={{ opacity: 0.8 }}>{quizId.description}</p>
            )}
            <p className="mb-0 mt-1" style={{ opacity: 0.65, fontSize: 12 }}>
              {createdAt && new Date(createdAt).toLocaleString('vi-VN')}
            </p>
          </div>

          <div className="d-flex" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="flex-fill text-center py-3" style={{ borderRight: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="fw-bold" style={{ fontSize: 22 }}>{correct}</div>
              <div style={{ opacity: 0.7, fontSize: 11 }}>Đúng</div>
            </div>
            <div className="flex-fill text-center py-3" style={{ borderRight: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="fw-bold" style={{ fontSize: 22 }}>{wrong}</div>
              <div style={{ opacity: 0.7, fontSize: 11 }}>Sai</div>
            </div>
            <div className="flex-fill text-center py-3">
              <div className="fw-bold" style={{ fontSize: 22 }}>{total}</div>
              <div style={{ opacity: 0.7, fontSize: 11 }}>Tổng</div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="d-flex align-items-center gap-3">
              <div className="flex-fill" style={{ height: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{
                  width: `${score}%`, height: '100%',
                  background: score >= 80 ? '#fff' : score >= 50 ? '#fcd34d' : '#fca5a5',
                  borderRadius: 5, transition: 'width 0.6s ease',
                }} />
              </div>
              <span className="fw-bold flex-shrink-0" style={{ fontSize: 28 }}>{score}%</span>
            </div>
            <div className="text-center mt-2" style={{ opacity: 0.7, fontSize: 12 }}>
              {score >= 80 ? 'Xuất sắc! 🏆' : score >= 50 ? 'Đạt yêu cầu! 👍' : 'Cần cố gắng hơn! 💪'}
            </div>
          </div>
        </div>
      </div>

      {/* Questions + Nav */}
      <div className="d-flex gap-4 align-items-start">
        {total > 1 && (
          <div className="flex-shrink-0 d-none d-lg-block" style={{ width: 200, position: 'sticky', top: 88 }}>
            <div className="card border" style={{ borderRadius: 14 }}>
              <div className="card-body p-3">
                <h6 className="fw-semibold small mb-3">Danh sách câu hỏi</h6>
                <div className="d-flex flex-column gap-1">
                  {questions.map((q: any, qi: number) => {
                    const answerData = answerByQuestionId.get(q._id);
                    const isCorrect = answerData?.isCorrect;
                    return (
                      <button
                        key={q._id}
                        onClick={() => {
                          setActiveQ(qi);
                          document.getElementById(`q-${q._id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className={`d-flex align-items-center gap-2 w-100 btn btn-sm text-start rounded-3 ${
                          activeQ === qi ? 'btn-warning text-white' : 'btn-light'
                        }`}
                        style={{ fontSize: 13, padding: '6px 10px' }}
                      >
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: isCorrect ? '#16a34a' : '#dc2626',
                        }} />
                        Câu {qi + 1}
                        <span className="ms-auto" style={{ fontSize: 11 }}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-fill min-w-0">
          <h4 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: 17 }}>
            📋 Chi tiết câu hỏi
            <span className="badge bg-body-tertiary text-secondary fw-normal rounded-3">{total} câu</span>
          </h4>

          <div className="d-flex flex-column gap-3">
            {questions.map((q: any, qi: number) => {
              const answerData = answerByQuestionId.get(q._id);
              const selected = answerData?.selectedIndex;
              const isCorrect = answerData?.isCorrect;
              return (
                <div
                  key={q._id}
                  id={`q-${q._id}`}
                  className="card border-0 shadow-sm taking-question-card"
                  style={{ borderRadius: 14, overflow: 'hidden' }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge rounded-3 px-3 py-2 fw-medium" style={{
                          background: isCorrect ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                          color: isCorrect ? '#16a34a' : '#dc2626',
                        }}>
                          Câu {qi + 1}
                        </span>
                      </div>
                      <span className={`badge rounded-3 px-3 py-2 fw-medium ${isCorrect ? 'bg-success' : 'bg-danger'}`}>
                        {isCorrect ? '✓ Đúng' : '✗ Sai'}
                      </span>
                    </div>

                    <div className="fw-semibold mb-3" style={{ fontSize: 15, lineHeight: 1.6 }}>{q.questionText}</div>

                    <div className="d-flex flex-column gap-2">
                      {(q.options || []).map((opt: string, oi: number) => {
                        const isCorrectAnswer = oi === q.correctAnswerIndex;
                        const isUserAnswer = selected === oi;
                        return (
                          <div
                            key={oi}
                            className="d-flex align-items-center gap-3 p-3 border rounded-3"
                            style={{
                              background: isCorrectAnswer
                                ? 'rgba(22,163,74,0.08)'
                                : isUserAnswer && !isCorrectAnswer
                                  ? 'rgba(220,38,38,0.08)'
                                  : 'transparent',
                              borderColor: isCorrectAnswer
                                ? '#16a34a'
                                : isUserAnswer && !isCorrectAnswer
                                  ? '#dc2626'
                                  : 'var(--bs-border-color)',
                              opacity: isCorrectAnswer || isUserAnswer ? 1 : 0.55,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span
                              className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle fw-bold"
                              style={{
                                width: 28, height: 28, fontSize: 12,
                                background: isCorrectAnswer
                                  ? '#16a34a'
                                  : isUserAnswer && !isCorrectAnswer
                                    ? '#dc2626'
                                    : 'var(--bs-border-color)',
                                color: isCorrectAnswer || (isUserAnswer && !isCorrectAnswer) ? '#fff' : 'var(--bs-secondary-color)',
                              }}
                            >
                              {isCorrectAnswer ? '✓' : LETTERS[oi]}
                            </span>
                            <span className="flex-fill" style={{ fontSize: 14 }}>{opt}</span>
                            {isCorrectAnswer && (
                              <span className="badge bg-success flex-shrink-0 rounded-3" style={{ fontSize: 11 }}>Đáp án đúng</span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="badge bg-danger flex-shrink-0 rounded-3" style={{ fontSize: 11 }}>Câu trả lời của bạn</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!isCorrect && q.explanation && (
                      <div className="mt-3 p-3 rounded-3" style={{
                        background: 'rgba(249,115,22,0.06)',
                        border: '1px solid rgba(249,115,22,0.12)',
                      }}>
                        <div className="d-flex align-items-start gap-2">
                          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
                          <div className="small" style={{ lineHeight: 1.6 }}>
                            <strong>Giải thích:</strong> {q.explanation}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="d-flex align-items-center justify-content-between mt-4 pt-2 gap-3 flex-wrap">
            <button className="btn btn-outline-secondary btn-sm rounded-3" onClick={() => navigate('/history')}>
              ← Quay lại lịch sử
            </button>
            {quizIdStr && (
              <Link to={`/quizzes/${quizIdStr}/take`} className="btn btn-warning text-white btn-sm rounded-3 px-4">
                🔄 Làm lại quiz này
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
