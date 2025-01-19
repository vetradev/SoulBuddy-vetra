// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Meditate from '../../public/Meditate.png';

export default function Home() {
  const [minutes, setMinutes] = useState(10);
  const [isMeditating, setIsMeditating] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [remainingTime, setRemainingTime] = useState(minutes * 60);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [meditateText, setMeditateText] = useState('Start');
  const [stopVisible, setStopVisible] = useState(false);

  const updateDisplay = () => {
    setRemainingTime(minutes * 60);
  };

  const startMeditation = () => {
    if (isMeditating) return;

    setIsMeditating(true);
    setMeditateText('Relax and focus on your breath.');
    setStopVisible(true);

    if (typeof window !== 'undefined') {
        const ambientSound = new Audio('/Audios/Meditate-music.mp3');
      setAudio(ambientSound);
      ambientSound.play().catch(error => console.log('Audio playback failed:', error));
    }

    let time = minutes * 60;
    const interval = setInterval(() => {
      if (time <= 0) {
        clearInterval(interval);
        endMeditation();
      } else {
        setRemainingTime(time);
        time--;
      }
    }, 1000);

    setTimerInterval(interval);
  };

  const endMeditation = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsMeditating(false);
    setMeditateText('Start');
    setStopVisible(false);
    setAudio(null);
    setRemainingTime(minutes * 60);
  };

  const handleIncrease = () => {
    if (!isMeditating && minutes < 120) {
      setMinutes(minutes + 10);
    }
  };

  const handleDecrease = () => {
    if (!isMeditating && minutes > 10) {
      setMinutes(minutes - 10);
    }
  };

  const handleStopMeditation = () => {
    endMeditation();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  useEffect(() => {
    updateDisplay();
  }, [minutes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [timerInterval, audio]);

  return (
    <main className="min-h-screen bg-cream">
      <div className="w-full min-h-[85vh] flex flex-col items-center rounded-b-xl">
        <p className="mt-20 mb-16 font-bold text-center">
          Close your eyes, and reflect upon your day
        </p>

        <button 
          onClick={startMeditation}
          className="relative flex justify-center items-center cursor-pointer"
        >
          <img
            src={Meditate.src}
            alt="Meditate Icon"
            className={`w-44 h-44 transition-transform duration-700 ${
              isMeditating ? 'scale-150' : 'scale-100'
            }`}
          />
          <p className="absolute text-lg pointer-events-none">{meditateText}</p>
        </button>

        <div className="flex items-center mt-16">
          <button
            className={`text-sm bg-transparent border-none cursor-pointer p-1 outline-none transition-colors duration-300 ${
              !isMeditating ? 'text-dark hover:text-orange' : 'text-gray-400'
            }`}
            onClick={handleDecrease}
            disabled={isMeditating}
          >
            ▼
          </button>
          <span className="w-8 text-xl font-bold text-center select-none font-lora">
            {minutes}
          </span>
          <button
            className={`text-sm bg-transparent border-none cursor-pointer p-1 outline-none transition-colors duration-300 ${
              !isMeditating ? 'text-dark hover:text-orange' : 'text-gray-400'
            }`}
            onClick={handleIncrease}
            disabled={isMeditating}
          >
            ▲
          </button>
          <span className="text-xl font-bold text-dark ml-6">Minutes</span>
        </div>

        <div className="mt-10">
          <p className="text-center font-lora">
            Click the button to start meditating. Adjust the time according to your preference.
          </p>
        </div>

        {stopVisible && (
          <div className="w-full mt-10 h-12 flex justify-center">
            <button
              onClick={handleStopMeditation}
              className="text-lg font-bold text-red-500 cursor-pointer bg-transparent"
            >
              Stop Session
            </button>
          </div>
        )}
      </div>
    </main>
  );
}