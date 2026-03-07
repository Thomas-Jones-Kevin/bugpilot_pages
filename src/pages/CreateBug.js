import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useBugs } from "../context/BugContext";

const mockPredict = (description) => {
  const d = description.toLowerCase();
  if (d.includes("crash") || d.includes("freeze") || d.includes("unusable")) return "blocker";
  if (d.includes("error") || d.includes("fail")   || d.includes("broken"))   return "critical";
  if (d.includes("wrong") || d.includes("incorrect") || d.includes("not working")) return "major";
  if (d.includes("feature") || d.includes("request") || d.includes("add"))   return "enhancement";
  if (d.includes("typo") || d.includes("spelling") || d.includes("minor"))   return "trivial";
  return "normal";
};

export default function CreateBug() {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const { addBug }  = useBugs();

  const [form,       setForm]       = useState({ title:"", description:"", severity:"normal", priority:"medium" });
  const [aiSeverity, setAiSeverity] = useState("");
  const [predicting, setPredicting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const predictSeverity = () => {
    if (!form.description.trim()) return toast.warning("Enter a description first");
    setPredicting(true);
    setTimeout(() => {
      const predicted = mockPredict(form.description);
      setAiSeverity(predicted);
      setForm((prev) => ({ ...prev, severity: predicted }));
      toast.success(`AI predicted: ${predicted.toUpperCase()}`);
      setPredicting(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const newBug = addBug({
      ...form,
      aiSeverity,
      screenshots: [],
      createdBy:   { name: user?.name },
      assignedTo:  null,
    });
    toast.success("Bug reported successfully!");
    navigate(`/bugs/${newBug._id}`);
  };

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth:700 }}>
        <div className="page-header">
          <h1 className="page-title">Report a Bug</h1>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Bug Title *</label>
              <input placeholder="Short descriptive title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea placeholder="Describe the bug in detail..." value={form.description} rows={5}
                onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <button type="button" className="btn btn-outline btn-sm" style={{ marginTop:"0.5rem" }}
                onClick={predictSeverity} disabled={predicting}>
                {predicting ? "Predicting..." : "🤖 Predict Severity with AI"}
              </button>
              {aiSeverity && (
                <div style={{ marginTop:"0.5rem", padding:"0.6rem 1rem", background:"#f0e6ff", borderRadius:8, fontSize:"0.85rem" }}>
                  🤖 AI Prediction: <strong><span className={`badge badge-${aiSeverity}`}>{aiSeverity}</span></strong>
                  <span style={{ color:"#888", marginLeft:"0.5rem" }}>(applied to severity below)</span>
                </div>
              )}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <div className="form-group">
                <label>Severity</label>
                <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                  {["blocker","critical","major","normal","minor","trivial","enhancement"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ display:"flex", gap:"1rem", justifyContent:"flex-end" }}>
              <button type="button" className="btn btn-outline" onClick={() => navigate("/bugs")}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Bug"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}