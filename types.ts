export type GenerationMode = 'calendar' | 'script';

export interface SocialLinks {
  instagram: string;
  linkedIn: string;
  x: string;
  facebook: string;
  youtube: string;
  pinterest: string;
}

export interface ContentEntry {
  day: number;
  platform: string;
  contentType: string;
  idea: string;
  caption: string;
  hashtags: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  niche: string;
  socialLinks: SocialLinks;
  previousContentText: string;
  referenceText: string;
  styleText: string;
}
