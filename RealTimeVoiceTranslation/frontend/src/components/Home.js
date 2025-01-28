import React, { useState } from 'react';
import Translator from './Translator';
import Button from 'react-bootstrap/Button';
import MarathiToEnglish from './MarathiToEnglish';
import './Home.css';

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
            <div className="hero-section text-center">
                <h1 className="main-heading">Real-Time Language Translation Using AI and Emotion Detection</h1>
                <p className="description">
                    Our AI-powered system provides seamless language translation with real-time accuracy and emotion detection.
                    Break down barriers and communicate effortlessly across different languages, ensuring your message is conveyed
                    clearly and empathetically.
                </p>
                <img src="path_to_your_image.jpg" alt="Language Translation" className="hero-image" />
            </div>

            <div className="text-center mt-24">
                <h3 style={{marginTop:'25px'}}>Select The Language</h3>
            </div>
            {/* Select The Language section */}
            <div className="home-container">
                {/* English to Marathi Translator button */}
                <div className="text-center mt-4">
                    <Button
                        className="btn-lg mt-1 custom-btn"
                        variant="primary" // Change variant as needed
                        onClick={handleTranslatorButtonClick}
                    >
                        {showTranslator ? 'Close Translator' : 'English To Marathi'}
                    </Button>
                    {showTranslator && <Translator />} {/* Conditionally render Translator */}
                </div>
            </div>

            {/* Marathi to English Translator section */}
            <div className="home-container">
                <div className="text-center mt-4">
                    <Button
                        className="btn-lg mt-2 custom-btn"
                        variant="primary" // Change variant as needed
                        onClick={handleMarathiToEnglishButtonClick}
                    >
                        {showMarathiToEnglish ? 'Close Translator' : 'Marathi To English'}
                    </Button>
                    {showMarathiToEnglish && <MarathiToEnglish />} {/* Conditionally render MarathiToEnglish */}
                </div>
            </div>

            {/* Additional Information Section */}
            <div className="info-section mt-5">
                <h4>Why Choose Our Translation System?</h4>
                <p style={{marginBottom:'50px'}}>
                    Our system is not just about translating words but understanding emotions behind every sentence.
                </p>

                <h4>How Does Emotion Detection Enhance Communication?</h4>
                <p>
                    It understands whether the speaker is happy, sad, frustrated, or excited and translates the message accordingly.
                </p>
            </div>
        </>
    );
};

export default Home;
