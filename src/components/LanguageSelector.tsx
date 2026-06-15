import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: string;
  onChange: (languageId: string) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="relative flex items-center" id="lang-selector-container">
      <label htmlFor="language-select" className="sr-only">
        Select Programming Language
      </label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full sm:w-48 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-xs font-mono font-semibold tracking-wider hover:border-red-500 focus:border-red-500 focus:outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-8"
      >
        {languages.length > 0 ? (
          languages.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white py-2">
              {lang.name.toUpperCase()}
            </option>
          ))
        ) : (
          <>
            <option value="javascript">JAVASCRIPT</option>
            <option value="python">PYTHON</option>
            <option value="java">JAVA</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
          </>
        )}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 dark:text-gray-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
