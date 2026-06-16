import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchQuizById, updateQuiz, createQuestion, updateQuestion, deleteQuestion, clearMessages } from '../store/quizSlice';
import type { AppDispatch, RootState } from '../store';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function EditQuiz() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentQuiz, loading, error } = useSelector((s: RootState) => s.quiz);
  const { user } = useSelector((s: RootState) => s.auth);

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
  const [qText, setQText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const backPath = user?.role === 'teacher' ? '/teacher/quizzes' : '/admin/quizzes';

  useEffect(() => {
    dispatch(clearMessages());
    if (id) dispatch(fetchQuizById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (searchParams.get('addQuestion') === '1' && currentQuiz) {
      setShowAddQuestion(true);
      resetQuestionForm();
    }
  }, [searchParams, currentQuiz]);

  useEffect(() => {
    if (currentQuiz) { setEditTitle(currentQuiz.title); setEditDesc(currentQuiz.description); }
  }, [currentQuiz]);

  const showSuccess = (msg: string) => { setLocalSuccess(msg); setLocalError(null); setTimeout(() => setLocalSuccess(null), 3000); };
  const showError = (msg: string) => { setLocalError(msg); setLocalSuccess(null); setTimeout(() => setLocalError(null), 5000); };
  const resetQuestionForm = () => { setQText(''); setOpt1(''); setOpt2(''); setOpt3(''); setOpt4(''); setCorrectIdx(0); };

  const handleUpdateQuiz = async () => {
    if (!id) return;
    try {
      setSubmitting(true);
      await dispatch(updateQuiz({ id, title: editTitle, description: editDesc })).unwrap();
      showSuccess('Cập nhật quiz thành công');
      setEditMode(false);
      dispatch(fetchQuizById(id));
    } catch (err: any) { showError(typeof err === 'string' ? err : 'Cập nhật quiz thất bại'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteQuestion = (questionId: string, questionText: string) => {
    if (window.confirm(`Xoá câu hỏi "${questionText.slice(0, 50)}..."?`)) {
      dispatch(deleteQuestion(questionId));
      showSuccess('Xoá câu hỏi thành công');
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const options = [opt1, opt2, opt3, opt4].filter(Boolean);
    if (options.length < 2) { showError('Cần ít nhất 2 đáp án'); return; }
    if (!id) return;
    try {
      setSubmitting(true);
      await dispatch(createQuestion({ quizId: id, questionText: qText, options, correctAnswerIndex: correctIdx, explanation: `Đáp án đúng: ${options[correctIdx]}` })).unwrap();
      showSuccess('Thêm câu hỏi thành công');
      setShowAddQuestion(false);
      resetQuestionForm();
      dispatch(fetchQuizById(id));
    } catch (err: any) { showError(typeof err === 'string' ? err : 'Thêm câu hỏi thất bại'); }
    finally { setSubmitting(false); }
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editQuestionId) return;
    const options = [opt1, opt2, opt3, opt4].filter(Boolean);
    if (options.length < 2) { showError('Cần ít nhất 2 đáp án'); return; }
    try {
      setSubmitting(true);
      await dispatch(updateQuestion({ questionId: editQuestionId, data: { questionText: qText, options, correctAnswerIndex: correctIdx, explanation: `Đáp án đúng: ${options[correctIdx]}` } })).unwrap();
      showSuccess('Cập nhật câu hỏi thành công');
      setEditQuestionId(null);
      resetQuestionForm();
      if (id) dispatch(fetchQuizById(id));
    } catch (err: any) { showError(typeof err === 'string' ? err : 'Cập nhật câu hỏi thất bại'); }
    finally { setSubmitting(false); }
  };

  const startEditQuestion = (q: any) => {
    setEditQuestionId(q._id); setShowAddQuestion(false);
    setQText(q.questionText); setOpt1(q.options[0] || ''); setOpt2(q.options[1] || ''); setOpt3(q.options[2] || ''); setOpt4(q.options[3] || '');
    setCorrectIdx(q.correctAnswerIndex);
  };

  const cancelQuestionForm = () => { setShowAddQuestion(false); setEditQuestionId(null); resetQuestionForm(); };

  const canAccess = user?.role === 'admin' || user?.role === 'teacher';
  if (!canAccess) return <div className="text-center text-danger py-5">Bạn không có quyền truy cập trang này.</div>;
  if (loading && !currentQuiz) return <p className="text-center text-muted py-5">Đang tải...</p>;
  if (!currentQuiz) return <p className="text-center text-muted py-5">Không tìm thấy quiz</p>;

  const questions = currentQuiz.question || [];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(backPath)}>←</button>
        <h1 className="fs-4 fw-bold mb-0">✏️ Chỉnh sửa Quiz</h1>
      </div>

      {localSuccess && <div className="alert alert-success py-2 small">{localSuccess}</div>}
      {localError && <div className="alert alert-danger py-2 small">{localError}</div>}
      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="card border p-4 mb-4">
        {!editMode ? (
          <div className="d-flex align-items-start justify-content-between">
            <div>
              <h5 className="fw-bold mb-1">{currentQuiz.title}</h5>
              <p className="text-secondary small mb-0">{currentQuiz.description}</p>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={() => setEditMode(true)}>✏️ Sửa</button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            <input className="form-control" type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Tiêu đề quiz" />
            <textarea className="form-control" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} placeholder="Mô tả quiz" />
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditMode(false)}>Huỷ</button>
              <button className="btn btn-warning text-white btn-sm" onClick={handleUpdateQuiz} disabled={submitting}>
                {submitting ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold mb-0">❓ Câu hỏi ({questions.length})</h5>
        {!showAddQuestion && !editQuestionId && (
          <button className="btn btn-warning text-white btn-sm" onClick={() => { setShowAddQuestion(true); resetQuestionForm(); }}>+ Thêm câu hỏi</button>
        )}
      </div>

      {(showAddQuestion || editQuestionId) && (
        <form onSubmit={editQuestionId ? handleUpdateQuestion : handleAddQuestion} className="card border p-4 mb-4" style={{ borderColor: 'var(--orange-500, #f97316) !important' }}>
          <h6 className="fw-bold mb-3">{editQuestionId ? '✏️ Sửa câu hỏi' : '➕ Thêm câu hỏi mới'}</h6>
          <div className="mb-3">
            <label className="form-label small fw-medium text-secondary">Nội dung câu hỏi <span className="text-danger">*</span></label>
            <input className="form-control" type="text" value={qText} onChange={(e) => setQText(e.target.value)} required placeholder="Nhập câu hỏi..." />
          </div>
          {[opt1, opt2, opt3, opt4].map((opt, i) => (
            <div key={i} className="mb-3">
              <label className="form-label small fw-medium text-secondary">Đáp án {LETTERS[i]}{i < 2 && <span className="text-danger">*</span>}</label>
              <div className="input-group">
                <span className="input-group-text">{LETTERS[i]}</span>
                <input className="form-control" type="text" value={opt} onChange={(e) => {
                  const setter = [setOpt1, setOpt2, setOpt3, setOpt4][i];
                  setter(e.target.value);
                }} required={i < 2} placeholder={`Đáp án ${LETTERS[i]}...`} />
              </div>
            </div>
          ))}
          <div className="mb-3">
            <label className="form-label small fw-medium text-secondary">Đáp án đúng <span className="text-danger">*</span></label>
            <select className="form-select" value={correctIdx} onChange={(e) => setCorrectIdx(Number(e.target.value))}>
              {[opt1, opt2, opt3, opt4].filter(Boolean).map((opt, i) => (
                <option key={i} value={i}>{LETTERS[i]}: {opt}</option>
              ))}
            </select>
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelQuestionForm}>Huỷ</button>
            <button type="submit" className="btn btn-warning text-white btn-sm" disabled={submitting}>
              {submitting ? 'Đang xử lý...' : editQuestionId ? 'Cập nhật' : 'Thêm'}
            </button>
          </div>
        </form>
      )}

      {questions.length === 0 && !showAddQuestion ? (
        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: 48 }}>📭</div>
          <h6 className="mt-2">Chưa có câu hỏi nào</h6>
          <p className="small">Thêm câu hỏi đầu tiên cho quiz này.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {questions.map((q, qi) => (
            <div key={q._id} className="card border admin-question-card">
              <div className="card-body">
                <div className="fw-semibold small mb-2">Câu {qi + 1}: {q.questionText}</div>
                <div className="d-flex flex-wrap gap-1 mb-2">
                  {q.options.map((opt, oi) => (
                    <span key={oi} className={`badge border ${oi === q.correctAnswerIndex ? 'bg-success-subtle text-success border-success' : 'bg-body-tertiary text-secondary border-0'}`}>
                      {LETTERS[oi]}. {opt}
                    </span>
                  ))}
                </div>
                <div className="d-flex gap-1">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => startEditQuestion(q)}>✏️ Sửa</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteQuestion(q._id, q.questionText)}>🗑️ Xoá</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
