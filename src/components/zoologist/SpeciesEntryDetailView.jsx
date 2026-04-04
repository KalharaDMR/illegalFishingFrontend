export default function SpeciesEntryDetailView({ species, variant = "light" }) {
  const isDark = variant === "dark";
  const fishes = species?.fishes || [];
  const description = species?.description;
  const evidence = species?.evidence;
  const loc = species?.location;
  const threats = species?.threats || [];
  const tags = species?.tags || [];

  const cardBase = isDark
    ? {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(34,211,176,0.28)",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "12px",
      }
    : {
        background: "#f8fafc",
        border: "1px solid #e4eaf3",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "12px",
      };

  const labelStyle = isDark
    ? { fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(200,220,255,0.55)", fontWeight: "600", marginBottom: "4px" }
    : { fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a96b0", fontWeight: "600", marginBottom: "4px" };

  const localStyle = isDark
    ? { fontSize: "16px", fontWeight: "600", color: "#f0f6ff", margin: "0 0 4px", letterSpacing: "-0.01em" }
    : { fontSize: "16px", fontWeight: "600", color: "#0a1628", margin: "0 0 4px", letterSpacing: "-0.01em" };

  const sciStyle = isDark
    ? { fontSize: "13px", fontStyle: "italic", color: "rgba(200,220,255,0.78)", margin: "0 0 12px", lineHeight: 1.45 }
    : { fontSize: "13px", fontStyle: "italic", color: "#475569", margin: "0 0 12px", lineHeight: 1.45 };

  const badgeStyle = {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: "999px",
    border: isDark ? "1px solid rgba(34,211,176,0.45)" : "1px solid #bae6fd",
    background: isDark ? "rgba(34,211,176,0.12)" : "rgba(14,165,233,0.08)",
    color: isDark ? "#5eead4" : "#0369a1",
    marginBottom: "10px",
  };

  const metaValue = isDark
    ? { fontSize: "13px", color: "rgba(226,236,255,0.92)", margin: 0, lineHeight: 1.45 }
    : { fontSize: "13px", color: "#334155", margin: 0, lineHeight: 1.45 };

  return (
    <div>
      {evidence?.url && (
        <img
          src={evidence.url}
          alt=""
          style={{
            width: "100%",
            maxHeight: isDark ? "160px" : "200px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "14px",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e4eaf3",
          }}
        />
      )}

      {fishes.length === 0 && (
        <p style={{ ...metaValue, opacity: 0.8 }}>No fish entries on this record.</p>
      )}

      {fishes.length > 0 && (
        <div
          className="scroll-hide"
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '12px',
            marginBottom: '12px',
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
          }}
        >
          {fishes.map((f, i) => (
            <div
              key={i}
              style={{
                ...cardBase,
                minWidth: '250px',
                flexShrink: 0,
                marginBottom: 0,
                scrollSnapAlign: 'start',
              }}
            >
              <div style={labelStyle}>Local name</div>
              <div style={localStyle}>{f.localName || "—"}</div>

              <div style={labelStyle}>Scientific name</div>
              <div style={sciStyle}>{f.scientificName || "—"}</div>

              <div style={labelStyle}>Conservation status</div>
              <div style={{ marginBottom: "10px" }}>
                <span style={badgeStyle}>{f.conservationStatus || "—"}</span>
              </div>

              <div style={labelStyle}>Population estimate</div>
              <p style={{ ...metaValue, marginBottom: 0 }}>
                {f.populationEstimate?.trim() ? f.populationEstimate : "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .scroll-hide::-webkit-scrollbar {
          display: none;
        }
        .scroll-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {loc && (loc.formattedAddress || loc.city || loc.coordinates) && (
        <div
          style={{
            ...cardBase,
            marginBottom: "12px",
            padding: "12px 14px",
          }}
        >
          <div style={labelStyle}>Recorded location</div>
          <p style={{ ...metaValue, margin: 0 }}>
            {loc.formattedAddress ||
              [loc.address, loc.city, loc.country].filter(Boolean).join(", ") ||
              (loc.coordinates?.length === 2
                ? `${Number(loc.coordinates[1]).toFixed(5)}°, ${Number(loc.coordinates[0]).toFixed(5)}°`
                : "—")}
          </p>
        </div>
      )}

      {description?.trim() && (
        <div style={{ marginTop: "4px" }}>
          <div style={{ ...labelStyle, marginBottom: "8px" }}>Description</div>
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.6,
              margin: 0,
              color: isDark ? "rgba(220,230,255,0.9)" : "#475569",
            }}
          >
            {description}
          </p>
        </div>
      )}

      {threats.length > 0 && (
        <div style={{ marginTop: "14px" }}>
          <div style={{ ...labelStyle, marginBottom: "8px" }}>Threats</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {threats.map((t, i) => (
              <span
                key={i}
                style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: isDark ? "rgba(239,68,68,0.15)" : "#fef2f2",
                  color: isDark ? "#fca5a5" : "#b91c1c",
                  border: isDark ? "1px solid rgba(248,113,113,0.3)" : "1px solid #fecaca",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <div style={{ ...labelStyle, marginBottom: "8px" }}>Tags</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {tags.map((t, i) => (
              <span
                key={i}
                style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: isDark ? "rgba(139,92,246,0.2)" : "#f5f3ff",
                  color: isDark ? "#c4b5fd" : "#6d28d9",
                  border: isDark ? "1px solid rgba(167,139,250,0.35)" : "1px solid #ddd6fe",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
