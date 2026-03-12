import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useBugs } from "../context/BugContext";

export default function Profile() {
  const { id }   = useParams();
  const { user } = useAuth();
  const { getAllBugsByUserId } = useBugs();

  const profileData   = user;
  const [profile,     setProfile]   = useState(profileData);
  const [skills,      setSkills]    = useState(profileData.skills || []);
  const [skillInput,  setSkillInput] = useState("");
  const assignedBugs  = getAllBugsByUserId(user.id);

  const workload = {
    open:           assignedBugs.filter((b) => b.status==="open").length,
    "in-progress":  assignedBugs.filter((b) => b.status==="in-progress").length,
    "under-review": assignedBugs.filter((b) => b.status==="under-review").length,
    resolved:       assignedBugs.filter((b) => b.status==="resolved").length,
  };

  const isOwn = user?.id === id;

  const addSkill = () => {
    if (!skillInput.trim() || skills.includes(skillInput.trim())) return;
    setSkills((prev) => [...prev, skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (s) => setSkills((prev) => prev.filter((sk) => sk !== s));

  const saveSkills = () => {
    setProfile((prev) => ({ ...prev, skills }));
    toast.success("Skills updated!");
  };

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth:900 }}>
        {/* Header */}
        <div className="card" style={{ marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:"1.5rem" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"#4f8ef7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem", color:"#fff", fontWeight:700, flexShrink:0 }}>
            {profile.name[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize:"1.4rem", fontWeight:700 }}>{profile.name}</h2>
            <p style={{ color:"#888", fontSize:"0.9rem" }}>{profile.email}</p>
            <span style={{ background:"#e8f4fd", color:"#2980b9", padding:"0.2rem 0.8rem", borderRadius:20, fontSize:"0.8rem", fontWeight:600, display:"inline-block", marginTop:"0.3rem" }}>
              {profile.role?.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
          {/* Workload */}
          <div className="card">
            <h3 style={{ marginBottom:"1rem" }}>Workload</h3>
            {[
              { label:"Open",         key:"open",          color:"#e74c3c" },
              { label:"In Progress",  key:"in-progress",   color:"#e67e22" },
              { label:"Under Review", key:"under-review",  color:"#2980b9" },
              { label:"Resolved",     key:"resolved",      color:"#27ae60" },
            ].map((w) => (
              <div key={w.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.5rem 0", borderBottom:"1px solid #f5f5f5" }}>
                <span style={{ fontSize:"0.9rem" }}>{w.label}</span>
                <span style={{ fontWeight:700, color:w.color, fontSize:"1.1rem" }}>{workload[w.key] || 0}</span>
              </div>
            ))}
            <div style={{ marginTop:"0.8rem", display:"flex", justifyContent:"space-between", fontWeight:700 }}>
              <span>Total Assigned</span>
              <span style={{ color:"#4f8ef7" }}>{assignedBugs.length}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 style={{ marginBottom:"1rem" }}>Skills</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem", marginBottom:"1rem" }}>
              {skills.length === 0 && <p style={{ color:"#aaa", fontSize:"0.85rem" }}>No skills added yet.</p>}
              {skills.map((s) => (
                <span key={s} style={{ background:"#e8f4fd", color:"#2980b9", padding:"0.3rem 0.8rem", borderRadius:20, fontSize:"0.82rem", display:"flex", alignItems:"center", gap:"0.4rem" }}>
                  {s}
                  {isOwn && <span onClick={() => removeSkill(s)} style={{ cursor:"pointer", color:"#e74c3c", fontWeight:700 }}>×</span>}
                </span>
              ))}
            </div>
            {isOwn && (
              <>
                <div style={{ display:"flex", gap:"0.5rem" }}>
                  <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add skill (e.g. React, Java)"
                    onKeyDown={(e) => e.key==="Enter" && addSkill()}
                    style={{ flex:1, padding:"0.5rem 0.8rem", border:"1.5px solid #ddd", borderRadius:8, outline:"none", fontSize:"0.85rem" }} />
                  <button className="btn btn-outline btn-sm" onClick={addSkill}>Add</button>
                </div>
                <button className="btn btn-primary btn-sm" style={{ marginTop:"0.8rem", width:"100%" }} onClick={saveSkills}>
                  Save Skills
                </button>
              </>
            )}
          </div>
        </div>

        {/* Assigned Bugs */}
        <div className="card" style={{ marginTop:"1.5rem" }}>
          <h3 style={{ marginBottom:"1rem" }}>Assigned Bugs ({assignedBugs.length})</h3>
          {assignedBugs.length === 0
            ? <p style={{ color:"#aaa" }}>No bugs assigned.</p>
            : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Title</th><th>Severity</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {assignedBugs.map((b) => (
                      <tr key={b.id}>
                        <td style={{ fontWeight:600 }}>{b.title}</td>
                        <td><span className={`badge badge-${b.severity}`}>{b.severity}</span></td>
                        <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                        <td><Link to={`/bugs/${b.id}`} className="btn btn-outline btn-sm">View</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}