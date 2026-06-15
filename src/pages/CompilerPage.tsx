import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../hooks/useTheme';
import { Play, Save, FolderOpen, ArrowLeft, Eye, HelpCircle, ShieldAlert, Sparkles, X, ChevronRight, Download, MessageSquare, Send, Copy, Plus, Minus, GripVertical, GripHorizontal, Wand2, ClipboardPaste, Moon, Sun } from 'lucide-react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { useWindowSize } from '../hooks/useWindowSize';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

import { Language, CompileResponse } from '../types';
import { Editor } from '../components/Editor';
import { LanguageSelector } from '../components/LanguageSelector';
import { OutputPanel } from '../components/OutputPanel';
import { useCollaboration } from '../hooks/useCollaboration';

// Default code templates
const DEFAULT_CODE: Record<string, string> = {
  python: 'print("Hello, World!")\n# Write your Python 3 code here',
  javascript: 'console.log("Hello, World!");\n// Write your JavaScript/TypeScipt here',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  cpp: '#include <iostream>\n\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}',
  csharp: 'using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, World!");\n  }\n}'
};

export const CompilerPage: React.FC = () => {
  const { width } = useWindowSize();
  const { isDark, toggleTheme } = useTheme();
  const isDesktop = width >= 1024;
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  let initialLang = searchParams.get('lang') || 'javascript';
  if (!['python', 'javascript', 'java', 'cpp', 'csharp'].includes(initialLang)) {
    initialLang = 'javascript';
  }
  const [languages, setLanguages] = useState<Language[]>([
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
    { id: 'csharp', name: 'C#' }
  ]);
  const [language, setLanguage] = useState(initialLang);
  
  const initialCodeFromState = location.state?.initialCode;
  const [code, setCode] = useState(() => {
    try {
      const tempSnippet = sessionStorage.getItem('temp_snippet_code');
      if (tempSnippet) {
        return tempSnippet;
      }
    } catch {}
    
    if (initialCodeFromState) return initialCodeFromState;
    try {
      const cached = localStorage.getItem(`compiler_snippet_${initialLang}`);
      if (cached) return cached;
    } catch {}
    return DEFAULT_CODE[initialLang] || '';
  });

  useEffect(() => {
    // Clean up temporary snippet from sessionStorage once mounted
    sessionStorage.removeItem('temp_snippet_code');
  }, []);
  const [output, setOutput] = useState('');
  const [errorObj, setErrorObj] = useState('');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [isCopied, setIsCopied] = useState(false);
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

  // Collaboration State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const { collaboratorsCount, provider, ydoc } = useCollaboration(sessionId, editorInstance);

  const handleCreateSession = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const genSeg = () => Array.from({length:4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const id = genSeg();
    setSessionId(id);
  };

  const handleJoinSession = () => {
    const id = window.prompt('Enter Session ID:');
    if (id && id.trim()) {
      setSessionId(id.trim());
    }
  };

  const handleLeaveSession = () => {
    if (editorInstance) {
      setCode(editorInstance.getValue());
    }
    setSessionId(null);
  };

  useEffect(() => {
    let lang = searchParams.get('lang') || 'javascript';
    if (!['python', 'javascript', 'java', 'cpp', 'csharp'].includes(lang)) {
      lang = 'javascript';
    }
    setLanguage(lang);
  }, [searchParams]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isChatting]);

  const prevLanguageRef = useRef(language);

  useEffect(() => {
    if (prevLanguageRef.current === language) {
       return; // Hasn't changed, this is a mount (or strict mode remount), skip it!
    }
    prevLanguageRef.current = language;

    try {
      const cached = localStorage.getItem(`compiler_snippet_${language}`);
      if (cached) {
        setCode(cached);
      } else {
        setCode(DEFAULT_CODE[language] || '');
      }
    } catch(e) {
      setCode(DEFAULT_CODE[language] || '');
    }
  }, [language]);

  // Sync collaborative language
  useEffect(() => {
    if (!ydoc || !provider) return;
    const metaMap = ydoc.getMap('meta');
    
    const initLanguage = () => {
      // Set initial if room was just created
      if (!metaMap.has('language') && provider.awareness.getStates().size <= 1) {
        metaMap.set('language', language);
      }
    };

    if (provider.synced) {
      initLanguage();
    } else {
      provider.once('sync', initLanguage);
    }
    
    const handleMetaChange = () => {
      const sharedLang = metaMap.get('language') as string;
      if (sharedLang) {
        setLanguage(prev => prev !== sharedLang ? sharedLang : prev);
      }
    };
    
    metaMap.observe(handleMetaChange);
    handleMetaChange();

    return () => {
      metaMap.unobserve(handleMetaChange);
    };
  }, [ydoc, provider]); // Removing 'language' so it doesn't try to reset the metaMap every time the local language changes

  // Sync run code execution
  const lastRunRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!provider) return;

    const handleAwarenessChange = () => {
      const states = provider.awareness.getStates();
      states.forEach((state: any, clientId: number) => {
        if (clientId !== provider.awareness.clientID && state.runTrigger && state.runTrigger !== lastRunRef.current) {
          lastRunRef.current = state.runTrigger;
          document.dispatchEvent(new CustomEvent('remote-run-code'));
        }
      });
    };

    provider.awareness.on('change', handleAwarenessChange);
    return () => provider.awareness.off('change', handleAwarenessChange);
  }, [provider]);

  useEffect(() => {
    const handleRemoteRun = () => {
      handleRunCode(false); // Call without broadcasting
    };
    document.addEventListener('remote-run-code', handleRemoteRun as EventListener);
    return () => document.removeEventListener('remote-run-code', handleRemoteRun as EventListener);
  }, [code, language]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (ydoc) {
      ydoc.getMap('meta').set('language', newLang);
    }
    try {
      const cached = localStorage.getItem(`compiler_snippet_${newLang}`);
      if (cached) {
        setCode(cached);
      } else {
        setCode(DEFAULT_CODE[newLang] || '');
      }
    } catch(e) {
       setCode(DEFAULT_CODE[newLang] || '');
    }
  };

  const handleRunCode = async (broadcast = true) => {
    if (isLoading) return;
    
    if (broadcast && provider) {
      const triggerId = Date.now();
      lastRunRef.current = triggerId;
      provider.awareness.setLocalStateField('runTrigger', triggerId);
    }
    
    setIsLoading(true);
    setStatus('loading');
    setOutput('');
    setErrorObj('');
    setExecutionTime(null);

    const currentCode = editorInstance ? editorInstance.getValue() : code;

    try {
      const res = await axios.post<CompileResponse>('/api/compile', {
        code: currentCode,
        language
      });
      
      setOutput(res.data.output || '');
      setErrorObj(res.data.error || '');
      
      if (res.data.status === 'error') {
        setStatus('error');
      } else {
        setStatus('success');
      }
      
      if (res.data.executionTime !== undefined) {
        setExecutionTime(res.data.executionTime);
      }
    } catch (err: any) {
      setStatus('error');
      if (err.response?.data?.error) {
        setErrorObj(err.response.data.error);
      } else {
        setErrorObj(err.message || 'An network connection runtime error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem(`compiler_snippet_${language}`, code);
      console.log(`SNAPSHOT SECURED: Saved your ${language.toUpperCase()} file locally.`);
    } catch(e) {
      console.warn("Storage restricted in this environment");
    }
  };

  const handleLoad = () => {
    try {
      const saved = localStorage.getItem(`compiler_snippet_${language}`);
      if (saved) {
        setCode(saved);
        console.log(`SNAPSHOT LOADED: Loaded your previous ${language.toUpperCase()} session.`);
      } else {
        console.log(`EMPTY BUFFER: No previous local snapshot found for ${language.toUpperCase()}.`);
      }
    } catch(e) {
      console.warn("Storage restricted in this environment");
    }
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      python: 'py',
      javascript: 'js',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs'
    };
    const extension = extensions[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `main.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsImage = async () => {
    const element = document.getElementById('compiler-main-canvas');
    if (!element) return;
    const canvas = await html2canvas(element);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compiler_snapshot.png';
    a.click();
  };

  const handleGenerateCode = async () => {
    if (!aiPrompt.trim() || isGeneratingCode) return;
    setIsGeneratingCode(true);

    try {
      const res = await axios.post('/api/generate', {
        prompt: aiPrompt,
        language
      });
      if (res.data.code) {
        setCode(res.data.code);
        setAiPrompt('');
      }
    } catch (err: any) {
      alert(`AI Generation Failed: ${err.message}`);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleChatSubmit = async (e?: React.FormEvent, overrideMessage?: string) => {
    e?.preventDefault();
    const userMessage = typeof overrideMessage === 'string' ? overrideMessage : chatInput.trim();
    if (!userMessage || isChatting) return;

    setChatInput('');
    
    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', text: userMessage }
    ];
    setChatHistory(newHistory);
    setIsChatting(true);

    try {
      const historyStr = chatHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await axios.post('/api/chat', {
        message: userMessage,
        history: historyStr,
        language,
        codeContext: code
      });
      
      let responseText = res.data.response || 'No response.';

      const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/;
      const match = responseText.match(codeBlockRegex);
      if (match && match[1]) {
        setCode(match[1].trim());
        // Clean the markdown from the text since it's now in the editor
        responseText = responseText.replace(codeBlockRegex, '\n\n**[Code updated in the editor panel]**\n\n').trim();
      }

      setChatHistory([
        ...newHistory,
        { role: 'model', text: responseText }
      ]);
    } catch (err: any) {
      setChatHistory([
        ...newHistory,
        { role: 'model', text: `Error: ${err.message}` }
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleExplainCode = () => {
    setShowChat(true);
    if (!isChatting && chatHistory.length === 0) {
      setChatHistory([
        { role: 'model', text: 'Hi! I am your AI coding companion. How can I help you with your code today?' }
      ]);
    }
  };

  const handleExplainError = (errString: string) => {
    setShowChat(true);
    // Add the user message directly to simulation if not chatting initially
    const errPrompt = `I received this error when running my code. Please explain what it means and how I can fix it:\n\n${errString}`;
    handleChatSubmit(undefined, errPrompt);
  };

  // Custom regex-powered clean Markdown element parser
  const renderFormattedExplanation = (md: string) => {
    if (!md) return <p className="text-gray-600 dark:text-gray-400 text-xs font-mono animate-pulse">Consulting retro brain circuits...</p>;
    
    return md.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={index} className="text-red-500 font-mono text-xs font-bold tracking-widest uppercase mt-6 mb-2 border-l-2 border-red-500 pl-2">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={index} className="text-zinc-900 dark:text-white font-sans text-sm font-bold tracking-wide mt-5 mb-2.5">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={index} className="text-green-500 font-sans text-base font-extrabold tracking-tight mt-6 mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-1">
            {line.replace('# ', '')}
          </h2>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemContent = line.substring(2);
        const boldParts = itemContent.split('**');
        return (
          <li key={index} className="text-gray-600 dark:text-gray-400 text-xs font-sans list-disc list-inside ml-2 my-1.5 leading-relaxed">
            {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-zinc-900 dark:text-white font-semibold">{part}</strong> : part)}
          </li>
        );
      }
      if (line.startsWith('```')) {
        return null;
      }

      // Handle raw bold parts in a paragraph
      const boldParts = line.split('**');
      if (boldParts.length > 1) {
        return (
          <p key={index} className="text-gray-600 dark:text-gray-400 text-xs font-sans leading-relaxed my-2">
            {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-zinc-900 dark:text-white font-semibold">{part}</strong> : part)}
          </p>
        );
      }
      
      return line.trim() === '' ? <div key={index} className="h-2" /> : (
        <p key={index} className="text-gray-600 dark:text-gray-400 text-xs font-sans leading-relaxed my-1.5">{line}</p>
      );
    });
  };

  return (
    <div className="h-[100dvh] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col justify-between overflow-hidden relative font-sans select-none" id="compiler-root">
      
      {/* Tiny top cyber accent header status */}
      <div className="h-1 bg-gradient-to-r from-red-500 via-zinc-800 to-green-500" />

      {/* Compiler Dashboard Navigation */}
      <header className="min-h-[4rem] border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between px-4 lg:px-6 py-3 bg-zinc-100 dark:bg-zinc-900 shrink-0 z-20 gap-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-1 bg-zinc-50 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800" id="nav-back-button">
            <ArrowLeft size={16} />
          </Link>
          <Link to="/" className="flex items-center h-10 gap-2">
            <img src="/logo.svg" alt="LOFERYX" className="h-full object-contain" />
            <span className="font-sans text-sm font-bold text-zinc-900 dark:text-white tracking-tight">Loferyx Compiler</span>
          </Link>
          <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-1.5 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 ml-2" title="Toggle Theme">
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 ml-auto sm:ml-0">
          {/* Toolbar & Selector */}
          <div className="flex items-center gap-3">
            <LanguageSelector 
              languages={languages} 
              selectedLanguage={language} 
              onChange={handleLanguageChange} 
              disabled={isLoading} 
            />

            {/* Local state persistent saving widgets */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={handleSave}
                title="Save current code snippet standard"
                className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-red-500 hover:text-red-500 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                id="compiler-save-btn"
              >
                <Save size={12} />
                <span>SAVE</span>
              </button>
              <button
                onClick={handleLoad}
                title="Load previous code snippet cache"
                className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-green-500 hover:text-green-500 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                id="compiler-load-btn"
              >
                <FolderOpen size={12} />
                <span>LOAD</span>
              </button>
              <button
                onClick={handleDownload}
                title="Download code as file"
                className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:text-blue-500 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                id="compiler-download-btn"
              >
                <Download size={12} />
                <span>DL</span>
              </button>
              <button
                onClick={downloadAsImage}
                title="Download snapshot as image"
                className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500 hover:text-purple-500 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                id="compiler-download-img-btn"
              >
                <Download size={12} />
                <span>IMG</span>
              </button>
            </div>
          </div>

          {/* Top Actions: Run and Explain */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Collaboration controls */}
            {sessionId ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-zinc-900 dark:text-white">ID: {sessionId}</span>
                  <span className="font-mono text-[10px] text-gray-600 dark:text-gray-400 ml-2 hidden sm:inline">[{collaboratorsCount} online]</span>
                </div>
                <button
                  onClick={handleLeaveSession}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 hover:border-red-500 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all"
                >
                  Leave
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateSession}
                  className="px-3 py-1.5 bg-[#61BB46]/10 hover:bg-[#61BB46]/20 text-[#61BB46] border border-[#61BB46]/30 hover:border-[#61BB46] rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all"
                >
                  <span className="hidden sm:inline">Send / </span>Create<span className="hidden sm:inline"> Session</span>
                </button>
                <button
                  onClick={handleJoinSession}
                  className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 hover:border-blue-500 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all"
                >
                  <span className="hidden sm:inline">Receive / </span>Join<span className="hidden sm:inline"> Session</span>
                </button>
              </div>
            )}

            {/* Explain button using Gemini */}
            <button
              onClick={handleExplainCode}
              disabled={isChatting || isLoading}
              className="hidden sm:flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-red-500 text-gray-600 dark:text-gray-400 hover:text-white px-3.5 py-2 rounded-lg font-mono text-[10px] items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              id="compiler-explain-btn"
            >
              <MessageSquare size={12} className={isChatting ? "text-red-500 animate-bounce" : "text-red-500"} />
              <span>AI CHAT</span>
            </button>

            <button
              onClick={handleRunCode}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-black hover:text-white px-5 py-2 rounded-lg font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xl hover:shadow-green-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:translate-y-0.5"
              id="compiler-run-btn"
            >
              <Play size={12} fill="currentColor" className={isLoading ? "animate-pulse" : ""} />
              <span>{isLoading ? 'EXECUTING...' : 'RUN CODE'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid: Workspace Editor and Output Console */}
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden min-h-0 relative w-full bg-zinc-50 dark:bg-zinc-950 p-4 lg:p-6" id="compiler-main-canvas">
        {isDesktop ? (
        <Group 
          orientation="horizontal" 
          className="flex-1 w-full h-full"
        >
        {/* Editor Workspace Block */}
        <Panel id="editor-panel" order={1} defaultSize={65} minSize={20} className="flex flex-col">
        <section className="flex flex-col justify-stretch h-full min-h-0 w-full" id="gala-editor-container">
          
          {/* AI Prompt Bar */}
          <div className="flex items-center gap-2 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100 dark:bg-zinc-900 mb-2 shrink-0">
            <Sparkles size={14} className={isGeneratingCode ? "text-purple-500 animate-pulse" : "text-gray-600 dark:text-gray-400"} />
            <input 
              type="text" 
              placeholder="Ask AI to write code for you..." 
              className="bg-transparent border-none outline-none flex-1 font-mono text-xs text-zinc-900 dark:text-white placeholder-zinc-800 min-w-0"
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerateCode();
                }
              }}
              disabled={isGeneratingCode || isLoading}
            />
            {aiPrompt && (
              <button 
                onClick={() => setAiPrompt('')}
                className="text-gray-600 dark:text-gray-400 hover:text-white p-1"
              >
                <X size={12} />
              </button>
            )}
            <button
              onClick={handleGenerateCode}
              disabled={isGeneratingCode || isLoading || !aiPrompt.trim()}
              className="text-[10px] font-mono uppercase bg-zinc-200 dark:bg-zinc-800 hover:bg-purple-500 text-gray-600 dark:text-gray-400 hover:text-white px-2.5 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
            >
              {isGeneratingCode ? "GENERATING..." : "GENERATE"}
            </button>
          </div>

          {/* Editor Header panel */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-x border-zinc-200 dark:border-zinc-800 rounded-t-lg bg-zinc-100 dark:bg-zinc-900 text-[10px] font-mono shrink-0 select-none text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider">main.{language === 'cpp' ? 'cpp' : language === 'javascript' ? 'ts' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cs'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-950 p-[2px]">
                <button 
                  onClick={() => setFontSize(Math.max(8, fontSize - 1))}
                  className="hover:bg-zinc-800 p-0.5 rounded text-gray-600 dark:text-gray-400 hover:text-white"
                  title="Decrease Font Size"
                >
                  <Minus size={10} />
                </button>
                <span className="px-1 text-zinc-900 dark:text-white">{fontSize}px</span>
                <button 
                  onClick={() => setFontSize(Math.min(32, fontSize + 1))}
                  className="hover:bg-zinc-800 p-0.5 rounded text-gray-600 dark:text-gray-400 hover:text-white"
                  title="Increase Font Size"
                >
                  <Plus size={10} />
                </button>
              </div>
              <button 
                onClick={() => {
                  if (editorInstance) {
                    editorInstance.getAction('editor.action.formatDocument').run();
                  }
                }}
                className="hover:text-white flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-800 px-2 py-0.5 rounded transition-colors"
                title="Format Code"
              >
                <Wand2 size={10} /> FORMAT
              </button>
              <button 
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (editorInstance) {
                      const selection = editorInstance.getSelection();
                      if (selection) {
                        editorInstance.executeEdits('paste', [{
                          range: selection,
                          text: text,
                          forceMoveMarkers: true
                        }]);
                        setCode(editorInstance.getValue());
                      } else {
                        setCode(text);
                      }
                    } else {
                      setCode(text);
                    }
                  } catch (err) {
                    console.error('Failed to read clipboard contents: ', err);
                  }
                }}
                className="hover:text-white flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-800 px-2 py-0.5 rounded transition-colors"
                title="Paste code from clipboard"
              >
                <ClipboardPaste size={10} /> PASTE
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="hover:text-white flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-800 px-2 py-0.5 rounded transition-colors"
                title="Copy code to clipboard"
              >
                <Copy size={10} /> {isCopied ? 'COPIED!' : 'COPY'}
              </button>
              <span className="hidden sm:inline">BUFF BOUNDS</span>
              <span className="hidden sm:inline">UTF-8</span>
            </div>
          </div>
          <div className="flex-1 min-h-0 relative">
            <div className="absolute inset-0">
              <Editor 
                code={sessionId ? undefined : code} 
                onChange={setCode} 
                language={language} 
                disabled={isLoading} 
                fontSize={fontSize}
                onMount={(editor) => setEditorInstance(editor)}
              />
            </div>
          </div>
        </section>
        </Panel>

        <Separator className="flex items-center justify-center shrink-0 z-10 transition-colors w-2 lg:w-4 h-full hover:bg-zinc-800 lg:cursor-col-resize flex-col items-center my-auto px-2">
          <div className="bg-zinc-200 dark:bg-zinc-800 rounded px-1 py-1 lg:px-0.5 lg:py-4 text-gray-500">
             <GripVertical size={12} />
          </div>
        </Separator>

        {/* Console / Output Area Panel */}
        <Panel id="console-panel" order={2} defaultSize={35} minSize={20} className="flex flex-col">
        <section className="w-full flex flex-col justify-stretch h-full min-h-0 relative" id="gala-console-container">
          <OutputPanel 
            output={output} 
            error={errorObj} 
            executionTime={executionTime} 
            isLoading={isLoading} 
            status={status}
            onExplainError={handleExplainError}
          />
        </section>
        </Panel>
        </Group>
        ) : (
          <div className="flex flex-col w-full min-h-max pb-[80px] gap-6">
            <section className="flex flex-col w-full h-[450px]" id="gala-editor-container-mobile">
              
              {/* AI Prompt Bar */}
              <div className="flex items-center gap-2 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100 dark:bg-zinc-900 mb-2 shrink-0">
                <Sparkles size={14} className={isGeneratingCode ? "text-purple-500 animate-pulse" : "text-gray-600 dark:text-gray-400"} />
                <input 
                  type="text" 
                  placeholder="Ask AI to write code for you..." 
                  className="bg-transparent border-none outline-none flex-1 font-mono text-xs text-zinc-900 dark:text-white placeholder-zinc-800 min-w-0"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGenerateCode();
                    }
                  }}
                  disabled={isGeneratingCode || isLoading}
                />
                {aiPrompt && (
                  <button 
                    onClick={() => setAiPrompt('')}
                    className="text-gray-600 dark:text-gray-400 hover:text-white p-1"
                  >
                    <X size={12} />
                  </button>
                )}
                <button
                  onClick={handleGenerateCode}
                  disabled={isGeneratingCode || isLoading || !aiPrompt.trim()}
                  className="text-[10px] font-mono uppercase bg-zinc-200 dark:bg-zinc-800 hover:bg-purple-500 text-gray-600 dark:text-gray-400 hover:text-white px-2.5 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
                >
                  {isGeneratingCode ? "GENERATING..." : "GENERATE"}
                </button>
              </div>

              {/* Editor Header panel */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-x border-zinc-200 dark:border-zinc-800 rounded-t-lg bg-zinc-100 dark:bg-zinc-900 text-[10px] font-mono shrink-0 select-none text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider">main.{language === 'cpp' ? 'cpp' : language === 'javascript' ? 'ts' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cs'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-950 p-[2px]">
                    <button 
                      onClick={() => setFontSize(Math.max(8, fontSize - 1))}
                      className="hover:bg-zinc-800 p-0.5 rounded text-gray-600 dark:text-gray-400 hover:text-white"
                      title="Decrease Font Size"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="px-1 text-zinc-900 dark:text-white">{fontSize}px</span>
                    <button 
                      onClick={() => setFontSize(Math.min(32, fontSize + 1))}
                      className="hover:bg-zinc-800 p-0.5 rounded text-gray-600 dark:text-gray-400 hover:text-white"
                      title="Increase Font Size"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      if (editorInstance) {
                        editorInstance.getAction('editor.action.formatDocument').run();
                      }
                    }}
                    className="hover:text-white flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-800 px-2 py-0.5 rounded transition-colors"
                    title="Format Code"
                  >
                    <Wand2 size={10} /> FORMAT
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (editorInstance) {
                          const selection = editorInstance.getSelection();
                          if (selection) {
                            editorInstance.executeEdits('paste', [{
                              range: selection,
                              text: text,
                              forceMoveMarkers: true
                            }]);
                            setCode(editorInstance.getValue());
                          } else {
                            setCode(text);
                          }
                        } else {
                          setCode(text);
                        }
                      } catch (err) {
                        console.error('Failed to read clipboard contents: ', err);
                      }
                    }}
                    className="hover:text-white flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-800 px-2 py-0.5 rounded transition-colors"
                    title="Paste code from clipboard"
                  >
                    <ClipboardPaste size={10} /> PASTE
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="hover:text-white flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-800 px-2 py-0.5 rounded transition-colors"
                    title="Copy code to clipboard"
                  >
                    <Copy size={10} /> {isCopied ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0 relative">
                <div className="absolute inset-0">
                  <Editor 
                    code={sessionId ? undefined : code} 
                    onChange={setCode} 
                    language={language} 
                    disabled={isLoading} 
                    fontSize={fontSize}
                    onMount={(editor) => setEditorInstance(editor)}
                  />
                </div>
              </div>
            </section>

            {/* Custom Vertical Divider */}
            <div className="w-full flex items-center justify-center gap-3 text-zinc-600 font-mono text-[10px] uppercase tracking-widest my-2">
               <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
               <span>Terminal Console</span>
               <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
            </div>

            <section className="w-full flex flex-col justify-stretch h-[350px] shrink-0" id="gala-console-container-mobile">
              <OutputPanel 
                output={output} 
                error={errorObj} 
                executionTime={executionTime} 
                isLoading={isLoading} 
                status={status}
                onExplainError={handleExplainError}
              />
            </section>
          </div>
        )}

        {/* Chat / Explain sliding side panel using Framer Motion */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-zinc-100 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col shadow-2xl z-30 font-mono text-xs overflow-hidden"
              id="ai-chat-drawer"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 p-4 shrink-0 bg-zinc-50 dark:bg-zinc-950">
                <div className="flex items-center gap-2 text-red-500">
                  <MessageSquare size={16} />
                  <span className="font-bold text-xs uppercase tracking-widest text-zinc-900 dark:text-white">AI CHAT & COMPANION</span>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-1.5 hover:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:text-white rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable chat messages */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatHistory.length === 0 && !isChatting ? (
                  <div className="text-center text-gray-600 dark:text-gray-400 mt-10">
                    <Sparkles size={24} className="mx-auto mb-2 opacity-50" />
                    <p>Start chatting with AI about your code.</p>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div key={idx} className={`max-w-[85%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white self-end ml-auto' : 'bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 mr-auto'}`}>
                      {msg.role === 'model' ? renderFormattedExplanation(msg.text) : msg.text}
                    </div>
                  ))
                )}
                {isChatting && (
                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 rounded-lg p-3 mr-auto max-w-[85%] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce delay-75" />
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce delay-150" />
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 shrink-0 bg-zinc-50 dark:bg-zinc-950">
                <form onSubmit={e => handleChatSubmit(e)} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={isChatting}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isChatting}
                    className="p-2 bg-red-500 text-zinc-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors flex items-center justify-center shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating explain/localStorage micro utilities on layouts for extremely small screens */}
      <div className="sm:hidden flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0 gap-3">
        <button
          onClick={handleExplainCode}
          disabled={isChatting || isLoading}
          className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-[10px] rounded-lg tracking-wider font-mono flex items-center justify-center gap-1"
        >
          <MessageSquare size={10} className="text-red-500" />
          <span>AI CHAT</span>
        </button>
        <button
          onClick={handleSave}
          className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-[10px] rounded-lg tracking-wider font-mono flex items-center justify-center gap-1"
        >
          <Save size={10} />
          <span>SAVE</span>
        </button>
        <button
          onClick={handleLoad}
          className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-[10px] rounded-lg tracking-wider font-mono flex items-center justify-center gap-1"
        >
          <FolderOpen size={10} />
          <span>LOAD</span>
        </button>
        <button
          onClick={handleDownload}
          className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-[10px] rounded-lg tracking-wider font-mono flex items-center justify-center gap-1"
        >
          <Download size={10} />
          <span>DL</span>
        </button>
      </div>

      {/* Retro Status footer bar */}
      <footer className="h-8 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-between px-6 text-[10px] font-mono text-gray-600 dark:text-gray-400 shrink-0 select-none z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
            <span>LOFERYX_TERMINAL_ONLINE_2026</span>
          </div>
          <span className="hidden sm:inline border-l border-zinc-200 dark:border-zinc-800 pl-3">CALLBACK_SYNC='run-code-sync'</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">SYSTEM BOUND REGION // WEST_US_GALA</span>
          <span>COMPACT_GALA_v4.1</span>
        </div>
      </footer>
    </div>
  );
};
