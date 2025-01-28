import React, { useState } from "react";
import Translator from "./Translator";
import Button from "react-bootstrap/Button";
import MarathiToEnglish from "./MarathiToEnglish";
import "./Home.css";

const Home = () => {
    const [showTranslator, setShowTranslator] = useState(false);
    const [showMarathiToEnglish, setShowMarathiToEnglish] = useState(false);

    // Toggle visibility of Translator component
    const handleTranslatorButtonClick = () => {
        setShowTranslator((prevState) => !prevState);
    };

    // Toggle visibility of MarathiToEnglish component
    const handleMarathiToEnglishButtonClick = () => {
        setShowMarathiToEnglish((prevState) => !prevState);
    };

    return (
        <>
            <div className="hero-section">
                <div className="content">
                    <h1 className="main-heading-Home animate-heading">
                        Real-Time Language Translation
                    </h1>
                    <p className="description animate-fade">
                        Experience seamless language translation powered by AI, bridging communication gaps with real-time accuracy.
                    </p>
                </div>
            </div>
            <div className="select-button">
                <h3>Select the language</h3>
            </div>
            <div className="home-container">
                {/* English to Marathi Translator */}
                <div className="button-container">
                    <Button
                        className={`btn-lg custom-btn ${showTranslator ? "active-btn" : ""
                            }`}
                        onClick={handleTranslatorButtonClick}
                    >
                        {showTranslator ? "Close Translator" : "English To Marathi"}
                    </Button>
                    <div
                        className={`translator-container ${showTranslator ? "fade-in" : "fade-out"
                            }`}
                    >
                        {showTranslator && <Translator />}
                    </div>
                </div>

                {/* Marathi to English Translator */}
                <div className="button-container">
                    <Button
                        className={`btn-lg custom-btn ${showMarathiToEnglish ? "active-btn" : ""
                            }`}
                        onClick={handleMarathiToEnglishButtonClick}
                    >
                        {showMarathiToEnglish ? "Close Translator" : "Marathi To English"}
                    </Button>
                    <div
                        className={`translator-container ${showMarathiToEnglish ? "fade-in" : "fade-out"
                            }`}
                    >
                        {showMarathiToEnglish && <MarathiToEnglish />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
