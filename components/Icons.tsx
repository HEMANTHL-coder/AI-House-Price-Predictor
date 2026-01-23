import React from 'react';

export const LoaderIcon: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036a3.375 3.375 0 0 0 2.17 2.17l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258a3.375 3.375 0 0 0-2.17 2.17l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a3.375 3.375 0 0 0-2.17-2.17l-1.036-.258a.75.75 0 0 1 0-1.456l1.036.258a3.375 3.375 0 0 0 2.17-2.17l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.558l.52 2.082a1.875 1.875 0 0 0 1.14 1.14l2.082.52a.75.75 0 0 1 0 1.424l-2.082.52a1.875 1.875 0 0 0-1.14 1.14l-.52 2.082a.75.75 0 0 1-1.424 0l-.52-2.082a1.875 1.875 0 0 0-1.14-1.14l-2.082-.52a.75.75 0 0 1 0-1.424l2.082.52a1.875 1.875 0 0 0 1.14-1.14l.52-2.082A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
    </svg>
);

export const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.5 13a3.5 3.5 0 0 1-3.5-3.5V5.5A3.5 3.5 0 0 1 5.5 2h9A3.5 3.5 0 0 1 18 5.5v4A3.5 3.5 0 0 1 14.5 13H12v2.5A1.5 1.5 0 0 1 10.5 17h-1A1.5 1.5 0 0 1 8 15.5V13H5.5zM6 5.5A1.5 1.5 0 0 0 4.5 7v2.5A1.5 1.5 0 0 0 6 11h8a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 14 5.5H6z" />
    </svg>
);

export const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
