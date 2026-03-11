import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useBugs } from "../context/BugContext";  

export default function AdminPanel() {
  const { user, getAllUsers }  = useAuth();
  const { bugs } = useBugs();
  const [users, setUsers] = useState([]);

  useEffect(() => {
      const fetchUsers = async () => {
        try {
          const data = await getAllUsers();
          // Fallback to empty array if data is undefined
          setUsers(data || []); 
        } catch (err) {
          console.error("Failed to fetch users:", err);
          setUsers([]); // Safeguard on error
        }
      };
      fetchUsers();
    },[])

  const changeRole = (userId, role) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
    toast.success("Role updated");
  };

  const deleteUser = (userId) => {
    if (!window.confirm("Delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.success("User deleted");
  };

  const devWorkload = users
    .filter((u) => u.role === "developer")
    .map((u) => ({
      ...u,
      count: bugs.filter((b) => b.assignedUser?.id === u.id && b.status !== "resolved").length,
    }))
    .sort((a,b) => b.count - a.count);

  const totalBugs    = bugs.length;
  const openBugs     = bugs.filter((b) => b.status === "open").length;
  const resolvedBugs = bugs.filter((b) => b.status === "resolved").length;

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
                    <tr key={u.id}>
                      <td style={{ fontWeight:600 }}>{u.name}</td>
                      <td style={{ color:"#888", fontSize:"0.85rem" }}>{u.email}</td>
                      <td>
                        <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}
                          style={{ padding:"0.3rem 0.6rem", border:"1.5px solid #ddd", borderRadius:6, fontSize:"0.8rem" }}>
                          <option value="developer">Developer</option>
                          <option value="qa">QA</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom:"1rem" }}>Developer Workload</h3>
            {devWorkload.map((dev) => (
              <div key={dev.id} style={{ marginBottom:"1rem" }}>
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