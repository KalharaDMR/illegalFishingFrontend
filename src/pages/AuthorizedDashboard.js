import Layout from "../components/Layout";

const quickActions = [
  { label: "Pending Actions", desc: "Review cases awaiting your decision", path: "/authorized/pending", accent: "#22d3b0", icon: "◎" },
  { label: "Enforcement", desc: "Manage ongoing enforcement operations", path: "/authorized/enforcement", accent: "#0ea5e9", icon: "◉" },
  { label: "Profile", desc: "Manage your authorized account", path: "/authorized/profile", accent: "#8b5cf6", icon: "◈" },
];

const alertItems = [
  { label: "High Priority", desc: "Cases needing immediate attention", color: "#a32d2d", bg: "#fcebeb" },
  { label: "New Reports", desc: "Recently validated and assigned to you", color: "#854f0b", bg: "#faeeda" },
];

export default function AuthorizedDashboard() {
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
              Enforcement Portal
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "600", color: "#f0f6ff", margin: "0 0 10px", letterSpacing: "-0.01em" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(200,220,255,0.65)", margin: 0, maxWidth: "480px", lineHeight: "1.6" }}>
              Manage enforcement actions and respond to validated illegal fishing reports.
            </p>
          </div>
        </div>

        {/* Alert banners */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
          {alertItems.map(item => (
            <div key={item.label} style={{ background: item.bg, borderRadius: "10px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", border: `1px solid ${item.color}22` }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: item.color }}>{item.label}</span>
                <span style={{ fontSize: "13px", color: item.color, opacity: 0.75, marginLeft: "8px" }}>{item.desc}</span>
              </div>
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
