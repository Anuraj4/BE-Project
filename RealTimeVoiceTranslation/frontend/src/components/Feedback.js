import React, { useState } from 'react';
import './Feedback.css';
import { FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import emailjs from 'emailjs-com';

const Feedback = () => {
    const [feedbackType, setFeedbackType] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFeedbackClick = (type) => {
        setFeedbackType(type);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!feedbackType) {
            alert("Please select your feedback (Happy, Neutral, or Sad).");
            return;
        }

        setLoading(true);

        const templateParams = {
            name: formData.name,
            email: formData.email,
            feedback_type: feedbackType,
            message: formData.message
        };

        emailjs.send(
            process.env.REACT_APP_EMAILJS_SERVICE_ID,
            process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
            templateParams,
            process.env.REACT_APP_EMAILJS_USER_ID
        ).then(
            (response) => {
                console.log("SUCCESS!", response.status, response.text);
                setSubmitted(true);
                setLoading(false);
            },
            (error) => {
                console.error("FAILED...", error);
                alert("Something went wrong. Please try again later.");
                setLoading(false);
            }
        );
    };

    const handleReset = () => {
        setFeedbackType('');
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(false);
    };

    return (
        <div className="feedback-page">
            <div className="feedback-container">
                <h2>We'd Love Your Feedback!</h2>
                {!submitted ? (
                    <form onSubmit={handleSubmit} className="feedback-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div className="feedback-options">
                            <button
                                type="button"
                                className={`feedback-button ${feedbackType === 'Happy' ? 'selected' : ''}`}
                                onClick={() => handleFeedbackClick('Happy')}
                            >
                                <FaSmile className="feedback-icon" /> Happy
                            </button>
                            <button
                                type="button"
                                className={`feedback-button ${feedbackType === 'Neutral' ? 'selected' : ''}`}
                                onClick={() => handleFeedbackClick('Neutral')}
                            >
                                <FaMeh className="feedback-icon" /> Neutral
                            </button>
                            <button
                                type="button"
                                className={`feedback-button ${feedbackType === 'Sad' ? 'selected' : ''}`}
                                onClick={() => handleFeedbackClick('Sad')}
                            >
                                <FaFrown className="feedback-icon" /> Sad
                            </button>
                        </div>

                        <textarea
                            name="message"
                            placeholder="Tell us more (optional)..."
                            value={formData.message}
                            onChange={handleChange}
                        />

                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Sending...' : 'Submit Feedback'}
                        </button>
                    </form>
                ) : (
                    <div className="feedback-result">
                        <p>🎉 Thank you, {formData.name}! Your feedback has been sent successfully.</p>
                        <button className="reset-button" onClick={handleReset}>
                            Give More Feedback
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feedback;
