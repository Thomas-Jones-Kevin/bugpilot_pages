import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .login-root {
    display: flex;
    height: 100vh;
    width: 100vw;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }

  /* ── LEFT PANEL ── */
  .login-left {
    width: 48%;
    background: #0d1b2e;
    position: relative;
    overflow: hidden;
  }

  .login-robot {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  /* ── RIGHT PANEL ── */
  .login-right {
    flex: 1;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }

  .login-form-wrapper {
    width: 100%;
    max-width: 420px;
  }

  .login-heading {
    font-size: 30px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px 0;
    letter-spacing: -0.5px;
  }

  .login-sub {
    font-size: 15px;
    color: #64748b;
    margin: 0 0 32px 0;
  }

  .login-field {
    margin-bottom: 20px;
  }

  .login-field label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .login-field input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 15px;
    color: #0f172a;
    background: #f8fafc;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    font-family: 'Inter', sans-serif;
  }

  .login-field input:focus {
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .login-field input::placeholder {
    color: #94a3b8;
  }

  .login-btn {
    width: 100%;
    padding: 14px;
    background: #2563eb;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 8px;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.1px;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  }

  .login-btn:hover:not(:disabled) {
    background: #1d4ed8;
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
    transform: translateY(-1px);
  }

  .login-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    color: #94a3b8;
    font-size: 13px;
  }

  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  .login-social {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .login-social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    background: #ffffff;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .login-social-btn:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .login-social-btn svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .login-register {
    text-align: center;
    margin-top: 28px;
    font-size: 14px;
    color: #64748b;
  }

  .login-register a {
    color: #2563eb;
    font-weight: 700;
    text-decoration: none;
  }

  .login-register a:hover {
    text-decoration: underline;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .login-left { display: none; }
    .login-right { padding: 32px 24px; }
  }
`;

export default function Login() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">

        {/* ── LEFT PANEL ── */}
        <div className="login-left">
          
          <img
            src="/login_robot.png"
            alt="BugPilot robot mascot"
            className="login-robot"
          />

          <div className="login-tagline">
            <strong>Track Bugs. Ship Fast.</strong>
            <span>- Welcome to BugPilot.</span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <h2 className="login-heading">Welcome Back 👋</h2>
            <p className="login-sub">Login to your BugPilot account.</p>

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="login-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              <button className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="login-register">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}