import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .sidebar {
    width: 240px;
    min-height: 100vh;
    background: #0d1b2e;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    font-family: 'Inter', sans-serif;
  }

  /* ── LOGO ── */
  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 24px 20px 20px;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 12px;
  }

  .sidebar-logo-icon {
    font-size: 22px;
  }

  .sidebar-logo-text {
    font-size: 18px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.3px;
  }

  /* ── NAV LINKS ── */
  .sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    gap: 2px;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    color: #94a3b8;
    transition: background 0.18s, color 0.18s;
  }

  .sidebar-link:hover {
    background: rgba(255,255,255,0.06);
    color: #ffffff;
  }

  .sidebar-link.active {
    background: rgba(255,255,255,0.1);
    color: #ffffff;
    font-weight: 600;
  }

  .sidebar-link svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    opacity: 0.85;
  }

  /* ── BOTTOM SECTION ── */
  .sidebar-bottom {
    padding: 12px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sidebar-user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    text-decoration: none;
    transition: background 0.18s;
    cursor: pointer;
  }

  .sidebar-user:hover {
    background: rgba(255,255,255,0.06);
  }

  .sidebar-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .sidebar-user-info {
    display: flex;
    flex-direction: column;
  }

  .sidebar-user-name {
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.3;
  }

  .sidebar-user-role {
    font-size: 11px;
    color: #64748b;
    text-transform: capitalize;
  }

  .sidebar-logout {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #94a3b8;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.18s, color 0.18s;
    margin-top: 2px;
  }

  .sidebar-logout:hover {
    background: rgba(239, 68, 68, 0.12);
    color: #f87171;
    border-color: rgba(239, 68, 68, 0.2);
  }

  /* ── PAGE OFFSET: push main content right ── */
  .sidebar-offset {
    margin-left: 240px;
  }
`;

// SVG icons
const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  bugs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2l1.5 1.5"/><path d="M14.5 3.5L16 2"/>
      <path d="M9 7.5A3 3 0 0 0 12 10.5 3 3 0 0 0 15 7.5"/>
      <path d="M6.5 9.5L3 8"/><path d="M17.5 9.5L21 8"/>
      <path d="M6 13H3"/><path d="M21 13h-3"/>
      <path d="M6.5 17L4 19"/><path d="M17.5 17L20 19"/>
      <path d="M9 7.5C8 6 8 4.5 9 3.5h6c1 1 1 2.5 0 4"/>
      <path d="M7 13c0 3 2 6 5 6s5-3 5-6V9H7v4z"/>
    </svg>
  ),
  board: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/>
      <rect x="17" y="3" width="5" height="15" rx="1"/>
    </svg>
  ),
  report: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
    </svg>
  ),
  newbug: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate("/"); };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  // Initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      <style>{styles}</style>
      <nav className="sidebar">

        {/* Logo */}
        <Link to="/dashboard" className="sidebar-logo">
          <span className="sidebar-logo-icon">🐛</span>
          <span className="sidebar-logo-text">BugPilot</span>
        </Link>

        {/* Nav links */}
        <div className="sidebar-nav">
          <Link to="/dashboard" className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}>
            {icons.dashboard} Dashboard
          </Link>

          <Link to="/bugs" className={`sidebar-link ${isActive("/bugs") ? "active" : ""}`}>
            {icons.bugs} Bugs
          </Link>

          <Link to="/board" className={`sidebar-link ${isActive("/board") ? "active" : ""}`}>
            {icons.board} Board
          </Link>

          <Link to="/report" className={`sidebar-link ${isActive("/report") ? "active" : ""}`}>
            {icons.report} Report
          </Link>

          {/* QA can report bugs */}
          {user?.role === "qa" && (
            <Link to="/bugs/new" className={`sidebar-link ${isActive("/bugs/new") ? "active" : ""}`}>
              {icons.newbug} Report Bug
            </Link>
          )}

          {/* Admin only */}
          {user?.role === "admin" && (
            <Link to="/admin" className={`sidebar-link ${isActive("/admin") ? "active" : ""}`}>
              {icons.admin} Admin
            </Link>
          )}
        </div>

        {/* Bottom: user + logout */}
        <div className="sidebar-bottom">
          <Link to={`/profile/${user?.id}`} className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name || "User"}</span>
              <span className="sidebar-user-role">{user?.role || "member"}</span>
            </div>
          </Link>
          <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
        </div>

      </nav>
    </>
  );
}