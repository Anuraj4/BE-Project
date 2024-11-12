import React, { useState } from 'react';
import Translator from './Translator';
import Button from 'react-bootstrap/Button';

const Home = () => {
    const [showTranslator, setShowTranslator] = useState(false);

    const handleButtonClick = () => {
        setShowTranslator((prevState) => !prevState); // Toggle the component visibility
    };

    return (
        <>
            {/* Styling for 'Select The Language' using Bootstrap */}
            <div className="text-center mt-5">
                <h3>Select The Language</h3>
            </div>

            {/* Main content */}
            <div className="text-center mt-4">
                <Button
                    className="btn-lg mt-2"
                    variant="primary" // You can change this to any color variant like "success", "danger", etc.
                    onClick={handleButtonClick}
                >
                    {showTranslator ? 'Close Translator' : 'English To Marathi'}
                </Button>
                {showTranslator && <Translator />} {/* Conditionally render the Translator component */}
            </div>
        </>
    );
};

export default Home;
