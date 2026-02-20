import { useEffect, useState } from "react";
import RestrictedAreas from "../components/RestrictedAreas";
import EndangeredSpecies from "../components/EndangeredSpecies";
import IllegalReport from "./IllegalReport";

const PublicDashboard = () => {
  const [restrictedAreas, setRestrictedAreas] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const username = localStorage.getItem("username") || "Public User";

  useEffect(() => {
    // MOCK DATA
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

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="bg-red-600 text-white px-4 py-2 rounded float-right"
      >
        Logout
      </button>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-900">OceanWatch</h1>
        <h2 className="text-xl text-cyan-700 mt-2">
          SDG 14: Life Below Water
        </h2>
        <p className="mt-2 text-cyan-800">
          Welcome, {username}! Help us protect marine life by reporting illegal
          fishing activities and learning about endangered species.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-6">

        <div className="bg-cyan-200 p-4 rounded-lg shadow-lg w-full md:w-96">
          <h3 className="text-2xl font-semibold mb-3 text-cyan-900">
            Endangered Species
          </h3>
          <EndangeredSpecies species={speciesList} />
        </div>

        <div className="bg-cyan-200 p-4 rounded-lg shadow-lg w-full md:w-96">
          <h3 className="text-2xl font-semibold mb-3 text-cyan-900">
            Restricted Areas
          </h3>
          <RestrictedAreas areas={restrictedAreas} />
        </div>

        <div className="bg-cyan-200 p-4 rounded-lg shadow-lg w-full md:w-96">
          <IllegalReport />
        </div>

      </div>
    </div>
  );
};

export default PublicDashboard;
