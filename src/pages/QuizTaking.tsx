import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizById, submitQuizResult, clearMessages, clearLastResult } from '../store/quizSlice';
import type { AppDispatch, RootState } from '../store';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function QuizTaking() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentQuiz, loading, error, submitting, lastResult } = useSelector((s: RootState) => s.quiz);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchQuizById(id));
    dispatch(clearLastResult());
    dispatch(clearMessages());
  }, [dispatch, id]);

  useEffect(() => { setSelectedAnswers({}); setConfirmed(false); }, [currentQuiz?._id]);

  const questions = currentQuiz?.question || [];
  const total = questions.length;
  const answered = Object.keys(selectedAnswers).length;
  const allAnswered = answered === total && total > 0;

  const handleSelect = useCallback((qIndex: number, optIndex: number) => {
    if (confirmed) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }, [confirmed]);

  const handleSubmit = useCallback(() => {
    if (!allAnswered || !id) return;
    const answers = questions.map((q, i) => ({ questionId: q._id, selectedIndex: selectedAnswers[i] }));
    dispatch(submitQuizResult({ quizId: id, answers }));
    setConfirmed(true);
  }, [allAnswered, id, questions, selectedAnswers, dispatch]);

  const handleRetry = useCallback(() => {
    setSelectedAnswers({}); setConfirmed(false); dispatch(clearLastResult()); window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  const result = lastResult;

  if (loading) return <p className="text-center text-muted py-5">Đang tải...</p>;
  if (error && !currentQuiz) return <p className="text-center text-danger py-5">{error}</p>;
  if (!currentQuiz) return <p className="text-center text-muted py-5">Không tìm thấy quiz</p>;

  if (total === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <div style={{ fontSize: 48 }}>📭</div>
        <h5 className="mt-2">{currentQuiz.title}</h5>
        <p>Quiz này chưa có câu hỏi nào.</p>
        <button className="btn btn-outline-secondary" onClick={() => navigate(`/quizzes/${id}`)}>← Quay lại</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {!confirmed && (
        <div className="mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="fs-5 fw-bold mb-0">{currentQuiz.title}</h1>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/quizzes/${id}`)}>← Thoát</button>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="flex-fill" style={{ height: 8, background: 'var(--bs-border-color, #e5e5e5)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${(answered / total) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--orange-500), var(--orange-600))', borderRadius: 4, transition: 'width 0.3s ease' }} />
            </div>
            <span className="text-muted small fw-medium flex-shrink-0">{answered}/{total} câu</span>
          </div>
        </div>
      )}

      <div className="d-flex gap-4 align-items-start">
        <div className="flex-fill min-w-0">
          {!confirmed && questions.map((q, qi) => {
            const selected = selectedAnswers[qi];
            return (
              <div key={q._id} id={`q-${qi}`} className={`card border mb-3 taking-question-card ${selected !== undefined ? 'border-warning' : ''}`}>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="taking-qnum">Câu {qi + 1}</span>
                    {selected !== undefined && <span className="badge bg-success-subtle text-success small">✓ Đã chọn</span>}
                  </div>
                  <div className="fw-semibold mb-3">{q.questionText}</div>
                  <div className="d-flex flex-column gap-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi}
                        className={`d-flex align-items-center gap-3 p-3 border rounded-3 taking-option ${selected === oi ? 'selected' : ''}`}
                        onClick={() => handleSelect(qi, oi)}>
                        <input type="radio" name={`q-${qi}`} className="form-check-input m-0" checked={selected === oi} onChange={() => {}} style={{ cursor: 'pointer' }} />
                        <span className="badge bg-body-secondary text-secondary flex-shrink-0">{LETTERS[oi]}</span>
                        <span className="flex-fill">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!confirmed && (
          <div className="flex-shrink-0" style={{ width: 220, position: 'sticky', top: 88 }}>
            <div className="card border">
              <div className="card-body">
                <h6 className="fw-semibold mb-3">Câu hỏi</h6>
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {questions.map((q, i) => (
                    <a key={q._id} href={`#q-${i}`}
                      className={`btn btn-sm ${selectedAnswers[i] !== undefined ? 'btn-warning text-white' : 'btn-outline-secondary'}`}
                      style={{ width: 34, height: 34, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, textDecoration: 'none' }}
                      onClick={(e) => { e.preventDefault(); document.getElementById(`q-${i}`)?.scrollIntoView({ behavior: 'smooth' }); }}>
                      {i + 1}
                    </a>
                  ))}
                </div>
                <div className="small text-muted mb-3">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="d-inline-block rounded-circle" style={{ width: 10, height: 10, background: 'var(--orange-500, #f97316)' }} /> Đã làm: {answered}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="d-inline-block rounded-circle" style={{ width: 10, height: 10, background: 'var(--bs-border-color, #e5e5e5)' }} /> Chưa làm: {total - answered}
                  </div>
                </div>
                <button className="btn btn-warning text-white w-100" disabled={!allAnswered || submitting} onClick={handleSubmit}>
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Đang nộp...</> : allAnswered ? '📤 Nộp bài' : `Còn ${total - answered} câu`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {confirmed && result && (
        <div className="mt-4 pt-4">
          <div className="card border-0 shadow text-center p-5" style={{ maxWidth: 500, margin: '0 auto' }}>
            <div style={{ fontSize: 56 }}>{result.score >= 50 ? '🎉' : '😞'}</div>
            <h3 className="fw-bold mt-2">{result.score >= 50 ? 'Chúc mừng!' : 'Chưa đạt'}</h3>
            <div className="d-flex flex-column align-items-center my-3">
              <span className="display-3 fw-bold score-gradient">{result.score}%</span>
              <span className="text-muted small">Kết quả</span>
            </div>
            <div className="d-flex justify-content-center gap-4 mb-4">
              <div className="text-center"><span className="fs-4 fw-bold text-success">{result.answers.filter((a: any) => a.isCorrect).length}</span><div className="text-muted small">Đúng</div></div>
              <div className="text-center"><span className="fs-4 fw-bold text-danger">{result.answers.filter((a: any) => !a.isCorrect).length}</span><div className="text-muted small">Sai</div></div>
              <div className="text-center"><span className="fs-4 fw-bold">{total}</span><div className="text-muted small">Tổng</div></div>
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-outline-secondary" onClick={() => navigate('/quizzes')}>← Về danh sách</button>
              <button className="btn btn-warning text-white" onClick={handleRetry}>🔄 Làm lại</button>
            </div>
          </div>

          <h4 className="fw-bold mt-5 mb-3">📋 Chi tiết câu hỏi</h4>
          {(() => {
            const answerMap = new Map(result.answers.map((a: any) => [a.questionId, a]));
            return questions.map((q, qi) => {
              const answer = answerMap.get(q._id);
              const isCorrect = answer?.isCorrect ?? false;
              const selected = answer?.selectedIndex;
              return (
                <div key={q._id} className={`card border mb-3 ${isCorrect ? 'border-success' : 'border-danger'}`}>
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="taking-qnum">Câu {qi + 1}</span>
                      <span className={`badge ${isCorrect ? 'bg-success' : 'bg-danger'}`}>{isCorrect ? '✓ Đúng' : '✗ Sai'}</span>
                    </div>
                    <div className="fw-semibold mb-3">{q.questionText}</div>
                    <div className="d-flex flex-column gap-2">
                      {q.options.map((opt, oi) => {
                        let cls = 'd-flex align-items-center gap-3 p-3 border rounded-3 taking-option review';
                        if (isCorrect && selected === oi) {
                          cls += ' correct';
                        } else if (selected === oi) {
                          cls += ' wrong';
                        } else {
                          cls += ' dimmed';
                        }
                        return (
                          <div key={oi} className={cls}>
                            <span className="badge flex-shrink-0"
                              style={selected === oi ? {} : { background: 'var(--bs-border-color)', color: 'var(--bs-secondary-color)' }}>
                              {selected === oi ? (isCorrect ? '✓' : '✗') : LETTERS[oi]}
                            </span>
                            <span className="flex-fill">{opt}</span>
                            {isCorrect && selected === oi && <span className="badge bg-success flex-shrink-0">✓ Đúng</span>}
                          </div>
                        );
                      })}
                    </div>
                    {!isCorrect && q.explanation && (
                      <div className="mt-2 p-3 bg-body-tertiary rounded-2 small text-secondary"><strong>Giải thích:</strong> {q.explanation}</div>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
