"use client"
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

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export default function ConversationalWellness() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'bot', 
      content: (
        <div className="space-y-4">
          <p>Hi! I'm your wellness assistant. What would you like help with today?</p>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleInitialChoice('workout')}
            >
              Workout Recommendations
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleInitialChoice('sleep')}
            >
              Sleep Analysis
            </Button>
          </div>
        </div>
      )
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

  const handleInitialChoice = (choice: 'workout' | 'sleep') => {
    setCurrentStep(choice === 'workout' ? 'selectZodiac' : 'askAge');
    
    if (choice === 'workout') {
      addMessage({
        type: 'bot',
        content: (
          <div className="space-y-4">
            <p>Please select your zodiac sign for personalized workout recommendations:</p>
            <div className="grid grid-cols-3 gap-2">
              {zodiacSigns.map(sign => (
                <Button
                  key={sign}
                  variant="outline"
                  onClick={() => handleZodiacSelect(sign)}
                  className="text-sm"
                >
                  {sign}
                </Button>
              ))}
            </div>
          </div>
        )
      });
    } else {
      addMessage({
        type: 'bot',
        content: "Let's analyze your sleep patterns! What's your age?"
      });
    }
  };

  const handleZodiacSelect = async (zodiacSign: string) => {
    addMessage({ type: 'user', content: zodiacSign });
    setUserData(prev => ({ ...prev, zodiacSign }));
    
    try {
      const response = await fetch(`/api/zodiac?zodiacName=${encodeURIComponent(zodiacSign)}`);
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      const data = await response.json();
      
      addMessage({
        type: 'bot',
        content: (
          <div className="space-y-2">
            <p className="font-medium">Workout Recommendations for {zodiacSign}:</p>
            <p>{data.exercise_recommendations}</p>
            <p className="text-muted-foreground mt-2">{data.why_it_suits_them}</p>
            <Button 
              variant="outline" 
              onClick={() => handleInitialChoice('sleep')}
              className="mt-4"
            >
              Would you like a sleep analysis too?
            </Button>
          </div>
        )
      });
    } catch (err) {
      addMessage({
        type: 'bot',
        content: "I'm having trouble getting your recommendations. Please try again later."
      });
    }
  };

  const handleUserInput = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    addMessage({ type: 'user', content: userInput });
    
    if (currentStep === 'askAge') {
      const age = Number(userInput);
      if (!isNaN(age) && age > 0 && age < 120) {
        const updatedUserData = { ...userData, age: userInput };
        setUserData(updatedUserData);
        setCurrentStep('askSleepQuality');
        addMessage({
          type: 'bot',
          content: (
            <div className="space-y-2">
              <p>How would you rate your sleep quality?</p>
              <div className="flex flex-wrap gap-2">
                {['Good', 'Fair', 'Poor'].map(quality => (
                  <Button
                    key={quality}
                    variant="outline"
                    onClick={() => handleSleepQualitySelect(quality, updatedUserData)}
                  >
                    {quality}
                  </Button>
                ))}
              </div>
            </div>
          )
        });
      } else {
        addMessage({
          type: 'bot',
          content: "Please provide a valid age between 1 and 120."
        });
      }
    }

    setInput("");
  };

  const handleSleepQualitySelect = (quality: string, previousUserData: UserData) => {
    const updatedUserData = { ...previousUserData, sleepQuality: quality };
    setUserData(updatedUserData);
    addMessage({ type: 'user', content: quality });
    setCurrentStep('askStressLevel');
    addMessage({
      type: 'bot',
      content: (
        <div className="space-y-2">
          <p>What's your current stress level?</p>
          <div className="flex flex-wrap gap-2">
            {['High', 'Medium', 'Low'].map(level => (
              <Button
                key={level}
                variant="outline"
                onClick={() => handleStressLevelSelect(level, updatedUserData)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
      )
    });
  };

  const handleStressLevelSelect = async (level: string, previousUserData: UserData) => {
    const updatedUserData = { ...previousUserData, stressLevel: level };
    setUserData(updatedUserData);
    addMessage({ type: 'user', content: level });
    
    if (!updatedUserData.age) {
      addMessage({
        type: 'bot',
        content: "Let's start over. What's your age?"
      });
      setCurrentStep('askAge');
      return;
    }
    
    await analyzeSleep(updatedUserData);
  };

  const analyzeSleep = async (currentUserData: UserData) => {
    if (!currentUserData.age || !currentUserData.sleepQuality || !currentUserData.stressLevel) {
      addMessage({
        type: 'bot',
        content: "I'm missing some information. Let's start over with your age."
      });
      setCurrentStep('askAge');
      return;
    }

    const sleepData = {
      age: parseInt(currentUserData.age),
      sleepQuality: currentUserData.sleepQuality.toLowerCase(),
      stressLevel: currentUserData.stressLevel.toLowerCase()
    };

    try {
      const response = await fetch('/api/sleep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sleepData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sleep');
      }

      const data = await response.json();

      addMessage({
        type: 'bot',
        content: (
          <div className="space-y-2">
            <p className="font-medium">Sleep Analysis Results:</p>
            <div className="bg-muted p-4 rounded-lg">
              <p>Age: {currentUserData.age}</p>
              <p>Sleep Quality: {currentUserData.sleepQuality}</p>
              <p>Stress Level: {currentUserData.stressLevel}</p>
              <p className="font-medium mt-2">Recommended Sleep: {data.recommended_sleep_hours}</p>
              <p className="mt-2">{data.sleep_tips}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => handleInitialChoice('workout')}
              className="mt-4"
            >
              Would you like workout recommendations?
            </Button>
          </div>
        ),
      });
      setCurrentStep('initial');
    } catch (err) {
      console.error('Sleep analysis error:', err);
      addMessage({
        type: 'bot',
        content: (
          <div className="space-y-2">
            <p>I apologize, but there was an issue analyzing your sleep data. Let's try again.</p>
            <Button 
              variant="outline" 
              onClick={() => handleInitialChoice('sleep')}
              className="mt-4"
            >
              Start Over
            </Button>
          </div>
        )
      });
    }
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
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex gap-2 max-w-[80%] ${
                  message.type === 'user'
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

      {currentStep === 'askAge' && (
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
            placeholder="Enter your age..."
            type="number"
            className="flex-1"
          />
          <Button onClick={handleUserInput}>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
