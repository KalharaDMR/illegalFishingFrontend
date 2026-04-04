import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export function MapRecenter({ lat, lng, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null && zoom != null) {
      map.setView([lat, lng], zoom, { animate: true });
    }
  }, [lat, lng, zoom, map]);
  return null;
}

/**
 * When `focus` is set (user picked a nearby result), fly the map to that pin.
 * When `focus` is null, fall back to user position or default area.
 */
export function NearbyMapViewSync({ focus, userPos, defaultCenter, defaultZoom, userZoom = 11 }) {
  const map = useMap();
  useEffect(() => {
    if (focus?.lat != null && focus?.lng != null) {
      const z = focus.zoom ?? 15;
      map.flyTo([focus.lat, focus.lng], z, { duration: 0.65 });
      return;
    }
    if (userPos) {
      map.setView([userPos.lat, userPos.lng], userZoom, { animate: true });
      return;
    }
    map.setView([defaultCenter.lat, defaultCenter.lng], defaultZoom, { animate: true });
  }, [focus?.lat, focus?.lng, focus?.zoom, userPos, defaultCenter.lat, defaultCenter.lng, defaultZoom, userZoom, map]);
  return null;
}

export function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
