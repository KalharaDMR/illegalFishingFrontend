// src/components/authorizedDashboard/MyInvestigationsTab.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, invStatusConfig, actionConfig } from "./dashboardConstants";

const Tag = ({ bg, color, children }) => (
  <span
    style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      background: bg,
      color,
    }}
  >
    {children}
  </span>
);

export default function MyInvestigationsTab({ onStatsUpdate }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [pdfLoading, setPdfLoading] = useState(null);

  const fetchMyInvestigations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/investigations/my-investigations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
      onStatsUpdate?.({
        myInProgress: json.investigating || 0,
        myCompleted: json.completed || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInvestigations();
  }, []);

  const handleDownloadPDF = async (invId) => {
    setPdfLoading(invId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/investigations/${invId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `investigation_report_${invId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download PDF report");
    } finally {
      setPdfLoading(null);
    }
  };

  const investigations = data?.investigations || [];
  const filtered =
    filter === "ALL"
      ? investigations
      : investigations.filter((i) => i.status === filter);

  if (loading)
    return (
      <div
        style={{ padding: "60px 20px", textAlign: "center", color: "#9aa4be" }}
      >
        Loading investigations…
      </div>
    );

  return (
    <div style={{ maxWidth: "860px" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Mini stats */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { label: "Total", value: data?.total || 0, color: "#0a1628" },
            {
              label: "Completed",
              value: data?.completed || 0,
              color: "#0f6e56",
            },
            {
              label: "In Progress",
              value: data?.investigating || 0,
              color: "#185fa5",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                border: "0.5px solid #dde3ee",
                borderRadius: "10px",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: "700",
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#8a96b0",
                  fontWeight: "500",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            ["ALL", "All"],
            ["INVESTIGATING", "In Progress"],
            ["COMPLETED", "Completed"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "500",
                border: "0.5px solid",
                cursor: "pointer",
                transition: "all 0.15s",
                background: filter === val ? "#0a1628" : "#fff",
                color: filter === val ? "#fff" : "#374263",
                borderColor: filter === val ? "#0a1628" : "#dde3ee",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/authorized")}
          style={{
            marginLeft: "auto",
            padding: "8px 18px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37,99,235,0.22)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(37,99,235,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.22)";
          }}
        >
          Go to Assigned Reports →
        </button>
      </div>

      {/* Investigations List */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #dde3ee",
            borderRadius: "14px",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "36px", marginBottom: "12px", color: "#c5cfe0" }}
          >
            ◉
          </div>
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#3a4565",
            }}
          >
            No investigations found
          </h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#9aa4be" }}>
            Start an investigation from Assigned Reports.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((inv) => {
            const sc = invStatusConfig[inv.status] || invStatusConfig.COMPLETED;
            const ac = actionConfig[inv.actionTaken] || actionConfig.NO_ACTION;
            const report = inv.reportId;

            return (
              <div
                key={inv._id}
                style={{
                  background: "#fff",
                  border: "0.5px solid #dde3ee",
                  borderRadius: "14px",
                  padding: "18px 22px",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#c8d0e0";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(15,23,42,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#dde3ee";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {/* Title row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#0a1628",
                        }}
                      >
                        {report?.location || "Location unavailable"}
                      </span>
                      <Tag bg={sc.bg} color={sc.color}>
                        {sc.label}
                      </Tag>
                      {inv.illegalActivityFound && (
                        <Tag bg="#fcebeb" color="#a32d2d">
                          Illegal Activity
                        </Tag>
                      )}
                    </div>

                    {/* Meta row */}
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#9aa4be" }}>
                        District:{" "}
                        <span style={{ color: "#374263", fontWeight: "500" }}>
                          {report?.district || "—"}
                        </span>
                      </span>
                      <span style={{ fontSize: "12px", color: "#9aa4be" }}>
                        Visited:{" "}
                        <span style={{ color: "#374263", fontWeight: "500" }}>
                          {inv.visitDate
                            ? new Date(inv.visitDate).toLocaleDateString(
                                "en-GB",
                              )
                            : "—"}
                          {inv.visitTime && ` · ${inv.visitTime}`}
                        </span>
                      </span>
                      {inv.resolvedAt && (
                        <span style={{ fontSize: "12px", color: "#9aa4be" }}>
                          Submitted:{" "}
                          <span style={{ color: "#374263", fontWeight: "500" }}>
                            {new Date(inv.resolvedAt).toLocaleDateString(
                              "en-GB",
                            )}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Action row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#9aa4be" }}>
                        Action:
                      </span>
                      <Tag bg={ac.bg} color={ac.color}>
                        {(inv.actionTaken || "—").replace(/_/g, " ")}
                      </Tag>
                      {inv.actionTaken === "FINE" && inv.fineAmount > 0 && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#a32d2d",
                            fontWeight: "700",
                          }}
                        >
                          LKR {inv.fineAmount.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Situation summary */}
                    {inv.actualSituation && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6b7a99",
                          marginTop: "10px",
                          marginBottom: 0,
                          lineHeight: 1.6,
                          padding: "8px 12px",
                          background: "#f8fafc",
                          borderRadius: "8px",
                          border: "0.5px solid #eef0f5",
                        }}
                      >
                        {inv.actualSituation.length > 130
                          ? inv.actualSituation.slice(0, 130) + "…"
                          : inv.actualSituation}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                    {inv.status === "COMPLETED" && (
                      <button
                        onClick={() => handleDownloadPDF(inv._id)}
                        disabled={pdfLoading === inv._id}
                        style={{
                          padding: "8px 16px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: "rgba(34,211,176,0.08)",
                          color: "#0f6e56",
                          border: "0.5px solid rgba(34,211,176,0.35)",
                          borderRadius: "8px",
                          cursor: "pointer",
                          opacity: pdfLoading === inv._id ? 0.6 : 1,
                          transition: "all 0.15s",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          if (pdfLoading !== inv._id)
                            e.currentTarget.style.background =
                              "rgba(34,211,176,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(34,211,176,0.08)";
                        }}
                      >
                        {pdfLoading === inv._id
                          ? "Generating…"
                          : "↓ PDF Report"}
                      </button>
                    )}
                    {inv.status === "INVESTIGATING" && (
                      <button
                        onClick={() =>
                          navigate(
                            `/authorized/submit-investigation/${inv._id}`,
                          )
                        }
                        style={{
                          padding: "8px 16px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: "rgba(14,165,233,0.08)",
                          color: "#185fa5",
                          border: "0.5px solid rgba(14,165,233,0.35)",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(14,165,233,0.15)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(14,165,233,0.08)")
                        }
                      >
                        Continue →
                      </button>
                    )}
                  </div>
                </div>

                {/* Evidence footer */}
                {(inv.evidenceImages?.length > 0 ||
                  inv.evidenceVideos?.length > 0) && (
                  <div
                    style={{
                      marginTop: "12px",
                      paddingTop: "10px",
                      borderTop: "0.5px solid #f0f4f8",
                      display: "flex",
                      gap: "16px",
                    }}
                  >
                    {inv.evidenceImages?.length > 0 && (
                      <span style={{ fontSize: "12px", color: "#9aa4be" }}>
                        📷 {inv.evidenceImages.length} photo
                        {inv.evidenceImages.length > 1 ? "s" : ""}
                      </span>
                    )}
                    {inv.evidenceVideos?.length > 0 && (
                      <span style={{ fontSize: "12px", color: "#9aa4be" }}>
                        🎥 {inv.evidenceVideos.length} video
                        {inv.evidenceVideos.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
