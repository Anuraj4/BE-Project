import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import './FrontPage.css'; // Import the CSS for styling
import FrontImage from './images/frontPageImage.png';

const FrontPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook for navigation


    const handleGetStartedClick = () => {
        navigate('/home'); // Navigate to the Home component
    };
    return (
        <div className="front-page-container">
            <div className="text-section">
                <h1 className="main-heading">Real-Time Language Translation Using AI and Emotion Detection</h1>
                <p className="description">
                    Experience seamless, instant language translation powered by AI. Our system offers real-time translation, enabling smooth communication across different languages.
                    With the added capability of emotion detection, it understands and interprets the emotional tone behind the conversation, ensuring that your message is conveyed accurately and empathetically.
                    Break down language barriers and enhance global connectivity with this innovative solution.
                </p>
                <button className="get-started-btn" onClick={handleGetStartedClick}>Get Started</button>
            </div>
            <div className="image-section">
                <img
                    src={FrontImage} // Replace with your project-related image URL
                    alt="Real-Time Translation"
                    className="image"
                />
            </div>
        </div>
    );
};

export default FrontPage;
