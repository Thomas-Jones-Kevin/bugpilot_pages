import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useBugs } from "../context/BugContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { bugs } = useBugs();

  const total      = bugs.length;
  const open       = bugs.filter((b) => b.status === "open").length;
  const inProgress = bugs.filter((b) => b.status === "in-progress").length;
  const resolved   = bugs.filter((b) => b.status === "resolved").length;
  const critical   = bugs.filter((b) => b.severity === "critical" || b.severity === "blocker").length;
  const myBugs     = bugs.filter((b) => b.assignedTo?._id === user?._id);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p style={{ color:"#888", fontSize:"0.9rem" }}>
              Welcome back, <strong>{user?.name}</strong> —{" "}
              <span style={{ background:"#e8f4fd", color:"#2980b9", padding:"0.2rem 0.6rem", borderRadius:"20px", fontSize:"0.8rem" }}>
                {user?.role?.toUpperCase()}
              </span>
            </p>
          </div>
          {["qa","admin"].includes(user?.role) && (
            <Link to="/bugs/new" className="btn btn-primary">+ Report Bug</Link>
          )}
        </div>

        <div className="stats-grid">
          {[
            { label:"Total Bugs",  value: total,      color:"#4f8ef7" },
            { label:"Open",        value: open,       color:"#e74c3c" },
            { label:"In Progress", value: inProgress, color:"#e67e22" },
            { label:"Resolved",    value: resolved,   color:"#2ecc71" },
            { label:"Critical",    value: critical,   color:"#c0392b" },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
          <div className="card">
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"1rem" }}>
              <h3>Recent Bugs</h3>
              <Link to="/bugs" style={{ fontSize:"0.85rem", color:"#4f8ef7", textDecoration:"none" }}>View all</Link>
            </div>
            {bugs.slice(0,5).map((b) => (
              <Link to={`/bugs/${b._id}`} key={b._id} style={{ textDecoration:"none", color:"inherit" }}>
                <div style={{ padding:"0.7rem 0", borderBottom:"1px solid #f0f0f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:"0.9rem" }}>{b.title}</div>
                    <div style={{ fontSize:"0.78rem", color:"#aaa" }}>{b.createdBy?.name}</div>
                  </div>
                  <span className={`badge badge-${b.severity}`}>{b.severity}</span>
                </div>
              </Link>
            ))}
            {bugs.length === 0 && <p style={{ color:"#aaa", fontSize:"0.9rem" }}>No bugs reported yet.</p>}
          </div>

          {user?.role === "developer" ? (
            <div className="card">
              <h3 style={{ marginBottom:"1rem" }}>My Assigned Bugs</h3>
              {myBugs.length === 0
                ? <p style={{ color:"#aaa", fontSize:"0.9rem" }}>No bugs assigned to you.</p>
                : myBugs.map((b) => (
                  <Link to={`/bugs/${b._id}`} key={b._id} style={{ textDecoration:"none", color:"inherit" }}>
                    <div style={{ padding:"0.7rem 0", borderBottom:"1px solid #f0f0f0", display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontWeight:600, fontSize:"0.9rem" }}>{b.title}</span>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </div>
                  </Link>
                ))
              }
            </div>
          ) : (
            <div className="card">
              <h3 style={{ marginBottom:"1rem" }}>Quick Links</h3>
              {[
                { to:"/bugs",     label:"📋 Bug List",    desc:"View all reported bugs" },
                { to:"/board",    label:"📌 Task Board",  desc:"Kanban view of all bugs" },
                { to:"/bugs/new", label:"➕ Report Bug",  desc:"Submit a new bug",      hide: user?.role === "developer" },
                { to:"/admin",    label:"⚙️ Admin Panel", desc:"Manage users & roles",  hide: user?.role !== "admin" },
              ].filter((l) => !l.hide).map((l) => (
                <Link to={l.to} key={l.to} style={{ textDecoration:"none", color:"inherit" }}>
                  <div style={{ padding:"0.7rem 0", borderBottom:"1px solid #f0f0f0" }}>
                    <div style={{ fontWeight:600, fontSize:"0.9rem" }}>{l.label}</div>
                    <div style={{ fontSize:"0.78rem", color:"#aaa" }}>{l.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}