import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "./dashboardConstants";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(2, 6, 23, 0.55)",
  backdropFilter: "blur(4px)",
  zIndex: 999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
};

const panelStyle = {
  width: "min(1080px, 100%)",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#f8fafc",
  borderRadius: "22px",
  boxShadow: "0 24px 80px rgba(2, 6, 23, 0.28)",
  border: "1px solid rgba(148, 163, 184, 0.22)",
};

const sectionCard = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  padding: "18px",
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
};

const mutedText = {
  color: "#64748b",
  fontSize: "13px",
  lineHeight: 1.6,
};

const headingText = {
  margin: 0,
  fontSize: "15px",
  fontWeight: 700,
  color: "#0f172a",
};

const getRiskMeta = (level) => {
  const normalized = String(level || "LOW").toUpperCase();

  switch (normalized) {
    case "CRITICAL":
      return {
        label: "CRITICAL",
        bg: "linear-gradient(135deg, #dc2626, #b91c1c)",
        softBg: "#fef2f2",
        text: "#991b1b",
        border: "#fecaca",
        icon: "🚨",
      };
    case "HIGH":
      return {
        label: "HIGH",
        bg: "linear-gradient(135deg, #f97316, #ea580c)",
        softBg: "#fff7ed",
        text: "#c2410c",
        border: "#fed7aa",
        icon: "⚠️",
      };
    case "MEDIUM":
      return {
        label: "MEDIUM",
        bg: "linear-gradient(135deg, #eab308, #ca8a04)",
        softBg: "#fefce8",
        text: "#a16207",
        border: "#fde68a",
        icon: "🟡",
      };
    default:
      return {
        label: "LOW",
        bg: "linear-gradient(135deg, #16a34a, #15803d)",
        softBg: "#f0fdf4",
        text: "#166534",
        border: "#bbf7d0",
        icon: "✅",
      };
  }
};

const normalizeResponse = (payload) => {
  if (!payload) return null;

  return {
    overallRiskLevel:
      payload.overallRiskLevel || payload.advisory?.overallRiskLevel || "LOW",

    executiveSummary:
      payload.executiveSummary ||
      payload.summary ||
      payload.advisory?.executiveSummary ||
      "No executive summary available.",

    keyConcerns: payload.keyConcerns || payload.advisory?.keyConcerns || [],

    recommendedActions:
      payload.recommendedActions ||
      payload.priorityActions ||
      payload.advisory?.recommendedActions ||
      [],

    expectedImpact:
      payload.expectedImpact || payload.advisory?.expectedImpact || [],

    patrolTiming: payload.patrolTiming || payload.advisory?.patrolTiming || {},

    priorityAreas:
      payload.priorityAreas || payload.advisory?.priorityAreas || [],

    zoneAnalysis:
      payload.zoneAnalysis ||
      payload.advisory?.zoneAnalysis ||
      payload.zoneFacts ||
      payload.advisory?.zoneFacts ||
      [],

    availableZones: payload.availableZones || [],

    selectedZoneId: payload.selectedZoneId || "",
    selectedZoneName: payload.selectedZoneName || "",

    futureOutlook:
      payload.futureOutlook ||
      payload.environmentalOutlook ||
      payload.advisory?.futureOutlook ||
      "If current ecological pressure continues, restricted marine areas may face increased stress in the coming days.",

    nearTermImpact:
      payload.nearTermImpact ||
      payload.advisory?.nearTermImpact ||
      "Continued disturbance may reduce recovery conditions and increase enforcement urgency.",

    operationalFlags: payload.operationalFlags || {},
  };
};

function EmptyList({ text }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "12px",
        background: "#f8fafc",
        border: "1px dashed #cbd5e1",
        color: "#64748b",
        fontSize: "13px",
      }}
    >
      {text}
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: "4px",
        padding: "10px 12px",
        borderRadius: "12px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        minWidth: "160px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          color: "#64748b",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "14px",
          color: "#0f172a",
          fontWeight: 700,
        }}
      >
        {value || "N/A"}
      </span>
    </div>
  );
}

