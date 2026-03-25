import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useBugs } from "../context/BugContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .db-root {
    display: flex;
    min-height: 100vh;
    background: #f1f4f8;
    font-family: 'Inter', sans-serif;
  }

  .db-main {
    margin-left: 240px;
    flex: 1;
    padding: 32px 32px 48px;
    min-width: 0;
  }

  /* ── HEADER ── */
  .db-header {
    margin-bottom: 24px;
  }

  .db-title {
    font-size: 26px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
    margin: 0 0 4px 0;
  }

  .db-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }

  .db-subtitle strong { color: #0f172a; }

  .db-role-badge {
    background: #e8f4fd;
    color: #2563eb;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  /* ── STAT CARDS ── */
  .db-stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }

  .db-stat-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  .db-stat-top {
    padding: 16px 18px 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .db-stat-label {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    opacity: 0.92;
    margin-bottom: 6px;
  }

  .db-stat-value {
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    letter-spacing: -1px;
  }

  .db-stat-icon {
    font-size: 22px;
    opacity: 0.9;
  }

  .db-stat-chart {
    padding: 0 0 4px;
    height: 56px;
    background: #fff;
  }

  .db-stat-chart svg {
    width: 100%;
    height: 56px;
  }

  /* ── REPORT BUG BUTTON ── */
  .db-report-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px;
    background: linear-gradient(90deg, #2563eb, #3b82f6);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    border-radius: 14px;
    text-decoration: none;
    margin-bottom: 24px;
    box-shadow: 0 4px 16px rgba(37,99,235,0.3);
    transition: opacity 0.2s, transform 0.1s;
    font-family: 'Inter', sans-serif;
  }

  .db-report-btn:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  /* ── BOTTOM GRID ── */
  .db-bottom {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 20px;
    align-items: start;
  }

  /* ── CARD ── */
  .db-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  .db-card-title {
    font-size: 17px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 20px 0;
  }

  /* ── RECENT BUGS TABLE ── */
  .db-table {
    width: 100%;
    border-collapse: collapse;
  }

  .db-table th {
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    padding: 0 12px 12px 0;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
  }

  .db-table td {
    padding: 14px 12px 14px 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 13.5px;
    color: #1e293b;
    vertical-align: middle;
  }

  .db-table tr:last-child td { border-bottom: none; }

  .db-table tr:hover td { background: #f8fafc; }

  .db-bug-id {
    color: #64748b;
    font-size: 12.5px;
    font-weight: 600;
    white-space: nowrap;
  }

  .db-bug-title {
    font-weight: 500;
    color: #0f172a;
    max-width: 200px;
  }

  .db-assignee {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .db-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .db-date {
    font-size: 12.5px;
    color: #64748b;
    white-space: nowrap;
  }

  /* ── BADGES ── */
  .db-badge {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .db-badge-open        { background: #fce7e7; color: #dc2626; }
  .db-badge-in-progress { background: #fef3cd; color: #d97706; }
  .db-badge-resolved    { background: #dcfce7; color: #16a34a; }
  .db-badge-review      { background: #ede9fe; color: #7c3aed; }

  .db-badge-critical    { background: #ef4444; color: #fff; }
  .db-badge-high        { background: #f97316; color: #fff; }
  .db-badge-medium      { background: #eab308; color: #fff; }
  .db-badge-low         { background: #22c55e; color: #fff; }
  .db-badge-blocker     { background: #7f1d1d; color: #fff; }

  /* ── QUICK LINKS ── */
  .db-quick-link {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid #f1f5f9;
    text-decoration: none;
    transition: background 0.15s;
    border-radius: 8px;
  }

  .db-quick-link:last-child { border-bottom: none; }

  .db-quick-link:hover { background: #f8fafc; }

  .db-ql-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 16px;
  }

  .db-ql-text {}
  .db-ql-label {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    display: block;
    margin-bottom: 2px;
  }
  .db-ql-desc {
    font-size: 12px;
    color: #94a3b8;
  }

  @media (max-width: 1100px) {
    .db-stats { grid-template-columns: repeat(3, 1fr); }
    .db-bottom { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .db-main { margin-left: 0; padding: 20px 16px; }
    .db-stats { grid-template-columns: repeat(2, 1fr); }
  }
`;

// Mini sparkline SVG per card color
function Sparkline({ color, fill }) {
  const paths = [
    "M0,40 C20,38 40,30 60,28 C80,26 100,32 120,28 C140,24 160,18 180,20 C200,22 220,16 240,14",
    "M0,42 C20,40 40,36 60,30 C80,24 100,28 120,22 C140,16 160,20 180,16 C200,12 220,18 240,12",
    "M0,38 C20,36 40,34 60,32 C80,30 100,34 120,28 C140,22 160,26 180,20 C200,14 220,18 240,16",
    "M0,40 C20,36 40,30 60,26 C80,22 100,28 120,22 C140,16 160,20 180,14 C200,8  220,12 240,10",
    "M0,44 C20,40 40,36 60,30 C80,24 100,20 120,16 C140,12 160,14 180,10 C200,6  220,10 240,8",
  ];
  const idx = Math.floor(Math.random() * paths.length);
  return (
    <svg viewBox="0 0 240 56" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={paths[0] + " L240,56 L0,56 Z"} fill={`url(#g${color.replace("#","")})`}/>
      <path d={paths[0]} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

const statCards = (total, open, inProgress, resolved, critical) => [
  { label: "Total Bugs",  value: total,      bg: "#2563eb", icon: "🐛",  chartColor: "#93c5fd" },
  { label: "Open",        value: open,       bg: "#dc2626", icon: "📂",  chartColor: "#fca5a5" },
  { label: "In Progress", value: inProgress, bg: "#d97706", icon: "⚙️",  chartColor: "#fcd34d" },
  { label: "Resolved",    value: resolved,   bg: "#16a34a", icon: "✅",  chartColor: "#86efac" },
  { label: "Critical",    value: critical,   bg: "#7c3aed", icon: "⚠️",  chartColor: "#c4b5fd" },
];

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusBadgeClass(status) {
  const map = { open: "db-badge-open", "in-progress": "db-badge-in-progress", resolved: "db-badge-resolved", review: "db-badge-review" };
  return map[status] || "db-badge-open";
}

function severityBadgeClass(sev) {
  const map = { critical: "db-badge-critical", high: "db-badge-high", medium: "db-badge-medium", low: "db-badge-low", blocker: "db-badge-blocker" };
  return map[sev] || "db-badge-medium";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { bugs }  = useBugs();

  const total      = bugs.length;
  const open       = bugs.filter((b) => b.status === "open").length;
  const inProgress = bugs.filter((b) => b.status === "in-progress").length;
  const resolved   = bugs.filter((b) => b.status === "resolved").length;
  const critical   = bugs.filter((b) => b.severity === "critical" || b.severity === "blocker").length;
  const myBugs     = bugs.filter((b) => b.assignedUser?.id === user?.id);

  const cards = statCards(total, open, inProgress, resolved, critical);

  const quickLinks = [
    { to: "/bugs",     icon: "📋", label: "Bug List",    desc: "View all reported bugs",      hide: false },
    { to: "/board",    icon: "📌", label: "Task Board",  desc: "Kanban view of all bugs",     hide: false },
    { to: "/bugs/new", icon: "➕", label: "Report Bug",  desc: "Submit a new bug",            hide: user?.role === "developer" },
    { to: "/admin",    icon: "⚙️", label: "Admin Panel", desc: "Manage users & roles",        hide: user?.role !== "admin" },
  ].filter((l) => !l.hide);

  return (
    <>
      <style>{styles}</style>
      <div className="db-root">
        <Navbar />

        <main className="db-main">
          {/* Header */}
          <div className="db-header">
            <h1 className="db-title">Dashboard</h1>
            <p className="db-subtitle">
              Welcome back, <strong>{user?.name}</strong> —{" "}
              <span className="db-role-badge">{user?.role?.toUpperCase()}</span>
            </p>
          </div>

          {/* Stat Cards */}
          <div className="db-stats">
            {cards.map((c) => (
              <div className="db-stat-card" key={c.label}>
                <div className="db-stat-top" style={{ background: c.bg }}>
                  <div>
                    <div className="db-stat-label">{c.label}</div>
                    <div className="db-stat-value">{c.value}</div>
                  </div>
                  <span className="db-stat-icon">{c.icon}</span>
                </div>
                <div className="db-stat-chart">
                  <Sparkline color={c.chartColor} />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom grid */}
          <div className="db-bottom">

            {/* Recent Bugs Table */}
            <div className="db-card">
              <h3 className="db-card-title">Recent Bugs</h3>
              {bugs.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: 14 }}>No bugs reported yet.</p>
              ) : (
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Assignee</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bugs.slice(0, 6).map((b) => (
                      <tr key={b.id} style={{ cursor: "pointer" }}
                        onClick={() => window.location.href = `/bugs/${b.id}`}>
                        <td className="db-bug-id">#{b.id?.toString().padStart(3,"0") || "—"}</td>
                        <td className="db-bug-title">{b.title}</td>
                        <td>
                          <span className={`db-badge ${statusBadgeClass(b.status)}`}>
                            {b.status === "in-progress" ? "In Progress" : b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`db-badge ${severityBadgeClass(b.severity)}`}>
                            {b.severity?.charAt(0).toUpperCase() + b.severity?.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="db-assignee">
                            <div className="db-avatar">{getInitials(b.assignedUser?.name)}</div>
                            {b.assignedUser?.name?.split(" ")[0]} {b.assignedUser?.name?.split(" ")[1]?.[0]}.
                          </div>
                        </td>
                        <td className="db-date">{formatDate(b.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Quick Links or My Bugs */}
            {user?.role === "developer" ? (
              <div className="db-card">
                <h3 className="db-card-title">My Assigned Bugs</h3>
                {myBugs.length === 0 ? (
                  <p style={{ color: "#94a3b8", fontSize: 14 }}>No bugs assigned to you.</p>
                ) : (
                  myBugs.slice(0, 5).map((b) => (
                    <Link to={`/bugs/${b.id}`} key={b.id} className="db-quick-link" style={{ paddingLeft: 8, paddingRight: 8 }}>
                      <div className="db-ql-text">
                        <span className="db-ql-label">{b.title}</span>
                        <span className="db-ql-desc">
                          <span className={`db-badge ${statusBadgeClass(b.status)}`} style={{ fontSize: 11, padding: "2px 8px" }}>
                            {b.status}
                          </span>
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            ) : (
              <div className="db-card">
                <h3 className="db-card-title">Quick Links</h3>
                {quickLinks.map((l) => (
                  <Link to={l.to} key={l.to} className="db-quick-link" style={{ paddingLeft: 8, paddingRight: 8 }}>
                    <div className="db-ql-icon">{l.icon}</div>
                    <div className="db-ql-text">
                      <span className="db-ql-label">{l.label}</span>
                      <span className="db-ql-desc">{l.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}