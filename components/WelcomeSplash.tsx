import React from 'react';

export const WelcomeSplash: React.FC = () => {
  return (
    <div className="m-auto text-center flex flex-col items-center p-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <h2 className="text-2xl font-bold text-white mb-2">Ready to Ignite Your Content?</h2>
      <p className="text-gray-400 max-w-md">
        Fill in your details on the left, upload your previous content calendar, and let our AI craft a personalized 30-day plan to supercharge your social media.
      </p>
    </div>
  );
};