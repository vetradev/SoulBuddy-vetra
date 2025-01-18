"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Moon, MessageCircle } from "lucide-react";

interface Message {
    type: 'bot' | 'user';
    content: string | React.ReactNode;
}

interface UserData {
    zodiacSign: string;
    age: string;
    sleepQuality: string;
    stressLevel: string;
}

export default function ConversationalWellness() {
    const [messages, setMessages] = useState<Message[]>([
        {
            type: 'bot',
            content: "Hi! I'm your wellness assistant. I can help you with exercise recommendations based on your zodiac sign and analyze your sleep patterns. What would you like to know about?"
        }
    ]);
    const [input, setInput] = useState("");
    const [currentStep, setCurrentStep] = useState<string>('initial');
    const [userData, setUserData] = useState<UserData>({
        zodiacSign: '',
        age: '',
        sleepQuality: '',
        stressLevel: ''
    });

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

    const analyzeSleep = async () => {
        try {
            const response = await fetch('/api/sleep', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    age: parseInt(userData.age),
                    sleepQuality: userData.sleepQuality,
                    stressLevel: userData.stressLevel,
                }),
            });

            if (!response.ok) throw new Error('Failed to analyze sleep');
            const data = await response.json();

            addMessage({
                type: 'bot',
                content: (
                    <div className="space-y-2">
                        <p>Based on your information:</p>
                        <ul className="list-disc pl-4">
                            <li>Age: {userData.age}</li>
                            <li>Sleep Quality: {userData.sleepQuality}</li>
                            <li>Stress Level: {userData.stressLevel}</li>
                        </ul>
                        <p className="font-medium mt-2">Recommended Sleep Duration: {data.recommended_sleep_hours}</p>
                        <p className="mt-2">{data.sleep_tips}</p>
                    </div>
                ),
            });
            setCurrentStep('initial');
        } catch (err) {
            console.error('Sleep analysis error:', err);
            setCurrentStep('askAge');
            addMessage({
                type: 'bot',
                content: "Let's try again with your sleep analysis. What's your age?"
            });
        }
    };

    const handleFitnessActivities = async (zodiacSign: string) => {
        try {
            const response = await fetch(`/api/zodiac?zodiacName=${encodeURIComponent(zodiacSign)}`);
            if (!response.ok) throw new Error("Failed to fetch recommendations");
            const data = await response.json();

            addMessage({
                type: 'bot',
                content: (
                    <div className="space-y-2">
                        <p>Based on your zodiac sign ({zodiacSign}), here are your recommended fitness activities:</p>
                        <p>{data.exercise_recommendations}</p>
                        <p className="text-muted-foreground">{data.why_it_suits_them}</p>
                    </div>
                )
            });
        } catch (err) {
            addMessage({
                type: 'bot',
                content: "I'm having trouble getting your fitness recommendations. Please try again later."
            });
        }
    };

    const handleUserInput = async () => {
        if (!input.trim()) return;

        addMessage({ type: 'user', content: input });
        const userInput = input.toLowerCase();

        switch (currentStep) {
            case 'initial':
                if (userInput.includes('fitness') || userInput.includes('activity') || userInput.includes('exercise')) {
                    setCurrentStep('askZodiacForFitness');
                    addMessage({
                        type: 'bot',
                        content: "To provide personalized fitness recommendations, what's your zodiac sign?"
                    });
                } else if (userInput.includes('sleep') || userInput.includes('pattern')) {
                    setCurrentStep('askAge');
                    addMessage({
                        type: 'bot',
                        content: "Let's analyze your sleep patterns! First, what's your age?"
                    });
                } else if (userInput.includes('zodiac')) {
                    setCurrentStep('askZodiac');
                    addMessage({
                        type: 'bot',
                        content: "What's your zodiac sign? I'll recommend exercises tailored to your sign!"
                    });
                } else {
                    addMessage({
                        type: 'bot',
                        content: "I can help you with exercise recommendations based on your zodiac sign or analyze your sleep patterns. What interests you?"
                    });
                }
                break;

            case 'askZodiacForFitness':
            case 'askZodiac':
                await handleFitnessActivities(input);
                setCurrentStep('initial');
                break;

            case 'askAge':
                const age = Number(input);
                if (!isNaN(age) && age > 0 && age < 120) {
                    setUserData(prev => ({ ...prev, age: input }));
                    setCurrentStep('askSleepQuality');
                    addMessage({
                        type: 'bot',
                        content: "How would you rate your sleep quality? Please respond with either Good, Fair, or Poor."
                    });
                } else {
                    addMessage({
                        type: 'bot',
                        content: "Please provide a valid age between 1 and 120."
                    });
                }
                break;

            case 'askSleepQuality':
                const quality = input.toLowerCase();
                if (['good', 'fair', 'poor'].includes(quality)) {
                    setUserData(prev => ({ ...prev, sleepQuality: input }));
                    setCurrentStep('askStressLevel');
                    addMessage({
                        type: 'bot',
                        content: "What's your current stress level? Please respond with either High, Medium, or Low."
                    });
                } else {
                    addMessage({
                        type: 'bot',
                        content: "Please respond with either Good, Fair, or Poor for sleep quality."
                    });
                }
                break;

            case 'askStressLevel':
                const stress = input.toLowerCase();
                if (['high', 'medium', 'low'].includes(stress)) {
                    setUserData(prev => ({ ...prev, stressLevel: input }));
                    await analyzeSleep();
                } else {
                    addMessage({
                        type: 'bot',
                        content: "Please respond with either High, Medium, or Low for stress level."
                    });
                }
                break;
        }

        setInput("");
    };

    return (
        <div className="container mx-auto h-screen flex flex-col p-4">
            <div className="flex items-center gap-2 mb-4">
                <Moon className="h-6 w-6" />
                <h1 className="text-xl font-semibold">Wellness Assistant</h1>
            </div>

            <ScrollArea className="flex-1 p-4 border rounded-lg mb-4">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            <div
                                className={`flex gap-2 max-w-[80%] ${message.type === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                    } rounded-lg p-3`}
                            >
                                {message.type === 'bot' && (
                                    <Avatar className="h-8 w-8">
                                        <Moon className="h-4 w-4" />
                                    </Avatar>
                                )}
                                <div>{message.content}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
                    placeholder="Type your message..."
                    className="flex-1"
                />
                <Button onClick={handleUserInput}>
                    <MessageCircle className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}