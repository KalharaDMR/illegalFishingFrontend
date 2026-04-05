import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in many React bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);

  return null;
}

export default function LeafletLocationPicker({ lat, lng, onChange }) {
  const position = {
    lat: Number(lat) || 7.8731,
    lng: Number(lng) || 80.7718,
  };

  return (
    <div
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #dde3ee",
        height: "190px",
      }}
    >
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[position.lat, position.lng]} />
        <MapClickHandler onPick={onChange} />
        <RecenterMap center={position} />
      </MapContainer>
    </div>
  );
}
