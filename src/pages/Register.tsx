import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { register, clearAuthError } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((s: RootState) => s.auth);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ email, name, password }));
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 p-4 bg-body-tertiary">
      <div className="card shadow-lg border-0" style={{ maxWidth: 420, width: '100%' }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2 fs-5 fw-bold">
            <span className="d-inline-flex align-items-center justify-content-center rounded-2 text-white" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))', fontSize: 20 }}>
              Q
            </span>
            QuizHub
          </div>
          <h1 className="text-center fs-4 fw-semibold mb-1">Đăng ký</h1>
          <p className="text-center text-muted small mb-4">Tạo tài khoản để bắt đầu.</p>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-medium text-secondary">Họ tên</label>
              <input className="form-control" type="text" placeholder="Nguyễn Văn A" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-medium text-secondary">Email</label>
              <input className="form-control" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-medium text-secondary">Mật khẩu</label>
              <input className="form-control" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-warning w-100 fw-medium text-white" type="submit" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Đang xử lý...</> : 'Đăng ký'}
            </button>
          </form>

          <div className="text-center mt-4 small text-muted">
            Đã có tài khoản? <Link to="/login" className="text-decoration-none fw-medium">Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
