// src/components/Chatbot.jsx
import React, { useState } from "react";
import "../Chatbot.scss";
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // State to manage messages
    const [input, setInput] = useState(''); // State for user input
    const [loading, setLoading] = useState(false); // State for loading
    const [error, setError] = useState(null); // State for error handling

    const fetchGeminiResponse = async (userMessage) => {
        setLoading(true); // Start loading
        setError(null); // Reset any previous errors
        try {
            const response = await axios.post(`https://blog-app-jsq6.onrender.com/api/gemini`, {
                prompt: userMessage
            });

            const aiMessage = response.data.response; // Get AI's response
            const aiImage = response.data.imageUrl; // Assume the API sends an image URL

            // Update messages with user's message and AI's response
            const newMessages = [
                { sender: 'user', text: userMessage }
            ];

            if (aiMessage) {
                newMessages.push({ sender: 'ai', text: aiMessage });
            }

            if (aiImage) {
                newMessages.push({ sender: 'ai', image: aiImage });
            }

            setMessages(prevMessages => [...prevMessages, ...newMessages]);
        } catch (error) {
            console.error('Error fetching response:', error);
            setError('Failed to get a response from the AI. Please try again.'); // Set error message
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault(); // Prevent page reload on form submission
        if (input.trim()) { // Check if input is not empty
            fetchGeminiResponse(input); // Fetch AI response
            setInput(''); // Clear input field
        }
    };

    return (
        <div className="chatbot">
            <div className="chatbot-header">Chat with AI</div>
            <div className="chatbot-messages">
                {messages.length === 0 && !loading ? (
                    <div className="chatbot-empty">Start chatting with the AI!</div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`chatbot-message ${msg.sender}`}>
                            {msg.text && <p>{msg.text}</p>}
                            {msg.image && <img src={msg.image} alt="Generated AI" />}
                        </div>
                    ))
                )}
                {loading && <div className="chatbot-loading">Loading...</div>} {/* Loading state */}
                {error && <div className="chatbot-error">{error}</div>} {/* Error state */}
            </div>
            <form onSubmit={handleSendMessage} className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
