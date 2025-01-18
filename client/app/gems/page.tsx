

"use client";
import { useState } from 'react';
import { gemstoneData, GemstoneInfo } from './gems';

export default function Home() {
    const [zodiacSign, setZodiacSign] = useState<string>('');
    const [gemstoneInfo, setGemstoneInfo] = useState<GemstoneInfo | null>(null);
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Normalize input by trimming spaces and converting to lowercase
        const lowerCaseSign = zodiacSign.trim().toLowerCase();

        // Clear previous results and errors
        setError('');
        setGemstoneInfo(null);

        // Check if the zodiac sign exists in gemstoneData
        if (lowerCaseSign in gemstoneData) {
            setGemstoneInfo(gemstoneData[lowerCaseSign as keyof typeof gemstoneData]);
        } else {
            // Set error if the zodiac sign is not found
            setError('Invalid zodiac sign. Please enter a valid one.');
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Personal Gemstone Suggestion
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <label htmlFor="zodiac-sign" className="text-lg font-medium text-gray-600">
                        Enter Your Zodiac Sign:
                    </label>
                    <input
                        type="text"
                        id="zodiac-sign"
                        value={zodiacSign}
                        onChange={(e) => setZodiacSign(e.target.value)}
                        required
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
                    />
                    <button
                        type="submit"
                        className="bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors duration-300"
                    >
                        Get Gemstone Suggestion
                    </button>
                </form>

                {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}

                {gemstoneInfo && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-gray-700">
                            Gemstone for {zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)}: {gemstoneInfo.gemstone}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            <strong>Why you should wear it:</strong> {gemstoneInfo.reason}
                        </p>
                        <p className="text-gray-600 mt-1">
                            <strong>When to wear:</strong> {gemstoneInfo.whenToWear}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}