import React, { useState } from "react";
import { Link } from 'react-router-dom'; // Import Link for navigation
import "./Navbar.css";
import logo from "./images/logo.png";

const NavigationBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            {/* Logo & Brand Name */}
            <Link to="/" className="brand"> {/* Use Link for navigation */}
                <img src={logo} alt="Logo" className="logo" />
                <span className="brand-name">Real-Time Voice Translator</span>
            </Link>

            {/* Hamburger Icon */}
            <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            {/* Navigation Links */}
            <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
                <li><Link to="/frontpage">Home</Link></li> {/* Link to FrontPage */}
                {/* <li><Link to="/home">Get Started</Link></li> Link to Home */}
                <li><a href="/instructions">Instructions</a></li>
                <li><a href="/playback">Playback</a></li>
                <li><a href="/disability">Disability</a></li>
                <li><a href="/feedback">Feedback</a></li>
                {/* <li><a href="#contact">Contact</a></li> */}
            </ul>
        </nav>
    );
};

export default NavigationBar;
