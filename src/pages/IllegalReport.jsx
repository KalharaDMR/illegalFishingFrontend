import React, { useState } from "react";
import axios from "../api/axios";

const IllegalReport = () => {
  const [formData, setFormData] = useState({
    reportDate: "",
    reportTime: "",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
  });
  const [evidence, setEvidence] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setEvidence([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    evidence.forEach((file) => data.append("evidence", file));

    try {
      const token = localStorage.getItem("token"); // Public User token

      // ✅ Changed URL from "/" to correct backend endpoint
      const res = await axios.post(
        "http://localhost:5000/api/reports/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      setFormData({
        reportDate: "",
        reportTime: "",
        location: "",
        latitude: "",
        longitude: "",
        description: "",
      });
      setEvidence([]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting report");
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-3 text-cyan-900">
        Report Illegal Fishing
      </h3>
      {message && <p className="mb-3 text-green-700 font-medium">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="date"
          name="reportDate"
          value={formData.reportDate}
          onChange={handleChange}
          required
          className="p-2 rounded border border-cyan-600"
        />
        <input
          type="time"
          name="reportTime"
          value={formData.reportTime}
          onChange={handleChange}
          required
          className="p-2 rounded border border-cyan-600"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="p-2 rounded border border-cyan-600"
        />
        <input
          type="text"
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
          className="p-2 rounded border border-cyan-600"
        />
        <input
          type="text"
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
          className="p-2 rounded border border-cyan-600"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="p-2 rounded border border-cyan-600"
        />
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          accept="image/*,video/*"
          className="p-2"
        />
        <button
          type="submit"
          className="bg-cyan-700 text-white p-2 rounded hover:bg-cyan-900 mt-2 font-bold"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default IllegalReport;
