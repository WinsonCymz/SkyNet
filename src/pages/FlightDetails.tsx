import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSuitcaseRolling } from "react-icons/fa";
import mastercardLogo from "../assets/mastercard.png";
import visaLogo from "../assets/visa.png";
import "./FlightDetails.css";
import PriceDetails from "./PriceDetails.tsx";
import TripDetails from "./TripDetails.tsx";

const FlightDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [selectedFare, setSelectedFare] = React.useState("low");
  const [baggagePrice, setBaggagePrice] = React.useState(0);

  if (!state) {
    return <p>No flight selected.</p>;
  }

  const {
    flight = {},
    from,
    to,
    departDate,
    returnDate,
    adults,
    children,
    cabinClass,
    price,
    title,
    firstName,
    middleName,
    lastName,
    dobDay,
    dobMonth,
    dobYear,
    nationality,
    passportNumber,
    passportCountry,
    validityDay,
    validityMonth,
    validityYear,
    contactFirstName,
    contactLastName,
    contactPhone,
    email,
  } = state || {};

  // Calculate robust total price before return
  const basePrice = parseFloat(
    price?.toString().replace(/[^0-9.]/g, "") || "0"
  );
  const premiumFareAddon = 89.85;
  const totalPrice = !isNaN(basePrice)
    ? (selectedFare === "low"
        ? basePrice + baggagePrice
        : basePrice + premiumFareAddon + baggagePrice
      ).toFixed(2)
    : "NaN";

  return (
    <div className="flight-details">
      <TripDetails />
      <div className="flight-summary">
        <div className="progress-tracker">
          <div className="step completed">
            <div className="circle">&#10003;</div>
            <p>Search results</p>
          </div>
          <div className="line active"></div>
          <div className="step active">
            <div className="circle">&#10003;</div>
            <p>Flights</p>
          </div>
          <div className="line active"></div>
          <div className="step">
            <div className="circle">3</div>
            <p>Passengers</p>
          </div>
          <div className="line"></div>
          <div className="step">
            <div className="circle">4</div>
            <p>Pay</p>
          </div>
        </div>
        <h2>Flight Summary</h2>
        <div className="flight-summary-content">
          <div className="flight-summary-main">
            <div className="flight-card">
              <div className="your-trip">
                <div className="flight-summary-row">
                  <span className="flight-summary-airline">
                    {flight.airline?.name}
                  </span>
                  <span className="flight-summary-times">
                    <strong>
                      {new Date(flight.departure?.scheduled).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                      {flight.departure?.iata} →{" "}
                      {new Date(flight.arrival?.scheduled).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                      {flight.arrival?.iata}
                    </strong>
                  </span>
                  <span className="flight-summary-duration">
                    Duration: 3h 0m
                  </span>
                </div>
              </div>

              <div className="your-fare">
                <h3>Your Fare</h3>
                <div className="fare-options">
                  <div className="fare-card low-fare">
                    <h4>
                      Low Fare <span>+ SG$0.00</span>
                    </h4>
                    <h5>Baggage</h5>
                    <ul>
                      <li>✔ 7kg carry-on baggage</li>
                      <li>✘ No checked baggage</li>
                    </ul>
                    <h5>Flexibility</h5>
                    <ul>
                      <li>
                        $ Fare difference may apply (Allowed for a fee up to 48
                        hours before scheduled time of departure)
                      </li>
                      <li>✘ Non-Refundable</li>
                    </ul>
                    <h5>Seat</h5>

                    <button
                      className={
                        selectedFare === "low" ? "selected-btn" : "upgrade-btn"
                      }
                      onClick={() => setSelectedFare("low")}
                    >
                      {selectedFare === "low" ? "Selected" : "Select"}
                    </button>
                  </div>

                  <div className="fare-card premium-flex">
                    <h4>
                      Premium Flex{" "}
                      <span>+ SG${premiumFareAddon.toFixed(2)}</span>
                    </h4>
                    <h5>Baggage</h5>
                    <ul>
                      <li>✔ 7kg carry-on baggage</li>
                      <li>✔ 20kg checked baggage</li>
                    </ul>
                    <h5>Flexibility</h5>
                    <ul>
                      <li>✔ 2 times free ( Fare difference may apply )</li>
                      <li>✘ Non-Refundable</li>
                    </ul>
                    <h5>Seat</h5>
                    <p>✔ Pick seat for free</p>

                    <button
                      className={
                        selectedFare === "premium"
                          ? "selected-btn"
                          : "upgrade-btn"
                      }
                      onClick={() => setSelectedFare("premium")}
                    >
                      {selectedFare === "premium" ? "Selected" : "Upgrade"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="baggage-section">
              <h3>
                <FaSuitcaseRolling className="baggage-icon" /> Your Baggage
              </h3>
              <div className="baggage-trip">
                <strong>Trip 1</strong> | {from} → {to}
              </div>
              <div className="baggage-info">
                <div className="baggage-columns">
                  <div className="baggage-column">
                    <FaSuitcaseRolling className="baggage-icon" />
                    <h4>Free checked baggage</h4>
                    <p>No free baggage allowance</p>
                  </div>
                  <div className="baggage-column">
                    <FaSuitcaseRolling className="baggage-icon" />
                    <h4>Extra checked baggage</h4>
                    <select
                      className="baggage-dropdown"
                      onChange={(e) => {
                        const selectedText =
                          e.target.options[e.target.selectedIndex].text;
                        const match = selectedText.match(/SG\$(\d+\.\d{2})/);
                        setBaggagePrice(match ? parseFloat(match[1]) : 0);
                      }}
                    >
                      <option value="">Add</option>
                      <option value="25kg">+25 kg — SG$80.74</option>
                      <option value="30kg">+30 kg — SG$89.83</option>
                      <option value="40kg">+40 kg — SG$113.07</option>
                      <option value="50kg">+50 kg — SG$138.39</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="confirm-button"
              onClick={() =>
                navigate("/passenger-info", {
                  state: {
                    flight,
                    from,
                    to,
                    departDate: departDate || "",
                    returnDate: returnDate || "",
                    adults: adults || 1,
                    children: children || 0,
                    cabinClass: cabinClass || "Not specified",
                    price,
                    title,
                    firstName,
                    middleName,
                    lastName,
                    dobDay,
                    dobMonth,
                    dobYear,
                    nationality,
                    passportNumber,
                    passportCountry,
                    validityDay,
                    validityMonth,
                    validityYear,
                    contactFirstName,
                    contactLastName,
                    contactPhone,
                    email,
                    priceSummary: {
                      base: basePrice.toFixed(2),
                      extras: (selectedFare === "premium"
                        ? premiumFareAddon
                        : 0
                      ).toFixed(2),
                      baggage: baggagePrice.toFixed(2),
                      selectedFare,
                      total: totalPrice,
                    },
                  },
                })
              }
            >
              Next: Passengers
            </button>
          </div>
        </div>
      </div>
      <PriceDetails
        price={basePrice}
        selectedFare={selectedFare as "low" | "premium"}
        premiumFareAddon={premiumFareAddon}
        baggagePrice={baggagePrice}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default FlightDetails;
