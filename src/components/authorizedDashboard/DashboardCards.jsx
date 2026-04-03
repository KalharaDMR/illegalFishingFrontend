import React, { useMemo, useState } from "react";
import { API_BASE } from "./dashboardConstants";

// ── Stat Card ────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, iconColor }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e4eaf3",
        borderRadius: "12px",
        padding: "20px 22px",
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "13px", color: "#6b7a99", fontWeight: "500" }}>
          {label}
        </span>
        <span style={{ fontSize: "18px", color: iconColor }}>{icon}</span>
      </div>
      <div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#0a1628",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: "12px", color: "#9aa4be", marginTop: "4px" }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

// ── Image Viewer Modal ───────────────────────────────────────
function ZoneImagesModal({ zoneName, imageUrls, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = imageUrls.length > 0;
  const activeImage = hasImages ? imageUrls[activeIndex] : null;

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,22,40,0.72)",
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid #e4eaf3",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: "700",
                color: "#0a1628",
              }}
            >
              {zoneName} - Images
            </h3>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12px",
                color: "#8a96b0",
              }}
            >
              {hasImages
                ? `Showing ${activeIndex + 1} of ${imageUrls.length}`
                : "No uploaded images available"}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#8a96b0",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: "20px",
            overflowY: "auto",
          }}
        >
          {hasImages ? (
            <>
              <div
                style={{
                  border: "1px solid #dde3ee",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#f8fafc",
                  marginBottom: "16px",
                }}
              >
                <img
                  src={activeImage}
                  alt={`${zoneName} ${activeIndex + 1}`}
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    objectFit: "contain",
                    display: "block",
                    background: "#f8fafc",
                  }}
                />
              </div>

              {imageUrls.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <button
                    onClick={goPrev}
                    style={{
                      flex: 1,
                      padding: "10px",
                      border: "1px solid #dde3ee",
                      borderRadius: "8px",
                      background: "#f8fafc",
                      color: "#3a4565",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={goNext}
                    style={{
                      flex: 1,
                      padding: "10px",
                      border: "1px solid #dde3ee",
                      borderRadius: "8px",
                      background: "#f8fafc",
                      color: "#3a4565",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {imageUrls.map((url, index) => (
                  <button
                    key={url}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      border:
                        activeIndex === index
                          ? "2px solid #2563eb"
                          : "1px solid #dde3ee",
                      borderRadius: "10px",
                      padding: 0,
                      background: "#fff",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={url}
                      alt={`${zoneName} thumb ${index + 1}`}
                      style={{
                        width: "88px",
                        height: "66px",
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
                color: "#8a96b0",
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

export function ZoneCard({ zone, onEdit, onDelete }) {
  const [showImages, setShowImages] = useState(false);

  const lat = zone.location?.lat;
  const lng = zone.location?.lng;

  const mapThumbUrl =
    lat && lng
      ? `https://maps.google.com/maps?q=${lat},${lng}&z=10&output=embed`
      : null;

  const imageUrls = useMemo(() => {
    if (!zone.evidenceFiles?.length) return [];

    return zone.evidenceFiles.filter(Boolean).map((filePath) => {
      const normalized = String(filePath).replace(/\\/g, "/").trim();

      if (
        normalized.startsWith("http://") ||
        normalized.startsWith("https://")
      ) {
        return normalized;
      }

      if (normalized.startsWith("src/uploads/")) {
        return `${API_BASE}/${normalized.replace(/^src\//, "")}`;
      }

      if (normalized.startsWith("/src/uploads/")) {
        return `${API_BASE}/${normalized.replace(/^\/src\//, "")}`;
      }

      if (normalized.startsWith("uploads/")) {
        return `${API_BASE}/${normalized}`;
      }

      if (normalized.startsWith("/uploads/")) {
        return `${API_BASE}${normalized}`;
      }

      return `${API_BASE}/uploads/${normalized.split("/").pop()}`;
    });
  }, [zone.evidenceFiles]);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        })
      : null;

  return (
    <>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e4eaf3",
          borderRadius: "12px",
          overflow: "hidden",
          width: "260px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "140px",
            background: "#b0c8d8",
            flexShrink: 0,
          }}
        >
          {mapThumbUrl ? (
            <iframe
              title={`map-${zone._id}`}
              src={mapThumbUrl}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", pointerEvents: "none" }}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(180deg, #8cb8d4 0%, #b8d4e0 100%)",
              }}
            />
          )}

          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#e53e3e",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "600",
              padding: "3px 8px",
              borderRadius: "4px",
            }}
          >
            Restricted
          </span>
        </div>

        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            flex: 1,
          }}
        >
          <div
            style={{ fontSize: "14px", fontWeight: "600", color: "#0a1628" }}
          >
            {zone.name}
          </div>

          {lat && lng && (
            <div style={{ fontSize: "12px", color: "#8a96b0" }}>
              📍 {lat}, {lng}
            </div>
          )}

          <div
            style={{
              fontSize: "12px",
              color: "#8a96b0",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>📅</span>
            {formatDate(zone.startDate)} –{" "}
            {formatDate(zone.endDate) || "Ongoing"}
          </div>

          <div style={{ fontSize: "12px", color: "#8a96b0" }}>
            <b>Time:</b> {zone.restrictedTime || "All Day"}
          </div>

          <button
            onClick={() => setShowImages(true)}
            style={{
              width: "100%",
              padding: "7px 0",
              fontSize: "12px",
              fontWeight: "600",
              border: "1px solid #8b5cf6",
              borderRadius: "7px",
              background: "#f5f3ff",
              color: "#6d28d9",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            🖼 View Images {imageUrls.length > 0 ? `(${imageUrls.length})` : ""}
          </button>

          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <button
              onClick={() => onEdit(zone)}
              style={{
                flex: 1,
                padding: "7px 0",
                fontSize: "12px",
                fontWeight: "600",
                border: "1px solid #3b82f6",
                borderRadius: "7px",
                background: "#eff6ff",
                color: "#2563eb",
                cursor: "pointer",
              }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete(zone)}
              style={{
                flex: 1,
                padding: "7px 0",
                fontSize: "12px",
                fontWeight: "600",
                border: "1px solid #fca5a5",
                borderRadius: "7px",
                background: "#fff5f5",
                color: "#e53e3e",
                cursor: "pointer",
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>

      {showImages && (
        <ZoneImagesModal
          zoneName={zone.name}
          imageUrls={imageUrls}
          onClose={() => setShowImages(false)}
        />
      )}
    </>
  );
}
