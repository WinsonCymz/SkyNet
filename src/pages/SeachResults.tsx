import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SeachResults.css";
import flightsData from "../data/flights.json";

type Flight = {
  airline?: { name?: string };
  departure?: { scheduled?: string; iata?: string };
  arrival?: { scheduled?: string; iata?: string };
  price?: string;
};

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [flights, setFlights] = useState<Flight[]>([]);

  // Destructure state before useEffect so from/to are available
  const { from, to, departDate, returnDate, adults, children, cabinClass } =
    state || {};

  useEffect(() => {
    if (!state) {
      navigate("/");
    } else {
      // Filter flightsData by both departure and arrival IATA matching 'from' and 'to'
      const extractIata = (location: string) => {
        const match = location.match(/\(([^)]+)\)/);
        return match ? match[1] : location;
      };
      const fromIata = extractIata(from || "").toUpperCase();
      const toIata = extractIata(to || "").toUpperCase();

      const filteredFlights = flightsData.filter(
        (flight) =>
          flight.departure?.iata?.toUpperCase() === fromIata &&
          flight.arrival?.iata?.toUpperCase() === toIata
      );

      setFlights(filteredFlights);
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const flightsWithPrices: Flight[] = flights.map((flight) => ({
    ...flight,
    price:
      flight.price ?? `$${(Math.floor(Math.random() * 300) + 50).toString()}`, // generates $50–$349
  }));

  if (flightsWithPrices.length === 0) {
    return (
      <div className="search-results-container">
        <h2>
          {from} → {to} | {new Date(departDate).toLocaleDateString()} –{" "}
          {returnDate ? new Date(returnDate).toLocaleDateString() : "One-way"} |{" "}
          {adults} Adults, {children} Children, {cabinClass}
        </h2>
        <p>No flights found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <h2>
        {from} → {to} | {new Date(departDate).toLocaleDateString()} –{" "}
        {returnDate ? new Date(returnDate).toLocaleDateString() : "One-way"} |{" "}
        {adults} Adults, {children} Children, {cabinClass}
      </h2>

      <div className="flight-list">
        {flightsWithPrices.map((flight, idx) => {
          if (!flight.airline?.name?.trim()) {
            return null;
          }

          const departureTime = flight.departure?.scheduled
            ? new Date(flight.departure.scheduled)
            : null;
          const arrivalTime = flight.arrival?.scheduled
            ? new Date(flight.arrival.scheduled)
            : null;

          let duration = "Unknown";
          if (departureTime && arrivalTime) {
            const diffMs = arrivalTime.getTime() - departureTime.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const hours = Math.floor(diffMins / 60);
            const minutes = diffMins % 60;
            duration = `${hours}h ${minutes}m`;
          }

          return (
            <div className="flight-card" key={idx}>
              <div className="flight-info">
                <p className="airline-name">
                  {flight.airline?.name || "Unknown Airline"}
                </p>
                <div className="flight-times">
                  <strong>
                    {flight.departure?.scheduled
                      ? flight.departure.scheduled.substring(11, 16)
                      : "??:??"}
                  </strong>{" "}
                  <span>{flight.departure?.iata || "?"}</span> →{" "}
                  <strong>
                    {flight.arrival?.scheduled
                      ? flight.arrival.scheduled.substring(11, 16)
                      : "??:??"}
                  </strong>{" "}
                  <span>{flight.arrival?.iata || "?"}</span>
                </div>
                <div className="flight-duration">Duration: {duration}</div>
                <div className="flight-right">
                  <div className="flight-price">
                    <span>{flight.price}</span>
                  </div>
                  <button
                    className="flight-button"
                    onClick={() =>
                      navigate("/flight-details", {
                        state: {
                          flight,
                          from,
                          to,
                          departDate,
                          returnDate,
                          adults,
                          children,
                          cabinClass,
                          price: flight.price,
                        },
                      })
                    }
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
