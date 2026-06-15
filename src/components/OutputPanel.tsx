import React from 'react';
import { Terminal, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  error: string;
  executionTime: number | null;
  isLoading: boolean;
  status: 'idle' | 'success' | 'error' | 'loading';
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  error,
  executionTime,
  isLoading,
  status,
}) => {
  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden" id="output-panel-outer">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-red-500" />
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
            Execution Console
          </span>
        </div>
        
        {/* Status indicator badges */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>RUNNING...</span>
            </div>
          ) : status === 'success' ? (
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-green-500">
              <CheckCircle size={12} />
              <span>SUCCESS</span>
            </div>
          ) : status === 'error' ? (
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-red-500">
              <AlertCircle size={12} />
              <span>FAILED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <span>READY</span>
            </div>
          )}

          {executionTime !== null && !isLoading && (
            <div className="flex items-center gap-1 font-mono text-[10px] bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded text-gray-400">
              <Clock size={10} className="text-green-500" />
              <span>{executionTime}ms</span>
            </div>
          )}
        </div>
      </div>

      {/* Output Console Body */}
      <div className="flex-1 p-5 font-mono text-xs overflow-auto bg-zinc-900 min-h-[180px] sm:min-h-[250px] flex flex-col justify-between">
        <div className="space-y-4">
          {isLoading && (
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-red-500 animate-pulse">&gt;</span>
                <span>Initializing sandboxed workspace...</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 animate-pulse">&gt;</span>
                <span>Linking execution headers...</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 animate-pulse">&gt;</span>
                <span className="text-white font-semibold">Running program...</span>
              </div>
            </div>
          )}

          {!isLoading && !output && !error && (
            <div className="text-gray-400 italic text-center py-10 flex flex-col items-center justify-center gap-2">
              <span className="text-zinc-800 text-2xl">&lt;/&gt;</span>
              <span>Awaiting code compilation. Press 'RUN CODE' to execute.</span>
            </div>
          )}

          {/* stdout - strictly white as per request */}
          {!isLoading && output && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 select-none border-b border-zinc-800 pb-0.5 max-w-max">
                STDOUT
              </div>
              <pre className="text-white whitespace-pre-wrap font-mono leading-relaxed bg-zinc-950 p-3 border border-zinc-800/50 rounded break-all">
                {output}
              </pre>
            </div>
          )}

          {/* stderr - strictly red #E03A3E as per request */}
          {!isLoading && error && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-red-500 tracking-wider mb-2 select-none border-b border-red-500/30 pb-0.5 max-w-max">
                STDERR
              </div>
              <div className="bg-red-500/5 border border-red-500/30 p-3 rounded text-red-500 whitespace-pre-wrap font-mono leading-relaxed flex gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <pre className="break-all flex-1 text-red-500 font-mono">{error}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Console status footer */}
        {!isLoading && (output || error) && (
          <div className="border-t border-zinc-800/30 pt-3 mt-4 text-[10px] text-gray-400 flex justify-between tracking-wide">
            <span>RUN COMPLETED SUCCESSFULLY</span>
            <span>END OF STREAM</span>
          </div>
        )}
      </div>
    </div>
  );
};
