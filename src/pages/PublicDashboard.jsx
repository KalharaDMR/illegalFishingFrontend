import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestrictedAreas from "../components/RestrictedAreas";
import EndangeredSpecies from "../components/EndangeredSpecies";

const PublicDashboard = () => {
  const [restrictedAreas, setRestrictedAreas] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const username = localStorage.getItem("username") || "User";
  const navigate = useNavigate();

  useEffect(() => {
    setRestrictedAreas([
      {
        name: "Hikkaduwa Marine Sanctuary",
        location: "Hikkaduwa, Galle District, Sri Lanka",
        startDate: "1/1/2025",
        endDate: "12/31/2027",
        time: "All Day",
      },
      {
        name: "Pigeon Island Marine National Park",
        location: "Trincomalee, Eastern Province, Sri Lanka",
        startDate: "1/1/2026",
        endDate: "Ongoing",
        time: "6:00 PM - 6:00 AM",
      },
    ]);

    setSpeciesList([
      {
        name: "Green Sea Turtle",
        status: "Endangered",
        habitat: "Coastal waters of Sri Lanka",
      },
      {
        name: "Dugong",
        status: "Vulnerable",
        habitat: "Shallow lagoons and bays",
      },
    ]);
  }, []);

  return (
    <div className="bg-cyan-100 min-h-screen p-6">

      {/* Header */}
      <header className="flex justify-between items-center bg-cyan-900 p-4 rounded-lg shadow-md mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">OceanWatch</h1>
          <p className="text-cyan-200 mt-1">SDG 14: Life Below Water</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-700 text-white rounded-full flex items-center justify-center font-bold shadow">
            {username[0].toUpperCase()}
          </div>
          <span className="text-white font-semibold">{username}</span>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6">

        {/* Endangered Species */}
        <div className="bg-cyan-200 p-6 rounded-lg shadow-lg w-full md:w-96 hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-semibold mb-3 text-cyan-900">
            Endangered Species
          </h3>
          <EndangeredSpecies species={speciesList} />
        </div>

        {/* Restricted Areas */}
        <div className="bg-cyan-200 p-6 rounded-lg shadow-lg w-full md:w-96 hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-semibold mb-3 text-cyan-900">
            Restricted Areas
          </h3>
          <RestrictedAreas areas={restrictedAreas} />
        </div>

        {/* Report Illegal Fishing */}
        <div className="bg-red-100 p-6 rounded-lg shadow-lg w-full md:w-96 text-center hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-semibold mb-4 text-red-700">
            Report Illegal Fishing
          </h3>
          <button
            onClick={() => navigate("/report")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-700 shadow"
          >
            🚨 Submit Report
          </button>
        </div>

        {/* ✅ NEW - My Reports */}
        <div className="bg-green-100 p-6 rounded-lg shadow-lg w-full md:w-96 text-center hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-semibold mb-4 text-green-700">
            My Submitted Reports
          </h3>
          <button
            onClick={() => navigate("/my-reports")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 shadow"
          >
            📂 View My Reports
          </button>
        </div>

      </div>
    </div>
  );
};

export default PublicDashboard;
