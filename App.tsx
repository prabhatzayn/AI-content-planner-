import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ContentTable } from './components/ContentTable';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeSplash } from './components/WelcomeSplash';
import { ChatInterface } from './components/ChatInterface';
import { VideoScriptDisplay } from './components/VideoScriptDisplay';
import { ProfileManager } from './components/ProfileManager'; // New component
import { generateContentPlan, generateVideoScript, getInitialPrompt, getVideoScriptPrompt, calendarSchema, scriptSchema } from './services/geminiService';
import { SocialLinks, ContentEntry, ChatMessage, GenerationMode, CompanyProfile } from './types';
import { downloadContentAsCSV } from './utils/fileUtils';
import { GoogleGenAI, Chat } from '@google/genai';

const readFilesAsText = (files: FileList): Promise<string> => {
  const readPromises = Array.from(files).map(file => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(`--- START OF FILE: ${file.name} ---\n\n${content}\n\n--- END OF FILE: ${file.name} ---\n\n`);
      };
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsText(file);
    });
  });
  return Promise.all(readPromises).then(contents => contents.join(''));
};

const SETTINGS_STORAGE_KEY = 'aiContentPlannerSettings';
const PROFILES_STORAGE_KEY = 'aiContentPlannerProfiles';

const App: React.FC = () => {
  const loadSettings = () => {
    try {
      const serializedState = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (serializedState === null) return undefined;
      return JSON.parse(serializedState);
    } catch (err) {
      console.error("Could not load settings from localStorage", err);
      return undefined;
    }
  };
  
  const savedSettings = loadSettings();

  const [niche, setNiche] = useState<string>('');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    instagram: '', linkedIn: '', x: '', facebook: '', youtube: '', pinterest: '',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [referenceFiles, setReferenceFiles] = useState<FileList | null>(null);
  const [styleFiles, setStyleFiles] = useState<FileList | null>(null);
  const [generatedContent, setGeneratedContent] = useState<ContentEntry[]>([]);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previousContentText, setPreviousContentText] = useState<string>('');
  const [referenceText, setReferenceText] = useState<string>('');
  const [styleText, setStyleText] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('calendar');
  const [videoIdea, setVideoIdea] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [videoAudience, setVideoAudience] = useState<string>('');
  
  // Profile state
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(savedSettings?.selectedProfileId || '');
  const [isProfileManagerOpen, setIsProfileManagerOpen] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(savedSettings?.rememberMe || false);

  // Chat state
  const chatSessionRef = useRef<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Load profiles from localStorage on initial render
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      } else {
         const initialCompanyNames = ["Personal Use", "Anmol TMT", "The Abduz", "Talisman", "Coirfit Matters", "Inklik Edu", "Dev Memorial Public School", "Dm Excellence Centre"];
         const initialProfiles: CompanyProfile[] = initialCompanyNames.map(name => ({
             id: crypto.randomUUID(),
             name: name,
             niche: '',
             socialLinks: { instagram: '', linkedIn: '', x: '', facebook: '', youtube: '', pinterest: '' },
             previousContentText: '',
             referenceText: '',
             styleText: ''
         }));
         setProfiles(initialProfiles);
         localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(initialProfiles));
      }
    } catch (err) {
      console.error("Could not load profiles from localStorage", err);
    }
  }, []);

  // Effect to load data when a profile is selected (or on initial load if remembered)
  useEffect(() => {
    if (selectedProfileId) {
      const profile = profiles.find(p => p.id === selectedProfileId);
      if (profile) {
        setNiche(profile.niche);
        setSocialLinks(profile.socialLinks);
        setPreviousContentText(profile.previousContentText);
        setReferenceText(profile.referenceText);
        setStyleText(profile.styleText);
        // Reset non-profile specific inputs
        setUploadedFile(null);
        setReferenceFiles(null);
        setStyleFiles(null);
        setVideoIdea('');
        setVideoDescription('');
        setVideoAudience('');
      }
    }
  }, [selectedProfileId, profiles]);

  // Save settings (rememberMe and selectedProfileId)
  useEffect(() => {
    if (rememberMe) {
      const settingsToSave = { rememberMe, selectedProfileId };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
      } catch (err) {
        console.error("Could not save settings to localStorage", err);
      }
    } else {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  }, [rememberMe, selectedProfileId]);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfileId(profileId);
    if (!profileId) { // If "Select a profile..." is chosen
        setNiche('');
        setSocialLinks({ instagram: '', linkedIn: '', x: '', facebook: '', youtube: '', pinterest: '' });
        setPreviousContentText('');
        setReferenceText('');
        setStyleText('');
    }
  };

  const handleSaveProfile = (profile: CompanyProfile) => {
    const profileExists = profiles.some(p => p.id === profile.id);
    const updatedProfiles = profileExists
      ? profiles.map(p => (p.id === profile.id ? profile : p))
      : [...profiles, profile];
      
    setProfiles(updatedProfiles);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
    
    // Automatically select the profile that was just saved or created.
    handleProfileSelect(profile.id);
  };
  
  const handleDeleteProfile = (profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
    if (selectedProfileId === profileId) {
        handleProfileSelect('');
    }
  };


  const handleGenerate = useCallback(async () => {
    if (generationMode === 'calendar' && !niche.trim() && (!uploadedFile && !previousContentText.trim())) {
      setError('Please provide a niche and a content source (file or text).');
      return;
    }
     if (generationMode === 'script' && (!niche.trim() || !videoIdea.trim())) {
        setError('Please provide a niche and a video idea.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent([]);
    setGeneratedScript(null);
    setChatHistory([]);
    chatSessionRef.current = null;

    try {
      const readSingleFile = (file: File | null): Promise<string> => {
        if (!file) return Promise.resolve('');
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Failed to read the uploaded calendar file.'));
          reader.readAsText(file);
        });
      };
      
      const referenceContentFromFiles = referenceFiles ? await readFilesAsText(referenceFiles) : '';
      const styleContentFromFiles = styleFiles ? await readFilesAsText(styleFiles) : '';

      const finalReferenceContent = [referenceContentFromFiles, referenceText].filter(Boolean).join('\n\n');
      const finalStyleContent = [styleContentFromFiles, styleText].filter(Boolean).join('\n\n');

      if (!process.env.API_KEY) throw new Error("API_KEY not found");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      if (generationMode === 'calendar') {
        const calendarContentFromFile = await readSingleFile(uploadedFile);
        const finalCalendarContent = [calendarContentFromFile, previousContentText].filter(Boolean).join('\n\n');
        const contentPlan = await generateContentPlan(niche, socialLinks, finalCalendarContent, finalReferenceContent, finalStyleContent);
        setGeneratedContent(contentPlan);
        
        const initialPrompt = getInitialPrompt(niche, socialLinks, finalCalendarContent, finalReferenceContent, finalStyleContent);
        const chat = ai.chats.create({
          model: 'gemini-2.5-pro',
          history: [
            { role: 'user', parts: [{ text: initialPrompt }] },
            { role: 'model', parts: [{ text: JSON.stringify({ contentPlan }) }] }
          ],
          config: {
            systemInstruction: `You are a helpful AI assistant refining a social media content plan. The user will provide feedback on the JSON data you've previously generated. Your task is to understand their request, modify the JSON data accordingly, and ALWAYS respond with the complete, updated JSON object under the key 'contentPlan'. Do not use markdown backticks or any other text outside the JSON object. Your entire response must be a parseable JSON object. If you must ask a clarifying question, phrase it conversationally, but your primary goal is to return the modified JSON.`,
            responseMimeType: 'application/json',
            responseSchema: calendarSchema,
          }
        });
        chatSessionRef.current = chat;
      } else { // 'script' mode
        const script = await generateVideoScript(niche, videoIdea, videoDescription, videoAudience, finalReferenceContent, finalStyleContent);
        setGeneratedScript(script);
        
        const initialScriptPrompt = getVideoScriptPrompt(niche, videoIdea, videoDescription, videoAudience, finalReferenceContent, finalStyleContent);
        const chat = ai.chats.create({
          model: 'gemini-2.5-pro',
          history: [
            { role: 'user', parts: [{ text: initialScriptPrompt }] },
            { role: 'model', parts: [{ text: JSON.stringify({ script }) }] }
          ],
          config: {
            systemInstruction: `You are a helpful AI assistant refining a video script. The user will provide feedback on the JSON data you've previously generated (which contains a single 'script' key). Your task is to understand their request, modify the script accordingly, and ALWAYS respond with the complete, updated JSON object under the key 'script'. Do not use markdown backticks or any other text outside the JSON object. Your entire response must be a parseable JSON object.`,
            responseMimeType: 'application/json',
            responseSchema: scriptSchema,
          }
        });
        chatSessionRef.current = chat;
      }

    } catch (err) {
      console.error(err);
      const errorMessage = (err instanceof Error) ? err.message : 'An unexpected error occurred.';
      setError('Failed to generate content. ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    generationMode, niche, videoIdea, videoDescription, videoAudience,
    uploadedFile, previousContentText, socialLinks,
    referenceFiles, referenceText, styleFiles, styleText
  ]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    const chatSession = chatSessionRef.current;
    if (!chatSession || !message.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, newUserMessage]);
    setIsChatLoading(true);

    try {
      const response = await chatSession.sendMessage({ message });
      
      let aiResponseText = response.text;
      let modelMessageContent = '';
      
      try {
        const parsedJson = JSON.parse(aiResponseText);
        if (generationMode === 'calendar' && parsedJson.contentPlan && Array.isArray(parsedJson.contentPlan)) {
          setGeneratedContent(parsedJson.contentPlan as ContentEntry[]);
          modelMessageContent = "I've updated the content plan based on your feedback. The changes are reflected in the table above.";
        } else if (generationMode === 'script' && parsedJson.script && typeof parsedJson.script === 'string') {
           setGeneratedScript(parsedJson.script);
           modelMessageContent = "I've updated the video script based on your feedback. The changes are reflected above.";
        } else {
           modelMessageContent = aiResponseText; // Valid JSON but not the expected format
        }
      } catch (e) {
        modelMessageContent = aiResponseText; // Not a JSON response, treat as a conversational message
      }

      const newModelMessage: ChatMessage = { role: 'model', content: modelMessageContent };
      setChatHistory(prev => [...prev, newModelMessage]);

    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again or refine your request." };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, [generationMode]);


  const handleDownload = () => {
    if (generatedContent.length > 0) {
      downloadContentAsCSV(generatedContent);
    }
  };

  const hasContent = generatedContent.length > 0 || generatedScript !== null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <InputForm
              niche={niche}
              setNiche={setNiche}
              socialLinks={socialLinks}
              setSocialLinks={setSocialLinks}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              referenceFiles={referenceFiles}
              setReferenceFiles={setReferenceFiles}
              styleFiles={styleFiles}
              setStyleFiles={setStyleFiles}
              previousContentText={previousContentText}
              setPreviousContentText={setPreviousContentText}
              referenceText={referenceText}
              setReferenceText={setReferenceText}
              styleText={styleText}
              setStyleText={setStyleText}
              generationMode={generationMode}
              setGenerationMode={setGenerationMode}
              videoIdea={videoIdea}
              setVideoIdea={setVideoIdea}
              videoDescription={videoDescription}
              setVideoDescription={setVideoDescription}
              videoAudience={videoAudience}
              setVideoAudience={setVideoAudience}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              profiles={profiles}
              selectedProfileId={selectedProfileId}
              onProfileSelect={handleProfileSelect}
              onManageProfiles={() => setIsProfileManagerOpen(true)}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9 bg-gray-800 rounded-xl shadow-lg p-6 min-h-[600px] flex flex-col">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="m-auto text-center">
                <p className="text-red-400 text-lg">{error}</p>
              </div>
            ) : hasContent ? (
               <div className="flex flex-col h-full space-y-4">
                  <div className="flex-grow min-h-0">
                    {generatedContent.length > 0 && <ContentTable content={generatedContent} onDownload={handleDownload} />}
                    {generatedScript && <VideoScriptDisplay script={generatedScript} />}
                  </div>
                  <div className="flex-shrink-0">
                     <ChatInterface 
                        history={chatHistory} 
                        isLoading={isChatLoading} 
                        onSendMessage={handleSendMessage} 
                     />
                  </div>
               </div>
            ) : (
              <WelcomeSplash />
            )}
          </div>
        </div>
      </main>
      {isProfileManagerOpen && (
        <ProfileManager
            isOpen={isProfileManagerOpen}
            onClose={() => setIsProfileManagerOpen(false)}
            profiles={profiles}
            onSave={handleSaveProfile}
            onDelete={handleDeleteProfile}
        />
      )}
    </div>
  );
};

export default App;
