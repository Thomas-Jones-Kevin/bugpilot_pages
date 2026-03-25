import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .reg-root {
    display: flex;
    height: 100vh;
    width: 100vw;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }

  /* ── LEFT PANEL (form) ── */
  .reg-left {
    flex: 1;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 48px;
    overflow-y: auto;
  }

  .reg-form-wrapper {
    width: 100%;
    max-width: 480px;
  }

  .reg-heading {
    font-size: 28px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px 0;
    letter-spacing: -0.5px;
  }

  .reg-sub {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 28px 0;
  }

  /* two-column row */
  .reg-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .reg-field {
    margin-bottom: 16px;
  }

  .reg-field label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 7px;
  }

  .reg-field input,
  .reg-field select {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 14px;
    color: #0f172a;
    background: #f8fafc;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    font-family: 'Inter', sans-serif;
    appearance: none;
    -webkit-appearance: none;
  }

  .reg-field input:focus,
  .reg-field select:focus {
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .reg-field input::placeholder {
    color: #94a3b8;
  }

  .reg-field input.match   { border-color: #22c55e; }
  .reg-field input.mismatch { border-color: #ef4444; }

  .reg-hint {
    font-size: 12px;
    margin-top: 4px;
  }
  .reg-hint.ok  { color: #22c55e; }
  .reg-hint.err { color: #ef4444; }

  /* select wrapper for custom arrow */
  .reg-select-wrap {
    position: relative;
  }
  .reg-select-wrap::after {
    content: '▾';
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
    font-size: 13px;
  }

  .reg-btn {
    width: 100%;
    padding: 13px;
    background: #2563eb;
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 6px;
    font-family: 'Inter', sans-serif;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  }

  .reg-btn:hover:not(:disabled) {
    background: #1d4ed8;
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
    transform: translateY(-1px);
  }

  .reg-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .reg-login {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: #64748b;
  }

  .reg-login a {
    color: #2563eb;
    font-weight: 700;
    text-decoration: none;
  }
  .reg-login a:hover { text-decoration: underline; }

  /* ── RIGHT PANEL (image) ── */
  .reg-right {
    width: 48%;
    background: #0d1b2e;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .reg-right img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .reg-right { display: none; }
    .reg-left  { padding: 32px 24px; }
  }
`;

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "developer",
    developerType: "",
    specialization: "",
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const specializationsMap = {
    backend:  ["api", "authentication", "database", "integration"],
    frontend: ["ui/ux", "integration", "mobile"],
    devops:   ["ci/cd", "monitoring", "infrastructure"],
    security: ["authentication", "security"],
  };

  const availableSpecializations = specializationsMap[form.developerType] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (form.password.length < 3) {
      toast.error("Password must be at least 3 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role, form.developerType, form.specialization);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch    = form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">

        {/* ── LEFT: FORM ── */}
        <div className="reg-left">
          <div className="reg-form-wrapper">
            <h2 className="reg-heading">Create Account 🚀</h2>
            <p className="reg-sub">Join your team on BugPilot</p>

            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="reg-field">
                <label>Full Name</label>
                <input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              {/* Email */}
              <div className="reg-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {/* Password + Confirm side by side */}
              <div className="reg-row">
                <div className="reg-field">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div className="reg-field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    className={passwordsMatch ? "match" : passwordsMismatch ? "mismatch" : ""}
                  />
                  {passwordsMatch   && <p className="reg-hint ok">✓ Passwords match</p>}
                  {passwordsMismatch && <p className="reg-hint err">✗ Passwords do not match</p>}
                </div>
              </div>

              {/* Role + Developer Type side by side */}
              <div className="reg-row">
                <div className="reg-field">
                  <label>Role</label>
                  <div className="reg-select-wrap">
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value, developerType: "", specialization: "" })}
                    >
                      <option value="developer">Developer</option>
                      <option value="qa">QA Tester</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {form.role === "developer" && (
                  <div className="reg-field">
                    <label>Developer Type</label>
                    <div className="reg-select-wrap">
                      <select
                        value={form.developerType}
                        onChange={(e) => setForm({ ...form, developerType: e.target.value, specialization: "" })}
                        required
                      >
                        <option value="">Select type...</option>
                        <option value="backend">Backend</option>
                        <option value="frontend">Frontend</option>
                        <option value="devops">DevOps</option>
                        <option value="security">Security</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Specialization — only when developer type is chosen */}
              {form.role === "developer" && form.developerType && (
                <div className="reg-field">
                  <label>Specialization</label>
                  <div className="reg-select-wrap">
                    <select
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      required
                    >
                      <option value="">Select specialization...</option>
                      {availableSpecializations.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button className="reg-btn" disabled={loading || passwordsMismatch}>
                {loading ? "Creating account..." : "Register"}
              </button>

            </form>

            <p className="reg-login">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT: IMAGE ── */}
        <div className="reg-right">
          <img src="/signup_robot.png" alt="BugPilot mascot" />
        </div>

      </div>
    </>
  );
}