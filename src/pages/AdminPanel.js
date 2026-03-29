/* eslint-disable */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useBugs } from "../context/BugContext";

export default function AdminPanel() {
  const { user, getAllUsers } = useAuth();
  const { bugs } = useBugs();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const changeRole = (userId, role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    toast.success("Role updated");
  };

  const deleteUser = (userId) => {
    if (!window.confirm("Delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.success("User deleted");
  };

  const devWorkload = users
    .filter((u) => u.role === "developer")
    .map((u) => ({
      ...u,
      count: bugs.filter(
        (b) =>
          b.assignedUser?.id === u.id &&
          b.status !== "resolved"
      ).length,
    }))
    .sort((a, b) => b.count - a.count);

  const totalBugs = bugs.length;
  const openBugs = bugs.filter((b) => b.status === "open").length;
  const resolvedBugs = bugs.filter(
    (b) => b.status === "resolved"
  ).length;

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "240px",              // 🔥 FIX
          width: "calc(100% - 240px)",      // 🔥 FIX
          padding: "2rem",
          background: "#f1f4f8",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>
            ⚙️ Admin Panel
          </h1>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "16px",
            marginBottom: "1.5rem",
          }}
        >
          {[
            { label: "Total Users", value: users.length, color: "#4f8ef7" },
            {
              label: "Developers",
              value: users.filter((u) => u.role === "developer").length,
              color: "#2ecc71",
            },
            {
              label: "QA Testers",
              value: users.filter((u) => u.role === "qa").length,
              color: "#e67e22",
            },
            { label: "Total Bugs", value: totalBugs, color: "#e74c3c" },
            { label: "Open Bugs", value: openBugs, color: "#c0392b" },
            { label: "Resolved Bugs", value: resolvedBugs, color: "#27ae60" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                padding: "16px",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "#888" }}>
                {s.label}
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: s.color,
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tables Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Manage Users */}
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>Manage Users</h3>

            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>

                    <td style={{ color: "#888", fontSize: "0.85rem" }}>
                      {u.email}
                    </td>

                    <td>
                      <select
                        value={u.role}
                        onChange={(e) =>
                          changeRole(u.id, e.target.value)
                        }
                      >
                        <option value="developer">Developer</option>
                        <option value="qa">QA</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() => deleteUser(u.id)}
                        style={{
                          background: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "6px",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Developer Workload */}
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>
              Developer Workload
            </h3>

            {devWorkload.map((dev) => (
              <div key={dev.id} style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {dev.name}
                  </span>
                  <span style={{ color: "#888" }}>
                    {dev.count} bugs
                  </span>
                </div>

                <div
                  style={{
                    background: "#eee",
                    height: "8px",
                    borderRadius: "20px",
                    marginTop: "5px",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(
                        (dev.count / 10) * 100,
                        100
                      )}%`,
                      height: "100%",
                      borderRadius: "20px",
                      background:
                        dev.count > 7
                          ? "#e74c3c"
                          : dev.count > 4
                          ? "#e67e22"
                          : "#2ecc71",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}