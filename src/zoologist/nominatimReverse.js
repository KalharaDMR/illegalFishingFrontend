/**
 * OpenStreetMap Nominatim reverse geocode (no API key; use sparingly per usage policy).
 */
export async function nominatimReverse(lat, lng) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lng)}`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address || {};
    const city = a.city || a.town || a.village || a.municipality || a.county || "";
    return {
      formattedAddress: data.display_name || "",
      address: data.display_name || "",
      city,
      country: a.country || "",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
