import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const INITIAL_BUGS = [
  { _id:"1", title:"Login page crashes on Safari",  severity:"critical",    status:"open",         assignedTo:{ name:"Dev User" } },
  { _id:"2", title:"Button color wrong on hover",   severity:"trivial",     status:"resolved",     assignedTo:{ name:"Dev User" } },
  { _id:"3", title:"Table overflows on mobile",     severity:"major",       status:"in-progress",  assignedTo:null },
  { _id:"4", title:"Add dark mode support",         severity:"enhancement", status:"open",         assignedTo:null },
  { _id:"5", title:"App freezes on file upload",    severity:"blocker",     status:"under-review", assignedTo:{ name:"Dev User" } },
  { _id:"6", title:"Typo in settings page label",   severity:"trivial",     status:"open",         assignedTo:{ name:"Dev User" } },
  { _id:"7", title:"Password reset email not sent", severity:"critical",    status:"in-progress",  assignedTo:{ name:"Dev User" } },
  { _id:"8", title:"404 error on profile page",     severity:"major",       status:"open",         assignedTo:null },
];

const COLUMNS = [
  { key:"open",         label:"🔴 Open" },
  { key:"in-progress",  label:"🟡 In Progress" },
  { key:"under-review", label:"🔵 Under Review" },
  { key:"resolved",     label:"🟢 Resolved" },
];

export default function TaskBoard() {
  const [bugs, setBugs] = useState(INITIAL_BUGS);

  const moveCard = (bugId, newStatus) => {
    setBugs((prev) => prev.map((b) => b._id === bugId ? { ...b, status: newStatus } : b));
    toast.success("Status updated");
  };

  const bugsByStatus = (status) => bugs.filter((b) => b.status === status);

  return (
    <>
      <Navbar />
      <div style={{ padding:"2rem 1.5rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", maxWidth:1400, margin:"0 auto 1.5rem" }}>
          <h1 style={{ fontSize:"1.6rem", fontWeight:700 }}>Task Board</h1>
          <span style={{ color:"#888", fontSize:"0.9rem" }}>{bugs.length} total bugs</span>
        </div>

        <div className="kanban" style={{ maxWidth:1400, margin:"0 auto" }}>
          {COLUMNS.map((col) => (
            <div key={col.key} className="kanban-col">
              <div className="kanban-col-title">
                {col.label}
                <span style={{ marginLeft:"0.5rem", background:"#e0e0e0", borderRadius:"20px", padding:"0.1rem 0.6rem", fontSize:"0.75rem" }}>
                  {bugsByStatus(col.key).length}
                </span>
              </div>

              {bugsByStatus(col.key).map((bug) => (
                <div key={bug._id} className="kanban-card">
                  <div className="kanban-card-title">
                    <Link to={`/bugs/${bug._id}`} style={{ textDecoration:"none", color:"inherit" }}>
                      {bug.title}
                    </Link>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.6rem" }}>
                    <span className={`badge badge-${bug.severity}`}>{bug.severity}</span>
                    <span style={{ fontSize:"0.75rem", color:"#aaa" }}>{bug.assignedTo?.name || "Unassigned"}</span>
                  </div>
                  <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                    {COLUMNS.filter((c) => c.key !== col.key).map((c) => (
                      <button key={c.key} onClick={() => moveCard(bug._id, c.key)}
                        style={{ fontSize:"0.7rem", padding:"0.2rem 0.5rem", border:"1px solid #ddd", borderRadius:4, background:"#f8f9fa", cursor:"pointer" }}>
                        → {c.label.split(" ")[1]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {bugsByStatus(col.key).length === 0 && (
                <div style={{ textAlign:"center", color:"#ccc", fontSize:"0.85rem", padding:"2rem 0" }}>
                  No bugs here
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}