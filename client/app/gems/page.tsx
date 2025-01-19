'use client';

import { useEffect, useState } from 'react';
import { gemstoneData, GemstoneInfo } from './gems';
import Image from 'next/image';
import Amethyst from './assets/Amethyst.gif';
import Aquamarine from './assets/Aquamarine.gif';
import Diamond from './assets/Diamond.gif';
import Emerald from './assets/Emerald.gif';
import Garnet from './assets/Garnet.gif';
import Opal from './assets/Opal.gif';
import Jade from './assets/Jade.gif';
import Moonstone from './assets/Moonstone.gif';
import Ruby from './assets/Ruby.gif';
import Sapphire from './assets/Sapphire.gif';
import Topaz from './assets/Topaz.gif';
import Turquoise from './assets/Turquoise.gif';

export default function Page() {
    const [zodiacSign, setZodiacSign] = useState<string>('');
    const [gemstoneInfo, setGemstoneInfo] = useState<GemstoneInfo | null>(null);
    const [error, setError] = useState<string>('');
    const [gifSrc, setGifSrc] = useState<any>(null);

    const gemstoneGifMap: Record<string, any> = {
        "Diamond": Diamond,
        "Emerald": Emerald,
        "Moonstone": Moonstone,
        "Ruby": Ruby,
        "Sapphire": Sapphire,
        "Opal": Opal,
        "Topaz": Topaz,
        "Turquoise": Turquoise,
        "Amethyst": Amethyst,
        "Aquamarine": Aquamarine,
        "Garnet": Garnet,
        "Jade": Jade
    };

    // Fetch zodiac sign from sessionStorage and automatically submit the form
    useEffect(() => {
        const savedZodiacSign = sessionStorage.getItem('highlightedSign');
        if (savedZodiacSign) {
            setZodiacSign(savedZodiacSign);
            handleSubmit(savedZodiacSign); // Automatically trigger form submission
        }
    }, []);

    useEffect(() => {
        if (!gemstoneInfo) return;
        const selectedGif = gemstoneGifMap[gemstoneInfo.gemstone];
        setGifSrc(selectedGif || Moonstone);
    }, [gemstoneInfo]);

    const handleSubmit = (zodiacSign: string) => {
        const lowerCaseSign = zodiacSign.trim().toLowerCase();
        setError('');
        setGemstoneInfo(null);

        if (lowerCaseSign in gemstoneData) {
            setGemstoneInfo(gemstoneData[lowerCaseSign as keyof typeof gemstoneData]);
            sessionStorage.setItem('zodiacSign', zodiacSign);  // Store the zodiac sign in sessionStorage
        } else {
            setError('Invalid zodiac sign. Please enter a valid one.');
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-black">
            {/* Decorative left border */}
            <div className="h-full w-4 bg-gradient-to-b from-white via-white to-white" />

            <div className="max-w-7xl w-full flex px-4 py-8">
                <div className="bg-black rounded-lg shadow-xl overflow-hidden border-2 border-white flex flex-row items-stretch w-full">
                    {/* Ornamental header */}
                    <div className="bg-gradient-to-b bg-white p-6 text-center flex-shrink-0 w-1/3 flex flex-col justify-center ">
                        <Image
                            src={gifSrc}
                            alt="Gemstone"
                            className="mx-auto mb-6 object-contain"
                            width={300}
                            height={300}
                            priority
                        />
                    </div>

                    <div className="p-8 flex-grow">
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            <div className="relative">
                                <label htmlFor="zodiac-sign" className="block text-lg font-medium text-white mb-2 text-center">
                                    Enter Your Rashi (Zodiac Sign)
                                </label>
                                <input
                                    type="text"
                                    id="zodiac-sign"
                                    value={zodiacSign}
                                    onChange={(e) => setZodiacSign(e.target.value)}
                                    required
                                    className="w-full p-4 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white bg-black placeholder-white"
                                    placeholder="Example: Mesha (Aries)"
                                />
                            </div>
                        </form>

                        {error && (
                            <p className="mt-4 text-red-400 font-medium text-center bg-black p-3 rounded-lg">
                                {error}
                            </p>
                        )}

                        {gemstoneInfo && gifSrc && (
                            <div className="mt-8 text-center">
                                <div className="bg-black p-6 rounded-lg border-2 border-white">
                                    <h2 className="text-2xl font-bold text-white mb-4">
                                        {zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)}'s Sacred Stone:
                                        <span className="text-white"> {gemstoneInfo.gemstone}</span>
                                    </h2>

                                    <div className="relative">
                                        <div className="absolute rounded-full" />
                                    </div>

                                    <div className="space-y-4 text-left bg-black p-6 rounded-lg shadow-inner">
                                        <p className="text-white">
                                            <span className="font-semibold text-white">Divine Purpose:</span> {gemstoneInfo.reason}
                                        </p>
                                        <p className="text-white">
                                            <span className="font-semibold text-white">Auspicious Times:</span> {gemstoneInfo.whenToWear}
                                        </p>
                                        <p className="text-white">
                                            <span className="font-semibold text-white">Mystical Properties:</span> {gemstoneInfo.properties}
                                        </p>
                                        <p className="text-white">
                                            <span className="font-semibold text-white">Spiritual Benefits:</span> {gemstoneInfo.benefits}
                                        </p>
                                        {gemstoneInfo.chakras && (
                                            <p className="text-white">
                                                <span className="font-semibold text-white">Associated Chakras:</span> {gemstoneInfo.chakras}
                                            </p>
                                        )}
                                        {gemstoneInfo.additionalSuggestion && (
                                            <p className="text-white">
                                                <span className="font-semibold text-white">Sacred Wisdom:</span> {gemstoneInfo.additionalSuggestion}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative right border */}
            <div className="h-full w-4 bg-gradient-to-b from-white via-white to-white" />
        </main>
    );
}
