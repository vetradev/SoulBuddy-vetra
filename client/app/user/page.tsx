// app/components/UserDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import "./user.css"

// types/zodiac.ts

export interface ZodiacSign {
    english: string;
    hindi: string;
    startDate: string;
    endDate: string;
}

export interface UserData {
    name: string;
    dob: Date | null;
    timeOfBirth: string;
    gender: string;
    state: string;
    city: string;
    starsign: string;
}

const zodiacData: ZodiacSign[] = [
    { english: "Aries", hindi: "मेष राशि", startDate: "03-21", endDate: "04-20" },
    { english: "Taurus", hindi: "वृषभ राशि", startDate: "04-21", endDate: "05-21" },
    { english: "Gemini", hindi: "मिथुन राशि", startDate: "05-22", endDate: "06-21" },
    { english: "Cancer", hindi: "कर्क राशि", startDate: "06-22", endDate: "07-22" },
    { english: "Leo", hindi: "सिंह राशि", startDate: "07-23", endDate: "08-21" },
    { english: "Virgo", hindi: "कन्या राशि", startDate: "08-22", endDate: "09-23" },
    { english: "Libra", hindi: "तुला राशि", startDate: "09-24", endDate: "10-23" },
    { english: "Scorpio", hindi: "वृश्चिक राशि", startDate: "10-24", endDate: "11-22" },
    { english: "Sagittarius", hindi: "धनु राशि", startDate: "11-23", endDate: "12-22" },
    { english: "Capricorn", hindi: "मकर राशि", startDate: "12-23", endDate: "01-20" },
    { english: "Aquarius", hindi: "कुम्भ राशि", startDate: "01-21", endDate: "02-19" },
    { english: "Pisces", hindi: "मीन राशि", startDate: "02-20", endDate: "03-20" }
];

interface Insight {
    heading: string;
    content: string;
}



export default function UserDashboard() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [highlightedSign, setHighlightedSign] = useState<ZodiacSign | null>(null);

    useEffect(() => {
        const savedData = sessionStorage.getItem('userData');
        const savedSign = sessionStorage.getItem('highlightedSign');

        if (savedData && savedSign) {
            try {
                setUserData(JSON.parse(savedData));
                setHighlightedSign(JSON.parse(savedSign));
            } catch (error) {
                console.error('Error parsing user data from session storage:', error);
            }
        }
    }, []);

    const getGeminiResponse = async (prompt: string): Promise<string> => {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAWnR55bAcVvkpTlLBfAmUWyETcPbtXhVQ`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const data = await response.json();
            if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }
            throw new Error("No insights returned by Gemini.");
        } catch (error) {
            console.error('Error fetching insights:', error);
            throw new Error("An error occurred while fetching insights.");
        }
    };

    const parseInsights = (rawText: string): Insight[] => {
        const regex = /(?:\d\.\s*)?(.*?):\s*(.+)/g;
        const sections: Insight[] = [];
        let match;

        while ((match = regex.exec(rawText)) !== null) {
            const [_, heading, content] = match;
            sections.push({ heading: heading.trim(), content: content.trim() });
        }

        return sections;
    };

    useEffect(() => {
        const fetchInsights = async () => {
            if (!userData) return;

            setLoading(true);
            setError(null);

            try {
                const prompt = `As an expert astrologer, provide insights for a person with the following details:
          Name: ${userData.name}
          Date of Birth: ${userData.dob}
          Time of Birth: ${userData.timeOfBirth}
          Gender: ${userData.gender}
          Location: ${userData.city}, ${userData.state}

          Please provide detailed insights on:
          1. Career prospects and professional growth
          2. Relationships and love life
          3. Personal growth and self-development
          4. Family dynamics and domestic life
          5. Social connections and friendships
          6. Daily horoscope for today

          Please provide the output in a way that can be shown beautifully on web.
        `;

                const response = await getGeminiResponse(prompt);
                setInsights(parseInsights(response));
            } catch (error) {
                setError("There was an issue processing the insights.");
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [userData]);

    const handleSaveUserData = () => {
        if (userData) {
            sessionStorage.setItem('userData', JSON.stringify(userData));
        }
        if (highlightedSign) {
            sessionStorage.setItem('highlightedSign', JSON.stringify(highlightedSign));
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your insights...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Your Astrological Insights</h2>
            {insights.length > 0 ? (
                <div className="insights-container">
                    {insights.map((section, index) => (
                        <div key={index} className="insight-block">
                            <h3 className="insight-heading" data-number={index + 1}>{section.heading}</h3>
                            <p className="insight-content">{section.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-insights-message">No insights available at the moment.</p>
            )}
            <button onClick={handleSaveUserData}>Save User Data</button>
        </div>
    );
}
