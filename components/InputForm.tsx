import React from 'react';
import { SocialLinks, GenerationMode, CompanyProfile } from '../types';
import { InstagramIcon, LinkedInIcon, XIcon, FacebookIcon, YouTubeIcon, PinterestIcon, UploadIcon, BrainIcon, VoiceIcon, ManageIcon } from './icons/SocialIcons';

interface InputFormProps {
  niche: string;
  setNiche: (value: string) => void;
  socialLinks: SocialLinks;
  setSocialLinks: (links: SocialLinks) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  referenceFiles: FileList | null;
  setReferenceFiles: (files: FileList | null) => void;
  styleFiles: FileList | null;
  setStyleFiles: (files: FileList | null) => void;
  previousContentText: string;
  setPreviousContentText: (value: string) => void;
  referenceText: string;
  setReferenceText: (value: string) => void;
  styleText: string;
  setStyleText: (value: string) => void;
  generationMode: GenerationMode;
  setGenerationMode: (mode: GenerationMode) => void;
  videoIdea: string;
  setVideoIdea: (value: string) => void;
  videoDescription: string;
  setVideoDescription: (value: string) => void;
  videoAudience: string;
  setVideoAudience: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  // New props for profile management
  profiles: CompanyProfile[];
  selectedProfileId: string;
  onProfileSelect: (id: string) => void;
  onManageProfiles: () => void;
}

const socialPlatforms = [
  { name: 'instagram', icon: <InstagramIcon />, placeholder: 'instagram.com/yourprofile' },
  { name: 'linkedIn', icon: <LinkedInIcon />, placeholder: 'linkedin.com/in/yourprofile' },
  { name: 'x', icon: <XIcon />, placeholder: 'x.com/yourhandle' },
  { name: 'facebook', icon: <FacebookIcon />, placeholder: 'facebook.com/yourpage' },
  { name: 'youtube', icon: <YouTubeIcon />, placeholder: 'youtube.com/c/yourchannel' },
  { name: 'pinterest', icon: <PinterestIcon />, placeholder: 'pinterest.com/yourprofile' },
] as const;


