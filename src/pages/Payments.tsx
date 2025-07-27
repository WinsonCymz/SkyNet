import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Payments.css";
import PriceDetails from "./PriceDetails.tsx";
import TripDetails from "./TripDetails.tsx";
import creditcard from "../assets/creditcard.png";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [submitted, setSubmitted] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");

  const location = useLocation();
  const priceSummary = location.state?.priceSummary || {};
  console.log("PaymentPage received state:", location.state);
  const { flight } = location.state || {};
  console.log("PaymentPage flight data:", flight);

  const basePrice = parseFloat(priceSummary.base || "0");
  const selectedFare = priceSummary.selectedFare || "low";
  const premiumFareAddon = parseFloat(priceSummary.premiumFareAddon || "0");
  const baggagePrice = parseFloat(priceSummary.baggagePrice || "0");
  const totalPrice = parseFloat(priceSummary.total || "0");

  return (
    <div className="payment-content">
      <TripDetails />
      <div className="payment-form">
        <div className="progress-indicator">
          <div className="step done">
            <div className="circle">&#10003;</div>
            <div className="label">Search results</div>
          </div>
          <div className="line" />
          <div className="step done">
            <div className="circle">&#10003;</div>
            <div className="label">Flights</div>
          </div>
          <div className="line" />
          <div className="step done">
            <div className="circle">3</div>
            <div className="label">Passengers</div>
          </div>
          <div className="line" />
          <div className="step current">
            <div className="circle">4</div>
            <div className="label">Pay</div>
          </div>
        </div>
        <h1 className="page-title">Payment Details</h1>
        <div className="steps-progress"></div>
        <h3 className="section-title">Payment method</h3>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="payment"
              value="credit"
              checked={paymentMethod === "credit"}
              onChange={() => setPaymentMethod("credit")}
            />
            <img src={creditcard} alt="Credit Cards" className="card-image" />
            Credit Card
          </label>
        </div>

        <form
          className="form-section"
          onSubmit={async (e) => {
            e.preventDefault();
            // Build payload
            const payload = {
              flight_info: location.state.flight,
              from_location: location.state.from,
              to_location: location.state.to,
              depart_date: location.state.departDate,
              return_date: location.state.returnDate || null,
              trip_type: location.state.tripType,
              adults: location.state.adults,
              children: location.state.children,
              cabin_class: location.state.cabinClass,
              contact_first_name: location.state.contactFirstName,
              contact_last_name: location.state.contactLastName,
              contact_phone: location.state.contactPhone,
              contact_email: location.state.email,
              passengers: location.state.passengers,
              base_price: location.state.priceSummary.base,
              extras_price:
                location.state.priceSummary.selectedFare === "premium"
                  ? location.state.priceSummary.extras
                  : "0",
              baggage_price: location.state.priceSummary.baggage,
              total_price: location.state.priceSummary.total,
              payment_method: "credit",
              card_holder_name: cardName,
              card_last4: cardNumber.slice(-4),
              card_expiry: expiry,
              billing_address: address,
            };

            try {
              const apiUrl =
                process.env.REACT_APP_API_URL || "http://localhost:4000";
              const response = await fetch(`${apiUrl}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Server error");
              }
              const { bookingId } = await response.json();
              console.log("Saved booking with ID:", bookingId);
              setSubmitted(true);
            } catch (err) {
              console.error("Could not save booking:", err);
              // Optionally show an error to the user here
            }
          }}
        >
          <div className="row">
            <input
              placeholder="Enter name on card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <input
              placeholder="Enter card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <div className="row">
            <input
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            <input
              placeholder="Enter CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
          <div className="row">
            <input
              placeholder="Add address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <label className="terms-notice">
            By selecting the button below, I agree to the Property Rules, Terms
            and Conditions, and Privacy Policy
          </label>
          <button className="submit-btn">Submit</button>
        </form>
        {submitted && (
          <div className="popup-message">
            <div className="popup-content">
              <h3>Purchase Successful!</h3>
              <p>
                Thank you for your booking. Please check your email for the
                e-ticket.
              </p>
            </div>
          </div>
        )}
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

export default PaymentPage;
