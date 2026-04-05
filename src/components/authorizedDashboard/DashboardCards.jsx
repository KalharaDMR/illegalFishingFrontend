import React, { useMemo, useState } from "react";
import { API_BASE } from "./dashboardConstants";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap');`;

const Icon = ({ d, size = 16, strokeWidth = 1.6, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const IC = {
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
  cal: "M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  clock: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 5v5l3 3",
  camera:
    "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  power: "M18.36 6.64a9 9 0 11-12.73 0M12 2v10",
  chevL: "M15 18l-6-6 6-6",
  chevR: "M9 18l6-6-6-6",
  x: "M18 6L6 18M6 6l12 12",
  mapPin:
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
  exlink:
    "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
};

// ── Stat Card ─────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, iconColor }) {
  const palettes = {
    "#e53e3e": {
      bg: "linear-gradient(135deg,#fff1f2,#ffe4e6)",
      accent: "#ef4444",
      glow: "rgba(239,68,68,0.16)",
    },
    "#d97706": {
      bg: "linear-gradient(135deg,#fffbeb,#fef3c7)",
      accent: "#f59e0b",
      glow: "rgba(245,158,11,0.16)",
    },
    "#3b82f6": {
      bg: "linear-gradient(135deg,#eff6ff,#dbeafe)",
      accent: "#3b82f6",
      glow: "rgba(59,130,246,0.16)",
    },
    "#16a34a": {
      bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
      accent: "#22c55e",
      glow: "rgba(34,197,94,0.16)",
    },
  };
  const pal = palettes[iconColor] || {
    bg: "#f8fafc",
    accent: "#64748b",
    glow: "rgba(0,0,0,0.06)",
  };
  return (
    <>
      <style>{FONT}</style>
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #e8edf5",
          borderRadius: "20px",
          padding: "22px 24px",
          flex: 1,
          minWidth: 0,
          fontFamily: "'DM Sans',sans-serif",
          position: "relative",
          overflow: "hidden",
          transition:
            "transform 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.22s ease, border-color 0.22s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = `0 20px 48px ${pal.glow}`;
          e.currentTarget.style.borderColor = pal.accent + "60";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "#e8edf5";
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            background: pal.bg,
            opacity: 0.8,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            left: "-10px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: pal.bg,
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: "10.5px",
              fontWeight: "700",
              color: "#7a8aaa",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
            }}
          >
            {label}
          </span>
          <span
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: pal.bg,
              border: `1.5px solid ${pal.accent}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: pal.accent,
              flexShrink: 0,
              boxShadow: `0 4px 16px ${pal.glow}`,
            }}
          >
            {icon}
          </span>
        </div>
        <div
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#0d1f3c",
            lineHeight: 1,
            marginTop: "18px",
            letterSpacing: "-1.5px",
            fontFamily: "'DM Sans',sans-serif",
            position: "relative",
          }}
        >
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "7px" }}>
            {sub}
          </div>
        )}
      </div>
    </>
  );
}

// ── Image URL resolver ────────────────────────────────────────
function resolveImageUrl(filePath) {
  if (!filePath || typeof filePath !== "string") return "";
  const n = filePath.replace(/\\/g, "/").trim();
  if (n.startsWith("http://") || n.startsWith("https://")) return n;
  if (n.startsWith("src/uploads/"))
    return `${API_BASE}/${n.replace(/^src\//, "")}`;
  if (n.startsWith("/src/uploads/"))
    return `${API_BASE}/${n.replace(/^\/src\//, "")}`;
  if (n.startsWith("uploads/")) return `${API_BASE}/${n}`;
  if (n.startsWith("/uploads/")) return `${API_BASE}${n}`;
  return `${API_BASE}/uploads/${n.split("/").pop()}`;
}

// ── Zone Images Modal ─────────────────────────────────────────
function ZoneImagesModal({ zoneName, imageUrls, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const validImages = imageUrls.filter(Boolean);
  const hasImages = validImages.length > 0;
  const activeImage = hasImages ? validImages[activeIndex] : null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,18,40,0.72)",
        backdropFilter: "blur(12px)",
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          overflow: "hidden",
          border: "1.5px solid #e8edf5",
          boxShadow: "0 48px 96px rgba(8,18,40,0.28)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        <div
          style={{
            padding: "20px 26px",
            borderBottom: "1.5px solid #f0f4f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(to right,#f8faff,#fff)",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: "700",
                color: "#0d1f3c",
                letterSpacing: "-0.3px",
              }}
            >
              {zoneName} — Zone Images
            </h3>
            <p
              style={{ margin: "4px 0 0", fontSize: "12px", color: "#7a8aaa" }}
            >
              {hasImages
                ? `${activeIndex + 1} of ${validImages.length}`
                : "No images uploaded"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "1.5px solid #e2e8f0",
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e2e8f0";
              e.currentTarget.style.color = "#0d1f3c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.color = "#475569";
            }}
          >
            <Icon d={IC.x} size={14} strokeWidth={2} />
          </button>
        </div>
        <div style={{ padding: "20px 26px", overflowY: "auto" }}>
          {hasImages ? (
            <>
              <div
                style={{
                  border: "1.5px solid #e8edf5",
                  borderRadius: "14px",
                  overflow: "hidden",
                  background: "#f8fafc",
                  marginBottom: "16px",
                  minHeight: "220px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {failedImages[activeImage] ? (
                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: "13px",
                    }}
                  >
                    Failed to load image.
                  </div>
                ) : (
                  <img
                    src={activeImage}
                    alt={`${zoneName} ${activeIndex + 1}`}
                    onError={() =>
                      setFailedImages((p) => ({ ...p, [activeImage]: true }))
                    }
                    style={{
                      width: "100%",
                      maxHeight: "500px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                )}
              </div>
              {validImages.length > 1 && (
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "16px" }}
                >
                  {[
                    { label: "Previous", d: IC.chevL, dir: -1 },
                    { label: "Next", d: IC.chevR, dir: 1 },
                  ].map(({ label, d, dir }) => (
                    <button
                      key={label}
                      onClick={() =>
                        setActiveIndex(
                          (i) =>
                            (i + dir + validImages.length) % validImages.length,
                        )
                      }
                      style={{
                        flex: 1,
                        padding: "10px",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: "11px",
                        background: "#f8fafc",
                        color: "#334155",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        fontFamily: "'DM Sans',sans-serif",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#eff6ff";
                        e.currentTarget.style.borderColor = "#93c5fd";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f8fafc";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }}
                    >
                      {dir === -1 && <Icon d={d} size={14} />}
                      {label}
                      {dir === 1 && <Icon d={d} size={14} />}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {validImages.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      border:
                        activeIndex === index
                          ? "2.5px solid #3b82f6"
                          : "1.5px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: 0,
                      background: "#fff",
                      cursor: "pointer",
                      overflow: "hidden",
                      boxShadow:
                        activeIndex === index
                          ? "0 0 0 3px rgba(59,130,246,0.15)"
                          : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <img
                      src={url}
                      alt={`thumb ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              No uploaded images for this zone.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Zone Card ─────────────────────────────────────────────────
export function ZoneCard({
  zone,
  onEdit,
  onDelete,
  onToggleStatus,
  toggleLoading,
}) {
  const [showImages, setShowImages] = useState(false);
  const lat = zone.location?.lat;
  const lng = zone.location?.lng;
  const googleMapsLink =
    lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;
  const staticMapImage =
    lat && lng
      ? `https://maps.google.com/maps?q=${lat},${lng}&z=11&output=embed`
      : null;
  const imageUrls = useMemo(() => {
    if (!zone.evidenceFiles?.length) return [];
    return zone.evidenceFiles.filter(Boolean).map(resolveImageUrl);
  }, [zone.evidenceFiles]);
  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";
  const isDisabled = zone.isActive === false;

  return (
    <>
      <style>
        {FONT +
          `
        @keyframes cardSlideIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .zc-wrap {
          animation: cardSlideIn 0.32s cubic-bezier(.22,1,.36,1) both;
          background: #ffffff;
          border: 1.5px solid #e4ecf8;
          border-radius: 22px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          box-shadow: 0 2px 12px rgba(13,31,60,0.05), 0 1px 3px rgba(13,31,60,0.04);
          transition: transform 0.26s cubic-bezier(.22,1,.36,1), box-shadow 0.26s ease, border-color 0.26s ease;
        }
        .zc-wrap:hover {
          transform: translateY(-7px) !important;
          box-shadow: 0 28px 60px rgba(13,31,60,0.14), 0 8px 24px rgba(37,99,235,0.08) !important;
          border-color: #93c5fd !important;
        }
        .zc-map { position:relative; height:148px; flex-shrink:0; overflow:hidden; background:#dbeafe; }
        .zc-overlay {
          position:absolute; inset:0; z-index:2; pointer-events:none;
          background: linear-gradient(to bottom, rgba(8,18,40,0.02) 0%, rgba(8,18,40,0.0) 35%, rgba(8,18,40,0.58) 100%);
        }
        .zc-pill {
          position:absolute; top:11px; right:11px; z-index:3;
          font-size:9.5px; font-weight:800;
          padding:5px 12px; border-radius:20px;
          letter-spacing:0.1em; text-transform:uppercase;
          backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
          border:1px solid rgba(255,255,255,0.28);
          font-family:'DM Sans',sans-serif;
        }
        .zc-bottom-bar {
          position:absolute; bottom:0; left:0; right:0; z-index:3;
          padding:8px 13px 10px;
          display:flex; align-items:center; justify-content:space-between;
        }
        .zc-coord {
          display:flex; align-items:center; gap:5px;
          font-family:'DM Mono',monospace;
          font-size:10px; font-weight:500;
          color:rgba(255,255,255,0.92);
          text-shadow:0 1px 6px rgba(0,0,0,0.5);
          letter-spacing:0.02em;
        }
        .zc-mapslink {
          display:flex; align-items:center; gap:5px;
          background:rgba(255,255,255,0.16);
          border:1px solid rgba(255,255,255,0.26);
          border-radius:8px; padding:4px 10px;
          color:rgba(255,255,255,0.92); text-decoration:none;
          font-size:10.5px; font-weight:700;
          backdrop-filter:blur(8px);
          transition:background 0.15s;
          font-family:'DM Sans',sans-serif;
          letter-spacing:0.02em;
        }
        .zc-mapslink:hover { background:rgba(255,255,255,0.3); }
        .zc-body { padding:17px 17px 18px; display:flex; flex-direction:column; flex:1; }
        .zc-name {
          font-size:14.5px; font-weight:700; color:#0d1f3c;
          line-height:1.42; margin-bottom:13px; letter-spacing:-0.25px;
          display:-webkit-box; -webkit-line-clamp:2;
          -webkit-box-orient:vertical; overflow:hidden;
        }
        .zc-meta {
          display:flex; flex-direction:column; gap:7px; margin-bottom:15px;
          padding:11px 13px;
          background:linear-gradient(135deg,#f5f8ff 0%,#f0f5ff 100%);
          border-radius:13px; border:1.5px solid #e4edff;
        }
        .zc-meta-row { display:flex; align-items:center; gap:9px; }
        .zc-meta-icon {
          width:24px; height:24px; border-radius:7px;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .zc-meta-label {
          font-size:11.5px; color:#334155; font-weight:500; line-height:1.4;
          font-family:'DM Sans',sans-serif;
        }
        .zc-img-btn {
          width:100%; height:40px; border-radius:12px;
          border:1.5px solid #c4b5fd;
          background:linear-gradient(135deg,#faf5ff,#f3edff);
          color:#6d28d9; font-size:12.5px; font-weight:700;
          cursor:pointer; margin-bottom:10px;
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:all 0.2s ease;
          font-family:'DM Sans',sans-serif; letter-spacing:0.01em;
          box-shadow:0 2px 10px rgba(109,40,217,0.1);
        }
        .zc-img-btn:hover {
          background:linear-gradient(135deg,#ede9fe,#e4d9ff) !important;
          border-color:#a78bfa !important;
          box-shadow:0 6px 20px rgba(109,40,217,0.2) !important;
          transform:translateY(-1px) !important;
        }
        .zc-count-badge {
          background:linear-gradient(135deg,#7c3aed,#6d28d9);
          color:#fff; font-size:10px; font-weight:800;
          padding:2px 8px; border-radius:20px; margin-left:2px;
          letter-spacing:0.04em;
          box-shadow:0 2px 8px rgba(109,40,217,0.4);
        }
        .zc-actions { display:grid; grid-template-columns:1fr 1fr 1fr; gap:7px; }
        .zc-btn {
          height:37px; border-radius:10px; font-size:12px; font-weight:700;
          cursor:pointer; display:flex; align-items:center;
          justify-content:center; gap:5px;
          transition:all 0.18s ease;
          font-family:'DM Sans',sans-serif; letter-spacing:0.01em;
        }
        .zc-edit {
          border:1.5px solid #bfdbfe;
          background:linear-gradient(135deg,#eff6ff,#e5f0ff);
          color:#1d4ed8; box-shadow:0 2px 6px rgba(37,99,235,0.08);
        }
        .zc-edit:hover {
          background:linear-gradient(135deg,#dbeafe,#cce5ff) !important;
          border-color:#60a5fa !important;
          box-shadow:0 4px 16px rgba(37,99,235,0.2) !important;
          transform:translateY(-2px) !important;
        }
        .zc-del {
          border:1.5px solid #fecaca;
          background:linear-gradient(135deg,#fff1f2,#ffebec);
          color:#dc2626; box-shadow:0 2px 6px rgba(220,38,38,0.08);
        }
        .zc-del:hover {
          background:linear-gradient(135deg,#fee2e2,#ffdbdb) !important;
          border-color:#f87171 !important;
          box-shadow:0 4px 16px rgba(220,38,38,0.2) !important;
          transform:translateY(-2px) !important;
        }
        .zc-enable {
          border:1.5px solid #86efac;
          background:linear-gradient(135deg,#f0fdf4,#e6fdf0);
          color:#15803d; box-shadow:0 2px 6px rgba(22,163,74,0.08);
        }
        .zc-enable:hover {
          background:linear-gradient(135deg,#dcfce7,#d0fce4) !important;
          border-color:#4ade80 !important;
          box-shadow:0 4px 16px rgba(22,163,74,0.2) !important;
          transform:translateY(-2px) !important;
        }
        .zc-disable {
          border:1.5px solid #fed7aa;
          background:linear-gradient(135deg,#fff7ed,#fff1de);
          color:#c2410c; box-shadow:0 2px 6px rgba(194,65,12,0.08);
        }
        .zc-disable:hover {
          background:linear-gradient(135deg,#ffedd5,#ffe4c0) !important;
          border-color:#fb923c !important;
          box-shadow:0 4px 16px rgba(194,65,12,0.2) !important;
          transform:translateY(-2px) !important;
        }
      `}
      </style>

      <div className="zc-wrap" style={{ opacity: isDisabled ? 0.7 : 1 }}>
        {/* MAP SECTION */}
        <div className="zc-map">
          {staticMapImage ? (
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0,
                zIndex: 1,
              }}
            >
              <iframe
                title={`map-${zone._id}`}
                src={staticMapImage}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", pointerEvents: "none" }}
                loading="lazy"
              />
            </a>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(160deg,#dbeafe 0%,#bfdbfe 45%,#c7f2da 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#93c5fd",
              }}
            >
              <Icon d={IC.mapPin} size={44} strokeWidth={0.7} />
            </div>
          )}

          <div className="zc-overlay" />

          {/* Status pill */}
          <div
            className="zc-pill"
            style={{
              background: isDisabled
                ? "rgba(51,65,85,0.86)"
                : "rgba(200,30,30,0.86)",
              color: "#fff",
            }}
          >
            {isDisabled ? "Disabled" : "⚠ Restricted"}
          </div>

          {/* Bottom bar: coords + maps link */}
          <div className="zc-bottom-bar">
            {lat && lng ? (
              <div className="zc-coord">
                <Icon
                  d={IC.pin}
                  size={10}
                  strokeWidth={2.2}
                  color="rgba(255,255,255,0.7)"
                />
                {Number(lat).toFixed(4)}, {Number(lng).toFixed(4)}
              </div>
            ) : (
              <div />
            )}
            {googleMapsLink && (
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noreferrer"
                className="zc-mapslink"
              >
                <Icon d={IC.exlink} size={10} strokeWidth={2.4} />
                Maps
              </a>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="zc-body">
          <div className="zc-name">{zone.name || "Unnamed Zone"}</div>

          <div className="zc-meta">
            {[
              {
                icon: IC.cal,
                bg: "#eff6ff",
                color: "#2563eb",
                text: `${fmt(zone.startDate)} – ${fmt(zone.endDate)}`,
              },
              {
                icon: IC.clock,
                bg: "#eef2ff",
                color: "#4f46e5",
                text: zone.restrictedTime || "All Day",
              },
            ].map(({ icon, bg, color, text }, i) => (
              <div key={i} className="zc-meta-row">
                <span className="zc-meta-icon" style={{ background: bg }}>
                  <Icon d={icon} size={13} strokeWidth={2} color={color} />
                </span>
                <span className="zc-meta-label">{text}</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Images button */}
          <button className="zc-img-btn" onClick={() => setShowImages(true)}>
            <Icon d={IC.camera} size={14} strokeWidth={1.9} />
            View Images
            <span className="zc-count-badge">{imageUrls.length}</span>
          </button>

          {/* Action buttons */}
          <div className="zc-actions">
            <button className="zc-btn zc-edit" onClick={() => onEdit(zone)}>
              <Icon d={IC.edit} size={12} strokeWidth={2.1} /> Edit
            </button>
            <button
              className={`zc-btn ${isDisabled ? "zc-enable" : "zc-disable"}`}
              onClick={() => onToggleStatus(zone)}
              disabled={toggleLoading}
              style={{
                opacity: toggleLoading ? 0.5 : 1,
                cursor: toggleLoading ? "not-allowed" : "pointer",
              }}
            >
              <Icon d={IC.power} size={12} strokeWidth={2.1} />
              {toggleLoading ? "…" : isDisabled ? "Enable" : "Disable"}
            </button>
            <button className="zc-btn zc-del" onClick={() => onDelete(zone)}>
              <Icon d={IC.trash} size={12} strokeWidth={2.1} /> Delete
            </button>
          </div>
        </div>
      </div>

      {showImages && (
        <ZoneImagesModal
          zoneName={zone.name || "Zone"}
          imageUrls={imageUrls}
          onClose={() => setShowImages(false)}
        />
      )}
    </>
  );
}