export const InputForm: React.FC<InputFormProps> = ({
  niche,
  setNiche,
  socialLinks,
  setSocialLinks,
  uploadedFile,
  setUploadedFile,
  referenceFiles,
  setReferenceFiles,
  styleFiles,
  setStyleFiles,
  previousContentText,
  setPreviousContentText,
  referenceText,
  setReferenceText,
  styleText,
  setStyleText,
  generationMode,
  setGenerationMode,
  videoIdea,
  setVideoIdea,
  videoDescription,
  setVideoDescription,
  videoAudience,
  setVideoAudience,
  onGenerate,
  isLoading,
  rememberMe,
  setRememberMe,
  profiles,
  selectedProfileId,
  onProfileSelect,
  onManageProfiles,
}) => {

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks({ ...socialLinks, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleMultipleFileChange = (setter: (files: FileList | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files);
    }
  };
  
  const isFormIncomplete = !niche.trim() || (
    generationMode === 'calendar' 
      ? (!uploadedFile && !previousContentText.trim())
      : !videoIdea.trim()
  );
  
  const incompleteMessage = generationMode === 'calendar'
    ? 'Please provide a niche and content source.'
    : 'Please provide a niche and a video idea.';
  
  const getFileLabel = (files: FileList | null) => {
    if (!files) return 'Click to upload files';
    if (files.length === 1) return files[0].name;
    return `${files.length} files selected`;
  }
  
  const OrDivider = () => (
    <div className="relative my-3">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-600" />
        </div>
        <div className="relative flex justify-center">
            <span className="bg-gray-800 px-2 text-sm text-gray-400">OR</span>
        </div>
    </div>
  );
  
  const inputBaseClasses = "w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 sticky top-8">
       <div>
        <label htmlFor="company-profile" className="block text-sm font-medium text-gray-300 mb-2">Company Profile</label>
        <div className="flex space-x-2">
            <select
                id="company-profile"
                value={selectedProfileId}
                onChange={(e) => onProfileSelect(e.target.value)}
                className={inputBaseClasses + ' flex-grow'}
            >
                <option value="">Select a profile...</option>
                {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>{profile.name}</option>
                ))}
            </select>
            <button onClick={onManageProfiles} className="bg-gray-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-gray-700 transition flex items-center" title="Manage Profiles">
                <ManageIcon />
            </button>
        </div>
      </div>

      <div>
        <label htmlFor="niche" className="block text-sm font-medium text-gray-300 mb-2">1. Your Niche</label>
        <input
          type="text"
          id="niche"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="e.g., Sustainable Fashion for Millennials"
          className={inputBaseClasses}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">2. What do you want to create?</label>
        <div className="flex rounded-md shadow-sm bg-gray-700 p-1 space-x-1">
            <button 
              onClick={() => setGenerationMode('calendar')}
              className={`w-full py-2 text-sm font-medium rounded ${generationMode === 'calendar' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600'} transition-colors`}
            >
              Content Calendar
            </button>
            <button 
              onClick={() => setGenerationMode('script')}
              className={`w-full py-2 text-sm font-medium rounded ${generationMode === 'script' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600'} transition-colors`}
            >
              Video Script
            </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">3. Social Profiles (Optional)</label>
        <div className="space-y-3">
          {socialPlatforms.map(platform => (
            <div key={platform.name} className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                {platform.icon}
              </span>
              <input
                type="text"
                name={platform.name}
                value={socialLinks[platform.name]}
                onChange={handleLinkChange}
                placeholder={platform.placeholder}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          ))}
        </div>
      </div>

      {generationMode === 'calendar' ? (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">4. Previous Content Calendar</label>
          <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 border-2 border-dashed border-gray-600 rounded-md flex flex-col items-center justify-center p-4 hover:border-indigo-500 transition">
            <UploadIcon />
            <span className="mt-2 block text-sm text-gray-400 truncate max-w-full px-2">
              {uploadedFile ? uploadedFile.name : 'Click to upload (.csv, .txt)'}
            </span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv,.txt" />
          </label>
          <OrDivider />
          <textarea
              value={previousContentText}
              onChange={(e) => setPreviousContentText(e.target.value)}
              placeholder="Paste text, links, video URLs..."
              className={inputBaseClasses}
              rows={3}
          />
        </div>
      ) : (
        <div className="space-y-4">
            <h3 className="block text-sm font-medium text-gray-300">4. Video Script Details</h3>
            <div>
                <label htmlFor="video-idea" className="block text-xs font-medium text-gray-400 mb-1">Video Idea / Prompt</label>
                <input id="video-idea" value={videoIdea} onChange={(e) => setVideoIdea(e.target.value)} placeholder="e.g., '3 myths about vegan protein'" className={inputBaseClasses} />
            </div>
            <div>
                <label htmlFor="video-desc" className="block text-xs font-medium text-gray-400 mb-1">Detailed Description</label>
                <textarea id="video-desc" value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} placeholder="e.g., 'Bust common myths, mention sources, keep it under 60s'" className={inputBaseClasses} rows={4}/>
            </div>
            <div>
                <label htmlFor="video-audience" className="block text-xs font-medium text-gray-400 mb-1">Target Audience</label>
                <input id="video-audience" value={videoAudience} onChange={(e) => setVideoAudience(e.target.value)} placeholder="e.g., 'Fitness enthusiasts new to plant-based diets'" className={inputBaseClasses} />
            </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">5. Brain (Reference & Guides)</label>
        <p className="text-xs text-gray-400 mb-2">Upload or paste links to courses, scripts, or guides for the AI to learn from.</p>
        <label htmlFor="brain-upload" className="relative cursor-pointer bg-gray-700 border-2 border-dashed border-gray-600 rounded-md flex flex-col items-center justify-center p-4 hover:border-indigo-500 transition">
          <BrainIcon />
          <span className="mt-2 block text-sm text-gray-400 truncate max-w-full px-2">
            {getFileLabel(referenceFiles)}
          </span>
          <input id="brain-upload" name="brain-upload" type="file" className="sr-only" onChange={handleMultipleFileChange(setReferenceFiles)} multiple />
        </label>
        <OrDivider />
         <textarea
            value={referenceText}
            onChange={(e) => setReferenceText(e.target.value)}
            placeholder="Paste text, links, video URLs..."
            className={inputBaseClasses}
            rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">6. My Style & Voice (Mimicry)</label>
        <p className="text-xs text-gray-400 mb-2">Upload or paste links to your past content so the AI can mimic your unique voice.</p>
        <label htmlFor="style-upload" className="relative cursor-pointer bg-gray-700 border-2 border-dashed border-gray-600 rounded-md flex flex-col items-center justify-center p-4 hover:border-indigo-500 transition">
          <VoiceIcon />
          <span className="mt-2 block text-sm text-gray-400 truncate max-w-full px-2">
            {getFileLabel(styleFiles)}
          </span>
          <input id="style-upload" name="style-upload" type="file" className="sr-only" onChange={handleMultipleFileChange(setStyleFiles)} multiple />
        </label>
        <OrDivider />
         <textarea
            value={styleText}
            onChange={(e) => setStyleText(e.target.value)}
            placeholder="Paste text, links, video URLs..."
            className={inputBaseClasses}
            rows={3}
        />
      </div>

      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
        />
        <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-300 cursor-pointer">
          Remember my inputs
        </label>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || isFormIncomplete}
        className="w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : 'Generate Content'}
      </button>
       {isFormIncomplete && !isLoading && (
         <p className="text-xs text-center text-yellow-400">{incompleteMessage}</p>
       )}
    </div>
  );
};
