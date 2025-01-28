import React, { useState } from 'react';
import './Feedback.css';
import { FaSmile, FaMeh, FaFrown } from 'react-icons/fa';

const Feedback = () => {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleFeedbackClick = (type) => {
        setFeedback(type);
        setSubmitted(true);
    };

    const handleReset = () => {
        setFeedback('');
        setSubmitted(false);
    };

    return (
        <div className="feedback-page">
            <div className="feedback-container">
                <h2>How was your experience?</h2>
                {!submitted ? (
                    <div className="feedback-options">
                        <button
                            className="feedback-button smile"
                            onClick={() => handleFeedbackClick('happy')}
                        >
                            <FaSmile className="feedback-icon" /> Happy
                        </button>
                        <button
                            className="feedback-button meh"
                            onClick={() => handleFeedbackClick('neutral')}
                        >
                            <FaMeh className="feedback-icon" /> Neutral
                        </button>
                        <button
                            className="feedback-button frown"
                            onClick={() => handleFeedbackClick('sad')}
                        >
                            <FaFrown className="feedback-icon" /> Sad
                        </button>
                    </div>
                ) : (
                    <div className="feedback-result">
                        <p>
                            {feedback === 'happy' && (
                                <>
                                    <FaSmile className="result-icon happy" />
                                    Thank you for your positive feedback! We're so happy you had a great experience! 😊
                                </>
                            )}
                            {feedback === 'neutral' && (
                                <>
                                    <FaMeh className="result-icon neutral" />
                                    Thanks for your feedback! We'll strive to improve. If you have suggestions, feel free to share. 😐
                                </>
                            )}
                            {feedback === 'sad' && (
                                <>
                                    <FaFrown className="result-icon sad" />
                                    Sorry to hear that. We'll work on making it better. Please let us know how we can improve. 😢
                                </>
                            )}
                        </p>
                        <button className="reset-button" onClick={handleReset}>Give More Feedback</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feedback;
