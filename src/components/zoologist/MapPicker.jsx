import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
} from "../../zoologist/constants";
import { nominatimReverse } from "../../zoologist/nominatimReverse";
import { MapClickHandler, MapRecenter } from "./leafletHelpers";

/**
 * Click map to set [lng, lat]. Optional Nominatim reverse geocode for address fields.
 */
export default function MapPicker({ value, onChange }) {
  const position = useMemo(() => {
    if (value?.coordinates?.length === 2) {
      return {
        lat: Number(value.coordinates[1]),
        lng: Number(value.coordinates[0]),
      };
    }
    return { lat: DEFAULT_MAP_CENTER.lat, lng: DEFAULT_MAP_CENTER.lng };
  }, [value]);

  const zoom = value?.coordinates?.length === 2 ? 12 : DEFAULT_MAP_ZOOM;

  const [manualLng, setManualLng] = useState(
    value?.coordinates?.[0] != null ? String(value.coordinates[0]) : ""
  );
  const [manualLat, setManualLat] = useState(
    value?.coordinates?.[1] != null ? String(value.coordinates[1]) : ""
  );
  const [locationError, setLocationError] = useState("");

  const lngCoord = value?.coordinates?.[0];
  const latCoord = value?.coordinates?.[1];
  useEffect(() => {
    if (lngCoord != null && latCoord != null) {
      setManualLng(String(lngCoord));
      setManualLat(String(latCoord));
    }
  }, [lngCoord, latCoord]);

  const applyCoords = useCallback(
    (lng, lat, extra = {}) => {
      const lo = parseFloat(lng);
      const la = parseFloat(lat);
      if (Number.isNaN(lo) || Number.isNaN(la)) return;
      onChange({
        type: "Point",
        coordinates: [lo, la],
        address: extra.address ?? value?.address ?? "",
        city: extra.city ?? value?.city ?? "",
        country: extra.country ?? value?.country ?? "",
        formattedAddress:
          extra.formattedAddress ?? value?.formattedAddress ?? "",
      });
    },
    [onChange, value]
  );

  const onUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setManualLng(String(lng));
        setManualLat(String(lat));
        const geo = await nominatimReverse(lat, lng);
        if (geo?.formattedAddress) {
          applyCoords(lng, lat, geo);
        } else {
          applyCoords(lng, lat);
        }
      },
      () => {
        setLocationError("Location permission denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const onMapClick = useCallback(
    async (lat, lng) => {
      setManualLng(String(lng));
      setManualLat(String(lat));
      const geo = await nominatimReverse(lat, lng);
      if (geo?.formattedAddress) {
        applyCoords(lng, lat, geo);
      } else {
        applyCoords(lng, lat);
      }
    },
    [applyCoords]
  );

  return (
    <div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: "600",
          color: "#374263",
          marginBottom: "8px",
        }}
      >
        Location on map
      </div>
      <p
        style={{
          fontSize: "11px",
          color: "#6b7a99",
          margin: "0 0 10px",
          lineHeight: 1.45,
        }}
      >
        Map: OpenStreetMap · Addresses from Nominatim (best-effort). You can always set coordinates manually below.
      </p>
      <div
        className="zoo-animate-fade-in"
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e4eaf3",
          boxShadow: "0 4px 18px rgba(10,22,40,0.06)",
          height: "280px",
        }}
      >
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
          <MapRecenter lat={position.lat} lng={position.lng} zoom={zoom} />
          <MapClickHandler onSelect={onMapClick} />
          {value?.coordinates?.length === 2 && (
            <Marker position={[Number(value.coordinates[1]), Number(value.coordinates[0])]} />
          )}
        </MapContainer>
      </div>
      <div style={{ marginTop: "12px", display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          type="button"
          className="zoo-btn-press zoo-focus-ring"
          onClick={onUseMyLocation}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #22d3b0, #0ea5e9)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Use my location
        </button>
        {locationError && (
          <span style={{ fontSize: "12px", color: "#b91c1c" }}>{locationError}</span>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginTop: "12px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              color: "#6b7a99",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Longitude
          </label>
          <input
            className="zoo-focus-ring"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            onBlur={() => {
              if (manualLat && manualLng) applyCoords(manualLng, manualLat);
            }}
            placeholder="79.8"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #dde3ec",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              color: "#6b7a99",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Latitude
          </label>
          <input
            className="zoo-focus-ring"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            onBlur={() => {
              if (manualLat && manualLng) applyCoords(manualLng, manualLat);
            }}
            placeholder="7.9"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #dde3ec",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
      {value?.formattedAddress && (
        <p style={{ fontSize: "12px", color: "#6b7a99", marginTop: "8px", marginBottom: 0 }}>
          {value.formattedAddress}
        </p>
      )}
    </div>
  );
}
