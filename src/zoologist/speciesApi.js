import api from "../api/axios";

export async function getSpeciesPage(params) {
  const res = await api.get("/species", { params });
  return res.data;
}

export async function getNearbySpecies({ longitude, latitude, maxDistance = 50000 }) {
  const res = await api.post("/species/nearby", {
    longitude,
    latitude,
    maxDistance,
  });
  return res.data;
}

export async function getSpeciesDetailsByLocation(location) {
  const res = await api.post("/species/details-by-location", { location });
  return res.data;
}

export async function createSpecies(formData) {
  const res = await api.post("/species", formData);
  return res.data;
}

export async function updateSpecies(id, formData) {
  const res = await api.put(`/species/${id}`, formData);
  return res.data;
}

export async function deleteSpecies(id) {
  const res = await api.delete(`/species/${id}`);
  return res.data;
}
