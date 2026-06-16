import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s: RootState) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/quizzes', label: 'Khám phá' },
    { to: '/history', label: 'Lịch sử' },
  ];

  if (user?.role === 'admin') {
    navLinks.push(
      { to: '/admin/quizzes', label: 'Quiz' },

      { to: '/admin/users', label: 'Người dùng' },
    );
  } else if (user?.role === 'teacher') {
    navLinks.push(
      { to: '/teacher/quizzes', label: 'Quiz của tôi' },
    );
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-body border-bottom" style={{ backdropFilter: 'blur(12px)', background: 'var(--bs-body-bg, #fff) !important' }}>
      <div className="container" style={{ maxWidth: 1200 }}>
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/dashboard">
          <span className="d-inline-flex align-items-center justify-content-center rounded-3 text-white" style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))' }}>
            Q
          </span>
          QuizHub
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto gap-1">
            {navLinks.map((link) => (
              <li key={link.to} className="nav-item">
                <Link
                  to={link.to}
                  className={`nav-link rounded-2 px-3 ${isActive(link.to) ? 'active fw-semibold' : ''}`}
                  style={isActive(link.to) ? { color: 'var(--orange-500)', background: 'rgba(234,88,12,0.08)' } : {}}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary border-0 rounded-2 theme-toggle"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Chuyển sang tối' : 'Chuyển sang sáng'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <div className="d-flex align-items-center gap-2 px-2 py-1 rounded-2 border bg-body-secondary">
              <span className="d-inline-flex align-items-center justify-content-center rounded-2 text-white" style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))', fontSize: 12 }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
              <div className="lh-1">
                <div className="fw-medium" style={{ fontSize: 13 }}>{user?.name || 'User'}</div>
                <div className="text-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{user?.role || 'user'}</div>
              </div>
            </div>

            <button className="btn btn-outline-secondary btn-sm rounded-2" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
