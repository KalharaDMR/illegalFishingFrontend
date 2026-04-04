/**
 * Decode JWT payload (no signature verification — UI only).
 * Backend signs { userId, role, ... }.
 */
export function getJwtPayload() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getCurrentUserId() {
  const p = getJwtPayload();
  if (!p?.userId) return null;
  return String(p.userId);
}

export function canManageSpecies(species) {
  const uid = getCurrentUserId();
  if (!uid || !species?.submittedBy) return false;
  return String(species.submittedBy) === uid;
}
