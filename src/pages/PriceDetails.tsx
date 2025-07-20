import React from "react";
import "./PriceDetails.css";
import mastercardLogo from "../assets/mastercard.png";
import visaLogo from "../assets/visa.png";

interface PriceDetailsProps {
  price: number;
  selectedFare: "low" | "premium";
  premiumFareAddon: number;
  baggagePrice: number;
  totalPrice: string;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  price,
  selectedFare,
  premiumFareAddon,
  baggagePrice,
  totalPrice,
}) => {
  return (
    <div className="price-summary">
      <div className="price-summary-card">
        <h3>Price Details</h3>
        <div className="price-detail-row">
          <strong>Passengers</strong>
          <span>Adult</span>
          <span>SG${price.toFixed(2)} × 1</span>
        </div>
        <div className="price-detail-row">
          <strong>Fare Type</strong>
          <span>{selectedFare === "low" ? "Low Fare" : "Premium Flex"}</span>
          <span>
            {selectedFare === "low"
              ? "SG$0.00 x 1"
              : `SG$${premiumFareAddon.toFixed(2)} x 1`}
          </span>
        </div>
        {baggagePrice > 0 && (
          <div className="price-detail-row">
            <strong>Extra Baggage</strong>
            <span>1 unit</span>
            <span>SG${baggagePrice.toFixed(2)} x 1</span>
          </div>
        )}
        <div className="price-summary-total">
          <p>Include taxes and fees</p>
          <h4>Price Summary</h4>
          <span className="price-total">SG${totalPrice}</span>
        </div>
        <div className="payment-methods">
          <img src={mastercardLogo} alt="MasterCard" />
          <img src={visaLogo} alt="Visa" />
        </div>
        <div className="trusted-choice">
          <h4>🔒 TRUSTED CHOICE</h4>
          <ul>
            <li>✔ No hidden charges</li>
            <li>✔ 100% confirmation after successful payment</li>
            <li>✔ SG owned & operated</li>
            <li>✔ Great service rated by customers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
