import React, { useState } from 'react';
import { CopyIcon } from './icons/SocialIcons';

interface VideoScriptDisplayProps {
  script: string;
}

export const VideoScriptDisplay: React.FC<VideoScriptDisplayProps> = ({ script }) => {
  const [copyText, setCopyText] = useState('Copy Script');

  const handleCopy = () => {
    navigator.clipboard.writeText(script).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy Script'), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyText('Failed to copy');
       setTimeout(() => setCopyText('Copy Script'), 2000);
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-shrink-0 flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Your Video Script</h2>
        <button
          onClick={handleCopy}
          className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition"
        >
          <CopyIcon />
          <span className="ml-2">{copyText}</span>
        </button>
      </div>
      <div className="flex-grow overflow-auto bg-gray-900/50 rounded-lg p-4">
        <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {script}
        </pre>
      </div>
    </div>
  );
};
