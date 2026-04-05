/** Matches backend Species.model fishes.conservationStatus enum */
export const CONSERVATION_STATUSES = [
  "Critically Endangered",
  "Endangered",
  "Vulnerable",
  "Near Threatened",
  "Least Concern",
  "Data Deficient",
  "Not Evaluated",
];

/** Default map center: Sri Lanka */
export const DEFAULT_MAP_CENTER = { lat: 7.8731, lng: 80.7718 };
export const DEFAULT_MAP_ZOOM = 7;

/** OpenStreetMap raster tiles (no API key) */
export const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
