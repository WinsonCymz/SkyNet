import React from "react";
import { useLocation } from "react-router-dom";
import "./TripDetails.css";

const TripDetails: React.FC = () => {
  const location = useLocation();
  const {
    from = "",
    to = "",
    departDate = "",
    returnDate = "",
    adults = 1,
    children = 0,
    cabinClass = "Not specified",
    tripType = returnDate ? "Return" : "One Way",
  } = location.state || {};

  return (
    <div className="trip-info-summary">
      <h3>Trip Overview</h3>
      <p>
        <strong>Route:</strong> {from} → {to}
      </p>
      <p>
        <strong>Trip Type:</strong> {tripType}
      </p>
      <p>
        <strong>Depart:</strong> {new Date(departDate).toLocaleDateString()}
      </p>
      {returnDate && (
        <p>
          <strong>Return:</strong> {new Date(returnDate).toLocaleDateString()}
        </p>
      )}
      <p>
        <strong>Passengers:</strong> {adults} Adults, {children} Children
      </p>
      <p>
        <strong>Class:</strong> {cabinClass}
      </p>
    </div>
  );
};

export default TripDetails;
