import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="logo">🐛 BugPilot</Link>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/bugs">Bugs</Link>
        <Link to="/board">Board</Link>
        {["qa"].includes(user?.role) && (
          <Link to="/bugs/new">+ Report Bug</Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin">Admin</Link>
        )}
        <Link to={`/profile/${user?.id}`}>👤 {user?.name}</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}