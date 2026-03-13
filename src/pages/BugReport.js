import { useState } from "react";
import Navbar from "../components/Navbar";
import { useBugs } from "../context/BugContext";

export default function BugReport() {
  const { bugs } = useBugs();
  const [filters, setFilters] = useState({ status:"", severity:"", priority:"" });

  const filtered = bugs.filter((b) => (
    (!filters.status   || b.status   === filters.status) &&
    (!filters.severity || b.severity === filters.severity) &&
    (!filters.priority || b.priority === filters.priority)
  ));

  // ── Stats for report header ──────────────────────────────
  const total      = filtered.length;
  const open       = filtered.filter((b) => b.status === "open").length;
  const inProgress = filtered.filter((b) => b.status === "in-progress").length;
  const resolved   = filtered.filter((b) => b.status === "resolved").length;
  const critical   = filtered.filter((b) => b.severity === "critical" || b.severity === "blocker").length;

  // ── CSV Download ─────────────────────────────────────────
  const downloadCSV = () => {
    const headers = ["ID","Title","Severity","AI Severity","Priority","Status","Assigned To","Created By","Created At"];
    const rows = filtered.map((b) => [
      b._id,
      `"${b.title.replace(/"/g, '""')}"`,
      b.severity,
      b.aiSeverity || "-",
      b.priority,
      b.status,
      b.assignedTo?.name || "Unassigned",
      b.createdBy?.name  || "-",
      new Date(b.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `bugreport_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── HTML/Print Download ───────────────────────────────────
  const downloadHTML = () => {
    const severityColors = {
      blocker:"#c0392b", critical:"#e74c3c", major:"#e67e22",
      normal:"#2980b9", minor:"#27ae60", trivial:"#7f8c8d", enhancement:"#8e44ad"
    };
    const statusColors = {
      "open":"#e74c3c", "in-progress":"#e67e22",
      "under-review":"#2980b9", "resolved":"#27ae60"
    };

    const rows = filtered.map((b) => `
      <tr>
        <td>${b._id?.slice(-6)}</td>
        <td><strong>${b.title}</strong></td>
        <td><span style="background:${severityColors[b.severity]}22;color:${severityColors[b.severity]};padding:2px 8px;border-radius:12px;font-size:12px;font-weight:600">${b.severity}</span></td>
        <td><span style="background:${severityColors[b.aiSeverity] ? severityColors[b.aiSeverity]+"22" : "#eee"};color:${severityColors[b.aiSeverity] || "#888"};padding:2px 8px;border-radius:12px;font-size:12px">${b.aiSeverity || "-"}</span></td>
        <td>${b.priority}</td>
        <td><span style="background:${statusColors[b.status]}22;color:${statusColors[b.status]};padding:2px 8px;border-radius:12px;font-size:12px;font-weight:600">${b.status}</span></td>
        <td>${b.assignedTo?.name || "Unassigned"}</td>
        <td>${b.createdBy?.name || "-"}</td>
        <td>${new Date(b.createdAt).toLocaleDateString()}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Bug Report — ${new Date().toLocaleDateString()}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    h1   { color: #1a1a2e; font-size: 26px; margin-bottom: 4px; }
    p.sub{ color: #888; font-size: 13px; margin-bottom: 24px; }
    .stats { display:flex; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
    .stat  { background:#f8f9fa; border-radius:10px; padding:14px 20px; min-width:100px; }
    .stat .val { font-size:28px; font-weight:700; color:#1a1a2e; }
    .stat .lbl { font-size:11px; color:#888; margin-top:2px; }
    table  { width:100%; border-collapse:collapse; font-size:13px; }
    th     { background:#1a1a2e; color:#fff; padding:10px 12px; text-align:left; }
    td     { padding:9px 12px; border-bottom:1px solid #f0f0f0; }
    tr:nth-child(even) td { background:#fafbff; }
    @media print { body { margin:20px; } }
  </style>
</head>
<body>
  <h1>🐛 BugTracker — Bug Report</h1>
  <p class="sub">Generated on ${new Date().toLocaleString()} &nbsp;|&nbsp; Total bugs: ${total}</p>
  <div class="stats">
    <div class="stat"><div class="val" style="color:#4f8ef7">${total}</div><div class="lbl">Total</div></div>
    <div class="stat"><div class="val" style="color:#e74c3c">${open}</div><div class="lbl">Open</div></div>
    <div class="stat"><div class="val" style="color:#e67e22">${inProgress}</div><div class="lbl">In Progress</div></div>
    <div class="stat"><div class="val" style="color:#2ecc71">${resolved}</div><div class="lbl">Resolved</div></div>
    <div class="stat"><div class="val" style="color:#c0392b">${critical}</div><div class="lbl">Critical</div></div>
  </div>
  <table>
    <thead>
      <tr><th>ID</th><th>Title</th><th>Severity</th><th>AI Severity</th><th>Priority</th><th>Status</th><th>Assigned To</th><th>Created By</th><th>Date</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `bugreport_${new Date().toISOString().slice(0,10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">📄 Bug Report</h1>
            <p style={{ color:"#888", fontSize:"0.9rem" }}>Filter and download the bug list as CSV or HTML</p>
          </div>
          <div style={{ display:"flex", gap:"0.8rem" }}>
            <button className="btn btn-outline" onClick={downloadCSV}>⬇ Download CSV</button>
            <button className="btn btn-primary" onClick={downloadHTML}>⬇ Download HTML Report</button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="under-review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={filters.severity} onChange={(e) => setFilters({ ...filters, severity: e.target.value })}>
            <option value="">All Severity</option>
            {["blocker","critical","major","normal","minor","trivial","enhancement"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {(filters.status || filters.severity || filters.priority) && (
            <button className="btn btn-outline btn-sm"
              onClick={() => setFilters({ status:"", severity:"", priority:"" })}>
              ✕ Clear Filters
            </button>
          )}
        </div>

        {/* Summary Stats */}
        <div className="stats-grid" style={{ marginBottom:"1.5rem" }}>
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

        {/* Preview Table */}
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <h3>Preview ({filtered.length} bugs)</h3>
            <span style={{ fontSize:"0.8rem", color:"#aaa" }}>This is a preview of what will be downloaded</span>
          </div>
          <div className="table-wrap">
            {filtered.length === 0 ? (
              <p style={{ padding:"2rem", textAlign:"center", color:"#aaa" }}>No bugs match the selected filters.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Title</th><th>Severity</th><th>AI Severity</th>
                    <th>Priority</th><th>Status</th><th>Assigned To</th><th>Created By</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b._id}>
                      <td style={{ color:"#aaa", fontSize:"0.8rem" }}>#{b._id?.slice(-6)}</td>
                      <td style={{ fontWeight:600, maxWidth:200 }}>{b.title}</td>
                      <td><span className={`badge badge-${b.severity}`}>{b.severity}</span></td>
                      <td>
                        {b.aiSeverity
                          ? <span className={`badge badge-${b.aiSeverity}`}>🤖 {b.aiSeverity}</span>
                          : <span style={{ color:"#aaa", fontSize:"0.8rem" }}>—</span>
                        }
                      </td>
                      <td><span className={`badge badge-${b.priority==="high"?"critical":b.priority==="medium"?"major":"trivial"}`}>{b.priority}</span></td>
                      <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                      <td>{b.assignedTo?.name || <span style={{ color:"#aaa" }}>Unassigned</span>}</td>
                      <td>{b.createdBy?.name || "—"}</td>
                      <td style={{ color:"#aaa", fontSize:"0.8rem" }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}