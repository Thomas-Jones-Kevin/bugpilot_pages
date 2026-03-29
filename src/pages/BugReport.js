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

  const total      = filtered.length;
  const open       = filtered.filter((b) => b.status === "open").length;
  const inProgress = filtered.filter((b) => b.status === "in-progress").length;
  const resolved   = filtered.filter((b) => b.status === "resolved").length;
  const critical   = filtered.filter((b) => b.severity === "critical" || b.severity === "blocker").length;

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
  <h1>🐛 BugPilot — Bug Report</h1>
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
      {/* ── FIX: push content right past the 240px fixed sidebar ── */}
      <div style={{ marginLeft: "240px", padding: "32px 32px 48px", minHeight: "100vh", background: "#f1f4f8", fontFamily: "'Inter', sans-serif" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, color:"#0f172a", margin:"0 0 4px", letterSpacing:"-0.5px" }}>📄 Bug Report</h1>
            <p style={{ color:"#64748b", fontSize:14, margin:0 }}>Filter and download the bug list as CSV or HTML</p>
          </div>
          <div style={{ display:"flex", gap:"12px" }}>
            <button onClick={downloadCSV}
              style={{ padding:"10px 20px", border:"1.5px solid #2563eb", borderRadius:10, background:"#fff", color:"#2563eb", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              ⬇ Download CSV
            </button>
            <button onClick={downloadHTML}
              style={{ padding:"10px 20px", border:"none", borderRadius:10, background:"#2563eb", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:"0 4px 14px rgba(37,99,235,0.3)" }}>
              ⬇ Download HTML Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:"12px", marginBottom:"24px", flexWrap:"wrap" }}>
          {[
            { val: filters.status,   key:"status",   label:"All Status",   opts:[["open","Open"],["in-progress","In Progress"],["under-review","Under Review"],["resolved","Resolved"]] },
            { val: filters.severity, key:"severity",  label:"All Severity", opts:[["major","Major"],["normal","Normal"],["minor","Minor"],["trivial","Trivial"]] },
            { val: filters.priority, key:"priority",  label:"All Priority", opts:[["high","High"],["normal","Normal"],["low","Low"]] },
          ].map((f) => (
            <select key={f.key} value={f.val}
              onChange={(e) => setFilters({ ...filters, [f.key]: e.target.value })}
              style={{ padding:"9px 14px", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14, color:"#0f172a", background:"#fff", outline:"none", cursor:"pointer" }}>
              <option value="">{f.label}</option>
              {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
          {(filters.status || filters.severity || filters.priority) && (
            <button onClick={() => setFilters({ status:"", severity:"", priority:"" })}
              style={{ padding:"9px 14px", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14, background:"#fff", color:"#64748b", cursor:"pointer" }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Stat Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16, marginBottom:24 }}>
          {[
            { label:"Total Bugs",  value: total,      color:"#2563eb" },
            { label:"Open",        value: open,       color:"#dc2626" },
            { label:"In Progress", value: inProgress, color:"#d97706" },
            { label:"Resolved",    value: resolved,   color:"#16a34a" },
            { label:"Critical",    value: critical,   color:"#7c3aed" },
          ].map((s) => (
            <div key={s.label} style={{ background:"#fff", borderRadius:16, padding:"20px 22px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#64748b", marginBottom:6 }}>{s.label}</div>
              <div style={{ fontSize:36, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Preview Table */}
        <div style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h3 style={{ fontSize:17, fontWeight:700, color:"#0f172a", margin:0 }}>Preview ({filtered.length} bugs)</h3>
            <span style={{ fontSize:13, color:"#94a3b8" }}>This is a preview of what will be downloaded</span>
          </div>

          {filtered.length === 0 ? (
            <p style={{ textAlign:"center", color:"#94a3b8", padding:"32px 0", fontSize:14 }}>No bugs match the selected filters.</p>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13.5 }}>
                <thead>
                  <tr>
                    {["ID","Title","Severity","AI Severity","Priority","Status","Assigned To","Created By","Date"].map((h) => (
                      <th key={h} style={{ textAlign:"left", padding:"0 12px 12px 0", borderBottom:"2px solid #f1f5f9", color:"#94a3b8", fontWeight:600, fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b._id} style={{ borderBottom:"1px solid #f1f5f9" }}>
                      <td style={{ padding:"12px 12px 12px 0", color:"#64748b", fontSize:12 }}>#{b._id?.slice(-6)}</td>
                      <td style={{ padding:"12px 12px 12px 0", fontWeight:600, maxWidth:200 }}>{b.title}</td>
                      <td style={{ padding:"12px 12px 12px 0" }}><span style={{ background:"#fce7e7", color:"#dc2626", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 }}>{b.severity}</span></td>
                      <td style={{ padding:"12px 12px 12px 0" }}>{b.aiSeverity ? <span style={{ background:"#ede9fe", color:"#7c3aed", padding:"3px 10px", borderRadius:20, fontSize:12 }}>🤖 {b.aiSeverity}</span> : <span style={{ color:"#94a3b8" }}>—</span>}</td>
                      <td style={{ padding:"12px 12px 12px 0" }}>{b.priority}</td>
                      <td style={{ padding:"12px 12px 12px 0" }}><span style={{ background:"#dcfce7", color:"#16a34a", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 }}>{b.status}</span></td>
                      <td style={{ padding:"12px 12px 12px 0", color:"#1e293b" }}>{b.assignedTo?.name || <span style={{ color:"#94a3b8" }}>Unassigned</span>}</td>
                      <td style={{ padding:"12px 12px 12px 0", color:"#1e293b" }}>{b.createdBy?.name || "—"}</td>
                      <td style={{ padding:"12px 0 12px 0", color:"#64748b", fontSize:12, whiteSpace:"nowrap" }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  );
}