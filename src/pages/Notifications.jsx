import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

const STATUS_META = {
  PENDING: { label: "Pending Review", color: "#ffa502", bg: "rgba(255,165,2,0.1)", icon: "⏳" },
  INVESTIGATING: { label: "Under Investigation", color: "#1e90ff", bg: "rgba(30,144,255,0.1)", icon: "🔍" },
  RESOLVED: { label: "Resolved", color: "#2ed573", bg: "rgba(46,213,115,0.1)", icon: "✅" },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports/my");
      const reports = res.data || [];

      // Build notification list from all reports
      const notifs = reports.map((r) => {
        const meta = STATUS_META[r.status] || STATUS_META.PENDING;
        const messages = {
          PENDING: `Your report for "${r.location || r.district}" has been received and is awaiting review.`,
          INVESTIGATING: `Authorities are now investigating your report in ${r.district}.`,
          RESOLVED: `Great news! Your report in ${r.district} has been resolved.`,
        };
        return {
          id: r._id,
          reportId: r._id,
          status: r.status,
          message: messages[r.status] || `Your report status: ${r.status}`,
          location: r.location || "—",
          district: r.district,
          date: r.reportDate,
          updatedAt: r.updatedAt,
          meta,
        };
      });

      // Sort: Resolved & Investigating first (actionable)
      notifs.sort((a, b) => {
        const order = { INVESTIGATING: 0, RESOLVED: 1, PENDING: 2 };
        return (order[a.status] ?? 3) - (order[b.status] ?? 3);
      });

      setNotifications(notifs);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filter === "ALL" ? notifications : notifications.filter((n) => n.status === filter);

  const counts = {
    ALL: notifications.length,
    INVESTIGATING: notifications.filter((n) => n.status === "INVESTIGATING").length,
    RESOLVED: notifications.filter((n) => n.status === "RESOLVED").length,
    PENDING: notifications.filter((n) => n.status === "PENDING").length,
  };

  return (
    <Layout>
      <div style={s.page}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>🔔 Notifications</h1>
            <p style={s.subtitle}>Updates on your submitted reports</p>
          </div>
          <button style={s.backBtn} onClick={() => navigate("/dashboard")}>
            ← Dashboard
          </button>
        </div>

        {/* Filter tabs */}
        <div style={s.filterRow}>
          {[
            { key: "ALL", label: "All", icon: "📋" },
            { key: "INVESTIGATING", label: "Investigating", icon: "🔍" },
            { key: "RESOLVED", label: "Resolved", icon: "✅" },
            { key: "PENDING", label: "Pending", icon: "⏳" },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              style={{
                ...s.filterBtn,
                ...(filter === key ? { ...s.filterActive, borderColor: STATUS_META[key]?.color || "#0d1b2a" } : {}),
              }}
              onClick={() => setFilter(key)}
            >
              {icon} {label}
              <span style={s.filterCount}>{counts[key]}</span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>⏳</div>
            <div style={s.emptyText}>Loading notifications…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>🔕</div>
            <div style={s.emptyText}>No notifications</div>
            <div style={s.emptySub}>
              {filter === "ALL"
                ? "Submit a report to start receiving updates."
                : `No ${filter.toLowerCase()} updates yet.`}
            </div>
            {filter === "ALL" && (
              <button style={s.newBtn} onClick={() => navigate("/report")}>
                File a Report
              </button>
            )}
          </div>
        ) : (
          <div style={s.list}>
            {filtered.map((n) => (
              <div
                key={n.id}
                style={s.card}
                onClick={() => navigate("/my-reports")}
              >
                {/* Left accent bar */}
                <div style={{ ...s.accentBar, background: n.meta.color }} />

                <div style={s.cardInner}>
                  {/* Icon + Status */}
                  <div style={s.cardTop}>
                    <div style={{ ...s.statusPill, color: n.meta.color, background: n.meta.bg }}>
                      {n.meta.icon} {n.meta.label}
                    </div>
                    <div style={s.timeAgo}>
                      {new Date(n.updatedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div style={s.message}>{n.message}</div>

                  {/* Meta row */}
                  <div style={s.metaRow}>
                    <span style={s.metaChip}>📍 {n.district}</span>
                    {n.location !== "—" && (
                      <span style={s.metaChip}>🗺️ {n.location}</span>
                    )}
                    <span style={s.metaChip}>
                      📅 {new Date(n.date).toLocaleDateString("en-GB")}
                    </span>
                  </div>

                  {/* CTA */}
                  <div style={s.cta}>View Report →</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

const s = {
  page: {
    fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
    maxWidth: 720,
    margin: "0 auto",
    paddingBottom: 48,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: 800, color: "#0d1b2a", margin: "0 0 4px", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 14, color: "#8a96b0", margin: 0 },
  backBtn: {
    background: "#fff",
    border: "1.5px solid #eef2f7",
    borderRadius: 10,
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    color: "#5a6480",
    cursor: "pointer",
  },
  newBtn: {
    marginTop: 8,
    background: "linear-gradient(135deg, #0078c8, #00d4ff)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "11px 22px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  filterRow: {
    display: "flex",
    gap: 8,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  filterBtn: {
    background: "#fff",
    border: "1.5px solid #eef2f7",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#5a6480",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  filterActive: {
    background: "#0d1b2a",
    color: "#fff",
  },
  filterCount: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    padding: "1px 8px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
    gap: 12,
    textAlign: "center",
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 18, fontWeight: 700, color: "#0d1b2a" },
  emptySub: { fontSize: 14, color: "#8a96b0" },
  list: { display: "flex", flexDirection: "column", gap: 14 },
  card: {
    background: "#fff",
    borderRadius: 18,
    border: "1.5px solid #eef2f7",
    boxShadow: "0 2px 14px rgba(0,0,0,0.06)",
    display: "flex",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  accentBar: {
    width: 5,
    flexShrink: 0,
  },
  cardInner: {
    padding: "18px 22px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: {
    fontSize: 12,
    fontWeight: 700,
    borderRadius: 99,
    padding: "4px 12px",
  },
  timeAgo: { fontSize: 12, color: "#b0b8c9" },
  message: { fontSize: 14, color: "#2d3748", lineHeight: 1.6, fontWeight: 500 },
  metaRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  metaChip: {
    fontSize: 11,
    fontWeight: 600,
    color: "#5a6480",
    background: "#f0f4f8",
    borderRadius: 99,
    padding: "3px 10px",
  },
  cta: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1e90ff",
    letterSpacing: "0.04em",
    marginTop: 2,
  },
};