import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const codeSnippet = `const calculateFibonacci = (n) => {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
};

// Execute and measure performance
const start = performance.now();
const result = calculateFibonacci(30);
const end = performance.now();

console.log(\`Result: \${result}\`);
console.log(\`Time: \${(end - start).toFixed(2)}ms\`);`;

const highlight = (code: string) => {
    return code
        .replace(/(const|return|if)/g, '<span class="text-[#E03A3E]">$1</span>')
        .replace(/(\/\/.*)/g, '<span class="text-[#61BB46]">$1</span>')
        .replace(/(`.*?`)/g, '<span class="text-yellow-300">$1</span>');
};

export const ScrollCodeCompiler: React.FC = () => {
    const [displayedCode, setDisplayedCode] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const screenCenter = window.innerHeight / 2;
            const distance = Math.abs(elementCenter - screenCenter);
            const activeRange = window.innerHeight * 0.4; 
            
            let progress = 1 - (distance / activeRange);
            progress = Math.min(Math.max(progress, 0), 1);
            
            const charCount = Math.floor(progress * codeSnippet.length);
            setDisplayedCode(codeSnippet.slice(0, charCount));
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initialize

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const downloadAsImage = async () => {
        if (!containerRef.current) return;
        const canvas = await html2canvas(containerRef.current);
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'code_compiler.png';
        a.click();
    };

    return (
        <div ref={containerRef} className="glass-card rounded-xl border border-white/10 overflow-hidden flex flex-col w-full min-h-[400px] relative">
            {/* Editor Header */}
            <div className="bg-surface-container flex items-center justify-between px-4 py-2 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E03A3E]/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-[#61BB46]/80"></div>
                </div>
                <div className="font-code-md text-[12px] text-on-surface-variant">main.js - Loferyx Compiler</div>
                <div className="flex gap-2">
                    <button className="bg-[#E03A3E] text-white px-4 py-1 rounded text-[12px] font-medium flex items-center gap-1 hover:bg-[#E03A3E]/90 transition-colors">
                        <span className="material-symbols-outlined text-[14px]">play_arrow</span> Run
                    </button>
                </div>
            </div>
            {/* Editor Body */}
            <div className="flex flex-col md:flex-row flex-1">
                <div className="flex-[2] bg-[#161618] p-4 font-code-md text-code-md text-gray-300 overflow-x-auto border-r border-white/5">
                    <pre className="!bg-transparent m-0 p-0 text-gray-300 whitespace-pre">
                        <code dangerouslySetInnerHTML={{ __html: highlight(displayedCode) }} />
                        <span className="inline-block w-2 h-[1em] bg-[#E03A3E] align-middle animate-pulse ml-[2px]"></span>
                    </pre>
                </div>
                {/* Output Area */}
                <div className="flex-1 bg-surface-container-lowest p-4 font-code-md text-code-md flex flex-col">
                    <div className="text-on-surface-variant text-[12px] mb-2 uppercase tracking-wider">Output</div>
                    <div className="text-white text-sm">
                        &gt; Result: 832040<br/>
                        &gt; Time: 12.45ms<br/>
                        <span className="text-[#61BB46] mt-2 block">✓ Execution completed successfully.</span>
                    </div>
                </div>
            </div>
            {/* Status Bar */}
            <div className="bg-surface-container-high px-4 py-1 flex justify-between items-center text-[11px] font-code-md text-on-surface-variant">
                <div>JavaScript (Node.js 20.x)</div>
                <div>Ln 12, Col 1</div>
            </div>
        </div>
    );
};
