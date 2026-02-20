import React from "react";
import "./Navbar.css";
import { assets } from "./../../assets/assets";

const Navbar = () => {
  return (
    <div className="navbar">
      {/* Brand Name */}
      <div className="logo-text">
        Food<span>Express</span>
      </div>

      {/* Admin Profile */}
      <div className="navbar-right">
        <img
          src={assets.profile_image}
          alt="Admin Profile"
          className="profile"
        />
      </div>
    </div>
  );
};

export default Navbar;
