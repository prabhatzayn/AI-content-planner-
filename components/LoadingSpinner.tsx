import React from 'react';

const loadingMessages = [
    "Analyzing your past content...",
    "Brewing fresh content ideas...",
    "Consulting the social media muses...",
    "Crafting engaging captions...",
    "Strategizing your content calendar...",
    "Assembling your 30-day plan...",
    "Just a moment, brilliance is loading..."
];

export const LoadingSpinner: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = loadingMessages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="m-auto text-center flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-semibold text-white">Generating Your Content Plan</p>
            <p className="text-gray-400 mt-2 transition-opacity duration-500">{message}</p>
        </div>
    );
};