import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchForm.css";
import DateRangePicker from "./DateRangePicker.tsx";

const SearchForm: React.FC = () => {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState<"OneWay" | "Return">("Return");
  const [showOptions, setShowOptions] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy");

  const [departDate, setDepartDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [activeField, setActiveField] = useState<"depart" | "return" | null>(
    null
  );
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);

  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [locationOptions, setLocationOptions] = useState<{ city: string }[]>(
    []
  );

  useEffect(() => {
    const baseUrl =
      process.env.REACT_APP_API_URL || "http://localhost:4000/api/locations";
    fetch(`${baseUrl}`)
      .then((res) => res.json())
      .then((data) => setLocationOptions(data))
      .catch((err) => console.error("Failed to fetch locations", err));
  }, []);

  function formatDate(d: Date | null) {
    if (!d) return "";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const handleDateFieldClick = (field: "depart" | "return") => {
    setActiveField(field);
    setCalendarVisible(true);
    setShowOptions(false); // hide class selector if open
  };

  return (
    <div className="search-form-container">
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!fromValue || !toValue || !departDate) {
            setErrorMessage(
              "Please complete all required fields: From, To, and Depart date."
            );
          } else if (
            fromValue.trim().toLowerCase() === toValue.trim().toLowerCase()
          ) {
            setErrorMessage("Origin and destination cannot be the same.");
          } else {
            setErrorMessage("");
            navigate("/seachResults", {
              state: {
                from: fromValue,
                to: toValue,
                departDate: formatDate(departDate),
                returnDate:
                  tripType === "Return" ? formatDate(returnDate) : null,
                adults,
                children,
                cabinClass,
              },
            });
          }
        }}
      >
        <div className="form-row">
          <div className="trip-type-select">
            <select
              id="tripType"
              className="trip-type-selector"
              value={tripType}
              onChange={(e) =>
                setTripType(e.target.value as "OneWay" | "Return")
              }
            >
              <option value="Return">Return</option>
              <option value="OneWay">One Way</option>
            </select>
          </div>
          <div className="input-with-popup">
            <input
              type="text"
              placeholder="From (e.g. Singapore)"
              name="from"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value.trimStart())}
              onFocus={() => {
                setFromFocus(true);
                setToFocus(false);
                setShowOptions(false);
                setCalendarVisible(false);
              }}
              onBlur={() => setTimeout(() => setFromFocus(false), 150)}
              required
            />
            {fromFocus && (
              <div className="input-popup">
                {locationOptions
                  .filter((loc) =>
                    loc.city.toLowerCase().includes(fromValue.toLowerCase())
                  )
                  .map((loc) => (
                    <p key={loc.city} onClick={() => setFromValue(loc.city)}>
                      {loc.city}
                    </p>
                  ))}
              </div>
            )}
          </div>
          <div className="input-with-popup">
            <input
              type="text"
              placeholder="To (e.g. Tokyo)"
              name="to"
              value={toValue}
              onChange={(e) => setToValue(e.target.value.trimStart())}
              onFocus={() => {
                setToFocus(true);
                setFromFocus(false);
                setShowOptions(false);
                setCalendarVisible(false);
              }}
              onBlur={() => setTimeout(() => setToFocus(false), 150)}
              required
            />
            {toFocus && (
              <div className="input-popup">
                {locationOptions
                  .filter(
                    (loc) =>
                      loc.city.toLowerCase().includes(toValue.toLowerCase()) &&
                      loc.city !== fromValue
                  )
                  .map((loc) => (
                    <p key={loc.city} onClick={() => setToValue(loc.city)}>
                      {loc.city}
                    </p>
                  ))}
              </div>
            )}
          </div>
          <div className="date-fields">
            <button
              type="button"
              className="date-input"
              onClick={() => handleDateFieldClick("depart")}
            >
              {departDate ? formatDate(departDate) : "Depart"}
            </button>
            {tripType === "Return" && (
              <button
                type="button"
                className="date-input"
                onClick={() => handleDateFieldClick("return")}
              >
                {returnDate ? formatDate(returnDate) : "Return"}
              </button>
            )}
          </div>
          {calendarVisible && activeField && (
            <DateRangePicker
              activeField={activeField}
              onClose={() => setCalendarVisible(false)}
              departDate={departDate}
              returnDate={returnDate}
              setDepartDate={setDepartDate}
              setReturnDate={setReturnDate}
            />
          )}

          <div className="traveller-selector">
            <button
              type="button"
              className="traveller-button"
              onClick={() => {
                setShowOptions(!showOptions);
                setCalendarVisible(false); // hide calendar if open
              }}
            >
              {`${adults} Adult${adults > 1 ? "s" : ""}${
                children > 0
                  ? `, ${children} Child${children > 1 ? "ren" : ""}`
                  : ""
              }, ${cabinClass}`}
            </button>
            {showOptions && (
              <div className="traveller-dropdown">
                <div>
                  <label>Cabin Class</label>
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    defaultValue={"Economy"}
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </div>
                <div className="passenger-control">
                  <label>Adults (18+)</label>
                  <div>
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      -
                    </button>
                    <span>{adults}</span>
                    <button type="button" onClick={() => setAdults(adults + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div className="passenger-control">
                  <label>Children (0-17)</label>
                  <div>
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                    >
                      -
                    </button>
                    <span>{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button type="button" onClick={() => setShowOptions(false)}>
                  Apply
                </button>
              </div>
            )}
          </div>
          <button type="submit" className="search-btn">
            Search
          </button>
          {errorMessage && (
            <div className="popup-error">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage("")}>✖</button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
