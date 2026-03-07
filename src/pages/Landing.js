import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1a1a2e,#16213e)", color:"#fff" }}>

      {/* Navbar */}
      <nav style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.2rem 3rem" }}>
        <span style={{ fontSize:"1.4rem", fontWeight:700, color:"#4f8ef7" }}>🐛 BugPilot</span>
        <div style={{ display:"flex", gap:"1rem" }}>
          <Link to="/login"    style={{ color:"#ccc", textDecoration:"none" }}>Login</Link>
          <Link to="/register" style={{ background:"#4f8ef7", color:"#fff", padding:"0.45rem 1.2rem", borderRadius:"8px", textDecoration:"none" }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign:"center", padding:"5rem 2rem 3rem" }}>
        <h1 style={{ fontSize:"3rem", fontWeight:800, marginBottom:"1rem", lineHeight:1.2 }}>
          Smart Bug Triaging<br />
          <span style={{ color:"#4f8ef7" }}>Powered by BugPilot</span>
        </h1>
        <p style={{ color:"#aaa", fontSize:"1.15rem", maxWidth:"500px", margin:"0 auto 2rem" }}>
          Automatically predict bug severity and assign to the right developer. Assign, track, and resolve bugs faster than ever.
        </p>
        <div style={{ display:"flex", gap:"1rem", justifyContent:"center" }}>
          <Link to="/register" style={{ background:"#4f8ef7", color:"#fff", padding:"0.8rem 2rem", borderRadius:"10px", textDecoration:"none", fontWeight:600, fontSize:"1rem" }}>
            Get Started Free
          </Link>
          <Link to="/login" style={{ border:"2px solid #4f8ef7", color:"#4f8ef7", padding:"0.8rem 2rem", borderRadius:"10px", textDecoration:"none", fontWeight:600, fontSize:"1rem" }}>
            Login
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1.5rem", maxWidth:"900px", margin:"3rem auto", padding:"0 2rem" }}>
        {[
          { icon:"🤖", title:"AI Severity Prediction",  desc:"Automatically predicts bug severity from description using DistilBERT" },
          { icon:"👥", title:"Role-Based Access",       desc:"Admin, Developer and QA roles with different permissions" },
          { icon:"📋", title:"Kanban Board",            desc:"Visual task board to track bugs across Open, In Progress, Review, Resolved" },
          { icon:"📊", title:"Analytics Dashboard",     desc:"Real-time workload and bug statistics for your team" },
        ].map((f) => (
          <div key={f.title} style={{ background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"1.5rem", textAlign:"center" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:"0.8rem" }}>{f.icon}</div>
            <h3 style={{ marginBottom:"0.5rem", fontSize:"1rem" }}>{f.title}</h3>
            <p style={{ color:"#aaa", fontSize:"0.85rem", lineHeight:1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center", padding:"2rem", borderTop:"1px solid rgba(255,255,255,0.08)", marginTop:"2rem", color:"#555", fontSize:"0.85rem" }}>
        © 2025 BugTracker — AI-Powered Bug Management System
      </div>

    </div>
  );
}