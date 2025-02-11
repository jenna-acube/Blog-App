import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../ChatbotButton.scss'; // Assuming you have styles

const ChatbotButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        if (location.pathname === '/chatbot') {
            // If already on the chatbot page, navigate back to the homepage
            navigate('/');
        } else {
            // Otherwise, navigate to the chatbot page
            navigate('/chatbot');
        }
    };

    return (
        <button onClick={handleClick} className="chatbot-button">
            💬CHAT-AI
        </button>
    );
};

export default ChatbotButton;
