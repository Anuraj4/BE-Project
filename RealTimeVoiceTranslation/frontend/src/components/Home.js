import React, { useState } from 'react';
import Translator from './Translator';
import Button from 'react-bootstrap/Button';
import MarathiToEnglish from './MarathiToEnglish';
import '../App.css';

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
            <div className="text-center mt-4">
                <h3>Select The Language</h3>
            </div>
            {/* Select The Language section */}
            <div className="home-container">
                {/* English to Marathi Translator button */}
                <div className="text-center mt-4">
                    <Button
                        className="btn-lg mt-1"
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
                        className="btn-lg mt-2"
                        variant="primary" // Change variant as needed
                        onClick={handleMarathiToEnglishButtonClick}
                    >
                        {showMarathiToEnglish ? 'Close Translator' : 'Marathi To English'}
                    </Button>
                    {showMarathiToEnglish && <MarathiToEnglish />} {/* Conditionally render MarathiToEnglish */}
                </div>
            </div>
        </>
    );
};

export default Home;
