import React from 'react';

const iconProps = {
  className: "h-5 w-5",
  viewBox: "0 0 24 24",
  fill: "currentColor",
};

const strokeIconProps = {
  className: "h-10 w-10 text-gray-500",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

export const InstagramIcon: React.FC = () => (
  <svg {...iconProps}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);

export const LinkedInIcon: React.FC = () => (
  <svg {...iconProps}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="2" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

export const XIcon: React.FC = () => (
  <svg {...iconProps}><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.931ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>
);

export const FacebookIcon: React.FC = () => (
  <svg {...iconProps}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

export const YouTubeIcon: React.FC = () => (
  <svg {...iconProps}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

export const PinterestIcon: React.FC = () => (
  <svg {...iconProps}><circle cx="12" cy="12" r="10"></circle><path d="M9 10c0-4.42 2.8-8 7-8s7 3.58 7 8c0 4.42-2.8 8-7 8a7.18 7.18 0 0 1-2.45-.42l-2.4 2.92c-.3.37-.82.37-1.12 0L9 10z"></path></svg>
);

export const UploadIcon: React.FC = () => (
  <svg {...strokeIconProps}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const BrainIcon: React.FC = () => (
    <svg {...strokeIconProps}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.5a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 6 6V4.5A2.5 2.5 0 0 1 8.5 2h1Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v1.5a2.5 2.5 0 0 0 2.5 2.5h1A2.5 2.5 0 0 0 18 6V4.5A2.5 2.5 0 0 0 15.5 2h-1Z" />
        <path d="M6 10a2.5 2.5 0 0 1 2.5 2.5v1.5a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 2.5 14v-1.5A2.5 2.5 0 0 1 5 10h1Z" />
        <path d="M18 10a2.5 2.5 0 0 0-2.5 2.5v1.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5v-1.5A2.5 2.5 0 0 0 19 10h-1Z" />
        <path d="M12 11.5a2.5 2.5 0 0 1 2.5 2.5v1.5a2.5 2.5 0 0 1-2.5 2.5h-1a2.5 2.5 0 0 1-2.5-2.5v-1.5A2.5 2.5 0 0 1 11 11.5h1Z" />
        <path d="M9.5 8.5V10" /><path d="M14.5 8.5V10" /><path d="M6 12.5H8" /><path d="M16 12.5h2" /><path d="M12 16.5V18" />
    </svg>
);

export const VoiceIcon: React.FC = () => (
    <svg {...strokeIconProps}>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
);

export const DownloadIcon: React.FC = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const CopyIcon: React.FC = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

export const SendIcon: React.FC = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

export const ManageIcon: React.FC = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
