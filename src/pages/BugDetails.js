/* eslint-disable */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useBugs } from "../context/BugContext";

export default function BugDetails() {
  const { id: stringId } = useParams();
  const id = Number(stringId);

  const [users, setUsers] = useState([]);
  const { user, getAllUsersType }  = useAuth();
  const { getBugById, updateBugStatus, assignBug, addComment } = useBugs();

  const bug = getBugById(id);
  const [comment, setComment] = useState("");
  console.log(bug)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsersType("developer");
        // Fallback to empty array if data is undefined
        setUsers(data || []); 
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]); // Safeguard on error
      }
    };
    fetchUsers();
  },[])

  if (!bug) return (
    <>
      <Navbar />
      <div className="page"><div className="card"><p style={{ color:"#aaa" }}>Bug not found.</p></div></div>
    </>
  );

  const changeStatus = (status) => {
    updateBugStatus(id, status);
    toast.success("Status updated");
  };

  const handleAssign = (userId) => {
    console.log(userId)
    const found = users.find((u) => u.id == userId) || null;
    assignBug(id, found);
    toast.success(found ? `Assigned to ${found.name}` : "Unassigned");
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(id, { user:{ name: user?.name }, text: comment, createdAt: new Date() });
    setComment("");
    toast.success("Comment added");
  };

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth:900 }}>
        <div style={{ marginBottom:"1.5rem" }}>
          <div style={{ display:"flex", gap:"0.6rem", marginBottom:"0.6rem", flexWrap:"wrap" }}>
            <span className={`badge badge-${bug.severity}`}>{bug.severity}</span>
            <span className={`badge badge-${bug.status}`}>{bug.status}</span>
            <span className={`badge badge-${bug.priority==="high"?"critical":"normal"}`}>{bug.priority} priority</span>
          </div>
          <h1 style={{ fontSize:"1.6rem", fontWeight:700 }}>{bug.title}</h1>
          <p style={{ color:"#888", fontSize:"0.85rem", marginTop:"0.3rem" }}>
            Reported by <strong>{bug.createdBy?.name}</strong> · {new Date(bug.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:"1.5rem" }}>
          <div>
            <div className="card" style={{ marginBottom:"1rem" }}>
              <h3 style={{ marginBottom:"0.8rem" }}>Description</h3>
              <p style={{ lineHeight:1.7, color:"#444" }}>{bug.description}</p>
            </div>

            {bug.aiSeverity && (
              <div className="card" style={{ marginBottom:"1rem", background:"#f0e6ff", border:"1px solid #d4b3ff" }}>
                <h3 style={{ marginBottom:"0.4rem", color:"#8e44ad" }}>🤖 AI Predicted Severity</h3>
                <span className={`badge badge-${bug.aiSeverity}`} style={{ fontSize:"1rem" }}>{bug.aiSeverity}</span>
                <p style={{ fontSize:"0.8rem", color:"#888", marginTop:"0.5rem" }}>Predicted by DistilBERT model</p>
              </div>
            )}

            <div className="card">
              <h3 style={{ marginBottom:"1rem" }}>Comments ({bug.comments?.length || 0})</h3>
              {bug.comments?.map((c, i) => (
                <div key={i} style={{ padding:"0.8rem 0", borderBottom:"1px solid #f0f0f0" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3rem" }}>
                    <strong style={{ fontSize:"0.85rem" }}>{c.user?.name}</strong>
                    <span style={{ fontSize:"0.75rem", color:"#aaa" }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize:"0.9rem", color:"#444" }}>{c.text}</p>
                </div>
              ))}
              <form onSubmit={handleComment} style={{ marginTop:"1rem", display:"flex", gap:"0.6rem" }}>
                <input value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  style={{ flex:1, padding:"0.6rem 0.9rem", border:"1.5px solid #ddd", borderRadius:8, outline:"none" }} />
                <button className="btn btn-primary" type="submit">Post</button>
              </form>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div className="card">
              <h4 style={{ marginBottom:"0.8rem" }}>Change Status</h4>
              {["open","in-progress","under-review","resolved"].map((s) => (
                <button key={s} onClick={() => changeStatus(s)}
                  className={`btn btn-sm ${bug.status.toLowerCase() === s?"btn-primary":"btn-outline"}`}
                  style={{ display:"block", width:"100%", marginBottom:"0.5rem", textAlign:"left" }}>
                  {s.replace("-"," ").replace(/\b\w/g,(l)=>l.toUpperCase())}
                </button>
              ))}
            </div>

            {["admin","qa"].includes(user?.role) && (
              <div className="card">
                <h4 style={{ marginBottom:"0.8rem" }}>Assign To</h4>
                <select onChange={(e) => handleAssign(e.target.value)}
                  defaultValue={bug.assignedUser?.id || ""}
                  style={{ width:"100%", padding:"0.6rem", border:"1.5px solid #ddd", borderRadius:8, outline:"none" }}>
                  <option value="">Unassigned</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                {bug.assignedUser && <p style={{ marginTop:"0.5rem", fontSize:"0.82rem", color:"#555" }}>Currently: <strong>{bug.assignedUser.name}</strong></p>}
              </div>
            )}

            <div className="card">
              <h4 style={{ marginBottom:"0.8rem" }}>Bug Info</h4>
              {[
                { label:"ID",       value: bug.id },
                { label:"Priority", value: bug.priority },
                { label:"Created",  value: new Date(bug.createdAt).toLocaleDateString() },
                { label:"Updated",  value: new Date(bug.updatedAt).toLocaleDateString() },
              ].map((i) => (
                <div key={i.label} style={{ display:"flex", justifyContent:"space-between", padding:"0.4rem 0", borderBottom:"1px solid #f5f5f5", fontSize:"0.85rem" }}>
                  <span style={{ color:"#888" }}>{i.label}</span>
                  <span style={{ fontWeight:600 }}>{i.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}