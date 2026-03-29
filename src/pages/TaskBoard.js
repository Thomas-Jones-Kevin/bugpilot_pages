/* eslint-disable */
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useBugs } from "../context/BugContext";

const COLUMNS = [
  { key: "open", label: "🔴 Open" },
  { key: "in-progress", label: "🟡 In Progress" },
  { key: "under-review", label: "🔵 Under Review" },
  { key: "resolved", label: "🟢 Resolved" },
];

export default function TaskBoard() {
  const { bugs } = useBugs();

  const bugsByStatus = (status) =>
    bugs.filter((b) => b.status === status);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "240px",                 // 🔥 IMPORTANT
          width: "calc(100% - 240px)",         // 🔥 IMPORTANT
          padding: "2rem 1.5rem",
          background: "#f1f4f8",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            maxWidth: 1400,
            margin: "0 auto 1.5rem",
          }}
        >
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>
            Task Board
          </h1>
          <span style={{ color: "#888", fontSize: "0.9rem" }}>
            {bugs.length} total bugs
          </span>
        </div>

        {/* Kanban Board */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {COLUMNS.map((col) => (
            <div
              key={col.key}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "16px",
                minHeight: "400px",
              }}
            >
              {/* Column Title */}
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {col.label}
                <span
                  style={{
                    background: "#e0e0e0",
                    borderRadius: "20px",
                    padding: "0.1rem 0.6rem",
                    fontSize: "0.75rem",
                  }}
                >
                  {bugsByStatus(col.key).length}
                </span>
              </div>

              {/* Cards */}
              {bugsByStatus(col.key).map((bug) => (
                <div
                  key={bug.id}
                  style={{
                    background: "#f8fafc",
                    padding: "12px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: "6px" }}>
                    <Link
                      to={`/bugs/${bug.id}`}
                      style={{
                        textDecoration: "none",
                        color: "#0f172a",
                      }}
                    >
                      {bug.title}
                    </Link>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      color: "#666",
                    }}
                  >
                    <span>{bug.severity}</span>
                    <span>
                      {bug.assignedUser?.name || "Unassigned"}
                    </span>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {bugsByStatus(col.key).length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#ccc",
                    fontSize: "0.85rem",
                    padding: "2rem 0",
                  }}
                >
                  No bugs here
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}