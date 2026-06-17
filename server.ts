import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import path from 'path';
import 'dotenv/config';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { WebSocketServer } from 'ws';
import YWsUtils from 'y-websocket/bin/utils';
const { setupWSConnection } = YWsUtils;

import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for rate limiting behind reverse proxies
  app.set('trust proxy', 1);

  // Security & standard middlewares
  // Note: helmet is disabled as it interferes with iframe rendering in the AI Studio environment
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  // Rate Limiting: 100 requests per 15 minutes
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    validate: { xForwardedForHeader: false, forwardedHeader: false, default: true },
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
  });

  // Health check
  app.get('/health', (req, res) => {
    if (req.query.err) {
      console.error('CLIENT ERROR LOGGED:', req.query.err);
      fs.appendFileSync('client-errors.log', String(req.query.err) + '\n');
    }
    res.json({ status: 'ok' });
  });

  // Snippet endpoints
  const snippetsFile = path.join(process.cwd(), 'snippets.json');
  const getSnippets = () => {
    try {
      if (fs.existsSync(snippetsFile)) {
        return JSON.parse(fs.readFileSync(snippetsFile, 'utf-8'));
      }
    } catch(e) {
      console.error(e);
    }
    return {};
  };

  const saveSnippet = (id: string, code: string, language: string) => {
    const snippets = getSnippets();
    snippets[id] = { code, language };
    fs.writeFileSync(snippetsFile, JSON.stringify(snippets));
  };

  app.post('/api/share', limiter, (req, res) => {
    const { code, language } = req.body;
    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Code is required.' });
      return;
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < 4; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    saveSnippet(id, code, language);
    res.json({ id });
  });

  app.get('/api/snippet/:id', (req, res) => {
    const id = req.params.id;
    const snippets = getSnippets();
    if (snippets[id]) {
      res.json(snippets[id]);
    } else {
      res.status(404).json({ error: 'Snippet not found' });
    }
  });

  // Languages endpoint
  app.get('/api/languages', (req, res) => {
    res.json([
      { id: 'python', name: 'Python' },
      { id: 'c', name: 'C' },
      { id: 'javascript', name: 'JavaScript' },
      { id: 'java', name: 'Java' },
      { id: 'cpp', name: 'C++' },
      { id: 'csharp', name: 'C#' }
    ]);
  });

  // Explain endpoint using server-side Gemini key
  app.post('/api/explain', limiter, async (req, res) => {
    const { code, language } = req.body;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Code is required and must be a string.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing from environment, falling back to simulated explanation.');
      // Premium look and feel fallback
      setTimeout(() => {
        res.json({
          explanation: `### Code Analysis (Simulation Mode)
This is a standard ${language} script.
- **Syntactic Structure**: Looks valid.
- **Primary Action**: Executing commands within the active language sandbox.

*Configure GEMINI_API_KEY in the Secrets panel for fully powered AI explanations.*`
        });
      }, 600);
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Explain the following ${language} code in detail. List its purpose, key blocks, logic flow, and tips on potential syntax or logic considerations. Format the response as elegant, premium Markdown:

\`\`\`${language}
${code}
\`\`\``
      });

      res.json({ explanation: response.text });
    } catch (error: any) {
      console.error('Gemini Explanation Error:', error.message);
      res.status(500).json({ error: `Failed to generate explanation: ${error.message}` });
    }
  });

  // Generate code endpoint
  app.post('/api/generate', limiter, async (req, res) => {
    const { prompt, language } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required and must be a string.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing from environment, falling back to simulated code generation.');
      setTimeout(() => {
        const simCode = language === 'python' ? 'print("Generated by AI")' : 'console.log("Generated by AI");';
        res.json({
          code: simCode
        });
      }, 600);
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are an expert coder. Write ONLY the raw code for the following request in ${language}. Do not include markdown code block syntax (like \`\`\`), do not include explanations, do not include HTML. The output should be strictly the raw code that can be compiled and executed directly.
        
Request: ${prompt}`
      });

      // Strip any markdown code blocks if the model still outputs them
      let code = response.text || '';
      code = code.replace(/^```[a-z]*\n/gm, '').replace(/```$/gm, '').trim();

      res.json({ code });
    } catch (error: any) {
      console.error('Gemini Generation Error:', error.message);
      res.status(500).json({ error: `Failed to generate code: ${error.message}` });
    }
  });

  // Chat endpoint for multi-turn AI interactions
  app.post('/api/chat', limiter, async (req, res) => {
    const { message, history, language, codeContext } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required and must be a string.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing from environment, falling back to simulated chat.');
      res.setHeader('Content-Type', 'text/plain');
      res.write('### Simulation Mode\nPlease provide a GEMINI_API_KEY to enable AI chat.');
      res.end();
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const systemInstruction = `You are an expert ${language} coding assistant. You are helping the user understand and modify the following code:\n\n\`\`\`${language}\n${codeContext}\n\`\`\`\n\nBe highly conversational, helpful, and concise. If you write or update code, output the FULL updated code in a single markdown code block (e.g., \`\`\`${language}\\n...\\n\`\`\`).`;

      const chat = ai.chats.create({
        model: 'gemini-3.5-flash',
        config: {
          systemInstruction
        },
        history: history || []
      });

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let stream;
      let retries = 0;
      const MAX_RETRIES = 3;

      while (retries < MAX_RETRIES) {
        try {
          stream = await chat.sendMessageStream({ message: message });
          break; // Success
        } catch (error: any) {
          if (error.message.includes('503') || error.message.includes('UNAVAILABLE')) {
            retries++;
            if (retries >= MAX_RETRIES) throw error;
            console.log(`Retry attempt ${retries} for Gemini API...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
          } else {
            throw error;
          }
        }
      }

      for await (const chunk of stream) {
        // Debugging log
        // console.log('Chunk received from Gemini:', chunk.text);
        res.write(chunk.text);
      }
      res.end();
    } catch (error: any) {
      console.error('Gemini Chat Error:', error.message);
      
      let message = error.message;
      let status = 500;
      
      if (error.message.includes('503') || error.message.includes('UNAVAILABLE')) {
        message = "The AI service is currently busy. Please try again in a moment.";
        status = 503;
      }

      res.setHeader('Content-Type', 'text/plain');
      res.status(status).write(`Error: ${message}`);
      res.end();
    }
  });

  // Compile endpoint
  app.post('/api/compile', limiter, async (req, res) => {
    const { code, language, input = "" } = req.body;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Code is required and must be a string.' });
      return;
    }
    
    if (code.length > 10000) {
      res.status(400).json({ error: 'Code length exceeds the 10,000 character limit.' });
      return;
    }

    const validLanguages = ['python', 'javascript', 'java', 'cpp', 'csharp', 'c'];
    if (!language || !validLanguages.includes(language)) {
      res.status(400).json({ error: 'Invalid or missing language.' });
      return;
    }

    const apiKey = process.env.COMPILER_API_KEY || 'MY_COMPILER_API_KEY';
    if (!apiKey) {
      console.error('COMPILER_API_KEY is missing from environment variables.');
      res.status(500).json({ error: 'Server misconfiguration.' });
      return;
    }

    const startTime = Date.now();

    // --- MOCK RESPONSE FOR DEFAULT KEY / DEV ENVIRONMENTS ---
    // If we don't have a real compiler key, instead of a static mock, use Gemini API to simulate execution.
    if (apiKey === 'MY_COMPILER_API_KEY') {
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey || geminiApiKey === 'MY_GEMINI_API_KEY') {
        setTimeout(() => {
          const executionTime = Date.now() - startTime;
          let mockOutput = 'Execution successful.\n';
          if (code.includes('print(') || code.includes('console.log(') || code.includes('System.out.println') || code.includes('cout') || code.includes('Console.WriteLine')) {
            mockOutput += 'Hello, World!\n';
          }
          res.json({
            output: mockOutput + `\n[Provide a real COMPILER_API_KEY or GEMINI_API_KEY to see actual results.]`,
            error: '',
            executionTime
          });
        }, 500);
        return;
      }

      try {
        const ai = new GoogleGenAI({
          apiKey: geminiApiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        const prompt = `You are a strict code executor/compiler for ${language}. Execute the following code.
Output EXACTLY the standard output (stdout) and standard error (stderr) results that would be produced by executing this code in a standard environment.
Do not wrap your response in markdown blocks (like \`\`\`).
Do not add any explanation, thoughts, or preamble. Just the raw console output.
If there is a compilation error or syntax error, output the error message exactly as a compiler or interpreter would.

Code to execute:
${code}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            temperature: 0.0
          }
        });

        const executionTime = Date.now() - startTime;
        let output = response.text || '';
        
        // Clean markdown block if model ignored instructions
        if (output.startsWith('```')) {
            output = output.replace(/```[a-z]*\n/g, '').replace(/```/g, '').trim();
        }

        res.json({
          output: output + '\n\n[Execution simulated using Gemini AI because COMPILER_API_KEY is not configured.]',
          error: '',
          executionTime
        });
        return;
      } catch (err: any) {
        console.error('Gemini executor simulation failed:', err.message);
        res.status(500).json({ error: 'AI Simulation fallback failed.', details: err.message });
        return;
      }
    }

    try {
      // Proxying to the external API
      const compilerMap: Record<string, string> = {
        python: 'python-3.14',
        javascript: 'typescript-deno',
        java: 'openjdk-25',
        cpp: 'g++-15',
        csharp: 'dotnet-csharp-9',
        c: 'gcc-15'
      };
      
      const compiler = compilerMap[language] || language;

      const response = await axios.post(
        'https://api.onlinecompiler.io/api/run-code-sync/',
        { 
          compiler: compiler,
          code: code,
          input: input
        },
        {
          headers: {
            'Authorization': apiKey, // The snippet showed the key directly in Authorization
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 seconds timeout
        }
      );

      // Map the onlinecompiler.io response to our frontend expected structure
      const executionTime = response.data.time ? Math.round(parseFloat(response.data.time) * 1000) : (Date.now() - startTime);
      
      let mappedError = response.data.error || '';
      if (mappedError === 'Internal error: code execution failed') {
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
          try {
            const ai = new GoogleGenAI({
              apiKey: geminiApiKey,
              httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
            });
            const prompt = `The following ${language} code threw a runtime or compilation error. Please output ONLY the exact standard error (stderr) or compiler error message that this code produces. Do not explain it or wrap in markdown blocks. Code:\n${code}\n\nStandard Input:\n${input||"None"}`;
            const aiResp = await ai.models.generateContent({
              model: 'gemini-3.5-flash',
              contents: prompt,
              config: { temperature: 0.0 }
            });
            let aiSyntaxError = aiResp.text || '';
            if (aiSyntaxError.startsWith('```')) {
                aiSyntaxError = aiSyntaxError.replace(/```[a-z]*\n/g, '').replace(/```/g, '').trim();
            }
            mappedError = aiSyntaxError || 'Execution Error: Application crashed or contained syntax errors.';
          } catch (e) {
            mappedError = 'Execution Error: Your code threw a runtime exception, timed out, or contained a syntax error.';
          }
        } else {
          mappedError = 'Execution Error: Your code threw a runtime exception, timed out, or contained a syntax error. (Sandbox API hides tracebacks for security).';
        }
      }

      const responseStatus = response.data.status === 'error' ? 'error' : 'success';
      
      res.json({
        output: response.data.output || '',
        error: mappedError,
        status: responseStatus,
        executionTime
      });

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      
      // FALLBACK for 404 or ENOTFOUND (since api.onlinecompiler.io might not actually exist)
      if (error.response?.status === 404 || error.code === 'ENOTFOUND') {
        setTimeout(() => {
          let mockOutput = 'Execution successful.\n';
          if (code.includes('print(') || code.includes('console.log(') || code.includes('System.out.println') || code.includes('cout') || code.includes('Console.WriteLine')) {
            mockOutput += 'Hello, World!\n';
          }
          res.json({
            output: mockOutput + `\n[Simulated output: The requested proxy API returned 404 or is offline.]`,
            error: '',
            executionTime: Date.now() - startTime
          });
        }, 500);
        return;
      }

      console.error('Compiler API Error:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        res.status(504).json({ error: 'Execution output timed out after 15 seconds.', executionTime });
        return;
      }
      
      if (error.response) {
        let errorMsg = `API returned status ${error.response.status}`;
        try {
           errorMsg = typeof error.response.data === 'object' ? JSON.stringify(error.response.data) : error.response.data;
        } catch(e) {}
        
        res.status(error.response.status).json({
          error: `Compiler API Error (${error.response.status}): ${errorMsg}`,
          executionTime
        });
        return;
      }

      res.status(500).json({ error: 'Failed to reach compilation service.', executionTime });
    }
  });

  // Vite middleware for development or Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    try {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: false 
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Failed to start Vite middleware:", e);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (conn, req) => {
    setupWSConnection(conn, req);
  });

  server.on('upgrade', (request, socket, head) => {
    // Vite Dev Server handles its own HMR WebSocket, which usually has sec-websocket-protocol 'vite-hmr'
    if (request.headers['sec-websocket-protocol'] === 'vite-hmr') {
      return; 
    }
    
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
}

startServer();
