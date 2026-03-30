import Layout from "../components/Layout";

const quickActions = [
  { label: "Validate Reports", desc: "Review and approve incoming incident reports", path: "/zoologist/validate", accent: "#22d3b0", icon: "◎" },
  { label: "Species Analysis", desc: "Analyse species data from submitted reports", path: "/zoologist/species", accent: "#0ea5e9", icon: "◉" },
  { label: "Profile", desc: "Manage your zoologist account", path: "/zoologist/profile", accent: "#8b5cf6", icon: "◈" },
];

const statCards = [
  { label: "Pending Review", value: "—", sub: "reports awaiting validation" },
  { label: "Validated", value: "—", sub: "approved this month" },
  { label: "Species Logged", value: "—", sub: "unique species recorded" },
];

export default function ZoologistDashboard() {
  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0d2a45 100%)",
          borderRadius: "16px", padding: "36px 40px", marginBottom: "28px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle, #22d3b0 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: "11px", color: "#22d3b0", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "500", marginBottom: "10px" }}>
              Zoologist Portal
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "600", color: "#f0f6ff", margin: "0 0 10px", letterSpacing: "-0.01em" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(200,220,255,0.65)", margin: 0, maxWidth: "480px", lineHeight: "1.6" }}>
              Validate incident reports and contribute species data to protect Sri Lanka's marine ecosystem.
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "28px" }}>
          {statCards.map(card => (
            <div key={card.label} style={{ background: "#fff", borderRadius: "12px", padding: "20px", border: "1px solid #e4eaf3" }}>
              <div style={{ fontSize: "11px", color: "#8a96b0", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "500", marginBottom: "8px" }}>{card.label}</div>
              <div style={{ fontSize: "28px", fontWeight: "600", color: "#0a1628", letterSpacing: "-0.02em", marginBottom: "4px" }}>{card.value}</div>
              <div style={{ fontSize: "12px", color: "#8a96b0" }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#8a96b0", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 14px" }}>
          Quick Actions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          {quickActions.map(action => (
            <a key={action.path} href={action.path} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff", borderRadius: "12px", padding: "22px",
                border: "1px solid #e4eaf3", cursor: "pointer", transition: "all 0.15s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = action.accent; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e4eaf3"; }}
              >
                <div style={{ fontSize: "22px", marginBottom: "12px", color: action.accent }}>{action.icon}</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#0a1628", marginBottom: "6px" }}>{action.label}</div>
                <div style={{ fontSize: "13px", color: "#8a96b0", lineHeight: "1.5" }}>{action.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
}
