import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const MOCK_USERS_INIT = [
  { _id:"1", name:"Admin User",  email:"admin@test.com", role:"admin" },
  { _id:"2", name:"Dev User",    email:"dev@test.com",   role:"developer" },
  { _id:"3", name:"Dev Smith",   email:"smith@test.com", role:"developer" },
  { _id:"4", name:"QA Tester",   email:"qa@test.com",    role:"qa" },
  { _id:"5", name:"QA Jones",    email:"jones@test.com", role:"qa" },
];

const MOCK_BUGS = [
  { _id:"1", status:"open",         assignedTo:{ _id:"2" } },
  { _id:"2", status:"resolved",     assignedTo:{ _id:"2" } },
  { _id:"3", status:"in-progress",  assignedTo:{ _id:"3" } },
  { _id:"4", status:"open",         assignedTo:null },
  { _id:"5", status:"under-review", assignedTo:{ _id:"2" } },
  { _id:"6", status:"open",         assignedTo:{ _id:"2" } },
  { _id:"7", status:"in-progress",  assignedTo:{ _id:"3" } },
  { _id:"8", status:"open",         assignedTo:{ _id:"3" } },
];

export default function AdminPanel() {
  const [users, setUsers] = useState(MOCK_USERS_INIT);

  const changeRole = (userId, role) => {
    setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role } : u));
    toast.success("Role updated");
  };

  const deleteUser = (userId) => {
    if (!window.confirm("Delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u._id !== userId));
    toast.success("User deleted");
  };

  const devWorkload = users
    .filter((u) => u.role === "developer")
    .map((u) => ({
      ...u,
      count: MOCK_BUGS.filter((b) => b.assignedTo?._id === u._id && b.status !== "resolved").length,
    }))
    .sort((a,b) => b.count - a.count);

  const totalBugs    = MOCK_BUGS.length;
  const openBugs     = MOCK_BUGS.filter((b) => b.status === "open").length;
  const resolvedBugs = MOCK_BUGS.filter((b) => b.status === "resolved").length;

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">⚙️ Admin Panel</h1>
        </div>

        <div className="stats-grid" style={{ marginBottom:"1.5rem" }}>
          {[
            { label:"Total Users",   value: users.length,                                   color:"#4f8ef7" },
            { label:"Developers",    value: users.filter((u)=>u.role==="developer").length,  color:"#2ecc71" },
            { label:"QA Testers",    value: users.filter((u)=>u.role==="qa").length,         color:"#e67e22" },
            { label:"Total Bugs",    value: totalBugs,    color:"#e74c3c" },
            { label:"Open Bugs",     value: openBugs,     color:"#c0392b" },
            { label:"Resolved Bugs", value: resolvedBugs, color:"#27ae60" },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
          <div className="card">
            <h3 style={{ marginBottom:"1rem" }}>Manage Users</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight:600 }}>{u.name}</td>
                      <td style={{ color:"#888", fontSize:"0.85rem" }}>{u.email}</td>
                      <td>
                        <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}
                          style={{ padding:"0.3rem 0.6rem", border:"1.5px solid #ddd", borderRadius:6, fontSize:"0.8rem" }}>
                          <option value="developer">Developer</option>
                          <option value="qa">QA</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom:"1rem" }}>Developer Workload</h3>
            {devWorkload.map((dev) => (
              <div key={dev._id} style={{ marginBottom:"1rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3rem" }}>
                  <span style={{ fontWeight:600, fontSize:"0.9rem" }}>{dev.name}</span>
                  <span style={{ fontSize:"0.85rem", color:"#888" }}>{dev.count} active bugs</span>
                </div>
                <div style={{ background:"#f0f2f5", borderRadius:20, height:8, overflow:"hidden" }}>
                  <div style={{
                    width:`${Math.min((dev.count/10)*100,100)}%`,
                    background: dev.count>7?"#e74c3c":dev.count>4?"#e67e22":"#2ecc71",
                    height:"100%", borderRadius:20, transition:"width 0.3s"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}