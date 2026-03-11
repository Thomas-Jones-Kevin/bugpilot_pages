import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {useBugs} from "../context/BugContext";

const COLUMNS = [
  { key:"open",         label:"🔴 Open" },
  { key:"in-progress",  label:"🟡 In Progress" },
  { key:"under-review", label:"🔵 Under Review" },
  { key:"resolved",     label:"🟢 Resolved" },
];

export default function TaskBoard() {
  const {bugs} = useBugs();

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
                <div key={bug.id} className="kanban-card">
                  <div className="kanban-card-title">
                    <Link to={`/bugs/${bug.id}`} style={{ textDecoration:"none", color:"inherit" }}>
                      {bug.title}
                    </Link>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.6rem" }}>
                    <span className={`badge badge-${bug.severity}`}>{bug.severity}</span>
                    <span style={{ fontSize:"0.75rem", color:"#aaa" }}>{bug.assignedUser?.name || "Unassigned"}</span>
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