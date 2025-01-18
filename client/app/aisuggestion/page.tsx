'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

import axios from 'axios';

interface Message {
    text: string;
    isUser: boolean;
    isError?: boolean;
}

interface APIResponse {
    output?: string;
    error?: string;
}

const LangflowChat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const predefinedPrompt = `{
        "name": "Rohan",
        "age": 32,
        "gender": "Male",
        "date_of_birth": "1991-03-15",
        "time_of_birth": "08:30 AM",
        "place_of_birth": "Delhi, India",
        "purpose": "Career growth and removing obstacles",
        "specific_concerns": "Manglik dosha",
        "astrological_sign": "Pisces",
        "output_format": "HTML"
    }`;

    const callAPI = async (userMessage: string): Promise<APIResponse> => {
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_URL!, {
                input: userMessage
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
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'API request failed';
                setError(errorMessage);
            } else {
                setError('An unknown error occurred');
            }
            return {
                output: "🙏 Kindly try again in a moment, facing connection issues."
            };
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setError('');
        setIsLoading(true);

        setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

        try {
            const response = await callAPI(userMessage);
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

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    useEffect(() => {
        const sendPredefinedPrompt = async () => {
            setIsLoading(true);
            try {
                const response = await callAPI(predefinedPrompt);
                setMessages(prev => [...prev, {
                    text: response.output || "🙏 Could you please rephrase your question?",
                    isUser: false
                }]);
            } catch (error) {
                console.error('Error sending predefined prompt:', error);
                setMessages(prev => [...prev, {
                    text: "🙏 Our services are temporarily unavailable. Please try again later.",
                    isUser: false,
                    isError: true
                }]);
            } finally {
                setIsLoading(false);
            }
        };

        sendPredefinedPrompt();
    }, []);

    return (
        <div className="w-full p-4  bg-gradient-to-b h-screen flex items-center justify-center flex-col from-orange-50 to-orange-100 rounded-lg shadow-lg border-2 border-orange-200">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-orange-800">🕉️ Jyotish Guide</h1>
                <p className="text-orange-600">Vedic Astrology Consultation</p>
            </div>

            <div className="mb-4 flex items-center justify-center flex-col  space-y-4 h-full overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg  shadow-sm ${message.isUser
                            ? 'bg-orange-200 ml-auto w-full  border-l-4 border-orange-400'
                            : 'bg-yellow-50 mr-auto  border-r-4 border-yellow-400'
                            }`}
                    >

                        <div
                            className={`${message.isError ? 'text-red-500' : 'text-orange-900'}`}
                            dangerouslySetInnerHTML={{ __html: message.text.slice(8) }}
                        />
                    </div>
                ))}
            </div>

            {/* <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-red-500 bg-red-50 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}
            </form> */}
        </div>
    );
};

export default LangflowChat;