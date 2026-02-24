import React from "react";

const EndangeredSpecies = ({ species }) => {
  return (
    <div>
      {species.map((s, idx) => (
        <div key={idx} className="bg-cyan-400 rounded-md p-3 mb-3 text-white shadow">
          <h4 className="font-bold">{s.name}</h4>
          <p>Status: {s.status}</p>
          <p>Habitat: {s.habitat}</p>
        </div>
      ))}
    </div>
  );
};

export default EndangeredSpecies;