export default function AIAdvisoryPanel({ onClose }) {
  const [data, setData] = useState(null);
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");

  const loadAdvisory = async (
    isRefresh = false,
    zoneIdParam = selectedZoneId,
  ) => {
    try {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem("token");
      const query = zoneIdParam
        ? `?zoneId=${encodeURIComponent(zoneIdParam)}`
        : "";

      const res = await fetch(`${API_BASE}/api/zones/ai-advisory${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(text || `Server error (${res.status})`);
      }

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(
          payload.message ||
            payload.error ||
            `Failed to fetch AI advisory (${res.status})`,
        );
      }

      const normalized = normalizeResponse(payload);

      setRaw(payload);
      setData(normalized);

      if (payload.selectedZoneId !== undefined) {
        setSelectedZoneId(payload.selectedZoneId || "");
      } else if (!zoneIdParam && payload.availableZones?.length) {
        setSelectedZoneId("");
      }
    } catch (err) {
      console.error("AI advisory load failed:", err);
      setError(err.message || "Unable to load AI advisory");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAdvisory();
  }, []);

  const handleZoneChange = async (e) => {
    const value = e.target.value;
    setSelectedZoneId(value);
    await loadAdvisory(false, value);
  };

  const risk = useMemo(
    () => getRiskMeta(data?.overallRiskLevel),
    [data?.overallRiskLevel],
  );

  const selectedZoneDetails = useMemo(() => {
    if (!data?.zoneAnalysis?.length) return null;

    if (selectedZoneId) {
      return (
        data.zoneAnalysis.find(
          (zone) =>
            zone.zoneId === selectedZoneId ||
            zone._id === selectedZoneId ||
            zone.id === selectedZoneId,
        ) || data.zoneAnalysis[0]
      );
    }

    if (data?.selectedZoneId) {
      return (
        data.zoneAnalysis.find(
          (zone) =>
            zone.zoneId === data.selectedZoneId ||
            zone._id === data.selectedZoneId ||
            zone.id === data.selectedZoneId,
        ) || data.zoneAnalysis[0]
      );
    }

    return [...data.zoneAnalysis].sort(
      (a, b) => (b.riskScore || 0) - (a.riskScore || 0),
    )[0];
  }, [data?.zoneAnalysis, data?.selectedZoneId, selectedZoneId]);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <style>{`
          .ai-scrollbar::-webkit-scrollbar { width: 10px; }
          .ai-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
          .ai-scrollbar::-webkit-scrollbar-track { background: transparent; }

          .ai-btn {
            border: none;
            outline: none;
            cursor: pointer;
            transition: all 0.18s ease;
          }

          .ai-btn:hover {
            transform: translateY(-1px);
          }

          .ai-list {
            padding-left: 18px;
            margin: 0;
          }

          .ai-list li {
            margin-bottom: 10px;
            color: #334155;
            font-size: 14px;
            line-height: 1.55;
          }
        `}</style>

        <div
          className="ai-scrollbar"
          style={{
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "22px 24px 18px",
              borderBottom: "1px solid #e2e8f0",
              background:
                "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 100%)",
              color: "#fff",
              borderTopLeftRadius: "22px",
              borderTopRightRadius: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.08)",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  <span>🧠</span>
                  AI Enforcement Advisory
                </div>

                <h2
                  style={{
                    margin: "0 0 8px",
                    fontSize: "26px",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Restricted Area Risk Intelligence Brief
                </h2>

                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "rgba(226,232,240,0.88)",
                    lineHeight: 1.6,
                    maxWidth: "760px",
                  }}
                >
                  Restricted-area-focused operational summary with risk signals,
                  near-term outlook, and recommended enforcement attention.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="ai-btn"
                  onClick={() => loadAdvisory(true)}
                  disabled={refreshing}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  {refreshing ? "Refreshing..." : "↻ Refresh Analysis"}
                </button>

                <button
                  className="ai-btn"
                  onClick={onClose}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(239,68,68,0.12)",
                    color: "#fecaca",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>
          </div>

          <div style={{ padding: "22px" }}>
            {loading ? (
              <div>Loading advisory...</div>
            ) : error ? (
              <div
                style={{
                  ...sectionCard,
                  borderColor: "#fecaca",
                  background: "#fef2f2",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px",
                    color: "#991b1b",
                    fontSize: "16px",
                  }}
                >
                  Unable to load AI advisory
                </h3>
                <p style={{ ...mutedText, color: "#7f1d1d", margin: 0 }}>
                  {error}
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    ...sectionCard,
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginBottom: "14px",
                    }}
                  >
                    <h3 style={headingText}>Area Selection</h3>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        padding: "6px 10px",
                        borderRadius: "999px",
                      }}
                    >
                      Generate advisory by selected area
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <select
                      value={selectedZoneId}
                      onChange={handleZoneChange}
                      style={{
                        minWidth: "260px",
                        height: "42px",
                        borderRadius: "12px",
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        color: "#0f172a",
                        fontSize: "13px",
                        fontWeight: 600,
                        padding: "0 12px",
                        outline: "none",
                      }}
                    >
                      <option value="">All Active Areas</option>
                      {(data?.availableZones || []).map((zone) => (
                        <option key={zone.zoneId} value={zone.zoneId}>
                          {zone.zoneName}
                        </option>
                      ))}
                    </select>

                    <span style={mutedText}>
                      {selectedZoneId
                        ? "Showing advisory for the selected restricted area."
                        : "Showing combined advisory across all active areas."}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    marginBottom: "18px",
                    padding: "16px 18px",
                    borderRadius: "18px",
                    border: `1px solid ${risk.border}`,
                    background: risk.softBg,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "14px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ fontSize: "22px", lineHeight: 1 }}>
                      {risk.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: risk.text,
                          fontSize: "15px",
                          marginBottom: "4px",
                        }}
                      >
                        Restricted Area Risk Status: {risk.label}
                      </div>
                      <div style={{ ...mutedText, color: risk.text }}>
                        This advisory reflects current restricted-area
                        conditions and possible near-term protection pressure.
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "8px 14px",
                      borderRadius: "999px",
                      background: risk.bg,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "12px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {risk.label}
                  </div>
                </div>

                <div
                  style={{
                    ...sectionCard,
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginBottom: "14px",
                    }}
                  >
                    <h3 style={headingText}>Restricted Area Overview</h3>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        padding: "6px 10px",
                        borderRadius: "999px",
                      }}
                    >
                      Area-wise decision support
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <InfoPill
                      label="Area"
                      value={
                        selectedZoneDetails?.zoneName ||
                        data?.selectedZoneName ||
                        "Restricted Area"
                      }
                    />
                    <InfoPill
                      label="Risk Level"
                      value={
                        selectedZoneDetails?.ecologicalRisk ||
                        data?.overallRiskLevel
                      }
                    />
                    <InfoPill
                      label="Area Status"
                      value={selectedZoneDetails?.status || "ACTIVE"}
                    />
                    <InfoPill
                      label="Restricted Time"
                      value={selectedZoneDetails?.restrictedTime || "All Day"}
                    />
                    <InfoPill
                      label="Evidence Count"
                      value={selectedZoneDetails?.evidenceCount ?? "0"}
                    />
                  </div>
                </div>

                <div style={{ ...sectionCard, marginBottom: "18px" }}>
                  <h3 style={{ ...headingText, marginBottom: "12px" }}>
                    Executive Summary
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: "#334155",
                      fontSize: "14px",
                      lineHeight: 1.7,
                    }}
                  >
                    {data?.executiveSummary}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "18px",
                    marginBottom: "18px",
                  }}
                >
                  <div style={sectionCard}>
                    <h3 style={{ ...headingText, marginBottom: "14px" }}>
                      Key Concerns
                    </h3>
                    {data?.keyConcerns?.length ? (
                      <ul className="ai-list">
                        {data.keyConcerns.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyList text="No key concerns were returned by the analysis." />
                    )}
                  </div>

                  <div style={sectionCard}>
                    <h3 style={{ ...headingText, marginBottom: "14px" }}>
                      Future Outlook
                    </h3>
                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "14px",
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#1d4ed8",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          fontWeight: 700,
                          marginBottom: "6px",
                        }}
                      >
                        Near-Term Outlook
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#1e3a8a",
                          lineHeight: 1.7,
                          fontWeight: 600,
                        }}
                      >
                        {data?.futureOutlook}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "18px",
                    marginBottom: "18px",
                  }}
                >
                  <div style={sectionCard}>
                    <h3 style={{ ...headingText, marginBottom: "14px" }}>
                      Possible Near-Term Impact
                    </h3>
                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "14px",
                        background: "#fff7ed",
                        border: "1px solid #fed7aa",
                        color: "#9a3412",
                        fontSize: "14px",
                        lineHeight: 1.7,
                        fontWeight: 600,
                      }}
                    >
                      {data?.nearTermImpact}
                    </div>
                  </div>

                  <div style={sectionCard}>
                    <h3 style={{ ...headingText, marginBottom: "14px" }}>
                      Recommended Actions
                    </h3>
                    {data?.recommendedActions?.length ? (
                      <ol
                        style={{
                          margin: 0,
                          paddingLeft: "20px",
                        }}
                      >
                        {data.recommendedActions.map((action, index) => (
                          <li
                            key={index}
                            style={{
                              marginBottom: "12px",
                              color: "#334155",
                              fontSize: "14px",
                              lineHeight: 1.6,
                            }}
                          >
                            {action}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <EmptyList text="No recommended actions were returned by the analysis." />
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "18px",
                  }}
                >
                  <div style={sectionCard}>
                    <h3 style={{ ...headingText, marginBottom: "14px" }}>
                      Expected Impact
                    </h3>
                    {data?.expectedImpact?.length ? (
                      <ul className="ai-list">
                        {data.expectedImpact.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyList text="No expected impact details were returned by the analysis." />
                    )}
                  </div>

                  <div style={sectionCard}>
                    <h3 style={{ ...headingText, marginBottom: "14px" }}>
                      Patrol Timing
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginBottom: "12px",
                      }}
                    >
                      <InfoPill
                        label="Highest Priority Window"
                        value={data?.patrolTiming?.highestPriorityWindow}
                      />
                    </div>
                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "14px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        color: "#334155",
                        fontSize: "14px",
                        lineHeight: 1.7,
                      }}
                    >
                      {data?.patrolTiming?.notes ||
                        "No patrol timing notes available."}
                    </div>
                  </div>
                </div>

                {process.env.NODE_ENV === "development" && raw ? (
                  <details
                    style={{
                      marginTop: "18px",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      padding: "14px",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        fontWeight: 700,
                        color: "#334155",
                      }}
                    >
                      Debug response
                    </summary>
                    <pre
                      style={{
                        marginTop: "12px",
                        fontSize: "12px",
                        color: "#334155",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {JSON.stringify(raw, null, 2)}
                    </pre>
                  </details>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
