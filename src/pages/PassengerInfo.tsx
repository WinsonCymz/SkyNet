import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PassengerInfo.css";
import PriceDetails from "./PriceDetails.tsx";
import TripDetails from "./TripDetails.tsx";

const PassengerInfo: React.FC = () => {
  const [passengers, setPassengers] = useState([
    {
      type: "Adult",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dobDay: "",
      dobMonth: "",
      dobYear: "",
      nationality: "",
      passportNumber: "",
      passportCountry: "",
      validityDay: "",
      validityMonth: "",
      validityYear: "",
    },
  ]);
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  // Helper for updating a passenger's field
  const handlePassengerChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const location = useLocation();
  const priceSummary = location.state?.priceSummary || null;
  console.log("PassengerInfo received state:", location.state);
  return (
    <div className="passenger-details">
      <TripDetails />
      <div className="passenger-info-page">
        <div className="passenger-form-section">
          <div className="progress-tracker">
            <div className="step completed">
              <div className="circle">&#10003;</div>
              <p>Search results</p>
            </div>
            <div className="line active"></div>
            <div className="step completed">
              <div className="circle">&#10003;</div>
              <p>Flights</p>
            </div>
            <div className="line active"></div>
            <div className="step active">
              <div className="circle">3</div>
              <p>Passengers</p>
            </div>
            <div className="line"></div>
            <div className="step">
              <div className="circle">4</div>
              <p>Pay</p>
            </div>
          </div>
          <h2>Passenger Info</h2>
          <p className="notice-box">
            <strong>
              Passenger’s information must be entered as per their passports
            </strong>
            <br />
            Ensure passport validity and correct spelling.
          </p>

          {passengers.map((p, idx) => (
            <div key={idx}>
              <h3>Passenger {idx + 1}</h3>
              <form className="passenger-form">
                <div className="form-row">
                  <select
                    value={p.type || "Adult"}
                    onChange={(e) =>
                      handlePassengerChange(idx, "type", e.target.value)
                    }
                  >
                    <option value="Adult">Adult</option>
                    <option value="Child">Child</option>
                  </select>
                  <select
                    value={p.title}
                    onChange={(e) =>
                      handlePassengerChange(idx, "title", e.target.value)
                    }
                  >
                    <option value="">Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                  <input
                    placeholder="First Name"
                    value={p.firstName}
                    onChange={(e) =>
                      handlePassengerChange(idx, "firstName", e.target.value)
                    }
                  />
                  <input
                    placeholder="Middle Name (Optional)"
                    value={p.middleName}
                    onChange={(e) =>
                      handlePassengerChange(idx, "middleName", e.target.value)
                    }
                  />
                  <input
                    placeholder="Last Name"
                    value={p.lastName}
                    onChange={(e) =>
                      handlePassengerChange(idx, "lastName", e.target.value)
                    }
                  />
                </div>
                <div className="form-row">
                  <label>Date of Birth</label>
                  <select
                    value={p.dobDay}
                    onChange={(e) =>
                      handlePassengerChange(idx, "dobDay", e.target.value)
                    }
                  >
                    <option value="">Day</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    value={p.dobMonth}
                    onChange={(e) =>
                      handlePassengerChange(idx, "dobMonth", e.target.value)
                    }
                  >
                    <option value="">Month</option>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={p.dobYear}
                    onChange={(e) =>
                      handlePassengerChange(idx, "dobYear", e.target.value)
                    }
                  >
                    <option value="">Year</option>
                    {Array.from(
                      { length: 100 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  placeholder="Nationality"
                  value={p.nationality}
                  onChange={(e) =>
                    handlePassengerChange(idx, "nationality", e.target.value)
                  }
                />
                <input
                  placeholder="Passport Number"
                  value={p.passportNumber}
                  onChange={(e) =>
                    handlePassengerChange(idx, "passportNumber", e.target.value)
                  }
                />
                <input
                  placeholder="Country of Passport"
                  value={p.passportCountry}
                  onChange={(e) =>
                    handlePassengerChange(
                      idx,
                      "passportCountry",
                      e.target.value
                    )
                  }
                />
                <div className="form-row">
                  <label>Passport Validity</label>
                  <select
                    value={p.validityDay}
                    onChange={(e) =>
                      handlePassengerChange(idx, "validityDay", e.target.value)
                    }
                  >
                    <option value="">Day</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    value={p.validityMonth}
                    onChange={(e) =>
                      handlePassengerChange(
                        idx,
                        "validityMonth",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Month</option>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={p.validityYear}
                    onChange={(e) =>
                      handlePassengerChange(idx, "validityYear", e.target.value)
                    }
                  >
                    <option value="">Year</option>
                    {Array.from(
                      { length: 20 },
                      (_, i) => new Date().getFullYear() + i
                    ).map((year) => (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
              {passengers.length > 1 && (
                <button
                  className="remove-passenger-button"
                  onClick={(e) => {
                    e.preventDefault();
                    const updated = passengers.filter((_, i) => i !== idx);
                    setPassengers(updated);
                  }}
                >
                  Remove Passenger
                </button>
              )}
            </div>
          ))}
          <button
            className="add-passenger-button"
            onClick={() =>
              setPassengers([
                ...passengers,
                {
                  type: "Adult",
                  title: "",
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  dobDay: "",
                  dobMonth: "",
                  dobYear: "",
                  nationality: "",
                  passportNumber: "",
                  passportCountry: "",
                  validityDay: "",
                  validityMonth: "",
                  validityYear: "",
                },
              ])
            }
          >
            + Add Passenger
          </button>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div className="contact-info-section">
            <h3>Contact Info</h3>
            <div className="form-row">
              <input
                placeholder="First name"
                value={contactFirstName}
                onChange={(e) => setContactFirstName(e.target.value)}
              />
              <input
                placeholder="Last name"
                value={contactLastName}
                onChange={(e) => setContactLastName(e.target.value)}
              />
            </div>
            <div className="form-row">
              <select>
                <option value="65">+65 Singapore</option>
                <option value="60">+60 Malaysia</option>
                <option value="62">+62 Indonesia</option>
                <option value="66">+66 Thailand</option>
                <option value="81">+81 Japan</option>
                <option value="82">+82 South Korea</option>
                <option value="86">+86 China</option>
                <option value="91">+91 India</option>
                <option value="1">+1 United States</option>
                <option value="44">+44 United Kingdom</option>
              </select>
              <input
                placeholder="Phone number"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
            <div className="form-row">
              <input
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="confirm-section">
            <h3>Confirm passenger details</h3>
            <p className="confirm-note">
              Please ensure all below passenger information correct as per your
              passport details. <a href="#">Fees will apply</a> if you need to
              correct these details after booking.
            </p>
            <div className="form-row">
              <button
                className="prev-button"
                onClick={() => {
                  const previousData = {
                    passengers,
                    contactFirstName,
                    contactLastName,
                    contactPhone,
                    email,
                    priceSummary,
                  };
                  localStorage.setItem(
                    "passengerInfo",
                    JSON.stringify(previousData)
                  );
                  navigate("/flight-details", { state: { priceSummary } });
                }}
              >
                &lt; Previous: Flights
              </button>
              <button
                className="next-button"
                onClick={() => {
                  const {
                    from,
                    to,
                    departDate,
                    returnDate,
                    adults,
                    children,
                    cabinClass,
                    tripType,
                  } = location.state || {};
                  navigate("/payment-details", {
                    state: {
                      from,
                      to,
                      departDate,
                      returnDate,
                      adults,
                      children,
                      cabinClass,
                      tripType,
                      passengers,
                      contactFirstName,
                      contactLastName,
                      contactPhone,
                      email,
                      priceSummary: {
                        base: priceSummary?.base || "0",
                        extras:
                          priceSummary?.selectedFare === "premium"
                            ? priceSummary?.premiumFareAddon || "0"
                            : "0",
                        baggage: priceSummary?.baggage || "0",
                        selectedFare: priceSummary?.selectedFare || "low",
                        total: priceSummary?.total || "0",
                      },
                    },
                  });
                }}
              >
                Next: Pay &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
      <PriceDetails
        price={Number(priceSummary?.base)}
        selectedFare={priceSummary?.selectedFare || "low"}
        premiumFareAddon={priceSummary?.selectedFare === "premium" ? 89.85 : 0}
        baggagePrice={
          priceSummary?.baggage
            ? Number(priceSummary.baggage)
            : priceSummary?.extras
            ? Number(priceSummary.extras)
            : 0
        }
        totalPrice={priceSummary?.total}
      />
    </div>
  );
};

export default PassengerInfo;
