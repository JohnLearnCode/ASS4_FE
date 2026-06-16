import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, createUser, updateUser, deleteUser, clearUserMessages } from '../store/userSlice';
import type { AppDispatch, RootState } from '../store';

const ROLES = ['user', 'admin', 'teacher'];
const PAGE_SIZE = 10;

export default function AdminUserList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading, error, successMessage } = useSelector((s: RootState) => s.users);
  const { user: currentUser } = useSelector((s: RootState) => s.auth);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => dispatch(clearUserMessages()), 3000);
      dispatch(fetchUsers());
      return () => clearTimeout(t);
    }
  }, [successMessage, dispatch]);

  useEffect(() => { dispatch(clearUserMessages()); }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase().trim();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

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
      pages.push(<li key={i} className={`page-item${i === page ? ' active' : ''}`}><button className="page-link" onClick={() => goToPage(i)}>{i}</button></li>);
    }
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<li key="dots2" className="page-item disabled"><span className="page-link">...</span></li>);
      pages.push(<li key={totalPages} className="page-item"><button className="page-link" onClick={() => goToPage(totalPages)}>{totalPages}</button></li>);
    }
    return pages;
  }

  const resetForm = () => {
    setEmail(''); setName(''); setPassword(''); setRole('user'); setEditId(null); setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) dispatch(updateUser({ id: editId, email, name, password: password || undefined, role }));
    else dispatch(createUser({ email, name, password, role }));
    resetForm();
  };

  const startEdit = (u: any) => {
    setEditId(u._id || u.id); setEmail(u.email); setName(u.name); setPassword(''); setRole(u.role); setShowForm(true);
  };

  const handleDelete = (u: any) => {
    if (window.confirm(`Xoá user "${u.name}" (${u.email})?`)) dispatch(deleteUser(u._id || u.id));
  };

  if (currentUser?.role !== 'admin') {
    return <div className="text-center text-danger py-5">Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard')}>←</button>
          <h1 className="fs-4 fw-bold mb-0">👥 Quản lý Người dùng</h1>
        </div>
        {!showForm && (
          <button className="btn btn-warning text-white btn-sm fw-medium" onClick={() => { resetForm(); setShowForm(true); }}>+ Tạo User</button>
        )}
      </div>

      {successMessage && <div className="alert alert-success py-2 small">{successMessage}</div>}
      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="card border mb-4 p-4" style={{ maxWidth: 500 }}>
          <h5 className="fw-bold mb-3">{editId ? '✏️ Sửa User' : '➕ Tạo User mới'}</h5>
          <div className="mb-3">
            <label className="form-label small fw-medium text-secondary">Email <span className="text-danger">*</span></label>
            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium text-secondary">Tên <span className="text-danger">*</span></label>
            <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Họ tên" />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium text-secondary">Mật khẩu{!editId && <span className="text-danger">*</span>}</label>
            <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!editId} placeholder={editId ? 'Để trống nếu không đổi' : 'Mật khẩu'} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium text-secondary">Role</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetForm}>Huỷ</button>
            <button type="submit" className="btn btn-warning text-white btn-sm">{editId ? 'Cập nhật' : 'Tạo'}</button>
          </div>
        </form>
      )}

      {loading && <div className="text-center text-muted py-3">Đang tải...</div>}

      {!showForm && (
        <div className="position-relative mb-3" style={{ maxWidth: 360 }}>
          <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ pointerEvents: 'none' }}>🔍</span>
          <input className="form-control ps-5" type="text" placeholder="Tìm kiếm theo tên hoặc email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 border rounded-3 overflow-hidden">
          <thead className="table-light">
            <tr>
              <th className="small text-muted text-uppercase">Tên</th>
              <th className="small text-muted text-uppercase">Email</th>
              <th className="small text-muted text-uppercase">Role</th>
              <th className="small text-muted text-uppercase text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u) => (
              <tr key={u._id || u.id}>
                <td className="fw-medium">{u.name}</td>
                <td className="text-secondary">{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'teacher' ? 'bg-info' : 'bg-warning'}`}>{u.role}</span>
                </td>
                <td className="text-end">
                  <div className="d-flex gap-1 justify-content-end">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => startEdit(u)}>✏️ Sửa</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(u)}>🗑️ Xoá</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="text-center text-muted py-4">{search ? 'Không tìm thấy user.' : 'Chưa có user nào.'}</div>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center mb-0">
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
    </div>
  );
}
