(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/pages/CompilerPage.tsx
  var import_react = __require("react");
  var import_react_router_dom = __require("react-router-dom");
  var import_axios = __toESM(__require("axios"), 1);
  var import_lucide_react = __require("lucide-react");
  var import_react2 = __require("motion/react");
  var import_Editor = __require("../components/Editor");
  var import_LanguageSelector = __require("../components/LanguageSelector");
  var import_OutputPanel = __require("../components/OutputPanel");
  var import_jsx_runtime = __require("react/jsx-runtime");
  var DEFAULT_CODE = {
    python: 'print("Hello, World!")\n# Write your Python 3 code here',
    javascript: 'console.log("Hello, World!");\n// Write your JavaScript/TypeScipt here',
    java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
    cpp: '#include <iostream>\n\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}',
    csharp: 'using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, World!");\n  }\n}'
  };
  var CompilerPage = () => {
    const [languages, setLanguages] = (0, import_react.useState)([
      { id: "python", name: "Python" },
      { id: "javascript", name: "JavaScript" },
      { id: "java", name: "Java" },
      { id: "cpp", name: "C++" },
      { id: "csharp", name: "C#" }
    ]);
    const [language, setLanguage] = (0, import_react.useState)("javascript");
    const [code, setCode] = (0, import_react.useState)(DEFAULT_CODE["javascript"]);
    const [output, setOutput] = (0, import_react.useState)("");
    const [errorObj, setErrorObj] = (0, import_react.useState)("");
    const [executionTime, setExecutionTime] = (0, import_react.useState)(null);
    const [isLoading, setIsLoading] = (0, import_react.useState)(false);
    const [chatHistory, setChatHistory] = (0, import_react.useState)([]);
    const [chatInput, setChatInput] = (0, import_react.useState)("");
    const [isChatting, setIsChatting] = (0, import_react.useState)(false);
    const [showChat, setShowChat] = (0, import_react.useState)(false);
    const [aiPrompt, setAiPrompt] = (0, import_react.useState)("");
    const [isGeneratingCode, setIsGeneratingCode] = (0, import_react.useState)(false);
    const chatScrollRef = (0, import_react.useRef)(null);
    const [status, setStatus] = (0, import_react.useState)("idle");
    (0, import_react.useEffect)(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, [chatHistory, isChatting]);
    (0, import_react.useEffect)(() => {
      const cached = localStorage.getItem(`compiler_snippet_${language}`);
      if (cached) {
        setCode(cached);
      } else {
        setCode(DEFAULT_CODE[language] || "");
      }
    }, [language]);
    const handleLanguageChange = (newLang) => {
      setLanguage(newLang);
      const cached = localStorage.getItem(`compiler_snippet_${newLang}`);
      if (cached) {
        setCode(cached);
      } else {
        setCode(DEFAULT_CODE[newLang] || "");
      }
    };
    const handleRunCode = async () => {
      if (isLoading) return;
      setIsLoading(true);
      setStatus("loading");
      setOutput("");
      setErrorObj("");
      setExecutionTime(null);
      try {
        const res = await import_axios.default.post("/api/compile", {
          code,
          language
        });
        setOutput(res.data.output || "");
        setErrorObj(res.data.error || "");
        if (res.data.status === "error") {
          setStatus("error");
        } else {
          setStatus("success");
        }
        if (res.data.executionTime !== void 0) {
          setExecutionTime(res.data.executionTime);
        }
      } catch (err) {
        setStatus("error");
        if (err.response?.data?.error) {
          setErrorObj(err.response.data.error);
        } else {
          setErrorObj(err.message || "An network connection runtime error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    const handleSave = () => {
      localStorage.setItem(`compiler_snippet_${language}`, code);
      alert(`SNAPSHOT SECURED: Saved your ${language.toUpperCase()} file locally.`);
    };
    const handleLoad = () => {
      const saved = localStorage.getItem(`compiler_snippet_${language}`);
      if (saved) {
        setCode(saved);
        alert(`SNAPSHOT LOADED: Loaded your previous ${language.toUpperCase()} session.`);
      } else {
        alert(`EMPTY BUFFER: No previous local snapshot found for ${language.toUpperCase()}.`);
      }
    };
    const handleDownload = () => {
      const extensions = {
        python: "py",
        javascript: "js",
        java: "java",
        cpp: "cpp",
        csharp: "cs"
      };
      const extension = extensions[language] || "txt";
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `main.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    const handleGenerateCode = async () => {
      if (!aiPrompt.trim() || isGeneratingCode) return;
      setIsGeneratingCode(true);
      try {
        const res = await import_axios.default.post("/api/generate", {
          prompt: aiPrompt,
          language
        });
        if (res.data.code) {
          setCode(res.data.code);
          setAiPrompt("");
        }
      } catch (err) {
        alert(`AI Generation Failed: ${err.message}`);
      } finally {
        setIsGeneratingCode(false);
      }
    };
    const handleChatSubmit = async (e, overrideMessage) => {
      e?.preventDefault();
      const userMessage = typeof overrideMessage === "string" ? overrideMessage : chatInput.trim();
      if (!userMessage || isChatting) return;
      setChatInput("");
      const newHistory = [
        ...chatHistory,
        { role: "user", text: userMessage }
      ];
      setChatHistory(newHistory);
      setIsChatting(true);
      try {
        const historyStr = chatHistory.map((m) => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));
        const res = await import_axios.default.post("/api/chat", {
          message: userMessage,
          history: historyStr,
          language,
          codeContext: code
        });
        let responseText = res.data.response || "No response.";
        const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/;
        const match = responseText.match(codeBlockRegex);
        if (match && match[1]) {
          setCode(match[1].trim());
          responseText = responseText.replace(codeBlockRegex, "\n\n**[Code updated in the editor panel]**\n\n").trim();
        }
        setChatHistory([
          ...newHistory,
          { role: "model", text: responseText }
        ]);
      } catch (err) {
        setChatHistory([
          ...newHistory,
          { role: "model", text: `Error: ${err.message}` }
        ]);
      } finally {
        setIsChatting(false);
      }
    };
    const handleExplainCode = () => {
      setShowChat(true);
      if (!isChatting && chatHistory.length === 0) {
        handleChatSubmit(void 0, "Please explain this code to me.");
      }
    };
    const renderFormattedExplanation = (md) => {
      if (!md) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[#A1A1AA] text-xs font-mono animate-pulse", children: "Consulting retro brain circuits..." });
      return md.split("\n").map((line, index) => {
        if (line.startsWith("### ")) {
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "text-[#E03A3E] font-mono text-xs font-bold tracking-widest uppercase mt-6 mb-2 border-l-2 border-[#E03A3E] pl-2", children: line.replace("### ", "") }, index);
        }
        if (line.startsWith("## ")) {
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-white font-sans text-sm font-bold tracking-wide mt-5 mb-2.5", children: line.replace("## ", "") }, index);
        }
        if (line.startsWith("# ")) {
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-[#61BB46] font-sans text-base font-extrabold tracking-tight mt-6 mb-3 border-b border-[#27272A] pb-1", children: line.replace("# ", "") }, index);
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          const itemContent = line.substring(2);
          const boldParts2 = itemContent.split("**");
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: "text-[#A1A1AA] text-xs font-sans list-disc list-inside ml-2 my-1.5 leading-relaxed", children: boldParts2.map((part, pIdx) => pIdx % 2 === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { className: "text-white font-semibold", children: part }, pIdx) : part) }, index);
        }
        if (line.startsWith("```")) {
          return null;
        }
        const boldParts = line.split("**");
        if (boldParts.length > 1) {
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[#A1A1AA] text-xs font-sans leading-relaxed my-2", children: boldParts.map((part, pIdx) => pIdx % 2 === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { className: "text-white font-semibold", children: part }, pIdx) : part) }, index);
        }
        return line.trim() === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2" }, index) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[#A1A1AA] text-xs font-sans leading-relaxed my-1.5", children: line }, index);
      });
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "min-h-screen bg-[#161618] text-white flex flex-col justify-between overflow-hidden relative font-sans select-none", id: "compiler-root", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 bg-gradient-to-r from-[#E03A3E] via-[#27272A] to-[#61BB46]" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "min-h-[4rem] border-b border-[#27272A] flex flex-wrap items-center justify-between px-4 lg:px-6 py-3 bg-[#18181B] shrink-0 z-20 gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_router_dom.Link, { to: "/", className: "text-[#A1A1AA] hover:text-white transition-colors p-1 bg-[#161618] rounded border border-[#27272A]", id: "nav-back-button", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowLeft, { size: 16 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-6 rounded bg-[#E03A3E] flex items-center justify-center font-mono font-bold text-black text-[10px]", children: "G" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-mono text-xs font-bold uppercase tracking-widest text-white hidden sm:inline", children: "RETRO GALA LABS" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center gap-3 ml-auto sm:ml-0", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_LanguageSelector.LanguageSelector,
              {
                languages,
                selectedLanguage: language,
                onChange: handleLanguageChange,
                disabled: isLoading
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "hidden md:flex items-center gap-1.5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  onClick: handleSave,
                  title: "Save current code snippet standard",
                  className: "px-3 py-2 bg-[#18181B] border border-[#27272A] hover:border-[#E03A3E] hover:text-[#E03A3E] rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer",
                  id: "compiler-save-btn",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Save, { size: 12 }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SAVE" })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  onClick: handleLoad,
                  title: "Load previous code snippet cache",
                  className: "px-3 py-2 bg-[#18181B] border border-[#27272A] hover:border-[#61BB46] hover:text-[#61BB46] rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer",
                  id: "compiler-load-btn",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FolderOpen, { size: 12 }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LOAD" })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  onClick: handleDownload,
                  title: "Download code as file",
                  className: "px-3 py-2 bg-[#18181B] border border-[#27272A] hover:border-blue-500 hover:text-blue-500 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer",
                  id: "compiler-download-btn",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Download, { size: 12 }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DL" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: handleExplainCode,
                disabled: isChatting || isLoading,
                className: "hidden sm:flex bg-[#18181B] border border-[#27272A] hover:border-[#E03A3E] text-[#A1A1AA] hover:text-white px-3.5 py-2 rounded-lg font-mono text-[10px] items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50",
                id: "compiler-explain-btn",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageSquare, { size: 12, className: isChatting ? "text-[#E03A3E] animate-bounce" : "text-[#E03A3E]" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI CHAT" })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: handleRunCode,
                disabled: isLoading,
                className: "bg-[#61BB46] hover:bg-[#529d3b] text-black hover:text-white px-5 py-2 rounded-lg font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xl hover:shadow-[#61BB46]/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:translate-y-0.5",
                id: "compiler-run-btn",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Play, { size: 12, fill: "currentColor", className: isLoading ? "animate-pulse" : "" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isLoading ? "EXECUTING..." : "RUN CODE" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { className: "flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative w-full bg-[#161618] p-4 lg:p-6 gap-4 lg:gap-6", id: "compiler-main-canvas", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "flex flex-col justify-stretch h-[300px] lg:h-[400px] lg:flex-1 shrink-0 min-h-0 w-full", id: "gala-editor-container", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 px-3 py-2 border border-[#27272A] rounded-lg bg-[#18181B] mb-2 shrink-0", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { size: 14, className: isGeneratingCode ? "text-[#9d4edd] animate-pulse" : "text-[#A1A1AA]" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                type: "text",
                placeholder: "Ask AI to write code for you...",
                className: "bg-transparent border-none outline-none flex-1 font-mono text-xs text-white placeholder-[#27272A] min-w-0",
                value: aiPrompt,
                onChange: (e) => setAiPrompt(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleGenerateCode();
                  }
                },
                disabled: isGeneratingCode || isLoading
              }
            ),
            aiPrompt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                onClick: () => setAiPrompt(""),
                className: "text-[#A1A1AA] hover:text-white p-1",
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 12 })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                onClick: handleGenerateCode,
                disabled: isGeneratingCode || isLoading || !aiPrompt.trim(),
                className: "text-[10px] font-mono uppercase bg-[#27272A] hover:bg-[#9d4edd] text-[#A1A1AA] hover:text-white px-2.5 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block",
                children: isGeneratingCode ? "GENERATING..." : "GENERATE"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between px-4 py-2 border-t border-x border-[#27272A] rounded-t-lg bg-[#18181B] text-[10px] font-mono shrink-0 select-none text-[#A1A1AA]", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#61BB46]" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-white uppercase tracking-wider", children: [
                "main.",
                language === "cpp" ? "cpp" : language === "javascript" ? "ts" : language === "python" ? "py" : language === "java" ? "java" : "cs"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BUFF BOUNDS" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UTF-8" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 min-h-0 relative", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_Editor.Editor,
            {
              code,
              onChange: setCode,
              language,
              disabled: isLoading
            }
          ) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "w-full lg:w-[420px] xl:w-[480px] shrink-0 flex flex-col justify-stretch h-[300px] lg:h-auto min-h-[300px] lg:min-h-0", id: "gala-console-container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_OutputPanel.OutputPanel,
          {
            output,
            error: errorObj,
            executionTime,
            isLoading,
            status
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.AnimatePresence, { children: showChat && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_react2.motion.div,
          {
            initial: { x: "100%" },
            animate: { x: 0 },
            exit: { x: "100%" },
            transition: { type: "spring", damping: 26, stiffness: 220 },
            className: "absolute top-0 right-0 h-full w-full sm:w-[450px] bg-[#18181B] border-l border-[#27272A] flex flex-col shadow-2xl z-30 font-mono text-xs overflow-hidden",
            id: "ai-chat-drawer",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between border-b border-[#27272A] p-4 shrink-0 bg-[#161618]", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 text-[#E03A3E]", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageSquare, { size: 16 }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-xs uppercase tracking-widest text-white", children: "AI CHAT & COMPANION" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    onClick: () => setShowChat(false),
                    className: "p-1.5 hover:bg-[#27272A] text-[#A1A1AA] hover:text-white rounded transition-colors",
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 16 })
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref: chatScrollRef, className: "flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar", children: [
                chatHistory.length === 0 && !isChatting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-[#A1A1AA] mt-10", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { size: 24, className: "mx-auto mb-2 opacity-50" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Start chatting with AI about your code." })
                ] }) : chatHistory.map((msg, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `max-w-[85%] rounded-lg p-3 ${msg.role === "user" ? "bg-[#27272A] text-white self-end ml-auto" : "bg-[#161618] border border-[#27272A] text-[#A1A1AA] mr-auto"}`, children: msg.role === "model" ? renderFormattedExplanation(msg.text) : msg.text }, idx)),
                isChatting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-[#161618] border border-[#27272A] text-[#A1A1AA] rounded-lg p-3 mr-auto max-w-[85%] flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#E03A3E] animate-bounce" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#E03A3E] animate-bounce delay-75" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#E03A3E] animate-bounce delay-150" })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-[#27272A] p-4 shrink-0 bg-[#161618]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: (e) => handleChatSubmit(e), className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "input",
                  {
                    type: "text",
                    value: chatInput,
                    onChange: (e) => setChatInput(e.target.value),
                    placeholder: "Ask a question...",
                    disabled: isChatting,
                    className: "flex-1 bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-white placeholder-[#52525B] focus:outline-none focus:border-[#E03A3E] transition-colors"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "submit",
                    disabled: !chatInput.trim() || isChatting,
                    className: "p-2 bg-[#E03A3E] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c33235] transition-colors flex items-center justify-center shrink-0",
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 16 })
                  }
                )
              ] }) })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "sm:hidden flex items-center justify-between p-3 bg-[#18181B] border-t border-[#27272A] shrink-0 gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            onClick: handleExplainCode,
            disabled: isChatting || isLoading,
            className: "flex-1 bg-[#161618] border border-[#27272A] p-2 text-[10px] rounded-lg tracking-wider font-mono flex items-center justify-center gap-1",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageSquare, { size: 10, className: "text-[#E03A3E]" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI CHAT" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            onClick: handleSave,
            className: "bg-[#161618] border border-[#27272A] p-2 text-[10px] rounded-lg tracking-wider font-mono flex items-center justify-center gap-1",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Save, { size: 10 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SAVE" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            onClick: handleLoad,
            className: "bg-[#161618] border border-[#27272A] p-2 text-[10px] rounded-lg tracking-wider font-mono flex items-center justify-center gap-1",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FolderOpen, { size: 10 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LOAD" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            onClick: handleDownload,
            className: "bg-[#161618] border border-[#27272A] p-2 text-[10px] rounded-lg tracking-wider font-mono flex items-center justify-center gap-1",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Download, { size: 10 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DL" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { className: "h-8 border-t border-[#27272A] bg-[#18181B] flex items-center justify-between px-6 text-[10px] font-mono text-[#A1A1AA] shrink-0 select-none z-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${isLoading ? "bg-[#E03A3E] animate-ping" : "bg-[#61BB46]"}` }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RETRO_TERMINAL_ONLINE_2026" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden sm:inline border-l border-[#27272A] pl-3", children: "CALLBACK_SYNC='run-code-sync'" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden md:inline", children: "SYSTEM BOUND REGION // WEST_US_GALA" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "COMPACT_GALA_v4.1" })
        ] })
      ] })
    ] });
  };
})();
