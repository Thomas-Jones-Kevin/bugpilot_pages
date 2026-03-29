import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Bugs", path: "/bugs" },
    { name: "Board", path: "/board" },
    { name: "Report", path: "/bugs/new" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>🐞 BugPilot</h2>

      <div style={styles.menu}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.link,
              ...(location.pathname === item.path ? styles.active : {}),
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={styles.user}>Admin User</div>
        <button style={styles.logout}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    width: "240px",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  link: {
    textDecoration: "none",
    color: "#cbd5f5",
    padding: "10px 12px",
    borderRadius: "8px",
    transition: "0.2s",
  },

  active: {
    background: "#1e293b",
    color: "#fff",
  },

  footer: {
    marginTop: "auto",
  },

  user: {
    marginBottom: "10px",
    fontSize: "14px",
  },

  logout: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#1e293b",
    color: "#fff",
    cursor: "pointer",
  },
};