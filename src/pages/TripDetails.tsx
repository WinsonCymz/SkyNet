import React from "react";
import { useLocation } from "react-router-dom";
import "./TripDetails.css";

const TripDetails: React.FC = () => {
  const location = useLocation();
  const {
    departDate = "",
    returnDate = "",
    adults = 1,
    children = 0,
    cabinClass = "Not specified",
  } = location.state || {};

  return (
    <div className="trip-info-summary">
      <h3>Trip Overview</h3>
      <p>
        <strong>Trip Type:</strong> {returnDate ? "Return" : "One Way"}
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
