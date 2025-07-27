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
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Payment details submitted:", {
              cardName,
              cardNumber,
              expiry,
              cvv,
              address,
            });
            setSubmitted(true);
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
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
