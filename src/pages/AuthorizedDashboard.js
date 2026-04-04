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
      console.error("Failed to fetch zones:", err);
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
      console.warn("Reports endpoint not available:", err);
    }
  };

  useEffect(() => {
    fetchZones();
    fetchReports();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("open") === "ai-advisory") {
      setShowAIAdvisory(true);
    }
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

      if (zone.endDate) {
        formData.append(
          "endDate",
          new Date(zone.endDate).toISOString().split("T")[0],
        );
      }

      formData.append("restrictedTime", zone.restrictedTime || "All Day");
      formData.append("isActive", zone.isActive ? "false" : "true");

      const res = await fetch(`${API_BASE}/api/zones/${zone._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        throw new Error("Server unreachable");
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update zone status");
      }

      fetchZones();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update zone");
    } finally {
      setToggleLoadingId(null);
    }
  };

  const filteredZones = zones.filter((z) => {
    const q = searchQuery.toLowerCase();
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
      icon: "📍",
      iconBg: "#eff6ff",
      iconColor: "#2563eb",
    },
    {
      label: "Pending Reports",
      value: stats.pendingReports,
      icon: "⚠️",
      iconBg: "#fff7ed",
      iconColor: "#d97706",
    },
    {
      label: "Your Investigations",
      value: stats.yourInvestigations,
      icon: "🛡️",
      iconBg: "#f5f3ff",
      iconColor: "#7c3aed",
    },
    {
      label: "Verified Cases",
      value: stats.verified,
      icon: "✅",
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
    },
  ];

  const statusColor = (status) => {
    if (status === "PENDING") return { bg: "#fff7ed", color: "#d97706" };
    if (status === "RESOLVED" || status === "VERIFIED") {
      return { bg: "#f0fdf4", color: "#16a34a" };
    }
    return { bg: "#eff6ff", color: "#3b82f6" };
  };

  return (
    <Layout>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }

        .dash-tab:hover {
          background: #f8fafc !important;
          color: #0f172a !important;
        }

        .search-input:focus {
          border-color: #818cf8 !important;
          box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.12) !important;
          outline: none;
        }

        .report-row:hover {
          border-color: #c7d2e8 !important;
          box-shadow: 0 2px 10px rgba(10,22,40,0.06);
        }

        .report-row {
          transition: all 0.15s ease !important;
        }
      `}</style>

      <div
        style={{
          marginBottom: "28px",
          animation: "fadeInUp 0.3s ease both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "5px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              flexShrink: 0,
              boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
            }}
          >
            🛡
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "800",
                color: "#0a1628",
                letterSpacing: "-0.5px",
              }}
            >
              Authorized Personnel Portal
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#8a96b0" }}>
              Manage restricted areas and investigate illegal fishing reports
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "14px",
          marginBottom: "28px",
          maxWidth: "1100px",
          animation: "fadeInUp 0.35s 0.05s ease both",
        }}
      >
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

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
            gap: "14px",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px",
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flex: "1 1 320px",
              minWidth: "280px",
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                background: "#eef2f7",
                borderRadius: "14px",
                padding: "4px",
                border: "1px solid #dbe3ef",
                gap: "4px",
                minWidth: "260px",
                height: "46px",
              }}
            >
              {[
                { key: "reports", label: "⚠️ Fishing Reports" },
                { key: "areas", label: "📍 Restricted Areas" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className="dash-tab"
                  onClick={() => setActiveTab(key)}
                  style={{
                    flex: 1,
                    height: "100%",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: activeTab === key ? "700" : "500",
                    color: activeTab === key ? "#0f172a" : "#64748b",
                    background: activeTab === key ? "#ffffff" : "transparent",
                    boxShadow:
                      activeTab === key
                        ? "0 4px 12px rgba(15,23,42,0.08)"
                        : "none",
                    transition: "all 0.18s ease",
                    letterSpacing: "0.01em",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              flex: "1 1 520px",
            }}
          >
            {activeTab === "areas" && (
              <>
                <div
                  style={{
                    position: "relative",
                    minWidth: "260px",
                    flex: "1 1 280px",
                    maxWidth: "360px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "14px",
                      color: "#94a3b8",
                      pointerEvents: "none",
                    }}
                  >
                    🔍
                  </span>

                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search restricted areas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      ...inputStyle,
                      width: "100%",
                      height: "46px",
                      borderRadius: "14px",
                      paddingLeft: "40px",
                      paddingRight: "14px",
                      border: "1px solid #dbe3ef",
                      background: "#fff",
                      boxShadow: "inset 0 1px 2px rgba(15,23,42,0.03)",
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    setEditingZone(null);
                    setShowAddModal(true);
                  }}
                  style={{
                    height: "46px",
                    padding: "0 18px",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "14px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: "0 10px 20px rgba(37,99,235,0.22)",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 14px 24px rgba(37,99,235,0.28)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 20px rgba(37,99,235,0.22)";
                  }}
                >
                  + Add Restricted Area
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {activeTab === "reports" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #dde3ee",
            borderRadius: "16px",
            maxWidth: "1100px",
            overflow: "hidden",
            animation: "fadeInUp 0.25s ease both",
            boxShadow: "0 2px 12px rgba(10,22,40,0.05)",
          }}
        >
          {reports.length === 0 ? (
            <div style={{ padding: "70px 20px", textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #f1f5f9, #e8ecf4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  margin: "0 auto 16px",
                }}
              >
                ⚠
              </div>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#3a4565",
                }}
              >
                No reports yet
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#9aa4be" }}>
                Reports from public users will appear here
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  padding: "12px 20px",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#8a96b0",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {reports.length} Report{reports.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {reports.map((report) => {
                  const badge = statusColor(report.status);
                  return (
                    <div
                      key={report._id}
                      className="report-row"
                      style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#0f172a",
                            }}
                          >
                            {report.title || "Fishing Incident Report"}
                          </h3>
                          <span
                            style={{
                              padding: "4px 9px",
                              borderRadius: "999px",
                              background: badge.bg,
                              color: badge.color,
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            {report.status}
                          </span>
                        </div>

                        <p
                          style={{
                            margin: "0 0 6px",
                            fontSize: "13px",
                            color: "#64748b",
                            lineHeight: 1.5,
                          }}
                        >
                          {report.description || "No description available"}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            gap: "14px",
                            flexWrap: "wrap",
                            fontSize: "12px",
                            color: "#94a3b8",
                          }}
                        >
                          <span>
                            📍 {report.location || "Unknown location"}
                          </span>
                          <span>
                            🕒{" "}
                            {report.createdAt
                              ? new Date(report.createdAt).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "areas" && (
        <>
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px",
              alignItems: "stretch",
              animation: "fadeInUp 0.35s ease both",
            }}
          >
            {loadingZones ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "310px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(90deg, #f8fafc 25%, #eef2f7 50%, #f8fafc 75%)",
                    backgroundSize: "600px 100%",
                    animation: "shimmer 1.4s infinite linear",
                    border: "1px solid #e5eaf2",
                  }}
                />
              ))
            ) : filteredZones.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  background: "#fff",
                  border: "1px solid #dde3ee",
                  borderRadius: "20px",
                  padding: "70px 20px",
                  textAlign: "center",
                  boxShadow: "0 10px 26px rgba(15,23,42,0.05)",
                }}
              >
                {/* keep existing empty state */}
              </div>
            ) : (
              filteredZones.map((zone) => (
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
              ))
            )}
          </div>
        </>
      )}

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
