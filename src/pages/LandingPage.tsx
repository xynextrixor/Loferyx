import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollCodeCompiler } from '../components/ScrollCodeCompiler';

export const LandingPage: React.FC = () => {
    return (
        <div className="antialiased min-h-screen flex flex-col font-body-md text-text-body-md bg-background text-on-surface w-full overflow-x-hidden">
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-surface/70 dark:bg-surface/70 backdrop-blur-md border-b border-white/10">
                <div className="flex justify-between items-center px-4 md:px-margin-desktop py-unit-md max-w-container-max mx-auto">
                    <Link to="/" className="h-10">
                        <img src="/logo.svg" alt="LOFERYX" className="h-full object-contain" />
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/snippets" className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200 cursor-pointer">Snippets</Link>
                        <button onClick={() => document.getElementById('languages')?.scrollIntoView({behavior: 'smooth'})} className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200 cursor-pointer bg-transparent border-none">Languages</button>
                        <button onClick={() => document.getElementById('ai')?.scrollIntoView({behavior: 'smooth'})} className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200 cursor-pointer bg-transparent border-none">AI</button>
                    </div>
                    <Link to="/compiler" className="bg-[#00c950] text-white transition-all duration-200 ease-in-out px-6 py-2 rounded-md font-label-md hidden md:block">
                        Launch Compiler
                    </Link>
                </div>
            </nav>
            
            <main className="flex-grow pt-24 pb-16">
                {/* Hero Section */}
                <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-8 z-10">
                        <h1 className="font-display-lg text-[48px] md:text-[64px] font-bold leading-tight text-white tracking-tighter mb-2">
                            Code Compiler. <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff8c82]">Retro Style.</span> <br/>
                            Instant Execution.
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                            Experience the raw speed of a modern compiler with the aesthetic purity of classic machines. Write, test, and deploy Python, JavaScript, Java, C++, and C# in milliseconds.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <Link to="/compiler" className="bg-[#00c950] text-white transition-all duration-200 ease-in-out px-8 py-3 rounded-md font-body-md font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">terminal</span>
                                Launch Compiler
                            </Link>
                            <button className="btn-secondary px-8 py-3 rounded-md font-body-md font-medium text-white">
                                Learn More
                            </button>
                        </div>
                    </div>
                </section>
                
                {/* Compiler Preview Section */}
                <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
                    <ScrollCodeCompiler />
                </section>
                
                {/* Languages Section */}
                <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl" id="languages">
                    <h2 className="font-headline-lg text-headline-lg text-white mb-12 text-center">Supported Languages</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {/* Lang Cards */}
                        <Link to="/compiler?lang=python" className="glass-card glow-effect rounded-lg p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant">code</span>
                            <span className="font-body-md font-medium">Python</span>
                        </Link>
                        <Link to="/compiler?lang=javascript" className="glass-card glow-effect rounded-lg p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant">javascript</span>
                            <span className="font-body-md font-medium">JavaScript</span>
                        </Link>
                        <Link to="/compiler?lang=java" className="glass-card glow-effect rounded-lg p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant">coffee</span>
                            <span className="font-body-md font-medium">Java</span>
                        </Link>
                        <Link to="/compiler?lang=cpp" className="glass-card glow-effect rounded-lg p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant">developer_mode</span>
                            <span className="font-body-md font-medium">C++</span>
                        </Link>
                        <Link to="/compiler?lang=csharp" className="glass-card glow-effect rounded-lg p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant">terminal</span>
                            <span className="font-body-md font-medium">C#</span>
                        </Link>
                    </div>
                </section>
                
                {/* AI Assistant Section */}
                <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl" id="ai">
                    <div className="glass-card rounded-xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-white/5 mb-6">
                                    <span className="material-symbols-outlined text-[16px] text-[#61BB46]">smart_toy</span>
                                    <span className="font-label-md text-label-md text-[#61BB46]">Beta</span>
                                </div>
                                <h2 className="font-headline-lg text-headline-lg text-white mb-4">AI-Powered Companion</h2>
                                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                                    Write code faster with an intelligent assistant that understands your context and anticipates your needs.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                        <span className="font-body-md text-on-surface">Explain complex code blocks instantly</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                        <span className="font-body-md text-on-surface">Find and resolve elusive bugs</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                        <span className="font-body-md text-on-surface">Optimize algorithms for peak performance</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                        <span className="font-body-md text-on-surface">Generate structured comments automatically</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-surface-container-low rounded-lg p-6 border border-white/5 h-full min-h-[300px] flex items-center justify-center">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-6xl text-primary/50 mb-4 animate-pulse">psychology</span>
                                    <div className="font-code-md text-code-md text-on-surface-variant">// AI Analysis ready</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Features Section */}
                <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl" id="features">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card rounded-xl p-8 flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-primary">bolt</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md font-semibold text-white">Fast Execution</h3>
                            <p className="font-body-md text-on-surface-variant leading-relaxed">Sub-millisecond compilation times across all supported languages, powered by optimized runtime environments.</p>
                        </div>
                        <div className="glass-card rounded-xl p-8 flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-primary">visibility</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md font-semibold text-white">Real-time Output</h3>
                            <p className="font-body-md text-on-surface-variant leading-relaxed">See the results of your code instantly as you type. No need to constantly hit refresh or recompile.</p>
                        </div>
                        <div className="glass-card rounded-xl p-8 flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-primary">lock</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md font-semibold text-white">Secure Compilation</h3>
                            <p className="font-body-md text-on-surface-variant leading-relaxed">Execute unknown code safely in isolated, ephemeral sandboxes protecting your host environment.</p>
                        </div>
                        <Link to="/snippets" className="glass-card glow-effect rounded-xl p-8 flex flex-col gap-4 border border-white/5 cursor-pointer transition-all duration-300 hover:-translate-y-1 block">
                            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-primary">code_blocks</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <h3 className="font-headline-md text-headline-md font-semibold text-white">Algorithms & Snippets</h3>
                                <div className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Browse</div>
                            </div>
                            <p className="font-body-md text-on-surface-variant leading-relaxed">Access our ready-to-use collection of sorting algorithms (Quick, Bubble) and foundational basic snippets in multiple languages with quick copy support.</p>
                        </Link>
                    </div>
                </section>
                
                {/* Footer Area */}
                <footer className="w-full border-t border-[#18181B] py-8 text-center mt-auto">
                    <p className="text-[#A1A1AA] text-xs uppercase tracking-widest font-mono">© 2026 Retro Gala Network. All Systems Operational.</p>
                </footer>
            </main>
        </div>
    );
};
