import React, { useMemo, useState } from "react";
import { API_BASE } from "./dashboardConstants";

export function StatCard({ label, value, sub, icon, iconColor }) {
  const bgMap = {
    "#e53e3e": "#fff0f0",
    "#d97706": "#fffbeb",
    "#3b82f6": "#eff6ff",
    "#16a34a": "#f0fdf4",
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #e2e8f0",
        borderRadius: "14px",
        padding: "18px 20px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: "500",
            color: "#8a97b0",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: bgMap[iconColor] || "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}
        >
          {icon}
        </span>
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "500",
          color: "#0a1628",
          lineHeight: 1,
          marginTop: "12px",
        }}
      >
        {value}
      </div>

      <div style={{ fontSize: "11px", color: "#b0bbd0", marginTop: "4px" }}>
        {sub}
      </div>
    </div>
  );
}

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
        background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
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
          borderRadius: "18px",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          overflow: "hidden",
          border: "0.5px solid #e2e8f0",
          boxShadow: "0 24px 60px rgba(15,23,42,0.14)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "0.5px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                color: "#0a1628",
              }}
            >
              {zoneName} — Images
            </h3>
            <p
              style={{ margin: "3px 0 0", fontSize: "12px", color: "#94a3b8" }}
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
              border: "none",
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "20px", overflowY: "auto" }}>
          {hasImages ? (
            <>
              <div
                style={{
                  border: "0.5px solid #e2e8f0",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#f8fafc",
                  marginBottom: "14px",
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
                  style={{ display: "flex", gap: "10px", marginBottom: "14px" }}
                >
                  <button
                    onClick={() =>
                      setActiveIndex((i) =>
                        i === 0 ? validImages.length - 1 : i - 1,
                      )
                    }
                    style={{
                      flex: 1,
                      padding: "9px",
                      border: "0.5px solid #e2e8f0",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      color: "#475569",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={() =>
                      setActiveIndex((i) =>
                        i === validImages.length - 1 ? 0 : i + 1,
                      )
                    }
                    style={{
                      flex: 1,
                      padding: "9px",
                      border: "0.5px solid #e2e8f0",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      color: "#475569",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Next →
                  </button>
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
                          ? "2px solid #818cf8"
                          : "0.5px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: 0,
                      background: "#fff",
                      cursor: "pointer",
                      overflow: "hidden",
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
          month: "numeric",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  const isDisabled = zone.isActive === false;

  return (
    <>
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e6e8ef",
          borderRadius: "10px",
          overflow: "hidden",
          width: "100%",
          minWidth: 0,
          boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
          transition: "all 0.18s ease",
          opacity: isDisabled ? 0.82 : 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 22px rgba(15,23,42,0.08)";
          e.currentTarget.style.borderColor = "#d5d9e4";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 10px rgba(15,23,42,0.04)";
          e.currentTarget.style.borderColor = "#e6e8ef";
        }}
      >
        <div
          style={{
            position: "relative",
            height: "112px",
            background: "#dbeafe",
            overflow: "hidden",
          }}
        >
          {staticMapImage ? (
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noreferrer"
              title="Open in Google Maps"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
              }}
            >
              <iframe
                title={`map-${zone._id}`}
                src={staticMapImage}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  display: "block",
                  pointerEvents: "none",
                }}
                loading="lazy"
              />
            </a>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 45%, #c7f9cc 100%)",
              }}
            />
          )}

          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: isDisabled ? "#9ca3af" : "#ef4444",
              color: "#fff",
              fontSize: "9px",
              fontWeight: "700",
              padding: "4px 8px",
              borderRadius: "4px",
              lineHeight: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {isDisabled ? "Disabled" : "Restricted"}
          </div>
        </div>

        <div style={{ padding: "10px 10px 12px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#1f2937",
              lineHeight: 1.35,
              marginBottom: "8px",
              minHeight: "32px",
            }}
          >
            {zone.name || "Unnamed Zone"}
          </div>

          <div
            style={{
              fontSize: "10px",
              color: "#6b7280",
              lineHeight: 1.45,
              display: "grid",
              gap: "4px",
              marginBottom: "10px",
            }}
          >
            <div>
              📍 {lat && lng ? `${lat}, ${lng}` : "Location not available"}
            </div>
            <div>
              📅 {fmt(zone.startDate)} – {fmt(zone.endDate)}
            </div>
            <div>Time: {zone.restrictedTime || "All Day"}</div>
          </div>

          <button
            onClick={() => setShowImages(true)}
            style={{
              width: "100%",
              height: "30px",
              borderRadius: "6px",
              border: "1px solid #8b5cf6",
              background: "#f5f3ff",
              color: "#7c3aed",
              fontSize: "10px",
              fontWeight: "700",
              cursor: "pointer",
              marginBottom: "8px",
            }}
          >
            📷 View Images ({imageUrls.length})
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px",
            }}
          >
            <button
              onClick={() => onEdit(zone)}
              style={{
                height: "28px",
                borderRadius: "6px",
                border: "1px solid #93c5fd",
                background: "#eff6ff",
                color: "#2563eb",
                fontSize: "10px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              ✏️ Edit
            </button>

            <button
              onClick={() => onToggleStatus(zone)}
              disabled={toggleLoading}
              style={{
                height: "28px",
                borderRadius: "6px",
                border: isDisabled ? "1px solid #86efac" : "1px solid #fdba74",
                background: isDisabled ? "#f0fdf4" : "#fff7ed",
                color: isDisabled ? "#16a34a" : "#ea580c",
                fontSize: "10px",
                fontWeight: "700",
                cursor: toggleLoading ? "not-allowed" : "pointer",
                opacity: toggleLoading ? 0.7 : 1,
              }}
              title={isDisabled ? "Activate zone" : "Disable zone"}
            >
              {toggleLoading ? "..." : isDisabled ? "Activate" : "Disable"}
            </button>

            <button
              onClick={() => onDelete(zone)}
              style={{
                height: "28px",
                borderRadius: "6px",
                border: "1px solid #fecaca",
                background: "#fff1f2",
                color: "#ef4444",
                fontSize: "10px",
                fontWeight: "700",
                cursor: "pointer",
              }}
              title="Delete zone"
            >
              🗑 Delete
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
