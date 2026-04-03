// ── Base URL — points to your Express backend ────────────────
export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// ── Shared input style used in both modals ───────────────────
export const inputStyle = {
  width: "100%",
  border: "1px solid #dde3ee",
  borderRadius: "8px",
  padding: "9px 12px",
  fontSize: "13px",
  color: "#1a2235",
  background: "#f8fafc",
  outline: "none",
  boxSizing: "border-box",
};
