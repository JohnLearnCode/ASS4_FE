import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearMessages, fetchQuizzes } from '../store/quizSlice';
import { clearUserMessages } from '../store/userSlice';
import { fetchUserStats, fetchLeaderboard } from '../store/resultSlice';
import type { AppDispatch, RootState } from '../store';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);
  const { quizzes } = useSelector((s: RootState) => s.quiz);
  const { stats, statsLoading, leaderboard, leaderboardLoading } = useSelector((s: RootState) => s.result);

  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchQuizzes());
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const goTo = (path: string) => {
    dispatch(clearMessages());
    dispatch(clearUserMessages());
    navigate(path);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="fs-2 fw-bold mb-1">Xin chào, {user?.name || 'User'} 👋</h1>
        <p className="text-secondary">Chào mừng bạn đến với QuizHub — nền tảng làm bài test online.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card border stat-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-2 p-2" style={{ background: 'rgba(234,88,12,0.1)' }}>📝</span>
              </div>
              <div className="fs-3 fw-bold">{quizzes.length}</div>
              <div className="text-muted small">Tổng số bài quiz</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border stat-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-2 p-2" style={{ background: 'rgba(59,130,246,0.1)' }}>📊</span>
              </div>
              <div className="fs-3 fw-bold">{statsLoading ? '...' : stats.totalQuizzesDone}</div>
              <div className="text-muted small">Bài đã làm</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border stat-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-2 p-2" style={{ background: 'rgba(34,197,94,0.1)' }}>🎯</span>
              </div>
              <div className="fs-3 fw-bold">{statsLoading ? '...' : `Điểm: ${stats.averageScore}`}</div>
              <div className="text-muted small">Điểm trung bình</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border stat-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-2 p-2" style={{ background: 'rgba(168,85,247,0.1)' }}>🏆</span>
              </div>
              <div className="fs-3 fw-bold">{user?.role === 'admin' ? 'Admin' : 'User'}</div>
              <div className="text-muted small">Vai trò</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border mb-4">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Thao tác nhanh</h5>
          <div className="row g-2">
            <div className="col-md-3 col-6">
              <div className="d-flex flex-column align-items-center gap-1 p-3 border rounded-3 bg-body-tertiary text-center" style={{ cursor: 'pointer' }} onClick={() => goTo('/quizzes')}>
                <span style={{ fontSize: 24 }}>📝</span>
                <span className="fw-medium small">Làm Quiz</span>
                <span className="text-muted" style={{ fontSize: 11 }}>Xem và làm bài test</span>
              </div>
            </div>
            {user?.role === 'admin' && (
              <>
                <div className="col-md-3 col-6">
                  <div className="d-flex flex-column align-items-center gap-1 p-3 border rounded-3 bg-body-tertiary text-center" style={{ cursor: 'pointer' }} onClick={() => goTo('/admin/quizzes')}>
                    <span style={{ fontSize: 24 }}>⚙️</span>
                    <span className="fw-medium small">Quản lý Quiz</span>
                    <span className="text-muted" style={{ fontSize: 11 }}>Tạo, sửa, xoá quiz</span>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="d-flex flex-column align-items-center gap-1 p-3 border rounded-3 bg-body-tertiary text-center" style={{ cursor: 'pointer' }} onClick={() => goTo('/admin/users')}>
                    <span style={{ fontSize: 24 }}>👥</span>
                    <span className="fw-medium small">Người dùng</span>
                    <span className="text-muted" style={{ fontSize: 11 }}>Quản lý người dùng</span>
                  </div>
                </div>
              </>
            )}
            {user?.role === 'teacher' && (
              <div className="col-md-3 col-6">
                <div className="d-flex flex-column align-items-center gap-1 p-3 border rounded-3 bg-body-tertiary text-center" style={{ cursor: 'pointer' }} onClick={() => goTo('/teacher/quizzes')}>
                  <span style={{ fontSize: 24 }}>📝</span>
                  <span className="fw-medium small">Quiz của tôi</span>
                  <span className="text-muted" style={{ fontSize: 11 }}>Quản lý quiz của bạn</span>
                </div>
              </div>
            )}
            {user?.role === 'user' && (
              <div className="col-md-3 col-6">
                <div className="d-flex flex-column align-items-center gap-1 p-3 border rounded-3 bg-body-tertiary text-center" style={{ cursor: 'pointer' }} onClick={() => goTo('/history')}>
                  <span style={{ fontSize: 24 }}>📚</span>
                  <span className="fw-medium small">Lịch sử</span>
                  <span className="text-muted" style={{ fontSize: 11 }}>Xem lịch sử làm bài</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card border">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">🏆 Bảng xếp hạng</h5>
          {leaderboardLoading ? (
            <div className="d-flex flex-column gap-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="d-flex align-items-center gap-3 p-3">
                  <div className="skeleton" style={{ width: 32, height: 20 }} />
                  <div className="skeleton flex-fill" style={{ height: 16 }} />
                  <div className="skeleton" style={{ width: 50, height: 20 }} />
                </div>
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-muted py-4">Chưa có dữ liệu xếp hạng. Hãy làm bài quiz để có điểm!</p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {leaderboard.map((entry, idx) => {
                const rank = idx + 1;
                let rankBadge = `#${rank}`;
                let rankClass = '';
                if (rank === 1) { rankBadge = '🥇'; rankClass = 'gold'; }
                else if (rank === 2) { rankBadge = '🥈'; rankClass = 'silver'; }
                else if (rank === 3) { rankBadge = '🥉'; rankClass = 'bronze'; }
                return (
                  <div key={entry.userId} className={`d-flex align-items-center gap-3 p-3 border rounded-3 leaderboard-row ${rankClass}`}>
                    <span className="fw-bold text-center" style={{ minWidth: 32, fontSize: rank <= 3 ? 20 : 16 }}>{rankBadge}</span>
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold flex-shrink-0" style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))' }}>
                      {entry.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex-fill min-w-0">
                      <div className="fw-semibold text-truncate" style={{ fontSize: 14 }}>{entry.name}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{entry.totalQuizzes} bài làm</div>
                    </div>
                    <span className="fw-bold flex-shrink-0" style={{ fontSize: 18, color: 'var(--orange-500, #f97316)' }}>{entry.averageScore}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
