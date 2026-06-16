export default function Footer() {
  return (
    <footer className="border-top bg-body py-3 mt-auto">
      <div className="container d-flex justify-content-between align-items-center" style={{ maxWidth: 1200 }}>
        <span className="text-muted" style={{ fontSize: 13 }}>
          &copy; {new Date().getFullYear()} QuizHub. Built with React + TypeScript.
        </span>
        <div className="d-flex gap-3">
          <a href="#" className="text-muted text-decoration-none" style={{ fontSize: 13 }}>Giới thiệu</a>
          <a href="#" className="text-muted text-decoration-none" style={{ fontSize: 13 }}>Liên hệ</a>
          <a href="#" className="text-muted text-decoration-none" style={{ fontSize: 13 }}>Điều khoản</a>
        </div>
      </div>
    </footer>
  );
}
