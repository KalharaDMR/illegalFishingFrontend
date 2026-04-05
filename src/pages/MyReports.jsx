import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

const STATUS_META = {
  PENDING: { label: "Pending", color: "#ffa502", bg: "rgba(255,165,2,0.1)", icon: "⏳" },
  INVESTIGATING: { label: "Investigating", color: "#1e90ff", bg: "rgba(30,144,255,0.1)", icon: "🔍" },
  RESOLVED: { label: "Resolved", color: "#2ed573", bg: "rgba(46,213,115,0.1)", icon: "✅" },
};

export default function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

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
      showToast("Failed to load reports", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
      showToast("Report deleted successfully");
    } catch {
      showToast("Failed to delete report", "error");
    }
    setDeletingId(null);
  };

  const handleEditSave = async (id) => {
    if (!editDesc.trim()) return;
    setSaving(true);
    try {
      await api.put(`/reports/${id}`, { description: editDesc });
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, description: editDesc } : r))
      );
      setEditingId(null);
      showToast("Report updated successfully");
    } catch {
      showToast("Failed to update report", "error");
    }
    setSaving(false);
  };

  const filtered =
    filter === "ALL" ? reports : reports.filter((r) => r.status === filter);

  const counts = {
    ALL: reports.length,
    PENDING: reports.filter((r) => r.status === "PENDING").length,
    INVESTIGATING: reports.filter((r) => r.status === "INVESTIGATING").length,
    RESOLVED: reports.filter((r) => r.status === "RESOLVED").length,
  };

  return (
    <Layout>
      <div style={s.page}>
        {/* Toast */}
        {toast && (
          <div
            style={{
              ...s.toast,
              background: toast.type === "success" ? "#2ed573" : "#ff4757",
            }}
          >
            {toast.type === "success" ? "✓" : "✕"} {toast.msg}
          </div>
        )}

        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>📂 My Reports</h1>
            <p style={s.subtitle}>Track and manage your submitted reports</p>
          </div>
          <button style={s.newBtn} onClick={() => navigate("/report")}>
            + New Report
          </button>
        </div>

        {/* Filter tabs */}
        <div style={s.filterRow}>
          {["ALL", "PENDING", "INVESTIGATING", "RESOLVED"].map((f) => (
            <button
              key={f}
              style={{
                ...s.filterBtn,
                ...(filter === f ? s.filterActive : {}),
                ...(f !== "ALL" ? { color: STATUS_META[f]?.color } : {}),
              }}
              onClick={() => setFilter(f)}
            >
              {f !== "ALL" && STATUS_META[f]?.icon + " "}
              {f === "ALL" ? "All Reports" : STATUS_META[f]?.label}
              <span style={s.filterCount}>{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>⏳</div>
            <div style={s.emptyText}>Loading your reports…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>📭</div>
            <div style={s.emptyText}>No reports found</div>
            <div style={s.emptySub}>
              {filter === "ALL"
                ? "You haven't submitted any reports yet."
                : `No ${filter.toLowerCase()} reports.`}
            </div>
            {filter === "ALL" && (
              <button style={s.newBtn} onClick={() => navigate("/report")}>
                File Your First Report
              </button>
            )}
          </div>
        ) : (
          <div style={s.list}>
            {filtered.map((report) => {
              const meta = STATUS_META[report.status] || STATUS_META.PENDING;
              const isEditing = editingId === report._id;
              const isDeleting = deletingId === report._id;

              return (
                <div key={report._id} style={s.card}>
                  {/* Card header */}
                  <div style={s.cardHeader}>
                    <div style={s.cardLeft}>
                      <span
                        style={{
                          ...s.statusBadge,
                          color: meta.color,
                          background: meta.bg,
                        }}
                      >
                        {meta.icon} {meta.label}
                      </span>
                      <span style={s.district}>📍 {report.district}</span>
                    </div>
                    <div style={s.cardDate}>
                      {new Date(report.reportDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" · "}
                      {report.reportTime}
                    </div>
                  </div>

                  {/* Location */}
                  {report.location && (
                    <div style={s.locationRow}>
                      <span style={s.locationIcon}>🗺️</span>
                      <span style={s.locationText}>{report.location}</span>
                    </div>
                  )}

                  {/* Coordinates */}
                  {report.latitude && (
                    <div style={s.coordRow}>
                      {report.latitude}°N, {report.longitude}°E
                    </div>
                  )}

                  {/* Description */}
                  <div style={s.descSection}>
                    <div style={s.descLabel}>Description</div>
                    {isEditing ? (
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        style={s.editTextarea}
                        autoFocus
                      />
                    ) : (
                      <div style={s.descText}>{report.description}</div>
                    )}
                  </div>

                  {/* Evidence */}
                  {report.evidenceFiles?.length > 0 && (
                    <div style={s.evidenceRow}>
                      {report.evidenceFiles.slice(0, 4).map((f, i) => (
                        <img
                          key={i}
                          src={`http://localhost:5000/${f}`}
                          alt="evidence"
                          style={s.evidenceThumb}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ))}
                      {report.evidenceFiles.length > 4 && (
                        <div style={s.evidenceMore}>
                          +{report.evidenceFiles.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submitted date */}
                  <div style={s.cardFooter}>
                    <span style={s.submittedText}>
                      Submitted {new Date(report.createdAt).toLocaleDateString()}
                    </span>

                    {/* Actions */}
                    <div style={s.actions}>
                      {isEditing ? (
                        <>
                          <button
                            style={{ ...s.actionBtn, ...s.cancelBtn }}
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                          <button
                            style={{ ...s.actionBtn, ...s.saveBtn }}
                            onClick={() => handleEditSave(report._id)}
                            disabled={saving}
                          >
                            {saving ? "Saving…" : "✓ Save"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            style={{ ...s.actionBtn, ...s.editBtn }}
                            onClick={() => {
                              setEditingId(report._id);
                              setEditDesc(report.description);
                            }}
                          >
                            ✏ Edit
                          </button>
                          <button
                            style={{
                              ...s.actionBtn,
                              ...s.deleteBtn,
                              opacity: isDeleting ? 0.6 : 1,
                            }}
                            onClick={() => handleDelete(report._id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "…" : "🗑 Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
    animation: "fadeIn 0.2s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: 800, color: "#0d1b2a", margin: "0 0 4px", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 14, color: "#8a96b0", margin: 0 },
  newBtn: {
    background: "linear-gradient(135deg, #0078c8, #00d4ff)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "11px 22px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.02em",
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
    transition: "all 0.15s",
  },
  filterActive: {
    background: "#0d1b2a",
    color: "#fff !important",
    borderColor: "#0d1b2a",
  },
  filterCount: {
    background: "rgba(0,0,0,0.08)",
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
  list: { display: "flex", flexDirection: "column", gap: 16 },
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: "22px 24px",
    border: "1.5px solid #eef2f7",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    transition: "box-shadow 0.15s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  cardLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  statusBadge: {
    fontSize: 12,
    fontWeight: 700,
    borderRadius: 99,
    padding: "4px 12px",
  },
  district: {
    fontSize: 12,
    fontWeight: 600,
    color: "#5a6480",
    background: "#f0f4f8",
    borderRadius: 99,
    padding: "4px 12px",
  },
  cardDate: { fontSize: 13, color: "#8a96b0" },
  locationRow: { display: "flex", alignItems: "center", gap: 8 },
  locationIcon: { fontSize: 14 },
  locationText: { fontSize: 14, color: "#0d1b2a", fontWeight: 500 },
  coordRow: {
    fontSize: 11,
    color: "#b0b8c9",
    fontFamily: "monospace",
    letterSpacing: "0.04em",
  },
  descSection: { display: "flex", flexDirection: "column", gap: 6 },
  descLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#8a96b0",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  descText: { fontSize: 14, color: "#2d3748", lineHeight: 1.6 },
  editTextarea: {
    width: "100%",
    minHeight: 100,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1.5px solid #00d4ff",
    fontSize: 14,
    color: "#0d1b2a",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  },
  evidenceRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  evidenceThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    objectFit: "cover",
    border: "1.5px solid #eef2f7",
  },
  evidenceMore: {
    width: 64,
    height: 64,
    borderRadius: 10,
    background: "#f0f4f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    color: "#5a6480",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTop: "1px solid #f0f4f8",
    flexWrap: "wrap",
    gap: 8,
  },
  submittedText: { fontSize: 12, color: "#b0b8c9" },
  actions: { display: "flex", gap: 8 },
  actionBtn: {
    border: "none",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  editBtn: { background: "rgba(30,144,255,0.1)", color: "#1e90ff" },
  deleteBtn: { background: "rgba(255,71,87,0.1)", color: "#ff4757" },
  saveBtn: { background: "rgba(46,213,115,0.15)", color: "#2ed573" },
  cancelBtn: { background: "#f0f4f8", color: "#5a6480" },
};