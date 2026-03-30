import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

const styles = {
  font: { fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" },
  pageHeader: {
    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
    marginBottom: "28px",
  },
  tag: {
    display: "inline-block", padding: "3px 10px", borderRadius: "20px",
    fontSize: "11px", fontWeight: "500", letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
};

const roleColors = {
  ZOOLOGIST: { bg: "#e1f5ee", color: "#0f6e56" },
  AUTHORIZED_PERSON: { bg: "#e6f1fb", color: "#185fa5" },
  ADMIN: { bg: "#faeeda", color: "#854f0b" },
  PUBLIC_USER: { bg: "#f1efe8", color: "#5f5e5a" },
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get("/admin/pending-users");
    setUsers(res.data);
  };

  const approve = async (id) => {
    await api.put(`/admin/approve/${id}`);
    fetchUsers();
  };

  const reject = async (id) => {
    await api.put(`/admin/reject/${id}`);
    fetchUsers();
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <Layout>
      <div style={styles.font}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <div>
            <div style={{ fontSize: "11px", color: "#8a96b0", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: "500", marginBottom: "4px" }}>
              Admin
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#0a1628", letterSpacing: "-0.01em", margin: 0 }}>
              Pending Approvals
            </h1>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e4eaf3", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", color: "#6b7a99" }}>
            <span style={{ fontWeight: "600", color: "#0a1628", marginRight: "4px" }}>{users.length}</span>
            awaiting review
          </div>
        </div>

        {/* Table card */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e4eaf3", overflow: "hidden" }}>
          {users.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.3 }}>◉</div>
              <p style={{ color: "#8a96b0", fontSize: "14px", margin: 0 }}>No pending approvals</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f7f9fc", borderBottom: "1px solid #e4eaf3" }}>
                  {["Name", "Email", "Role", "Evidence", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "11px", fontWeight: "600", color: "#8a96b0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => {
                  const rc = roleColors[u.role] || roleColors.PUBLIC_USER;
                  return (
                    <tr key={u._id} style={{ borderBottom: idx < users.length - 1 ? "1px solid #f0f4f8" : "none", transition: "background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbfd"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            background: "linear-gradient(135deg, #22d3b0, #0ea5e9)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "12px", fontWeight: "600", color: "#fff", flexShrink: 0,
                          }}>
                            {u.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a2640" }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: "13px", color: "#6b7a99" }}>{u.email}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ ...styles.tag, background: rc.bg, color: rc.color }}>
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {u.evidenceFiles.map((file, i) => (
                            <a key={i}
                              href={`http://localhost:5000/uploads/${file}`}
                              target="_blank" rel="noreferrer"
                              style={{ fontSize: "12px", color: "#0ea5e9", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
                              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                            >
                              ◎ Doc {i + 1}
                            </a>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => approve(u._id)} style={{
                            padding: "7px 14px", fontSize: "12px", fontWeight: "500",
                            background: "rgba(34,211,176,0.1)", color: "#0f6e56",
                            border: "1px solid rgba(34,211,176,0.3)", borderRadius: "6px",
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,211,176,0.2)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,211,176,0.1)"; }}
                          >
                            Approve
                          </button>
                          <button onClick={() => reject(u._id)} style={{
                            padding: "7px 14px", fontSize: "12px", fontWeight: "500",
                            background: "rgba(239,68,68,0.08)", color: "#991b1b",
                            border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px",
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.16)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
