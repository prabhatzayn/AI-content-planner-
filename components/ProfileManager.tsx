import React, { useState, useEffect } from 'react';
import { CompanyProfile, SocialLinks } from '../types';
import { InstagramIcon, LinkedInIcon, XIcon, FacebookIcon, YouTubeIcon, PinterestIcon } from './icons/SocialIcons';

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: CompanyProfile[];
  onSave: (profile: CompanyProfile) => void;
  onDelete: (id: string) => void;
}

const emptyProfile: Omit<CompanyProfile, 'id'> = {
  name: '',
  niche: '',
  socialLinks: { instagram: '', linkedIn: '', x: '', facebook: '', youtube: '', pinterest: '' },
  previousContentText: '',
  referenceText: '',
  styleText: '',
};

const socialPlatforms = [
  { name: 'instagram', icon: <InstagramIcon />, placeholder: 'instagram.com/yourprofile' },
  { name: 'linkedIn', icon: <LinkedInIcon />, placeholder: 'linkedin.com/in/yourprofile' },
  { name: 'x', icon: <XIcon />, placeholder: 'x.com/yourhandle' },
  { name: 'facebook', icon: <FacebookIcon />, placeholder: 'facebook.com/yourpage' },
  { name: 'youtube', icon: <YouTubeIcon />, placeholder: 'youtube.com/c/yourchannel' },
  { name: 'pinterest', icon: <PinterestIcon />, placeholder: 'pinterest.com/yourprofile' },
] as const;


export const ProfileManager: React.FC<ProfileManagerProps> = ({ isOpen, onClose, profiles, onSave, onDelete }) => {
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Omit<CompanyProfile, 'id'>>(emptyProfile);

  useEffect(() => {
    if (activeProfileId) {
      const profile = profiles.find(p => p.id === activeProfileId);
      setFormState(profile || emptyProfile);
    } else {
      setFormState(emptyProfile);
    }
  }, [activeProfileId, profiles]);
  
  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };
  
  const handleNewProfile = () => {
    setActiveProfileId(null);
    setFormState(emptyProfile);
  };
  
  const handleSave = () => {
    if (!formState.name.trim()) {
        alert("Profile Name cannot be empty.");
        return;
    }
    const profileToSave: CompanyProfile = {
        id: activeProfileId || crypto.randomUUID(),
        ...formState,
    };
    onSave(profileToSave);
    onClose(); // Close the modal after saving
  };
  
  const handleDelete = () => {
    if (activeProfileId && window.confirm(`Are you sure you want to delete the profile "${formState.name}"?`)) {
        onDelete(activeProfileId);
        setActiveProfileId(null);
    }
  };

  const inputBaseClasses = "w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Manage Company Profiles</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        
        <div className="flex flex-grow min-h-0">
          {/* Left Panel: Profile List */}
          <div className="w-1/3 border-r border-gray-700 flex flex-col">
            <div className="p-3 flex-shrink-0">
                <button onClick={handleNewProfile} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition text-sm">
                    + Create New Profile
                </button>
            </div>
            <ul className="overflow-y-auto flex-grow p-1">
              {profiles.map(p => (
                <li key={p.id}>
                  <button 
                    onClick={() => setActiveProfileId(p.id)}
                    className={`w-full text-left text-sm p-3 rounded-md transition ${activeProfileId === p.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Panel: Form */}
          <div className="w-2/3 flex flex-col">
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Profile Name</label>
                    <input type="text" id="name" name="name" value={formState.name} onChange={handleInputChange} className={inputBaseClasses} placeholder="e.g., Anmol TMT"/>
                </div>
                <div>
                    <label htmlFor="niche" className="block text-sm font-medium text-gray-300 mb-2">Niche</label>
                    <input type="text" id="niche" name="niche" value={formState.niche} onChange={handleInputChange} className={inputBaseClasses} placeholder="e.g., High-Quality Steel Manufacturing"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Social Profiles</label>
                    <div className="space-y-3">
                    {socialPlatforms.map(platform => (
                        <div key={platform.name} className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            {platform.icon}
                        </span>
                        <input
                            type="text"
                            name={platform.name}
                            value={formState.socialLinks[platform.name]}
                            onChange={handleLinkChange}
                            placeholder={platform.placeholder}
                            className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition"
                        />
                        </div>
                    ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="previousContentText" className="block text-sm font-medium text-gray-300 mb-2">Previous Content / Data</label>
                    <textarea id="previousContentText" name="previousContentText" value={formState.previousContentText} onChange={handleInputChange} className={inputBaseClasses} rows={5} placeholder="Paste previous content CSV data, links, etc."/>
                </div>
                 <div>
                    <label htmlFor="referenceText" className="block text-sm font-medium text-gray-300 mb-2">Brain (Reference & Guides)</label>
                    <textarea id="referenceText" name="referenceText" value={formState.referenceText} onChange={handleInputChange} className={inputBaseClasses} rows={5} placeholder="Paste links to courses, competitor analysis, etc."/>
                </div>
                <div>
                    <label htmlFor="styleText" className="block text-sm font-medium text-gray-300 mb-2">My Style & Voice (Mimicry)</label>
                    <textarea id="styleText" name="styleText" value={formState.styleText} onChange={handleInputChange} className={inputBaseClasses} rows={5} placeholder="Paste examples of your writing style, brand voice guidelines..."/>
                </div>
            </div>
            <div className="flex-shrink-0 p-4 border-t border-gray-700 flex justify-end items-center space-x-3">
                <button
                    onClick={handleDelete}
                    disabled={!activeProfileId}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Delete
                </button>
                <button
                    onClick={handleSave}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                   {activeProfileId ? 'Save Changes' : 'Create Profile'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
