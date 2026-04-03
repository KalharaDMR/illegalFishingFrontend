import React from "react";

const RestrictedAreas = ({ areas }) => {
  return (
    <div>
      {areas.map((area, idx) => (
        <div key={idx} className="bg-cyan-400 rounded-md p-3 mb-3 text-white shadow">
          <h4 className="font-bold">{area.name}</h4>
          <p>{area.location}</p>
          <p>{area.startDate} - {area.endDate}</p>
          <p>Restricted Time: {area.time}</p>
        </div>
      ))}
    </div>
  );
};

export default RestrictedAreas;
