import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

const quickActions = [
  {
    label: "Report Incident",
    desc: "Submit a new illegal fishing report",
    path: "/public/report",
    accent: "#22d3b0",
    icon: "◎",
  },
  {
    label: "My Reports",
    desc: "Track your submitted reports",
    path: "/public/my-reports",
    accent: "#0ea5e9",
    icon: "◉",
  },
  {
    label: "Profile",
    desc: "Manage your account settings",
    path: "/public/profile",
    accent: "#8b5cf6",
    icon: "◈",
  },
  {
    label: "Notifications",
    desc: "View updates on your reports",
    path: "/notifications",
    accent: "#f59e0b",
    icon: "◆",
    badge: true,
  },
];

const STATUS_COLOR = {
  "Critically Endangered": "#ff2d55",
  Endangered: "#ff6b00",
  Vulnerable: "#ffc300",
  "Near Threatened": "#a8e063",
  "Least Concern": "#00c9a7",
  "Data Deficient": "#8e9aaf",
  "Not Evaluated": "#b0b8c9",
};

export default function PublicDashboard() {
  const navigate = useNavigate();

  const [zones, setZones] = useState([]);
  const [species, setSpecies] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, investigating: 0 });
  const [notifCount, setNotifCount] = useState(0);
  const [activeTab, setActiveTab] = useState("zones");
  const [loadingZones, setLoadingZones] = useState(true);
  const [loadingSpecies, setLoadingSpecies] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchZones();
    fetchSpecies();
    fetchReportStats();
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    try {
      const res = await api.get("/profile/public/me");
      setUserName(res.data.name || "");
    } catch {
      setUserName("");
    }
  };

  const fetchZones = async () => {
    try {
      const res = await api.get("/zones?active=true");
      setZones(Array.isArray(res.data) ? res.data : []);
    } catch {
      setZones([]);
    } finally {
      setLoadingZones(false);
    }
  };

  const fetchSpecies = async () => {
    try {
      const res = await api.get("/species");
      const data = res.data?.data || res.data || [];
      setSpecies(Array.isArray(data) ? data : []);
    } catch {
      setSpecies([]);
    } finally {
      setLoadingSpecies(false);
    }
  };

  const fetchReportStats = async () => {
    try {
      const res = await api.get("/reports/my");
      const reports = res.data || [];
      const investigating = reports.filter((r) => r.status === "INVESTIGATING").length;
      const resolved = reports.filter((r) => r.status === "RESOLVED").length;
      setStats({
        total: reports.length,
        pending: reports.filter((r) => r.status === "PENDING").length,
        investigating,
        resolved,
      });
      setNotifCount(investigating + resolved);
    } catch {
      setStats({ total: 0, pending: 0, resolved: 0, investigating: 0 });
    }
  };

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>

        {/* ── Welcome hero ── */}
        <div style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0d2a45 100%)",
          borderRadius: "16px",
          padding: "36px 40px",
          marginBottom: "28px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle, #22d3b0 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: "11px", color: "#22d3b0", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "500", marginBottom: "10px" }}>
              {userName || "Public Portal"}
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "600", color: "#f0f6ff", margin: "0 0 10px", letterSpacing: "-0.01em" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(200,220,255,0.65)", margin: 0, maxWidth: "480px", lineHeight: "1.6" }}>
              Help protect marine life by reporting illegal fishing activity. Your reports make a difference.
            </p>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
          {[
            { label: "Reports Filed", value: stats.total, color: "#0ea5e9" },
            { label: "Pending", value: stats.pending, color: "#f59e0b" },
            { label: "Investigating", value: stats.investigating, color: "#8b5cf6" },
            { label: "Resolved", value: stats.resolved, color: "#22d3b0" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: "12px", padding: "18px 20px",
              border: "1px solid #e4eaf3", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: "28px", fontWeight: "700", color: s.color, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "6px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "11px", color: "#8a96b0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#8a96b0", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 14px" }}>
            Quick Actions
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
            {quickActions.map((action) => (
              <a key={action.path} href={action.path} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "22px",
                  border: "1px solid #e4eaf3",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "block",
                  position: "relative",
                }}>
                  <div style={{ fontSize: "22px", marginBottom: "12px", color: action.accent }}>
                    {action.icon}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "#0a1628", marginBottom: "6px" }}>
                    {action.label}
                  </div>
                  <div style={{ fontSize: "13px", color: "#8a96b0", lineHeight: "1.5" }}>
                    {action.desc}
                  </div>
                  {action.badge && notifCount > 0 && (
                    <span style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "#f59e0b",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: "700",
                      borderRadius: "99px",
                      padding: "2px 8px",
                      minWidth: "18px",
                      textAlign: "center",
                    }}>
                      {notifCount}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Marine Intelligence panels ── */}
        <div>
          <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#8a96b0", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 14px" }}>
            Marine Intelligence
          </h2>

          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", borderBottom: "2px solid #e4eaf3", paddingBottom: "0" }}>
            {[
              { key: "zones", label: "🚫 Restricted Zones", count: zones.length },
              { key: "species", label: "🐟 Endangered Species", count: species.length },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.key ? "2px solid #22d3b0" : "2px solid transparent",
                marginBottom: "-2px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: "600",
                color: activeTab === tab.key ? "#0a1628" : "#8a96b0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "color 0.15s",
              }}>
                {tab.label}
                <span style={{
                  background: "#f0f4f8", borderRadius: "99px",
                  fontSize: "10px", fontWeight: "700", padding: "2px 8px", color: "#5a6480",
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Zones */}
          {activeTab === "zones" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
              {loadingZones ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#8a96b0", padding: "40px" }}>Loading zones…</div>
              ) : zones.length === 0 ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#8a96b0", padding: "40px" }}>No active restricted zones found.</div>
              ) : zones.map((z) => (
                <div key={z._id} style={{ background: "#fff", borderRadius: "12px", padding: "18px 20px", border: "1px solid #e4eaf3", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22d3b0", flexShrink: 0, boxShadow: "0 0 0 3px rgba(34,211,176,0.2)" }} />
                    <span style={{ fontWeight: "600", color: "#0a1628", fontSize: "14px", flex: 1 }}>{z.name}</span>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", background: "rgba(34,211,176,0.1)", color: "#22d3b0", borderRadius: "99px", padding: "2px 10px" }}>
                      {z.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ fontSize: "12px", color: "#5a6480", display: "flex", gap: "6px" }}>
                      <span>📍</span>
                      <span>{z.location?.lat?.toFixed(4)}, {z.location?.lng?.toFixed(4)}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#5a6480", display: "flex", gap: "6px" }}>
                      <span>📅</span>
                      <span>{new Date(z.startDate).toLocaleDateString()} → {new Date(z.endDate).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#5a6480", display: "flex", gap: "6px" }}>
                      <span>⏰</span>
                      <span>{z.restrictedTime || "All Day"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Species */}
          {activeTab === "species" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
              {loadingSpecies ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#8a96b0", padding: "40px" }}>Loading species…</div>
              ) : species.length === 0 ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#8a96b0", padding: "40px" }}>No endangered species records found.</div>
              ) : species.map((sp) => {
                const fish = sp.fishes?.[0] || {};
                const status = fish.conservationStatus || "Not Evaluated";
                return (
                  <div key={sp._id} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e4eaf3", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    {sp.evidence?.url && <img src={sp.evidence.url} alt={fish.localName} style={{ width: "100%", height: "140px", objectFit: "cover" }} />}
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#0a1628" }}>{fish.localName}</div>
                          <div style={{ fontSize: "11px", color: "#8a96b0", fontStyle: "italic", marginTop: "2px" }}>{fish.scientificName}</div>
                        </div>
                        <span style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          borderRadius: "99px",
                          padding: "3px 10px",
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          color: STATUS_COLOR[status] || "#8a96b0",
                          background: (STATUS_COLOR[status] || "#8a96b0") + "18",
                        }}>
                          {status}
                        </span>
                      </div>
                      {sp.location?.city && <div style={{ fontSize: "11px", color: "#8a96b0", marginBottom: "8px" }}>📍 {sp.location.city}{sp.location.country ? `, ${sp.location.country}` : ""}</div>}
                      {sp.threats?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {sp.threats.slice(0, 3).map((t, i) => (
                            <span key={i} style={{ fontSize: "10px", fontWeight: "600", background: "rgba(255,107,0,0.08)", color: "#ff6b00", borderRadius: "99px", padding: "2px 8px" }}>{t}</span>
                          ))}
                        </div>
                      )}
                      {sp.fishes?.length > 1 && <div style={{ fontSize: "11px", color: "#8a96b0", marginTop: "8px" }}>+{sp.fishes.length - 1} more species in this entry</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}