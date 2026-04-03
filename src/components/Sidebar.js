import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (role === "PUBLIC_USER") {
      fetchNotifCount();
    }
  }, [role]);

  const fetchNotifCount = async () => {
    try {
      const res = await api.get("/reports/my");
      const reports = res.data || [];
      const count = reports.filter(
        (r) => r.status === "INVESTIGATING" || r.status === "RESOLVED"
      ).length;
      setNotifCount(count);
    } catch {
      setNotifCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getMenuItems = () => {
    switch (role) {
      case "ADMIN":
        return [
          { name: "Dashboard", path: "/admin", icon: "⬡" },
          { name: "All Users", path: "/admin/users", icon: "◈" },
          { name: "Manage Reports", path: "/admin/reports", icon: "◉" },
          { name: "Statistics", path: "/admin/statistics", icon: "◈" },
        ];
      case "PUBLIC_USER":
        return [
          { name: "Dashboard", path: "/public", icon: "⬡" },
          { name: "Report Incident", path: "/public/report", icon: "◎" },
          { name: "My Reports", path: "/public/my-reports", icon: "◉" },
          { name: "Notifications", path: "/notifications", icon: "◆", badge: true },
          { name: "Profile", path: "/public/profile", icon: "◈" },
        ];
      case "ZOOLOGIST":
        return [
          { name: "Dashboard", path: "/zoologist", icon: "⬡" },
          { name: "Validate Reports", path: "/zoologist/validate", icon: "◎" },
          { name: "Species Analysis", path: "/zoologist/species", icon: "◉" },
          { name: "Profile", path: "/zoologist/profile", icon: "◈" },
        ];
      case "AUTHORIZED_PERSON":
        return [
          { name: "Dashboard", path: "/authorized", icon: "⬡" },
          { name: "Pending Actions", path: "/authorized/pending", icon: "◎" },
          { name: "Enforcement", path: "/authorized/enforcement", icon: "◉" },
          { name: "Profile", path: "/authorized/profile", icon: "◈" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const roleLabel = {
    ADMIN: "Administrator",
    PUBLIC_USER: "Public User",
    ZOOLOGIST: "Zoologist",
    AUTHORIZED_PERSON: "Authorized Person",
  }[role] || "User";

  return (
    <aside style={{
      width: "240px",
      minWidth: "240px",
      background: "linear-gradient(180deg, #0a1628 0%, #0d1f35 100%)",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Logo / Brand */}
      <div style={{
        padding: "28px 24px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <div style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg, #22d3b0, #0ea5e9)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: "700", color: "#fff",
          }}>F</div>
          <span style={{ color: "#f0f6ff", fontWeight: "600", fontSize: "15px", letterSpacing: "0.01em" }}>
            FishWatch
          </span>
        </div>
        <div style={{
          fontSize: "11px",
          color: "#22d3b0",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: "500",
          marginLeft: "42px",
        }}>{roleLabel}</div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? "500" : "400",
                color: isActive ? "#22d3b0" : "rgba(200,220,255,0.65)",
                background: isActive ? "rgba(34,211,176,0.1)" : "transparent",
                borderLeft: isActive ? "2px solid #22d3b0" : "2px solid transparent",
                transition: "all 0.15s ease",
                position: "relative",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#e0f0ff";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(200,220,255,0.65)";
                }
              }}
            >
              <span style={{ fontSize: "11px", opacity: 0.7 }}>{item.icon}</span>
              {item.name}
              {/* Notification badge — only on Notifications item */}
              {item.badge && notifCount > 0 && (
                <span style={{
                  marginLeft: "auto",
                  background: "#f59e0b",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "700",
                  borderRadius: "99px",
                  padding: "1px 7px",
                  minWidth: "18px",
                  textAlign: "center",
                }}>
                  {notifCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "8px",
            color: "#f87171",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.2)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
          }}
        >
          <span style={{ fontSize: "12px" }}>⬡</span>
          Logout
        </button>
      </div>
    </aside>
  );
}