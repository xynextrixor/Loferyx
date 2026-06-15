import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const CODE_LINES = [
    { text: 'const compiler = new RetroCompiler();', color: 'text-blue-400' },
    { text: 'compiler.loadLanguage("javascript");', color: 'text-yellow-400' },
    { text: 'compiler.compile(sourceCode);', color: 'text-purple-400' },
    { text: 'compiler.execute();', color: 'text-green-400' },
    { text: 'console.log("Program Executed Successfully");', color: 'text-white' },
];

export const ScrollCodeAnimation: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const codeEditorRef = useRef<HTMLDivElement>(null);
    const [activeLine, setActiveLine] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!containerRef.current || !codeEditorRef.current) return;

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
                const currentProgress = self.progress;
                setProgress(currentProgress);
                
                // Calculate which line should be fully typed and active
                const linesCount = CODE_LINES.length;
                let newActiveLine = Math.floor(currentProgress * (linesCount + 0.5));
                if (newActiveLine >= linesCount) newActiveLine = linesCount;
                setActiveLine(newActiveLine);
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section 
            ref={containerRef} 
            className="w-full relative bg-[#05060A]" 
            style={{ height: '200vh' }}
        >
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#05060A] via-transparent to-[#05060A]"></div>
                    {/* Scan Lines */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[size:100%_4px] pointer-events-none"></div>
                </div>

                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center relative z-10">
                    
                    {/* Left: Code Editor Window */}
                    <motion.div 
                        ref={codeEditorRef}
                        className="relative w-full rounded-xl overflow-hidden glass-card border border-[#00FF66]/20 shadow-[0_0_15px_rgba(0,255,102,0.1)] bg-[#0A0C10] max-w-[600px] mx-auto lg:mx-0"
                        style={{
                            rotateX: 10 - progress * 10,
                            rotateY: -10 + progress * 10,
                            transformPerspective: 1000,
                        }}
                        initial={{ opacity: 1, y: 0 }}
                    >
                        {/* Editor Header */}
                        <div className="h-8 md:h-10 border-b border-[#00FF66]/20 flex items-center px-4 bg-[#05060A]">
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#00FF66]"></div>
                            </div>
                            <div className="text-[10px] font-mono tracking-widest text-[#00FF66]/50 absolute left-1/2 -translate-x-1/2">
                                compiler.js
                            </div>
                        </div>

                        {/* Editor Content */}
                        <div className="p-4 md:p-8 font-mono text-xs md:text-base leading-relaxed min-h-[200px] md:min-h-[350px]">
                            {CODE_LINES.map((line, idx) => {
                                // Calculate typing effect based on progress
                                const startProgress = idx / CODE_LINES.length;
                                const endProgress = (idx + 1) / CODE_LINES.length;
                                const lineProgress = Math.max(0, Math.min(1, (progress - startProgress) / (endProgress - startProgress)));
                                
                                const charsToShow = Math.floor(lineProgress * line.text.length);
                                const displayedText = line.text.substring(0, charsToShow);
                                
                                const isActive = idx === activeLine;
                                const isFullyTyped = lineProgress === 1;
                                const isVisible = lineProgress > 0 || isActive;

                                if (!isVisible && idx >= activeLine) return null;

                                return (
                                    <div 
                                        key={idx} 
                                        className={`flex relative py-1 ${isActive ? 'bg-[#00FF66]/5 -mx-4 px-4 border-l-2 border-[#00FF66]' : 'border-l-2 border-transparent'}`}
                                    >
                                        <span className="text-gray-600 mr-4 select-none">{idx + 1}</span>
                                        <div className="relative w-full">
                                            <span className={`${line.color} opacity-80 ${isActive ? 'text-shadow-[0_0_10px_currentColor]' : ''}`}>
                                                {displayedText}
                                            </span>
                                            {isActive && lineProgress < 1 && (
                                                <span className="inline-block w-2.5 h-5 bg-[#00FF66] animate-pulse ml-1 align-middle"></span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Final Output */}
                            {progress > 0.95 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="mt-8 border-t border-[#00FF66]/20 pt-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#00FF66] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-black text-[14px]">check</span>
                                        </div>
                                        <span className="text-[#00FF66] font-bold tracking-widest text-xs uppercase shadow-[0_0_10px_currentColor]">Build Successful</span>
                                    </div>
                                    <div className="mt-4 opacity-50 text-xs">
                                        [19:57:51] Execution completed in 0.04ms
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Feature Explanation */}
                    <div className="flex flex-col gap-4 md:gap-8 max-w-lg mt-4 md:mt-0 px-4 md:px-0">
                        <motion.div
                            initial={{ opacity: 1, x: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF66]/30 bg-[#00FF66]/10 mb-4 md:mb-6 font-mono text-[10px] uppercase tracking-widest text-[#00FF66]">
                                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
                                Interactive Build Process
                            </div>
                            
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                                Build as you <br/>
                                <span className="text-[#00FF66] italic">Scroll.</span>
                            </h2>
                            
                            <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
                                Watch the compiler process your instructions in real-time. Our optimized runtime ensures immediate execution feedback, complete with retro-futuristic styling and modern performance.
                            </p>

                            {progress > 0.9 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-4"
                                >
                                    <Link to="/compiler" className="bg-[#00FF66] text-black font-bold px-8 py-4 rounded-lg hover:bg-white hover:scale-105 transition-all w-full md:w-auto text-center flex items-center justify-center gap-2 uppercase tracking-wide text-sm shadow-[0_0_20px_rgba(0,255,102,0.4)]">
                                        Ready to Build?
                                    </Link>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Progress Tracker Steps */}
                        <div className="space-y-4 font-mono text-sm">
                            <div className={`flex items-center gap-4 transition-colors duration-300 ${progress >= 0.2 ? 'text-[#00FF66]' : 'text-gray-600'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${progress >= 0.2 ? 'bg-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,1)]' : 'bg-gray-600'}`} />
                                Initialize Engine
                            </div>
                            <div className={`flex items-center gap-4 transition-colors duration-300 ${progress >= 0.4 ? 'text-[#00FF66]' : 'text-gray-600'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${progress >= 0.4 ? 'bg-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,1)]' : 'bg-gray-600'}`} />
                                Mount Language Context
                            </div>
                            <div className={`flex items-center gap-4 transition-colors duration-300 ${progress >= 0.6 ? 'text-[#00FF66]' : 'text-gray-600'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${progress >= 0.6 ? 'bg-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,1)]' : 'bg-gray-600'}`} />
                                Compile Source Tree
                            </div>
                            <div className={`flex items-center gap-4 transition-colors duration-300 ${progress >= 0.8 ? 'text-[#00FF66]' : 'text-gray-600'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${progress >= 0.8 ? 'bg-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,1)]' : 'bg-gray-600'}`} />
                                Execute Instructions
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
