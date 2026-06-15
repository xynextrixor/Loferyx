import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  code?: string;
  onChange: (value: string) => void;
  language: string;
  disabled?: boolean;
  fontSize?: number;
  onMount?: (editor: any, monaco: any) => void;
}

export const Editor: React.FC<EditorProps> = ({
  code,
  onChange,
  language,
  disabled = false,
  fontSize = 14,
  onMount,
}) => {
  const getMonacoLanguage = (lang: string) => {
    if (lang === 'cpp') return 'cpp';
    if (lang === 'csharp') return 'csharp';
    return lang;
  };

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('gala-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '71717A', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'E03A3E', fontStyle: 'bold' },
        { token: 'string', foreground: '61BB46' },
        { token: 'number', foreground: 'E03A3E' },
        { token: 'regexp', foreground: '61BB46' },
        { token: 'type', foreground: 'FFFFFF' },
        { token: 'class', foreground: 'FFFFFF' },
        { token: 'function', foreground: 'E03A3E' },
      ],
      colors: {
        'editor.background': '#18181B',
        'editor.foreground': '#FFFFFF',
        'editor.lineHighlightBackground': '#27272A33',
        'editorLineNumber.foreground': '#4b5563',
        'editorLineNumber.activeForeground': '#E03A3E',
        'editor.selectionBackground': '#E03A3E4D',
        'editor.inactiveSelectionBackground': '#27272A66',
      },
    });
  };

  return (
    <div className="w-full h-full border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900" id="monaco-editor-wrapper">
      <MonacoEditor
        height="100%"
        language={getMonacoLanguage(language)}
        theme="gala-theme"
        value={code}
        onChange={(value) => onChange(value || '')}
        beforeMount={handleEditorWillMount}
        onMount={onMount}
        options={{
          readOnly: disabled,
          minimap: { enabled: false },
          fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace',
          fontSize: fontSize,
          fontWeight: '500',
          lineHeight: 22,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          contextmenu: false,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
};
