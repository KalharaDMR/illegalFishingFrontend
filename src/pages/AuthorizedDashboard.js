import { useEffect, useState } from "react";
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

  const handleDeleteConfirm = async () => {
    if (!deletingZone) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/zones/${deletingZone._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeletingZone(null);
        fetchZones();
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (zone) => {
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
      formData.append("isActive", zone.isActive === false ? "true" : "false");

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
        throw new Error(data.message || "Failed to update status");
      }

      fetchZones();
    } catch (err) {
      alert(err.message || "Failed to update zone status");
    } finally {
      setToggleLoadingId(null);
    }
  };

  const filteredZones = zones.filter((z) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    const nameMatch = z.name?.toLowerCase().includes(q);
    const coordMatch = z.location
      ? `${z.location.lat} ${z.location.lng}`.includes(q)
      : false;
    return nameMatch || coordMatch;
  });

  const statCards = [
    {
      label: "Restricted Areas",
      value: stats.restrictedAreas,
      sub: "Active restrictions",
      icon: "📍",
      iconColor: "#e53e3e",
    },
    {
      label: "Pending Reports",
      value: stats.pendingReports,
      sub: "Awaiting investigation",
      icon: "⚠️",
      iconColor: "#d97706",
    },
    {
      label: "Your Investigations",
      value: stats.yourInvestigations,
      sub: "Assigned to you",
      icon: "🔺",
      iconColor: "#3b82f6",
    },
    {
      label: "Verified",
      value: stats.verified,
      sub: "Completed",
      icon: "✅",
      iconColor: "#16a34a",
    },
  ];

  const tabStyle = (active) => ({
    flex: 1,
    padding: "9px 0",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: active ? "600" : "400",
    color: active ? "#0a1628" : "#8a96b0",
    background: active ? "#fff" : "#eef0f5",
    border: "1px solid #dde3ee",
    cursor: "pointer",
    transition: "all 0.15s ease",
  });

  return (
    <Layout>
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            fontWeight: "700",
            color: "#0a1628",
          }}
        >
          Authorized Personnel Portal
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#8a96b0" }}>
          Manage restricted areas and investigate illegal fishing reports
        </p>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "860px",
        }}
      >
        <div
          style={{
            display: "flex",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #dde3ee",
            flex: 1,
          }}
        >
          <button
            style={{
              ...tabStyle(activeTab === "reports"),
              borderRadius: "8px 0 0 8px",
              borderRight: "none",
            }}
            onClick={() => setActiveTab("reports")}
          >
            Illegal Fishing Reports
          </button>
          <button
            style={{
              ...tabStyle(activeTab === "areas"),
              borderRadius: "0 8px 8px 0",
              borderLeft: "none",
            }}
            onClick={() => setActiveTab("areas")}
          >
            Restricted Areas
          </button>
        </div>

        <button
          onClick={() => setShowAIAdvisory(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 16px",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          ✨ AI Advisory
        </button>
      </div>

      {activeTab === "reports" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #dde3ee",
            borderRadius: "12px",
            padding: "60px 20px",
            textAlign: "center",
            maxWidth: "860px",
          }}
        >
          {reports.length === 0 ? (
            <>
              <div
                style={{
                  fontSize: "38px",
                  marginBottom: "12px",
                  color: "#c5cfe0",
                }}
              >
                ⚠
              </div>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#3a4565",
                }}
              >
                No reports yet
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#9aa4be" }}>
                Reports from public users will appear here
              </p>
            </>
          ) : (
            <div
              style={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {reports.map((r) => (
                <div
                  key={r._id}
                  style={{
                    padding: "14px 18px",
                    border: "1px solid #e4eaf3",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#0a1628",
                      }}
                    >
                      {r.title || r.description || "Report"}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#9aa4be",
                        marginTop: "3px",
                      }}
                    >
                      {r.location?.address || ""} ·{" "}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background:
                        r.status === "PENDING"
                          ? "#fff7ed"
                          : r.status === "RESOLVED"
                            ? "#f0fdf4"
                            : "#eff6ff",
                      color:
                        r.status === "PENDING"
                          ? "#d97706"
                          : r.status === "RESOLVED"
                            ? "#16a34a"
                            : "#3b82f6",
                    }}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "areas" && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 18px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
              Add Restricted Area
            </button>

            <div style={{ position: "relative", flex: 1, maxWidth: "320px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "11px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "14px",
                  color: "#9aa4be",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                style={{
                  ...inputStyle,
                  paddingLeft: "34px",
                  background: "#fff",
                  border: "1px solid #dde3ee",
                }}
                placeholder="Search by name or coordinates…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loadingZones ? (
            <p style={{ color: "#8a96b0", fontSize: "14px" }}>Loading zones…</p>
          ) : filteredZones.length === 0 ? (
            <div
              style={{
                background: "#fff",
                border: "1px solid #dde3ee",
                borderRadius: "12px",
                padding: "60px 20px",
                textAlign: "center",
                maxWidth: "860px",
              }}
            >
              <div
                style={{
                  fontSize: "38px",
                  marginBottom: "12px",
                  color: "#c5cfe0",
                }}
              >
                🗺
              </div>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#3a4565",
                }}
              >
                {searchQuery
                  ? "No zones match your search"
                  : "No restricted areas yet"}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#9aa4be" }}>
                {searchQuery
                  ? "Try a different search term."
                  : `Click "Add Restricted Area" to get started.`}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
              {filteredZones.map((zone) => (
                <ZoneCard
                  key={zone._id}
                  zone={zone}
                  onEdit={(z) => setEditingZone(z)}
                  onDelete={(z) => setDeletingZone(z)}
                  onToggleStatus={handleToggleStatus}
                  toggleLoading={toggleLoadingId === zone._id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <ZoneFormModal
          zone={null}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchZones();
          }}
        />
      )}

      {editingZone && (
        <ZoneFormModal
          zone={editingZone}
          onClose={() => setEditingZone(null)}
          onSuccess={() => {
            setEditingZone(null);
            fetchZones();
          }}
        />
      )}

      {deletingZone && (
        <DeleteConfirmModal
          zone={deletingZone}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingZone(null)}
          loading={deleteLoading}
        />
      )}

      {showAIAdvisory && (
        <AIAdvisoryPanel onClose={() => setShowAIAdvisory(false)} />
      )}
    </Layout>
  );
}
