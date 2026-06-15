(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/pages/LandingPage.tsx
  var import_react_router_dom = __require("react-router-dom");
  var import_jsx_runtime = __require("react/jsx-runtime");
  var LandingPage = () => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "antialiased min-h-screen flex flex-col font-body-md text-text-body-md bg-background text-on-surface w-full overflow-x-hidden", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { className: "fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-md border-b border-white/10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center px-4 md:px-margin-desktop py-unit-md max-w-container-max mx-auto", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-headline-md text-[20px] font-bold text-on-surface", children: "Retro Machines" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "hidden md:flex items-center gap-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "text-on-surface-variant font-body-md text-[14px] hover:text-primary transition-colors duration-200", href: "#features", children: "Features" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "text-on-surface-variant font-body-md text-[14px] hover:text-primary transition-colors duration-200", href: "#languages", children: "Languages" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "text-on-surface-variant font-body-md text-[14px] hover:text-primary transition-colors duration-200", href: "#ai", children: "AI" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_router_dom.Link, { to: "/compiler", className: "btn-primary px-6 py-2 rounded-md font-label-md text-[12px] hidden md:block uppercase font-bold tracking-wider", children: "Launch Compiler" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_router_dom.Link, { to: "/compiler", className: "btn-primary px-4 py-2 rounded-md font-label-md text-[12px] md:hidden block uppercase font-bold tracking-wider", children: "Launch" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { className: "flex-grow pt-24 pb-16 w-full max-w-container-max mx-auto", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "px-4 xl:px-0 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col gap-6 md:gap-8 z-10 w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { className: "font-display-lg text-[36px] md:text-[48px] leading-[1.1] font-semibold text-white", children: [
              "Code Compiler. ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff8c82]", children: "Retro Style." }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
              "Instant Execution."
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-body-lg text-[16px] text-on-surface-variant max-w-xl", children: "Experience the raw speed of a modern compiler with the aesthetic purity of classic machines. Write, test, and deploy Python, JavaScript, Java, C++, and C# in milliseconds." }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-4 mt-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_router_dom.Link, { to: "/compiler", className: "btn-primary px-6 md:px-8 py-3 rounded-md font-body-md font-medium text-white flex items-center justify-center gap-2 flex-1 md:flex-initial text-center sm:text-left", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-[18px]", children: "terminal" }),
                "Launch Compiler"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: "#features", className: "btn-secondary px-6 md:px-8 py-3 rounded-md font-body-md font-medium text-white flex-1 md:flex-initial text-center items-center justify-center flex", children: "Learn More" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative w-full rounded-2xl mt-8 lg:mt-0 shadow-[0_0_80px_rgba(224,58,62,0.15)] group flex flex-col max-w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-1 bg-gradient-to-tr from-[#E03A3E] via-transparent to-[#61BB46] opacity-30 rounded-2xl blur-lg transition-all duration-1000 group-hover:opacity-50" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative bg-[#161618] border border-white/10 rounded-2xl overflow-hidden flex flex-col w-full shadow-2xl h-[300px] sm:h-[400px]", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-[#1C1C1E] flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-[#ff5f56]" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-[#ffbd2e]" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-[#27c93f]" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "font-mono text-[10px] sm:text-xs text-on-surface-variant flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-[14px]", children: "lock" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "secure-sandbox.ts" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-[#61BB46] font-mono tracking-widest uppercase", children: "Live" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#61BB46] animate-pulse" })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1 p-4 sm:p-6 font-mono text-[12px] sm:text-[14px] overflow-hidden relative leading-loose", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 bottom-0 w-8 sm:w-12 bg-[#1C1C1E]/50 border-r border-white/5 flex flex-col items-center py-4 sm:py-6 text-on-surface-variant/30 select-none", children: [...Array(10)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[28px]", children: i + 1 }, i)) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pl-6 sm:pl-10 text-gray-300", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "h-[28px]", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E] font-medium", children: "import" }),
                    " ",
                    "{",
                    " Engine ",
                    "}",
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E] font-medium", children: "from" }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#61BB46]", children: "'@retro/compiler'" }),
                    ";"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[28px] mt-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-on-surface-variant/50 italic", children: "// Boot sequence initialized..." }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "h-[28px]", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E] font-medium", children: "const" }),
                    " vm = ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E] font-medium", children: "new" }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-yellow-400", children: "Engine" }),
                    "(",
                    "{"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "h-[28px] pl-4", children: [
                    "language: ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#61BB46]", children: "'typescript'" }),
                    ","
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "h-[28px] pl-4", children: [
                    "memory: ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-purple-400", children: "1024" }),
                    ","
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "h-[28px] pl-4", children: [
                    "mode: ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#61BB46]", children: "'fast'" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "h-[28px]", children: [
                    "}",
                    ");"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "h-[28px] mt-4 flex items-center", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E] font-medium", children: "await" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-2", children: "vm." }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-blue-400", children: "execute" }),
                    "();",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-2 sm:w-2.5 h-4 sm:h-5 bg-white/70 ml-1 animate-[pulse_1s_step-start_infinite]" })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "px-4 xl:px-0 py-16 md:py-24", id: "languages", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "font-headline-lg text-[28px] md:text-[32px] font-semibold text-white mb-8 md:mb-12 text-center", children: "Supported Languages" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card glow-effect rounded-lg p-4 md:p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-3xl md:text-4xl text-on-surface-variant", children: "code" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-body-md font-medium text-sm md:text-base", children: "Python" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card glow-effect rounded-lg p-4 md:p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-3xl md:text-4xl text-on-surface-variant", children: "javascript" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-body-md font-medium text-sm md:text-base", children: "JavaScript" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card glow-effect rounded-lg p-4 md:p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-3xl md:text-4xl text-on-surface-variant", children: "coffee" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-body-md font-medium text-sm md:text-base", children: "Java" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card glow-effect rounded-lg p-4 md:p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-3xl md:text-4xl text-on-surface-variant", children: "developer_mode" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-body-md font-medium text-sm md:text-base", children: "C++" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card glow-effect rounded-lg p-4 md:p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-3xl md:text-4xl text-on-surface-variant", children: "terminal" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-body-md font-medium text-sm md:text-base", children: "C#" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "px-4 xl:px-0 py-16 md:py-24", id: "ai", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card rounded-xl p-6 sm:p-8 md:p-12 border border-white/10 relative overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center relative z-10 w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-full", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-white/5 mb-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-[16px] text-[#61BB46]", children: "smart_toy" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-label-md text-[12px] text-[#61BB46] uppercase font-bold tracking-wider", children: "Beta" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "font-headline-lg text-[28px] md:text-[32px] font-semibold text-white mb-4", children: "AI-Powered Companion" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-body-lg text-[16px] text-on-surface-variant mb-8", children: "Write code faster with an intelligent assistant that understands your context and anticipates your needs." }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "space-y-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-primary mt-0.5", children: "check_circle" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-body-md text-on-surface", children: "Explain complex code blocks instantly" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-primary mt-0.5", children: "check_circle" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-body-md text-on-surface", children: "Find and resolve elusive bugs" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-primary mt-0.5", children: "check_circle" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-body-md text-on-surface", children: "Optimize algorithms for peak performance" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-primary mt-0.5", children: "check_circle" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-body-md text-on-surface", children: "Generate structured comments automatically" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-surface-container-low rounded-lg p-6 border border-white/5 w-full min-h-[250px] md:min-h-[300px] flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-6xl text-primary/50 mb-4 animate-pulse", children: "psychology" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-code-md text-[14px] text-on-surface-variant", children: "// AI Analysis ready" })
            ] }) })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "px-4 xl:px-0 py-16 md:py-24", id: "features", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card rounded-xl p-6 md:p-8 flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-colors w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-1 md:mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-primary", children: "bolt" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-headline-md text-[18px] md:text-[20px] font-medium text-white", children: "Fast Execution" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-body-md text-on-surface-variant text-sm md:text-base", children: "Sub-millisecond compilation times across all supported languages, powered by optimized runtime environments." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card rounded-xl p-6 md:p-8 flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-colors w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-1 md:mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-primary", children: "visibility" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-headline-md text-[18px] md:text-[20px] font-medium text-white", children: "Real-time Output" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-body-md text-on-surface-variant text-sm md:text-base", children: "See the results of your code instantly as you type. No need to constantly hit refresh or recompile." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card rounded-xl p-6 md:p-8 flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-colors w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-1 md:mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-primary", children: "lock" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-headline-md text-[18px] md:text-[20px] font-medium text-white", children: "Secure Compilation" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-body-md text-on-surface-variant text-sm md:text-base", children: "Execute unknown code safely in isolated, ephemeral sandboxes protecting your host environment." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card rounded-xl p-6 md:p-8 flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-colors w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-1 md:mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-primary", children: "bookmark" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-headline-md text-[18px] md:text-[20px] font-medium text-white", children: "Save Snippets" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-body-md text-on-surface-variant text-sm md:text-base", children: "Store your most used algorithms and utility functions securely in the cloud for quick retrieval." })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "px-4 xl:px-0 py-16 md:py-24 w-full", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "glass-card rounded-xl border border-white/10 overflow-hidden flex flex-col w-full", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-surface-container flex items-center justify-between px-3 md:px-4 py-2 border-b border-white/5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-1.5 md:gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#E03A3E]/80" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#61BB46]/80" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-code-md text-[10px] md:text-[12px] text-on-surface-variant", children: "main.js - Retro Compiler" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_router_dom.Link, { to: "/compiler", className: "bg-[#E03A3E] text-white px-2 md:px-4 py-1 rounded text-[10px] md:text-[12px] font-medium flex items-center gap-1 hover:bg-[#E03A3E]/90 transition-colors", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-outlined text-[12px] md:text-[14px]", children: "play_arrow" }),
              " Run"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col lg:flex-row min-h-[300px] md:min-h-[400px]", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 bg-[#161618] p-3 md:p-4 font-code-md text-[12px] md:text-[14px] text-gray-300 border-b lg:border-b-0 lg:border-r border-white/5 overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E]", children: "const" }),
              " calculateFibonacci = (n) => ",
              "{\n",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E]", children: "if" }),
              " (n <= 1) ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E]", children: "return" }),
              " n;",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E]", children: "return" }),
              " calculateFibonacci(n - 1) + calculateFibonacci(n - 2);",
              "}",
              ";",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#61BB46]", children: "// Execute and measure performance" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E]", children: "const" }),
              " start = performance.now();",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E]", children: "const" }),
              " result = calculateFibonacci(30);",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#E03A3E]", children: "const" }),
              " end = performance.now(); console.log(",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-yellow-300", children: [
                "`Result: ",
                "$",
                "{result}",
                "`"
              ] }),
              "); console.log(",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-yellow-300", children: [
                "`Time: ",
                "$",
                "{(end - start).toFixed(2)}",
                "ms`"
              ] }),
              ");"
            ] }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-full lg:w-1/3 bg-surface-container-lowest p-3 md:p-4 font-code-md flex flex-col text-[12px] md:text-[14px]", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-on-surface-variant text-[10px] md:text-[12px] mb-2 uppercase tracking-wider", children: "Output" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-white", children: [
                "> Result: 832040",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
                "> Time: 12.45ms",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#61BB46] mt-2 block", children: "\u2713 Execution completed successfully." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-surface-container-high px-4 py-1.5 flex justify-between items-center text-[10px] md:text-[11px] font-code-md text-on-surface-variant", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "JavaScript (Node.js 20.x)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Ln 12, Col 1" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", { className: "w-full py-8 border-t border-white/10 bg-surface-container-lowest", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col lg:flex-row justify-between items-center px-4 md:px-margin-desktop gap-4 max-w-container-max mx-auto w-full text-center lg:text-left", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-headline-md text-[18px] md:text-[20px] font-bold text-on-surface", children: "Retro Machines" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap justify-center gap-4 md:gap-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "text-on-surface-variant font-body-md text-sm hover:text-on-surface transition-colors", href: "#", children: "Documentation" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "text-on-surface-variant font-body-md text-sm hover:text-on-surface transition-colors", href: "#", children: "Privacy Policy" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "text-on-surface-variant font-body-md text-sm hover:text-on-surface transition-colors", href: "#", children: "Terms of Service" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "text-on-surface-variant font-body-md text-sm hover:text-on-surface transition-colors", href: "#", children: "Github" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-on-surface-variant font-body-md text-xs md:text-sm", children: "\xA9 2026 Retro Machines Gala. All rights reserved." })
      ] }) })
    ] });
  };
})();
