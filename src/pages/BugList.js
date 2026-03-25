import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useBugs } from "../context/BugContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .bl-root {
    display: flex;
    min-height: 100vh;
    background: #f1f4f8;
    font-family: 'Inter', sans-serif;
  }

  .bl-main {
    margin-left: 240px;
    flex: 1;
    padding: 32px 32px 48px;
    min-width: 0;
  }

  /* ── HEADER ── */
  .bl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .bl-title {
    font-size: 26px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
    margin: 0;
  }

  .bl-report-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 22px;
    background: #2563eb;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border-radius: 10px;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(37,99,235,0.3);
    transition: background 0.2s, transform 0.1s;
    font-family: 'Inter', sans-serif;
  }
  .bl-report-btn:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  /* ── FILTERS ── */
  .bl-filters {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .bl-search-wrap {
    flex: 1;
    min-width: 220px;
    position: relative;
  }

  .bl-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 15px;
    pointer-events: none;
  }

  .bl-search {
    width: 100%;
    padding: 10px 14px 10px 38px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 14px;
    color: #0f172a;
    background: #fff;
    outline: none;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .bl-search:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
  .bl-search::placeholder { color: #94a3b8; }

  /* filter dropdown buttons */
  .bl-filter-select-wrap {
    position: relative;
  }

  .bl-filter-select {
    appearance: none;
    -webkit-appearance: none;
    padding: 10px 36px 10px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #334155;
    background: #fff;
    outline: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.2s;
    white-space: nowrap;
  }
  .bl-filter-select:focus {
    border-color: #3b82f6;
  }

  .bl-filter-select-wrap::after {
    content: '⌄';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-52%);
    color: #64748b;
    font-size: 14px;
    pointer-events: none;
  }

  /* ── TABLE CARD ── */
  .bl-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    overflow: hidden;
  }

  .bl-table {
    width: 100%;
    border-collapse: collapse;
  }

  .bl-table th {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    padding: 16px 20px;
    border-bottom: 1.5px solid #f1f5f9;
    background: #fff;
    white-space: nowrap;
  }

  .bl-table td {
    padding: 15px 20px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 13.5px;
    color: #1e293b;
    vertical-align: middle;
  }

  .bl-table tbody tr:last-child td {
    border-bottom: none;
  }

  .bl-table tbody tr:hover td {
    background: #f8fafc;
  }

  .bl-bug-title {
    font-weight: 500;
    color: #0f172a;
  }

  /* ── ASSIGNEE / CREATOR ── */
  .bl-user {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .bl-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    flex-shrink: 0;
    overflow: hidden;
  }

  .bl-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* ── DETAILS LINK ── */
  .bl-details-link {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 500;
    color: #94a3b8;
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s;
  }
  .bl-details-link:hover { color: #2563eb; }

  /* ── BADGES ── */
  .bl-badge {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  /* severity */
  .bl-sev-blocker     { background: #fee2e2; color: #dc2626; }
  .bl-sev-critical    { background: #fee2e2; color: #dc2626; }
  .bl-sev-major       { background: #fef3c7; color: #d97706; }
  .bl-sev-normal      { background: #dbeafe; color: #2563eb; }
  .bl-sev-minor       { background: #dcfce7; color: #16a34a; }
  .bl-sev-trivial     { background: #f1f5f9; color: #64748b; }
  .bl-sev-enhancement { background: #ede9fe; color: #7c3aed; }

  /* priority */
  .bl-pri-high   { background: #fee2e2; color: #dc2626; }
  .bl-pri-normal { background: #fef3c7; color: #d97706; }
  .bl-pri-low    { background: #dcfce7; color: #16a34a; }

  /* status */
  .bl-sta-open         { background: #fee2e2; color: #dc2626; }
  .bl-sta-in-progress  { background: #fef3c7; color: #d97706; }
  .bl-sta-under-review { background: #ede9fe; color: #7c3aed; }
  .bl-sta-resolved     { background: #dcfce7; color: #16a34a; }
  .bl-sta-closed       { background: #dcfce7; color: #16a34a; }

  .bl-empty {
    padding: 48px;
    text-align: center;
    color: #94a3b8;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .bl-main { margin-left: 0; padding: 20px 16px; }
  }
`;

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
}

export default function BugList() {
  const { user }  = useAuth();
  const { bugs }  = useBugs();
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("");
  const [severity, setSeverity] = useState("");
  const [priority, setPriority] = useState("");

  const filtered = bugs.filter((b) => (
    (!search   || b.title.toLowerCase().includes(search.toLowerCase())) &&
    (!status   || b.status   === status) &&
    (!severity || b.severity === severity) &&
    (!priority || b.priority === priority)
  ));

  return (
    <>
      <style>{styles}</style>
      <div className="bl-root">
        <Navbar />

        <main className="bl-main">

          {/* Header */}
          <div className="bl-header">
            <h1 className="bl-title">Bug List ({bugs.length} Bugs)</h1>
            {["qa", "admin"].includes(user?.role) && (
              <Link to="/bugs/new" className="bl-report-btn">
                <span style={{ fontSize: 16 }}>＋</span> Report Bug
              </Link>
            )}
          </div>

          {/* Filters */}
          <div className="bl-filters">
            <div className="bl-search-wrap">
              <span className="bl-search-icon">🔍</span>
              <input
                className="bl-search"
                placeholder="Search bugs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="bl-filter-select-wrap">
              <select className="bl-filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Status: All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="under-review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="bl-filter-select-wrap">
              <select className="bl-filter-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="">Severity: All Severity</option>
                {["blocker","critical","major","normal","minor","trivial","enhancement"].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="bl-filter-select-wrap">
              <select className="bl-filter-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="">Priority: All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bl-card">
            {filtered.length === 0 ? (
              <div className="bl-empty">No bugs found.</div>
            ) : (
              <table className="bl-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Severity</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Created By</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id}>
                      <td className="bl-bug-title">{b.title}</td>

                      <td>
                        <span className={`bl-badge bl-sev-${b.severity}`}>
                          {b.severity?.charAt(0).toUpperCase() + b.severity?.slice(1)}
                        </span>
                      </td>

                      <td>
                        <span className={`bl-badge bl-pri-${b.priority}`}>
                          {b.priority?.charAt(0).toUpperCase() + b.priority?.slice(1)}
                        </span>
                      </td>

                      <td>
                        <span className={`bl-badge bl-sta-${b.status}`}>
                          {b.status === "in-progress" ? "In Progress"
                            : b.status === "under-review" ? "Under Review"
                            : b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                        </span>
                      </td>

                      <td>
                        <div className="bl-user">
                          <div className="bl-avatar">{getInitials(b.assignedUser?.name)}</div>
                          {b.assignedUser?.name || <span style={{ color: "#94a3b8" }}>Unassigned</span>}
                        </div>
                      </td>

                      <td>
                        <div className="bl-user">
                          <div className="bl-avatar">{getInitials(b.createdBy?.name)}</div>
                          {b.createdBy?.name || "—"}
                        </div>
                      </td>

                      <td style={{ color: "#64748b", fontSize: 13 }}>{formatDate(b.createdAt)}</td>

                      <td>
                        <Link to={`/bugs/${b.id}`} className="bl-details-link">
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </main>
      </div>
    </>
  );
}