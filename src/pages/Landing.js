import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    min-height: 100vh;
    background: #0a1628;
    color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
  }

  /* ── circuit board background ── */
  .lp-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  /* subtle radial glow behind hero */
  .lp-glow {
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(37,99,235,0.22) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── NAVBAR ── */
  .lp-nav {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 3rem;
    height: 64px;
    background: rgba(10, 22, 40, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .lp-nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.25rem;
    font-weight: 800;
    color: #fff;
    text-decoration: none;
    letter-spacing: -0.3px;
  }

  .lp-nav-brand-icon {
    width: 32px;
    height: 32px;
    background: #2563eb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .lp-nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lp-btn-ghost {
    padding: 8px 22px;
    border: 1.5px solid rgba(255,255,255,0.25);
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .lp-btn-ghost:hover {
    border-color: rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.06);
  }

  .lp-btn-primary {
    padding: 8px 22px;
    background: #2563eb;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    box-shadow: 0 4px 14px rgba(37,99,235,0.4);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .lp-btn-primary:hover {
    background: #1d4ed8;
    box-shadow: 0 6px 20px rgba(37,99,235,0.5);
    transform: translateY(-1px);
  }

  /* ── HERO ── */
  .lp-hero {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 90px 2rem 70px;
  }

  .lp-hero h1 {
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -1.5px;
    color: #ffffff;
    margin-bottom: 0;
  }

  .lp-hero h1 .blue {
    color: #38bdf8;
    display: block;
  }

  .lp-hero p {
    color: #94a3b8;
    font-size: 1.1rem;
    max-width: 520px;
    margin: 20px auto 36px;
    line-height: 1.7;
  }

  .lp-hero-btns {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .lp-hero-btn-primary {
    padding: 14px 32px;
    background: #2563eb;
    border: none;
    border-radius: 50px;
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(37,99,235,0.45);
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .lp-hero-btn-primary:hover {
    background: #1d4ed8;
    box-shadow: 0 6px 28px rgba(37,99,235,0.55);
    transform: translateY(-2px);
  }

  .lp-hero-btn-outline {
    padding: 14px 32px;
    border: 2px solid rgba(56,189,248,0.5);
    border-radius: 50px;
    color: #38bdf8;
    font-size: 1rem;
    font-weight: 700;
    text-decoration: none;
    background: transparent;
    transition: border-color 0.2s, background 0.2s, transform 0.1s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .lp-hero-btn-outline:hover {
    border-color: #38bdf8;
    background: rgba(56,189,248,0.08);
    transform: translateY(-2px);
  }

  /* ── FEATURE CARDS ── */
  .lp-features {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
    max-width: 1050px;
    margin: 0 auto;
    padding: 0 2rem 80px;
  }

  .lp-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 32px 28px 28px;
    text-align: center;
    backdrop-filter: blur(8px);
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    animation: fadeUp 0.5s ease both;
  }

  .lp-card:nth-child(1) { animation-delay: 0.1s; }
  .lp-card:nth-child(2) { animation-delay: 0.2s; }
  .lp-card:nth-child(3) { animation-delay: 0.3s; }
  .lp-card:nth-child(4) { animation-delay: 0.4s; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lp-card:hover {
    border-color: rgba(56,189,248,0.3);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(37,99,235,0.15);
  }

  .lp-card-icon {
    width: 90px;
    height: 90px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    background: rgba(255,255,255,0.04);
    border-radius: 16px;
  }

  .lp-card h3 {
    font-size: 1.05rem;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 10px;
    letter-spacing: -0.2px;
  }

  .lp-card p {
    color: #94a3b8;
    font-size: 0.875rem;
    line-height: 1.65;
  }

  /* ── FOOTER ── */
  .lp-footer {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 24px 2rem;
    border-top: 1px solid rgba(255,255,255,0.07);
    color: #475569;
    font-size: 0.82rem;
  }

  @media (max-width: 640px) {
    .lp-nav { padding: 0 1.25rem; }
    .lp-hero { padding: 60px 1.25rem 50px; }
    .lp-features { padding: 0 1.25rem 60px; }
  }
`;

const features = [
  {
    emoji: "🤖",
    title: "AI Severity Prediction",
    desc: "Automatically predicts bug severity from description using advanced AI models.",
  },
  {
    emoji: "👥",
    title: "Role-Based Access",
    desc: "Admin, Developer and QA roles with different permissions for secure workflows.",
  },
  {
    emoji: "📋",
    title: "Kanban Board",
    desc: "Visual task board to track bugs across Open, In Progress, Review, Resolved stages.",
  },
  {
    emoji: "📊",
    title: "Analytics Dashboard",
    desc: "Real-time workload and bug statistics across your entire team.",
  },
];

export default function Landing() {
  return (
    <>
      <style>{styles}</style>
      <div className="lp-root">
        <div className="lp-glow" />

        {/* ── NAVBAR ── */}
        <nav className="lp-nav">
          <Link to="/" className="lp-nav-brand">
            <div className="lp-nav-brand-icon">🐛</div>
            BugPilot
          </Link>
          <div className="lp-nav-actions">
            <Link to="/login"    className="lp-btn-ghost">Login</Link>
            <Link to="/register" className="lp-btn-primary">Get Started</Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <h1>
            Smart Bug Triaging
            <span className="blue">Powered by BugPilot</span>
          </h1>
          <p>
            Automatically predict bug severity and assign to the right developer.
            Assign, track, and resolve bugs faster than ever.
          </p>
          <div className="lp-hero-btns">
            <Link to="/register" className="lp-hero-btn-primary">Get Started Free</Link>
            <Link to="/login"    className="lp-hero-btn-outline">Login</Link>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <div className="lp-features">
          {features.map((f) => (
            <div className="lp-card" key={f.title}>
              <div className="lp-card-icon">{f.emoji}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          © 2026 BugPilot — AI-Powered Bug Management System
        </footer>
      </div>
    </>
  );
}