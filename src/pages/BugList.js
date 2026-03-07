import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useBugs } from "../context/BugContext";

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
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Bug List</h1>
          {["qa","admin"].includes(user?.role) && (
            <Link to="/bugs/new" className="btn btn-primary">+ Report Bug</Link>
          )}
        </div>

        <div className="filters">
          <input placeholder="🔍 Search bugs..." value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ flex:1, minWidth:180 }} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="under-review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="">All Severity</option>
            {["blocker","critical","major","normal","minor","trivial","enhancement"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="card">
          <div className="table-wrap">
            {filtered.length === 0 ? (
              <p style={{ padding:"2rem", textAlign:"center", color:"#aaa" }}>No bugs found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th><th>Severity</th><th>Priority</th>
                    <th>Status</th><th>Assigned To</th><th>Created By</th><th>Date</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight:600, maxWidth:220 }}>{b.title}</td>
                      <td><span className={`badge badge-${b.severity}`}>{b.severity}</span></td>
                      <td><span className={`badge badge-${b.priority==="high"?"critical":b.priority==="medium"?"major":"trivial"}`}>{b.priority}</span></td>
                      <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                      <td>{b.assignedTo?.name || <span style={{ color:"#aaa" }}>Unassigned</span>}</td>
                      <td>{b.createdBy?.name}</td>
                      <td style={{ color:"#aaa", fontSize:"0.8rem" }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td><Link to={`/bugs/${b._id}`} className="btn btn-outline btn-sm">View</Link></td>
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