// src/pages/authorized/AuthorizedDashboard.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import {
  inputStyle,
  API_BASE,
} from "../components/authorizedDashboard/dashboardConstants";
import {
  StatCard,
  ZoneCard,
} from "../components/authorizedDashboard/DashboardCards";
import {
  DeleteConfirmModal,
  ZoneFormModal,
} from "../components/authorizedDashboard/DashboardModals";
import AIAdvisoryPanel from "../components/authorizedDashboard/AIAdvisoryPanel";
import AssignedReportsTab from "../components/authorizedDashboard/AssignedReportsTab";
import MyInvestigationsTab from "../components/authorizedDashboard/MyInvestigationsTab";

// ── Inline SVG icon helper ────────────────────────────────────
const Icon = ({ d, size = 16, strokeWidth = 1.6 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const IC = {
  shield:
    "M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z",
  warning:
    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
  clip: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  compass:
    "M12 2a10 10 0 100 20A10 10 0 0012 2zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
  plus: "M12 5v14M5 12h14",
  check: "M20 6L9 17l-5-5",
};

const StatIcons = {
  pin: <Icon d={IC.pin} size={16} strokeWidth={1.8} />,
  warning: <Icon d={IC.warning} size={16} strokeWidth={1.8} />,
  shield: <Icon d={IC.shield} size={16} strokeWidth={1.8} />,
  check: <Icon d={IC.check} size={16} strokeWidth={2.4} />,
};

export default function AuthorizedDashboard() {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("areas");
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    restrictedAreas: 0,
    pendingReports: 0,
    yourInvestigations: 0,
    verified: 0,
  });
  const [loadingZones, setLoadingZones] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [deletingZone, setDeletingZone] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAIAdvisory, setShowAIAdvisory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  const fetchZones = async () => {
    setLoadingZones(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/zones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setZones(data);
        setStats((s) => ({
          ...s,
          restrictedAreas: data.filter((z) => z.isActive).length,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingZones(false);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
        const pending = data.filter(
          (r) => r.status === "PENDING" || r.status === "VALIDATED",
        ).length;
        const mine = data.filter(
          (r) => r.assignedTo && r.status === "INVESTIGATING",
        ).length;
        const verified = data.filter(
          (r) => r.status === "RESOLVED" || r.status === "VERIFIED",
        ).length;
        setStats((s) => ({
          ...s,
          pendingReports: pending,
          yourInvestigations: mine,
          verified,
        }));
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    fetchZones();
    fetchReports();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("open") === "ai-advisory") setShowAIAdvisory(true);
  }, [location.search]);

  const handleDeleteConfirm = async () => {
    if (!deletingZone) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/zones/${deletingZone._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setDeletingZone(null);
      fetchZones();
    } catch (err) {
      console.error(err);
      alert("Failed to delete zone");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleZone = async (zone) => {
    setToggleLoadingId(zone._id);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", zone.name || "");
      formData.append(
        "location",
        JSON.stringify({
          lat: parseFloat(zone.location?.lat),
          lng: parseFloat(zone.location?.lng),
        }),
      );
      formData.append(
        "startDate",
        zone.startDate
          ? new Date(zone.startDate).toISOString().split("T")[0]
          : "",
      );
      if (zone.endDate)
        formData.append(
          "endDate",
          new Date(zone.endDate).toISOString().split("T")[0],
        );
      formData.append("restrictedTime", zone.restrictedTime || "All Day");
      formData.append("isActive", zone.isActive === false ? "true" : "false");

      const res = await fetch(`${API_BASE}/api/zones/${zone._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchZones();
    } catch (err) {
      alert(err.message || "Failed to update zone status");
    } finally {
      setToggleLoadingId(null);
    }
  };

  const filteredZones = zones.filter((z) => {
    const q = searchQuery?.toLowerCase() || "";
    return (
      z.name?.toLowerCase().includes(q) ||
      z.restrictedTime?.toLowerCase().includes(q) ||
      String(z.location?.lat || "").includes(q) ||
      String(z.location?.lng || "").includes(q)
    );
  });

  const statCards = [
    {
      label: "Restricted Areas",
      value: stats.restrictedAreas,
      icon: StatIcons.pin,
      iconColor: "#3b82f6",
    },
    {
      label: "Pending Reports",
      value: stats.pendingReports,
      icon: StatIcons.warning,
      iconColor: "#d97706",
    },
    {
      label: "Your Investigations",
      value: stats.yourInvestigations,
      icon: StatIcons.shield,
      iconColor: "#e53e3e",
    },
    {
      label: "Verified Cases",
      value: stats.verified,
      icon: StatIcons.check,
      iconColor: "#16a34a",
    },
  ];

  const statusBadge = (status) => {
    if (status === "PENDING") return { bg: "#fff8e6", color: "#92580a" };
    if (status === "RESOLVED" || status === "VERIFIED")
      return { bg: "#dcfce7", color: "#166534" };
    return { bg: "#e0f2fe", color: "#075985" };
  };

  const tabs = [
    { key: "reports", icon: IC.warning, label: "Fishing Reports" },
    { key: "areas", icon: IC.pin, label: "Restricted Areas" },
    { key: "assigned", icon: IC.clip, label: "Assigned" },
    { key: "myInvestigations", icon: IC.compass, label: "My Investigations" },
  ];

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        * { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -700px 0; }
          100% { background-position: 700px 0; }
        }

        .search-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3.5px rgba(59,130,246,0.12) !important;
          outline: none !important;
        }
        .search-input::placeholder { color: #a8b4c8; }

        .report-row { transition: background 0.14s ease !important; }
        .report-row:hover { background: #f8fbff !important; }

        .add-zone-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 28px rgba(37,99,235,0.36) !important;
        }
        .dash-tab:hover {
          background: rgba(255,255,255,0.8) !important;
          color: #0d1f3c !important;
        }

        /* Thin scrollbar for the whole page */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d0d9e8; border-radius: 6px; }
      `}</style>

      {/* ── Page header ───────────────────────────── */}
      <div
        style={{ marginBottom: "28px", animation: "fadeInUp 0.3s ease both" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(37,99,235,0.32)",
            }}
          >
            <Icon d={IC.shield} size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "700",
                color: "#0d1f3c",
                letterSpacing: "-0.5px",
              }}
            >
              Authorized Personnel Portal
            </h1>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: "12.5px",
                color: "#7a8aaa",
                fontWeight: "500",
              }}
            >
              Manage restricted areas and investigate illegal fishing reports
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat cards ────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
          maxWidth: "1100px",
          animation: "fadeInUp 0.35s 0.05s ease both",
        }}
      >
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Tab bar + actions ─────────────────────── */}
      <div
        style={{
          maxWidth: "1100px",
          marginBottom: "22px",
          animation: "fadeInUp 0.35s 0.1s ease both",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            background: "#ffffff",
            border: "1.5px solid #e8edf5",
            borderRadius: "18px",
            boxShadow: "0 4px 16px rgba(13,31,60,0.05)",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              background: "linear-gradient(135deg, #f1f5fb, #eef2f9)",
              borderRadius: "13px",
              padding: "5px",
              gap: "4px",
              flex: "1 1 380px",
              minWidth: "280px",
              border: "1.5px solid #e8edf5",
            }}
          >
            {tabs.map(({ key, icon, label }) => (
              <button
                key={key}
                className="dash-tab"
                onClick={() => setActiveTab(key)}
                style={{
                  flex: 1,
                  height: "36px",
                  border: "none",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: activeTab === key ? "700" : "500",
                  color: activeTab === key ? "#0d1f3c" : "#64748b",
                  background: activeTab === key ? "#ffffff" : "transparent",
                  boxShadow:
                    activeTab === key
                      ? "0 2px 10px rgba(13,31,60,0.1)"
                      : "none",
                  transition: "all 0.18s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  padding: "0 10px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <Icon
                  d={icon}
                  size={13}
                  strokeWidth={activeTab === key ? 2.1 : 1.6}
                />
                {label}
              </button>
            ))}
          </div>

          {/* Search + Add button (areas tab) */}
          {activeTab === "areas" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flex: "0 0 auto",
              }}
            >
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    pointerEvents: "none",
                    display: "flex",
                  }}
                >
                  <Icon d={IC.search} size={13} strokeWidth={2} />
                </span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search areas…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    ...inputStyle,
                    width: "220px",
                    height: "40px",
                    borderRadius: "11px",
                    paddingLeft: "36px",
                    paddingRight: "14px",
                    border: "1.5px solid #d0d9e8",
                    background: "#f8fbff",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#0d1f3c",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.18s ease",
                  }}
                />
              </div>

              <button
                className="add-zone-btn"
                onClick={() => {
                  setEditingZone(null);
                  setShowAddModal(true);
                }}
                style={{
                  height: "40px",
                  padding: "0 20px",
                  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "11px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 6px 18px rgba(37,99,235,0.3)",
                  transition: "all 0.18s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  letterSpacing: "0.01em",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <Icon d={IC.plus} size={14} strokeWidth={2.4} />
                Add Restricted Area
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Reports tab ───────────────────────────── */}
      {activeTab === "reports" && (
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #e8edf5",
            borderRadius: "16px",
            maxWidth: "900px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(13,31,60,0.05)",
          }}
        >
          {reports.length === 0 ? (
            <div style={{ padding: "64px 20px", textAlign: "center" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #fff8e6, #fef3c7)",
                  border: "1.5px solid #fde68a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "#d97706",
                  boxShadow: "0 4px 14px rgba(217,119,6,0.12)",
                }}
              >
                <Icon d={IC.warning} size={24} strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  margin: "0 0 7px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#0d1f3c",
                }}
              >
                No reports yet
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#7a8aaa" }}>
                Reports from public users will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Table header */}
              <div
                style={{
                  padding: "12px 22px",
                  borderBottom: "1.5px solid #f0f4fa",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  background: "linear-gradient(to right, #f8fbff, #f5f8fd)",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#7a8aaa",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Report
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#7a8aaa",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Status
                </span>
              </div>

              {reports.map((r, idx) => {
                const badge = statusBadge(r.status);
                return (
                  <div
                    key={r._id}
                    className="report-row"
                    style={{
                      padding: "16px 22px",
                      borderBottom:
                        idx < reports.length - 1 ? "1px solid #f0f4fa" : "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                      background: "#ffffff",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: "600",
                          color: "#0d1f3c",
                          marginBottom: "4px",
                        }}
                      >
                        {r.title || r.description || "Report"}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          fontWeight: "500",
                        }}
                      >
                        {r.location?.address || ""}
                        {r.location?.address && " · "}
                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: "700",
                        padding: "5px 13px",
                        borderRadius: "20px",
                        background: badge.bg,
                        color: badge.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        flexShrink: 0,
                        border: `1px solid ${badge.color}22`,
                      }}
                    >
                      {r.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Areas tab ─────────────────────────────── */}
      {activeTab === "areas" && (
        <>
          {loadingZones ? (
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
                animation: "fadeInUp 0.35s ease both",
              }}
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "340px",
                    borderRadius: "18px",
                    background:
                      "linear-gradient(90deg, #f8fafc 25%, #edf2f9 50%, #f8fafc 75%)",
                    backgroundSize: "700px 100%",
                    animation: "shimmer 1.5s infinite linear",
                    border: "1.5px solid #e8edf5",
                  }}
                />
              ))}
            </div>
          ) : filteredZones.length === 0 ? (
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e8edf5",
                borderRadius: "18px",
                padding: "72px 20px",
                textAlign: "center",
                width: "100%",
                boxShadow: "0 4px 16px rgba(13,31,60,0.05)",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  border: "1.5px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "#3b82f6",
                  boxShadow: "0 4px 14px rgba(59,130,246,0.12)",
                }}
              >
                <Icon d={IC.pin} size={24} strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  margin: "0 0 7px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#0d1f3c",
                }}
              >
                {searchQuery
                  ? "No zones match your search"
                  : "No restricted areas yet"}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#7a8aaa" }}>
                {searchQuery
                  ? "Try a different search term."
                  : 'Click "Add Restricted Area" to get started.'}
              </p>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
                animation: "fadeInUp 0.35s ease both",
                alignItems: "stretch",
              }}
            >
              {filteredZones.map((zone) => (
                <ZoneCard
                  key={zone._id}
                  zone={zone}
                  onEdit={() => {
                    setEditingZone(zone);
                    setShowAddModal(true);
                  }}
                  onDelete={() => setDeletingZone(zone)}
                  onToggleStatus={() => handleToggleZone(zone)}
                  toggleLoading={toggleLoadingId === zone._id}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Other tabs ────────────────────────────── */}
      {activeTab === "assigned" && (
        <AssignedReportsTab
          onStatsUpdate={(s) =>
            setStats((prev) => ({
              ...prev,
              pendingReports: s.assignedPending ?? prev.pendingReports,
            }))
          }
        />
      )}
      {activeTab === "myInvestigations" && (
        <MyInvestigationsTab
          onStatsUpdate={(s) =>
            setStats((prev) => ({
              ...prev,
              yourInvestigations: s.myInProgress ?? prev.yourInvestigations,
              verified: s.myCompleted ?? prev.verified,
            }))
          }
        />
      )}

      {/* ── Modals ────────────────────────────────── */}
      {showAddModal && (
        <ZoneFormModal
          zone={editingZone}
          onClose={() => {
            setShowAddModal(false);
            setEditingZone(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingZone(null);
            fetchZones();
          }}
        />
      )}

      {deletingZone && (
        <DeleteConfirmModal
          zone={deletingZone}
          onCancel={() => setDeletingZone(null)}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
        />
      )}

      {showAIAdvisory && (
        <AIAdvisoryPanel onClose={() => setShowAIAdvisory(false)} />
      )}
    </Layout>
  );
}
