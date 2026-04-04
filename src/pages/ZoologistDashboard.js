import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpeciesPage } from "../zoologist/speciesApi";

const accent = "#22d3b0";
const accent2 = "#0ea5e9";

export default function ZoologistDashboard() {
  const [totalSpecies, setTotalSpecies] = useState(null);
  const [recentSpecies, setRecentSpecies] = useState([]);
  const [loadingCount, setLoadingCount] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Fetch total count
        const totalData = await getSpeciesPage({ page: 1, limit: 1 });
        if (!cancelled) setTotalSpecies(typeof totalData.total === "number" ? totalData.total : 0);

        // Fetch recent entries
        const recentData = await getSpeciesPage({ page: 1, limit: 5, sortBy: "createdAt", order: "desc" });
        if (!cancelled) setRecentSpecies(recentData.data || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        if (!cancelled) {
          setTotalSpecies(null);
          setRecentSpecies([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingCount(false);
          setLoadingRecent(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const statCards = [
    {
      label: "Total Species",
      value: loadingCount ? "…" : totalSpecies != null ? String(totalSpecies) : "—",
      sub: "entries in registry",
      icon: "🐟",
      color: accent,
    },
    {
      label: "Recent Activity",
      value: loadingRecent ? "…" : String(recentSpecies.length),
      sub: "entries added this week to system by Zoologists",
      icon: "📈",
      color: accent2,
    },
    
    {
      label: "Geographic Coverage",
      value: "Global",
      sub: "species locations mapped",
      icon: "🌍",
      color: "#10b981",
    },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Hero Section */}
      <div
        className="zoo-animate-fade-up"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0d2a45 100%)",
          borderRadius: "16px",
          padding: "36px 40px",
          marginBottom: "28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: "radial-gradient(circle, #22d3b0 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: "11px",
              color: accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: "500",
              marginBottom: "10px",
            }}
          >
            Zoologist Portal
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "600",
              color: "#f0f6ff",
              margin: "0 0 10px",
              letterSpacing: "-0.01em",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(200,220,255,0.65)",
              margin: "0 0 22px",
              maxWidth: "520px",
              lineHeight: 1.6,
            }}
          >
            Document endangered species with map-backed locations, evidence imagery, and a registry your team can
            trust.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Link
              to="/zoologist/species/new"
              className="zoo-btn-press zoo-focus-ring"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 22px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
                textDecoration: "none",
                boxShadow: "0 8px 28px rgba(14,165,233,0.35)",
                transition: "transform 0.15s ease, box-shadow 0.2s ease",
              }}
            >
              Add endangered species entry
            </Link>
            <Link
              to="/zoologist/species"
              className="zoo-btn-press zoo-focus-ring"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 22px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#e8f4ff",
                fontWeight: "600",
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              View all entries
            </Link>
            <Link
              to="/zoologist/species/nearby"
              className="zoo-btn-press zoo-focus-ring"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 22px",
                borderRadius: "10px",
                background: "transparent",
                border: `1px solid rgba(34,211,176,0.45)`,
                color: accent,
                fontWeight: "600",
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              Species near me
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className="zoo-stagger-children zoo-dashboard-stats"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "28px" }}
      >
        {statCards.map((card, index) => (
          <div
            key={card.label}
            className="zoo-card-hover"
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e4eaf3",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                fontSize: "24px",
                opacity: 0.1,
              }}
            >
              {card.icon}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#8a96b0",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: card.color,
                letterSpacing: "-0.02em",
                marginBottom: "4px",
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: "12px", color: "#8a96b0" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Entries Section */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#0a1628",
              margin: 0,
            }}
          >
            Recent Species Entries
          </h2>
          <Link
            to="/zoologist/species"
            style={{
              fontSize: "14px",
              color: accent,
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            View all →
          </Link>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #e4eaf3",
            overflow: "hidden",
          }}
        >
          {loadingRecent ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8a96b0" }}>
              Loading recent entries...
            </div>
          ) : recentSpecies.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8a96b0" }}>
              No species entries yet. <Link to="/zoologist/species/new" style={{ color: accent }}>Add the first one</Link>.
            </div>
          ) : (
            <div>
              {recentSpecies.map((species, index) => {
                const names = (species.fishes || [])
                  .map((f) => f.localName || f.scientificName)
                  .slice(0, 2)
                  .join(", ");
                return (
                  <div
                    key={species._id}
                    style={{
                      padding: "16px 20px",
                      borderBottom: index < recentSpecies.length - 1 ? "1px solid #f1f5f9" : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <img
                      src={species.evidence?.url}
                      alt=""
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #e4eaf3",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#0a1628", marginBottom: "4px" }}>
                        {names || "Species Entry"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#8a96b0" }}>
                        {species.location?.city || species.location?.country || "Location unknown"} •{" "}
                        {new Date(species.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Section - Redesigned */}
      <div>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#0a1628",
            margin: "0 0 16px",
          }}
        >
          Quick Actions
        </h2>
        <div
          className="zoo-stagger-children"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}
        >
          {[
            {
              label: "Add New Species",
              desc: "Document a new endangered species with location and evidence",
              path: "/zoologist/species/new",
              accent: accent,
              icon: "➕",
            },
            {
              label: "Browse Registry",
              desc: "View and manage species entries",
              path: "/zoologist/species",
              accent: accent2,
              icon: "📋",
            },
            {
              label: "Nearby Species",
              desc: "Find and explore species entries near your location or any point on the map",
              path: "/zoologist/species/nearby",
              accent: "#10b981",
              icon: "📍",
            },
          ].map((action) => (
            <Link key={action.path} to={action.path} style={{ textDecoration: "none" }}>
              <div
                className="zoo-card-hover"
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "24px",
                  border: "1px solid #e4eaf3",
                  cursor: "pointer",
                  height: "100%",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{action.icon}</div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#0a1628", marginBottom: "8px" }}>
                  {action.label}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7a99", lineHeight: 1.5 }}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .zoo-dashboard-stats {
            grid-template-columns: 1fr !important;
          }
          .zoo-stagger-children {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
