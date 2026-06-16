import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';

export default function ProtectedRoute() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((s: RootState) => s.auth);
  const hasToken = !!localStorage.getItem('accessToken');

  useEffect(() => {
    if (hasToken && !user && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, hasToken, user, loading]);

  if (!hasToken) return <Navigate to="/login" replace />;
  if (loading || (hasToken && !user)) return <div className="container"><p className="loading">Đang xác thực...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
