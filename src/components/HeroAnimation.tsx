import React, { useEffect, useState } from 'react';

const bubbleSortCode = `def bubbleSort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        # Last i elements are already in place
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]

arr = [64, 34, 25, 12, 22, 11, 90]
bubbleSort(arr)
print("Sorted array:", arr)`;

// Simple highlighter
const highlight = (code: string) => {
    return code
        .replace(/(def|for|if|in|return|print)/g, '<span class="text-[#E03A3E]">$1</span>')
        .replace(/(#.*)/g, '<span class="text-[#61BB46]">$1</span>')
        .replace(/(".*?")/g, '<span class="text-yellow-300">$1</span>');
};

export const HeroAnimation: React.FC = () => {
    const [displayedCode, setDisplayedCode] = useState("");
    const [lineNumbers, setLineNumbers] = useState("");

    useEffect(() => {
        // Generate line numbers once
        const numLines = bubbleSortCode.split('\n').length;
        let lineHtml = '';
        for (let i = 1; i <= numLines; i++) {
            lineHtml += `<span class="block">${i}</span>`;
        }
        setLineNumbers(lineHtml);

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = 500; 
            const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
            
            const charCount = Math.floor(progress * bubbleSortCode.length);
            setDisplayedCode(bubbleSortCode.slice(0, charCount));
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initialize

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="w-full bg-[#161618] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[500px]">
             {/* Header */}
            <div className="flex items-center px-4 py-3 bg-[#2d2d2d] border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]/80"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]/80"></div>
                </div>
                <div className="flex-1 text-center text-xs text-gray-600 dark:text-gray-400 font-mono">bubble_sort.py</div>
            </div>
            
            {/* Editor Area */}
            <div className="flex-1 font-code-md text-code-md overflow-hidden relative flex">
                <div 
                    className="w-12 bg-[#1a1a1c] border-r border-white/5 pt-4 text-right pr-3 text-on-surface-variant/40 select-none flex flex-col text-[13px] leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: lineNumbers }}
                />
                <div className="flex-1 p-4 overflow-y-auto text-[13px] leading-relaxed">
                    <pre className="!bg-transparent m-0 p-0 whitespace-pre-wrap break-words text-gray-700 dark:text-gray-300">
                        <code dangerouslySetInnerHTML={{ __html: highlight(displayedCode) }} />
                        <span className="inline-block w-2 h-[1em] bg-[#E03A3E] align-middle animate-pulse ml-[2px]"></span>
                    </pre>
                </div>
            </div>
        </div>
    );
};
