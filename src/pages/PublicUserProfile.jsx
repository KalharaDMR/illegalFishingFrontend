import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

export default function PublicUserProfile() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const userName = localStorage.getItem("userName") || "Public User";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userRole = localStorage.getItem("userRole") || "PUBLIC_USER";

  useEffect(() => {
    fetchReports();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports/my");
      setReports(res.data || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "PENDING").length,
    investigating: reports.filter((r) => r.status === "INVESTIGATING").length,
    resolved: reports.filter((r) => r.status === "RESOLVED").length,
  };

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Layout>
      <div style={s.page}>
        {toast && (
          <div style={{ ...s.toast, background: toast.type === "success" ? "#2ed573" : "#ff4757" }}>
            {toast.msg}
          </div>
        )}

        {/* Profile hero */}
        <div style={s.hero}>
          <div style={s.avatarRing}>
            <div style={s.avatar}>{initials}</div>
          </div>
          <div style={s.heroInfo}>
            <div style={s.heroName}>{userName}</div>
            <div style={s.heroEmail}>{userEmail}</div>
            <div style={s.roleBadge}>
              🌊 {userRole.replace("_", " ")}
            </div>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            { label: "Total Reports", value: stats.total, icon: "📋", color: "#1e90ff" },
            { label: "Pending", value: stats.pending, icon: "⏳", color: "#ffa502" },
            { label: "Investigating", value: stats.investigating, icon: "🔍", color: "#a55eea" },
            { label: "Resolved", value: stats.resolved, icon: "✅", color: "#2ed573" },
          ].map((stat) => (
            <div key={stat.label} style={s.statCard}>
              <div style={s.statIcon}>{stat.icon}</div>
              <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={s.sectionTitle}>Quick Actions</div>
        <div style={s.linksGrid}>
          {[
            { label: "File New Report", icon: "🚨", path: "/report", color: "#ff4757", bg: "rgba(255,71,87,0.08)" },
            { label: "My Reports", icon: "📂", path: "/my-reports", color: "#1e90ff", bg: "rgba(30,144,255,0.08)" },
            { label: "Notifications", icon: "🔔", path: "/notifications", color: "#ffa502", bg: "rgba(255,165,2,0.08)" },
            { label: "Dashboard", icon: "🏠", path: "/dashboard", color: "#2ed573", bg: "rgba(46,213,115,0.08)" },
          ].map((link) => (
            <button
              key={link.path}
              style={{ ...s.linkCard, background: link.bg, borderColor: link.color + "33" }}
              onClick={() => navigate(link.path)}
            >
              <div style={s.linkIcon}>{link.icon}</div>
              <div style={{ ...s.linkLabel, color: link.color }}>{link.label}</div>
            </button>
          ))}
        </div>

        {/* Recent activity */}
        <div style={s.sectionTitle}>Recent Activity</div>
        {loading ? (
          <div style={s.loading}>Loading activity…</div>
        ) : reports.length === 0 ? (
          <div style={s.emptyActivity}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
            <div style={{ fontWeight: 700, color: "#0d1b2a", marginBottom: 4 }}>No activity yet</div>
            <div style={{ fontSize: 13, color: "#8a96b0" }}>Your submitted reports will appear here.</div>
          </div>
        ) : (
          <div style={s.activityList}>
            {reports.slice(0, 5).map((r) => {
              const statusColors = { PENDING: "#ffa502", INVESTIGATING: "#1e90ff", RESOLVED: "#2ed573" };
              const color = statusColors[r.status] || "#8a96b0";
              return (
                <div
                  key={r._id}
                  style={s.activityItem}
                  onClick={() => navigate("/my-reports")}
                >
                  <div style={{ ...s.activityDot, background: color }} />
                  <div style={s.activityBody}>
                    <div style={s.activityTitle}>
                      Report in {r.district}
                      {r.location ? ` · ${r.location}` : ""}
                    </div>
                    <div style={s.activitySub}>
                      {new Date(r.reportDate).toLocaleDateString("en-GB")} · {r.reportTime}
                    </div>
                  </div>
                  <span style={{ ...s.activityStatus, color, background: color + "18" }}>
                    {r.status}
                  </span>
                </div>
              );
            })}
            {reports.length > 5 && (
              <button style={s.viewAllBtn} onClick={() => navigate("/my-reports")}>
                View all {reports.length} reports →
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

const s = {
  page: {
    fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
    maxWidth: 800,
    margin: "0 auto",
    paddingBottom: 48,
    position: "relative",
  },
  toast: {
    position: "fixed",
    top: 24,
    right: 24,
    padding: "12px 24px",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    zIndex: 9999,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
  hero: {
    background: "linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%)",
    borderRadius: 20,
    padding: "32px 36px",
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    gap: 24,
    position: "relative",
    boxShadow: "0 8px 32px rgba(13,27,42,0.2)",
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #00d4ff, #0078c8)",
    padding: 3,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#0d1b2a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    fontWeight: 800,
    color: "#00d4ff",
    letterSpacing: "-0.02em",
  },
  heroInfo: { flex: 1 },
  heroName: { fontSize: 22, fontWeight: 800, color: "#f0f6ff", marginBottom: 4 },
  heroEmail: { fontSize: 13, color: "rgba(200,230,255,0.6)", marginBottom: 10 },
  roleBadge: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    background: "rgba(0,212,255,0.15)",
    color: "#00d4ff",
    borderRadius: 99,
    padding: "4px 12px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  logoutBtn: {
    background: "rgba(255,71,87,0.15)",
    color: "#ff4757",
    border: "1.5px solid rgba(255,71,87,0.3)",
    borderRadius: 10,
    padding: "9px 20px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginBottom: 28,
  },
  statCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "20px 16px",
    textAlign: "center",
    border: "1.5px solid #eef2f7",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 },
  statLabel: { fontSize: 11, color: "#8a96b0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#8a96b0",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 14,
  },
  linksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 28,
  },
  linkCard: {
    border: "1.5px solid",
    borderRadius: 14,
    padding: "18px 14px",
    cursor: "pointer",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  linkIcon: { fontSize: 24 },
  linkLabel: { fontSize: 13, fontWeight: 700 },
  loading: { textAlign: "center", color: "#8a96b0", padding: 40 },
  emptyActivity: {
    textAlign: "center",
    padding: "48px 20px",
    background: "#fff",
    borderRadius: 16,
    border: "1.5px solid #eef2f7",
  },
  activityList: {
    background: "#fff",
    borderRadius: 16,
    border: "1.5px solid #eef2f7",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 20px",
    borderBottom: "1px solid #f0f4f8",
    cursor: "pointer",
    transition: "background 0.1s",
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  activityBody: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: 600, color: "#0d1b2a", marginBottom: 3 },
  activitySub: { fontSize: 12, color: "#8a96b0" },
  activityStatus: {
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 99,
    padding: "3px 10px",
    letterSpacing: "0.06em",
    flexShrink: 0,
  },
  viewAllBtn: {
    width: "100%",
    background: "none",
    border: "none",
    padding: "14px 20px",
    fontSize: 13,
    fontWeight: 700,
    color: "#1e90ff",
    cursor: "pointer",
    textAlign: "center",
  },
};