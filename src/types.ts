export interface CompileResponse {
  output: string;
  error: string;
  executionTime?: number;
  status?: 'success' | 'error';
}

export interface Language {
  id: string;
  name: string;
}

export interface CodeSnippet {
  language: string;
  code: string;
}
