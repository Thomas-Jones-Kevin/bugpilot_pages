import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    role: "developer",
    developerType: "",     // Added field
    specialization: ""     // Added field
  });
  
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate  = useNavigate();

  const specializationsMap = {
    "backend": ["api", "authentication", "database", "integration"],
    "frontend": ["ui/ux", "integration", "mobile"],
    "devops": ["ci/cd", "monitoring", "infrastructure"],
    "security": ["authentication", "security"],
  };

  // Get the correct array of specializations based on the selected developerType
  const availableSpecializations = specializationsMap[form.developerType] || [];

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
      // Updated this line to include the two new fields
      await register(form.name, form.email, form.password, form.role, form.developerType, form.specialization);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

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
                borderColor: passwordsMatch ? "#2ecc71" : passwordsMismatch ? "#e74c3c" : "#ddd",
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

          {/* Added conditional fields for developers */}
          {form.role === "developer" && (
            <>
              <div className="form-group">
                <label>Developer Type</label>
                <select 
                  value={form.developerType}
                  onChange={(e) => setForm({ ...form, developerType: e.target.value })} 
                  required={form.role === "developer"}
                >
                  <option value="">Select type...</option>
                  <option value="backend">backend</option>
                  <option value="devops">devops</option>
                  <option value="frontend">frontend</option>
                  <option value="security">security</option>
                </select>
              </div>

              {form.developerType && (
                <div className="form-group">
                  <label>Specialization</label>
                  <select 
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })} 
                    required={form.role === "developer"}
                    disabled={!form.developerType} // Disables this dropdown until a type is chosen
                  >
                    <option value="">Select specialization...</option>
                    
                    {/* Dynamically create options from the array */}
                    {availableSpecializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

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