// app/components/InputForm.tsx
'use client';

import { useState, useEffect } from 'react';

import './inputform.css';
import { useRouter } from 'next/navigation';


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

export const zodiacData: ZodiacSign[] = [
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

export default function InputForm() {
    const [userData, setUserData] = useState<UserData>({
        name: '',
        dob: null,
        timeOfBirth: '',
        gender: '',
        state: '',
        city: '',
        starsign: ''
    });

    const [highlightedSign, setHighlightedSign] = useState<ZodiacSign | null>(null);
    const [dobEntered, setDobEntered] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedData = sessionStorage.getItem('userData');
        const savedSign = sessionStorage.getItem('highlightedSign');
        if (savedData && savedSign) {
            router.push('/user');
        }
    }, [router]);

    const getZodiacSign = (dateStr: Date): ZodiacSign | null => {
        const month = dateStr.getMonth() + 1;
        const day = dateStr.getDate();
        const formattedDate = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        if ((month === 12 && day >= 23) || (month === 1 && day <= 20)) {
            return zodiacData[9]; // Capricorn
        }

        return zodiacData.find(sign => {
            const [startMonth, startDay] = sign.startDate.split('-').map(Number);
            const [endMonth, endDay] = sign.endDate.split('-').map(Number);

            if (month === startMonth) {
                return day >= startDay;
            } else if (month === endMonth) {
                return day <= endDay;
            }
            return month > startMonth && month < endMonth;
        }) || null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value ? new Date(e.target.value) : null;
        if (date) {
            const zodiacSign = getZodiacSign(date);
            setUserData({ ...userData, dob: date });
            setHighlightedSign(zodiacSign);
            setDobEntered(true);
        } else {
            setUserData({ ...userData, dob: null });
            setHighlightedSign(null);
            setDobEntered(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem('userData', JSON.stringify(userData));
        if (highlightedSign) {
            sessionStorage.setItem('highlightedSign', highlightedSign.english);  // Store only the sign's english name
        }
        router.push('/user');
    };    

    return (
        <div className="container">
            <h1>Enter your details</h1>
            <div className="form-container">
                <div className="input-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="My name is..."
                        value={userData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        name="dob"
                        value={userData.dob ? userData.dob.toISOString().split("T")[0] : ""}
                        onChange={handleDateChange}
                        className="custom-date-picker"
                    />
                    <input
                        type="time"
                        name="timeOfBirth"
                        value={userData.timeOfBirth}
                        onChange={handleChange}
                        placeholder="Time of Birth"
                    />
                    <select
                        name="gender"
                        value={userData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">I am a Male...</option>
                        <option value="Female">I am a Female...</option>
                    </select>
                    <input
                        type="text"
                        name="state"
                        placeholder="I was born in state of..."
                        value={userData.state}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="I was born in city of..."
                        value={userData.city}
                        onChange={handleChange}
                    />
                </div>
                <button onClick={handleSubmit} className="submit-button">Submit</button>
            </div>

            <div className="starsign-grid">
                {zodiacData.map((sign, index) => (
                    <div
                        key={index}
                        className={`star-sign-box ${dobEntered ? 'dob-entered' : ''} 
              ${sign === highlightedSign ? 'highlighted' : ''}`}
                    >
                        <div className="sign-english">{sign.english}</div>
                        <div className="sign-hindi">{sign.hindi}</div>
                        <div className="sign-dates">
                            {sign.startDate.replace('-', '/')} - {sign.endDate.replace('-', '/')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}