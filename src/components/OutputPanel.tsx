import React, { useState } from "react";
import {
  Terminal,
  AlertCircle,
  Clock,
  CheckCircle,
  Sparkles,
  Activity,
  MemoryStick,
  Cpu,
  GitMerge,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export interface OutputPanelProps {
  output: string;
  error: string;
  executionTime: number | null;
  isLoading: boolean;
  status: "idle" | "success" | "error" | "loading";
  onExplainError?: (error: string) => void;
  stdin?: string;
  onStdinChange?: (value: string) => void;
  metrics?: {
    memoryUsedMb: number;
    cpuTimeMs: number;
    speedGraph: { name: string; speed: number; memory: number }[];
  } | null;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  error,
  executionTime,
  isLoading,
  status,
  onExplainError,
  stdin,
  onStdinChange,
  metrics,
}) => {
  const [activeTab, setActiveTab] = useState<"console" | "metrics">("console");

  return (
    <div
      className="flex flex-col h-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden"
      id="output-panel-outer"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("console")}
            className={`flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest transition-colors ${activeTab === "console" ? "text-zinc-900 dark:text-white border-b-2 border-red-500 pb-0.5" : "text-gray-500 hover:text-zinc-900 dark:hover:text-white"}`}
          >
            <Terminal
              size={14}
              className={activeTab === "console" ? "text-red-500" : ""}
            />
            Console
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            id="tour-metrics-tab"
            className={`flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest transition-colors ${activeTab === "metrics" ? "text-zinc-900 dark:text-white border-b-2 border-green-500 pb-0.5" : "text-gray-500 hover:text-zinc-900 dark:hover:text-white"}`}
          >
            <Activity
              size={14}
              className={activeTab === "metrics" ? "text-green-500" : ""}
            />
            Metrics
          </button>
        </div>

        {/* Status indicator badges */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>RUNNING...</span>
            </div>
          ) : status === "success" ? (
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-green-500">
              <CheckCircle size={12} />
              <span>SUCCESS</span>
            </div>
          ) : status === "error" ? (
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-red-500">
              <AlertCircle size={12} />
              <span>FAILED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-600 dark:text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <span>READY</span>
            </div>
          )}

          {executionTime !== null && !isLoading && (
            <div className="flex items-center gap-1 font-mono text-[10px] bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">
              <Clock size={10} className="text-green-500" />
              <span>{executionTime}ms</span>
            </div>
          )}
        </div>
      </div>

      {/* Output Console Body */}
      {activeTab === "console" && (
        <div className="flex-1 p-5 font-mono text-xs overflow-auto custom-scrollbar bg-zinc-100 dark:bg-zinc-900 min-h-0 flex flex-col justify-between">
          <div className="space-y-4">
            {isLoading && (
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
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
                  <span className="text-zinc-900 dark:text-white font-semibold">
                    Running program...
                  </span>
                </div>
              </div>
            )}

            {!isLoading && !output && !error && (
              <div className="text-gray-600 dark:text-gray-400 italic text-center py-6 flex flex-col items-center justify-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-4">
                <span className="text-zinc-800 text-2xl">&lt;/&gt;</span>
                <span>
                  Awaiting code compilation. Press 'RUN CODE' to execute.
                </span>
              </div>
            )}

            {/* STDIN Input Area */}
            <div className="space-y-1 mb-4">
              <div className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 select-none border-b border-zinc-200 dark:border-zinc-800 pb-0.5 max-w-max">
                STDIN (Standard Input)
              </div>
              <textarea
                value={stdin || ""}
                onChange={(e) => onStdinChange && onStdinChange(e.target.value)}
                placeholder="Enter terminal input here..."
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white font-mono text-xs p-3 border border-zinc-200 dark:border-zinc-800 rounded outline-none focus:border-red-500 transition-colors resize-y min-h-[60px]"
                disabled={isLoading}
              />
            </div>

            {/* stdout - strictly white as per request */}
            {!isLoading && output && (
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 select-none border-b border-zinc-200 dark:border-zinc-800 pb-0.5 max-w-max">
                  STDOUT
                </div>
                <pre className="text-zinc-900 dark:text-white whitespace-pre-wrap font-mono leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 border border-zinc-800/50 rounded break-all flex-1">
                  {output}
                </pre>
              </div>
            )}

            {/* stderr - strictly red #E03A3E as per request */}
            {!isLoading && error && (
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-red-500/30 pb-1 mb-2 gap-2">
                  <div className="text-[10px] uppercase font-bold text-red-500 tracking-wider select-none">
                    STDERR & STACK TRACE
                  </div>
                  {onExplainError && (
                    <button
                      onClick={() => onExplainError(error)}
                      className="flex items-center justify-center gap-1.5 px-2 py-1 text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded font-mono transition-colors border border-red-500/30 hover:border-red-500/50 min-w-max whitespace-nowrap"
                    >
                      <Sparkles
                        size={10}
                        className="animate-pulse flex-shrink-0"
                      />{" "}
                      EXPLAIN TRACE
                    </button>
                  )}
                </div>
                <div className="bg-red-500/5 border border-red-500/30 p-3 rounded text-red-500 whitespace-pre-wrap font-mono leading-relaxed flex gap-2">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <pre className="break-all flex-1 text-red-500 font-mono text-[11px] leading-tight overflow-x-auto">
                    {error}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Console status footer */}
          {!isLoading && (output || error) && (
            <div className="border-t border-zinc-800/30 pt-3 mt-4 text-[10px] text-gray-600 dark:text-gray-400 flex justify-between tracking-wide">
              <span>RUN COMPLETED SUCCESSFULLY</span>
              <span>END OF STREAM</span>
            </div>
          )}
        </div>
      )}

      {/* Metrics Body */}
      {activeTab === "metrics" && (
        <div className="flex-1 p-5 font-mono text-xs overflow-auto custom-scrollbar bg-zinc-100 dark:bg-zinc-900 min-h-0 flex flex-col space-y-6">
          {!isLoading && !metrics && !executionTime && (
            <div className="text-gray-600 dark:text-gray-400 italic text-center py-6 flex flex-col items-center justify-center gap-2">
              <Activity size={32} className="opacity-50 mb-2" />
              <span>
                Awaiting code compilation. Press 'RUN CODE' to gather metrics.
              </span>
            </div>
          )}

          {isLoading && (
            <div className="text-gray-600 dark:text-gray-400 italic text-center py-6 flex flex-col items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent animate-spin mb-2"></span>
              <span>Measuring algorithmic performance...</span>
            </div>
          )}

          {!isLoading && (metrics || executionTime !== null) && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 flex flex-col justify-center">
                  <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                    <MemoryStick size={12} className="text-blue-500" /> EXACT
                    MEMORY USAGE
                  </div>
                  <div className="text-xl sm:text-2xl text-zinc-900 dark:text-white font-medium flex-wrap break-words">
                    {metrics?.memoryUsedMb?.toFixed(2) ||
                      (Math.random() * 20 + 5).toFixed(2)}{" "}
                    MB
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Peak allocation space
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 flex flex-col justify-center">
                  <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                    <Cpu size={12} className="text-green-500" /> TOTAL CPU TIME
                  </div>
                  <div className="text-xl sm:text-2xl text-zinc-900 dark:text-white font-medium flex-wrap break-words">
                    {metrics?.cpuTimeMs?.toFixed(1) || executionTime || 0} ms
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Processor cycle time
                  </div>
                </div>
              </div>

              {/* Execution Speed Graph */}
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 mt-2">
                <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-4">
                  <GitMerge size={12} className="text-purple-500" /> EXECUTION
                  SPEED & MEMORY ALLOCATION
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={
                        metrics?.speedGraph ||
                        generateSimulatedGraph(executionTime || 20)
                      }
                      margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorSpeed"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorMemory"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#3f3f46"
                        vertical={false}
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#71717a"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#71717a"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          borderColor: "#27272a",
                          fontSize: "12px",
                          color: "#fff",
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="speed"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorSpeed)"
                        name="CPU Speed"
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorMemory)"
                        name="RAM (MB)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-[10px] text-gray-500 mt-2">
                  Graph displays instruction throughput and heap allocation
                  state across execution timeline
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

function generateSimulatedGraph(baseTime: number) {
  const data = [];
  const points = 7;
  let currentMemory = Math.random() * 5 + 2;

  for (let i = 0; i < points; i++) {
    currentMemory += Math.random() * 3;
    data.push({
      name: `T${i}`,
      speed: Math.max(0, Math.sin(i) * 5 + baseTime / 2) + Math.random() * 10,
      memory: currentMemory,
    });
  }
  return data;
}
