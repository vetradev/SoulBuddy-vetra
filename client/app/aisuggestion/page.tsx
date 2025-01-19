'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import './aisuggestion.css'; // Import the CSS file

const ASTROLOGICAL_PURPOSES = [
    "Career Growth",
    "Marriage Timing",
    "Business Success",
    "Health Issues",
    "Financial Prosperity",
    "Education Success",
    "Relationship Harmony",
    "Child Birth",
    "Property Matters",
    "Foreign Travel",
    "Legal Matters",
    "Mental Peace",
    "Family Conflicts",
    "Spiritual Growth",
    "Remove Negative Energy"
] as const;

const ASTROLOGICAL_CONCERNS = [
    "Manglik dosha",
    "Kundli matching issues",
    "Rahu-Ketu influence",
    "Shani Sade Sati",
    "Health astrology",
    "Financial hurdles",
    "Relationship advice",
    "Career roadblocks"
] as const;

interface Message {
    text: string;
    isUser: boolean;
    isError?: boolean;
}

interface APIResponse {
    output?: string;
    error?: string;
}

interface StoredUserData {
    name: string;
    dob: string;
    timeOfBirth: string;
    gender: string;
    state: string;
    city: string;
    starsign: string;
    purposes?: string[];
    concerns?: string[];
}

const LangflowChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
    const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

    const formatPrompt = (userData: StoredUserData) => {
        const birthDate = new Date(userData.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        const formattedDate = new Date(userData.dob).toISOString().split('T')[0];
        const formattedPurposes = userData.purposes?.length
            ? userData.purposes.join(", ")
            : "General consultation";
        const formattedConcerns = userData.concerns?.length
            ? userData.concerns.join(", ")
            : "None specified";

        return JSON.stringify({
            name: userData.name,
            age: age,
            gender: userData.gender,
            date_of_birth: formattedDate,
            time_of_birth: userData.timeOfBirth,
            place_of_birth: `${userData.city}, ${userData.state}, India`,
            purpose: formattedPurposes,
            specific_concerns: formattedConcerns,
            astrological_sign: userData.starsign || "Not specified",
            output_format: "HTML"
        }, null, 4);
    };

    const callAPI = async (formattedPrompt: string): Promise<APIResponse> => {
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_URL!, {
                input: formattedPrompt
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            let messageText: string;
            if (response.data.output && typeof response.data.output === 'string') {
                messageText = response.data.output;
            } else if (typeof response.data === 'string') {
                messageText = response.data;
            } else {
                messageText = "Received an unexpected response format";
            }

            setError('');
            return { output: messageText };
        } catch (error) {
            console.error('Error:', error);
            setError(axios.isAxiosError(error) ? error.response?.data?.error || 'API request failed' : 'An unknown error occurred');
            return { output: "🙏 Kindly try again in a moment, facing connection issues." };
        }
    };

    const toggleSelection = (item: string, setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
        setSelected(prev => {
            const newSelection = prev.includes(item)
                ? prev.filter(p => p !== item)
                : [...prev, item];
            return newSelection;
        });
    };

    const handleSubmit = async () => {
        const storedUserData = sessionStorage.getItem('userData');
        if (!storedUserData) {
            console.error('No user data found in session storage');
            return;
        }

        const userData = JSON.parse(storedUserData) as StoredUserData;
        userData.purposes = selectedPurposes;
        userData.concerns = selectedConcerns;

        const formattedPrompt = formatPrompt(userData);
        setIsLoading(true);

        try {
            const response = await callAPI(formattedPrompt);
            setMessages(prev => [...prev, {
                text: response.output || "🙏 Could you please rephrase your question?",
                isUser: false
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                text: "🙏 Our services are temporarily unavailable. Please try again later.",
                isUser: false,
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="header">
                <h1 className="title">🕉️ Pooja Suggestions</h1>
            </div>

            <div className="selection-container">
                <h3 className="section-title">Select Your Consultation Purposes:</h3>
                <div className="button-group">
                    {ASTROLOGICAL_PURPOSES.map(purpose => (
                        <button
                            key={purpose}
                            onClick={() => toggleSelection(purpose, setSelectedPurposes)}
                            className={`button ${selectedPurposes.includes(purpose) ? 'selected' : ''}`}
                        >
                            {purpose}
                        </button>
                    ))}
                </div>
            </div>

            <div className="selection-container">
                <h3 className="section-title">Select Your Concerns:</h3>
                <div className="button-group">
                    {ASTROLOGICAL_CONCERNS.map(concern => (
                        <button
                            key={concern}
                            onClick={() => toggleSelection(concern, setSelectedConcerns)}
                            className={`button ${selectedConcerns.includes(concern) ? 'selected' : ''}`}
                        >
                            {concern}
                        </button>
                    ))}
                </div>
            </div>

            <div className="message-container">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.isUser ? 'user-message' : 'response-message'} ${message.isError ? 'error' : ''}`}
                    >
                        <div
                            className="message-text"
                            dangerouslySetInnerHTML={{ __html: message.text }}
                        />
                    </div>
                ))}
            </div>

            {isLoading && <div className="loading">Fetching your astrological insights...</div>}

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="submit-button"
            >
                {isLoading ? 'Loading...' : 'Submit'}
            </button>
        </div>
    );
};

export default LangflowChat;
