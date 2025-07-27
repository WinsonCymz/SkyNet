import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SeachResults.css";

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
  const {
    from,
    to,
    departDate,
    returnDate,
    adults,
    children,
    cabinClass,
    tripType,
  } = state || {};
  console.log("SearchResults received state:", {
    from,
    to,
    departDate,
    returnDate,
    adults,
    children,
    cabinClass,
    tripType,
  });

  useEffect(() => {
    if (!state) {
      navigate("/");
    } else {
      const cityToIata: Record<string, string> = {
        Singapore: "SIN",
        "Kuala Lumpur": "KUL",
        Tokyo: "HND",
        Osaka: "KIX",
        Bangkok: "BKK",
        Narita: "NRT",
        "Haneda (Tokyo)": "HND",
        Seoul: "ICN",
        Jakarta: "CGK",
        Manila: "MNL",
        "Hong Kong": "HKG",
        Beijing: "PEK",
        Shanghai: "PVG",
        Taipei: "TPE",
        Dubai: "DXB",
        Doha: "DOH",
        London: "LHR",
        Paris: "CDG",
        Frankfurt: "FRA",
        Amsterdam: "AMS",
        "New York": "JFK",
        "Los Angeles": "LAX",
        "San Francisco": "SFO",
        Chicago: "ORD",
        Toronto: "YYZ",
        Sydney: "SYD",
        Melbourne: "MEL",
        Auckland: "AKL",
        Perth: "PER",
      };
      const extractIata = (location: string) => {
        const match = location.match(/\(([^)]+)\)/);
        if (match) return match[1];
        return cityToIata[location] || location;
      };
      const fromIata = extractIata(from || "").toUpperCase();
      const toIata = extractIata(to || "").toUpperCase();

      const fetchFlights = async () => {
        try {
          const baseUrl =
            process.env.REACT_APP_API_URL || "http://localhost:4000";
          const response = await fetch(`${baseUrl}/api/flights`);
          const data = await response.json();
          // Transform backend data to frontend shape
          const transformed: Flight[] = (data || []).map((item: any) => ({
            airline: { name: item.airline_name },
            departure: {
              iata: item.departure_iata,
              scheduled: item.departure_time,
            },
            arrival: {
              iata: item.arrival_iata,
              scheduled: item.arrival_time,
            },
            // price: item.price,
          }));

          const filteredFlights = transformed.filter(
            (flight) =>
              flight.departure?.iata?.toUpperCase() === fromIata &&
              flight.arrival?.iata?.toUpperCase() === toIata
          );

          setFlights(filteredFlights);
        } catch (error) {
          console.error("Failed to fetch flights:", error);
        }
      };

      fetchFlights();
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
          {from} → {to} |{" "}
          {departDate && !isNaN(new Date(departDate).getTime())
            ? new Date(departDate).toLocaleDateString()
            : "Invalid Date"}{" "}
          –{" "}
          {tripType === "Return" &&
          returnDate &&
          !isNaN(new Date(returnDate).getTime())
            ? new Date(returnDate).toLocaleDateString()
            : "One-way"}{" "}
          | {adults} Adults, {children} Children, {cabinClass}
        </h2>
        <p>No flights found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <h2>
        {from} → {to} |{" "}
        {departDate && !isNaN(new Date(departDate).getTime())
          ? new Date(departDate).toLocaleDateString()
          : "Invalid Date"}{" "}
        –{" "}
        {tripType === "Return" &&
        returnDate &&
        !isNaN(new Date(returnDate).getTime())
          ? new Date(returnDate).toLocaleDateString()
          : "One-way"}{" "}
        | {adults} Adults, {children} Children, {cabinClass}
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
                          tripType,
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
