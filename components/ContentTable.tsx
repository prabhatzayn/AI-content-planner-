import React from 'react';
import { ContentEntry } from '../types';
import { DownloadIcon } from './icons/SocialIcons';

interface ContentTableProps {
  content: ContentEntry[];
  onDownload: () => void;
}

export const ContentTable: React.FC<ContentTableProps> = ({ content, onDownload }) => {
  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-shrink-0 flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Your 30-Day Content Plan</h2>
        <button
          onClick={onDownload}
          className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition"
        >
          <DownloadIcon />
          <span className="ml-2">Download CSV</span>
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide text-center">Day</th>
              <th className="p-3 text-sm font-semibold tracking-wide">Platform</th>
              <th className="p-3 text-sm font-semibold tracking-wide">Type</th>
              <th className="p-3 text-sm font-semibold tracking-wide">Idea / Hook</th>
              <th className="p-3 text-sm font-semibold tracking-wide">Caption</th>
              <th className="p-3 text-sm font-semibold tracking-wide">Hashtags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {content.sort((a, b) => a.day - b.day).map((entry, index) => (
              <tr key={index} className="bg-gray-800 hover:bg-gray-700/50 transition-colors">
                <td className="p-3 text-sm text-center font-bold text-indigo-400">{entry.day}</td>
                <td className="p-3 text-sm capitalize">{entry.platform}</td>
                <td className="p-3 text-sm">
                  <span className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-md ${
                    entry.contentType.toLowerCase() === 'reel' ? 'bg-purple-800 text-purple-200' :
                    entry.contentType.toLowerCase() === 'carousel' ? 'bg-blue-800 text-blue-200' :
                    'bg-green-800 text-green-200'
                  }`}>
                    {entry.contentType}
                  </span>
                </td>
                <td className="p-3 text-sm">{entry.idea}</td>
                <td className="p-3 text-sm whitespace-pre-wrap leading-relaxed">{entry.caption}</td>
                <td className="p-3 text-xs text-gray-400 break-words">{entry.hashtags}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
