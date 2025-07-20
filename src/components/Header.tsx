import React from "react";
import { FaPlaneDeparture } from "react-icons/fa";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <FaPlaneDeparture style={{ marginRight: "8px" }} />
        SkyNet
      </div>
    </header>
  );
};

export default Header;
