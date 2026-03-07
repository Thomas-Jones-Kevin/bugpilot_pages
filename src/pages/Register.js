import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirmPassword:"", role:"developer" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check passwords match
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Check minimum password length
    if (form.password.length < 3) {
      toast.error("Password must be at least 3 characters");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account 🚀</h2>
        <p>Join your team on BugTracker</p>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="John Doe" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              style={{
                borderColor: passwordsMatch
                  ? "#2ecc71"
                  : passwordsMismatch
                  ? "#e74c3c"
                  : "#ddd",
              }}
            />
            {passwordsMatch && (
              <p style={{ color:"#2ecc71", fontSize:"0.8rem", marginTop:"0.3rem" }}>
                ✓ Passwords match
              </p>
            )}
            {passwordsMismatch && (
              <p style={{ color:"#e74c3c", fontSize:"0.8rem", marginTop:"0.3rem" }}>
                ✗ Passwords do not match
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="developer">Developer</option>
              <option value="qa">QA Tester</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn btn-primary" style={{ width:"100%" }}
            disabled={loading || passwordsMismatch}>
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}