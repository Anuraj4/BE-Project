import React, { useState, useEffect } from 'react';
import './Playback.css';

const Playback = ({ translatedText }) => {
    const [translations, setTranslations] = useState([]);

    // Store translations in session storage
    useEffect(() => {
        const storedTranslations = sessionStorage.getItem('translations');
        if (storedTranslations) {
            setTranslations(JSON.parse(storedTranslations));
        }
    }, []);

    // Update translations when new translated text is received
    useEffect(() => {
        if (translatedText) {
            const updatedTranslations = [translatedText, ...translations];

            // Ensure only the latest 10 translations are stored
            if (updatedTranslations.length > 10) {
                updatedTranslations.pop(); // Remove the oldest entry if more than 10
            }

            setTranslations(updatedTranslations);
            sessionStorage.setItem('translations', JSON.stringify(updatedTranslations));
        }
    }, [translatedText]);

    return (
        <div className="playback-container">
            <h5 className="text-muted">Playback History (Latest 10):</h5>
            <ul>
                {translations.map((text, index) => (
                    <li key={index}>{text}</li>
                ))}
            </ul>
        </div>
    );
};

export default Playback;
