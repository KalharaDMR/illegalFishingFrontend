import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

const roleColors = {
  ZOOLOGIST: { bg: "#e1f5ee", color: "#0f6e56" },
  AUTHORIZED_PERSON: { bg: "#e6f1fb", color: "#185fa5" },
  ADMIN: { bg: "#faeeda", color: "#854f0b" },
  PUBLIC_USER: { bg: "#f1efe8", color: "#5f5e5a" },
};

const statusColors = {
  APPROVED: { bg: "#e1f5ee", color: "#0f6e56" },
  PENDING: { bg: "#faeeda", color: "#854f0b" },
  REJECTED: { bg: "#fcebeb", color: "#a32d2d" },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const removeUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#8a96b0", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: "500", marginBottom: "4px" }}>
              Admin
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#0a1628", letterSpacing: "-0.01em", margin: 0 }}>
              All Users
            </h1>
          </div>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#8a96b0" }}>◎</span>
            <input
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: "9px 14px 9px 32px", fontSize: "13px",
                border: "1px solid #dde3ec", borderRadius: "8px",
                outline: "none", color: "#1a2640", background: "#fff",
                width: "220px", fontFamily: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={e => { e.target.style.borderColor = "#22d3b0"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,176,0.12)"; }}
              onBlur={e => { e.target.style.borderColor = "#dde3ec"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        {/* Summary chips */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {[
            { label: "Total", count: users.length, bg: "#f0f4f8", color: "#374263" },
            { label: "Approved", count: users.filter(u => u.status === "APPROVED").length, bg: "#e1f5ee", color: "#0f6e56" },
            { label: "Pending", count: users.filter(u => u.status === "PENDING").length, bg: "#faeeda", color: "#854f0b" },
          ].map(chip => (
            <div key={chip.label} style={{ background: chip.bg, borderRadius: "8px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px", fontWeight: "600", color: chip.color }}>{chip.count}</span>
              <span style={{ fontSize: "12px", color: chip.color, opacity: 0.8, fontWeight: "500" }}>{chip.label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e4eaf3", overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.3 }}>◈</div>
              <p style={{ color: "#8a96b0", fontSize: "14px", margin: 0 }}>No users found</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f7f9fc", borderBottom: "1px solid #e4eaf3" }}>
                  {["User", "Email", "Role", "Status", "Action"].map(h => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "11px", fontWeight: "600", color: "#8a96b0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => {
                  const rc = roleColors[u.role] || roleColors.PUBLIC_USER;
                  const sc = statusColors[u.status] || statusColors.PENDING;
                  return (
                    <tr key={u._id}
                      style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f0f4f8" : "none", transition: "background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbfd"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "14px 20px" }}>
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
                      <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6b7a99" }}>{u.email}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", letterSpacing: "0.04em", textTransform: "uppercase", background: rc.bg, color: rc.color }}>
                          {u.role.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", letterSpacing: "0.04em", textTransform: "uppercase", background: sc.bg, color: sc.color }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <button onClick={() => removeUser(u._id)} style={{
                          padding: "7px 14px", fontSize: "12px", fontWeight: "500",
                          background: "rgba(239,68,68,0.08)", color: "#991b1b",
                          border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px",
                          cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.16)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                        >
                          Remove
                        </button>
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
