// src/components/authorizedDashboard/dashboardConstants.js

// ── Base URL — points to your Express backend ────────────────
export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const inputStyle = {
  width: "100%",
  border: "1.5px solid #d0d9e8",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "13px",
  color: "#0d1f3c",
  background: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.18s ease, box-shadow 0.18s ease",
};

// ════════════════════════════════════════════════════════════════
// INVESTIGATION CONSTANTS
// ════════════════════════════════════════════════════════════════

export const focusStyle = {
  borderColor: "#0ea5e9",
  boxShadow: "0 0 0 3px rgba(14,165,233,0.15)",
};

export const reportStatusConfig = {
  PENDING: { bg: "#fff8e6", color: "#92580a", label: "Pending" },
  INVESTIGATING: { bg: "#e0f2fe", color: "#075985", label: "Investigating" },
  RESOLVED: { bg: "#dcfce7", color: "#166534", label: "Resolved" },
};

export const invStatusConfig = {
  NOT_STARTED: { bg: "#f1f5f9", color: "#475569", label: "Not Started" },
  INVESTIGATING: { bg: "#e0f2fe", color: "#075985", label: "In Progress" },
  COMPLETED: { bg: "#dcfce7", color: "#166534", label: "Completed" },
};

export const actionConfig = {
  NO_ACTION: { bg: "#f1f5f9", color: "#475569" },
  WARNING: { bg: "#fff8e6", color: "#92580a" },
  FINE: { bg: "#fee2e2", color: "#991b1b" },
  EQUIPMENT_CONFISCATED: { bg: "#e0f2fe", color: "#075985" },
  ARREST: { bg: "#fee2e2", color: "#7f1d1d" },
  OTHER: { bg: "#f1f5f9", color: "#475569" },
};

export const ACTION_OPTIONS = [
  { value: "NO_ACTION", label: "No Action" },
  { value: "WARNING", label: "Warning Issued" },
  { value: "FINE", label: "Fine Issued" },
  { value: "EQUIPMENT_CONFISCATED", label: "Equipment Confiscated" },
  { value: "ARREST", label: "Arrest Made" },
  { value: "OTHER", label: "Other" },
];
