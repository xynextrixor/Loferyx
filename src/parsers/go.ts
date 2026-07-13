import { InputFieldDef } from '../types/InputField';
import { formatLabel, mapDatatype } from './utils';

export const parseGo = (code: string): InputFieldDef[] => {
  const inputs: InputFieldDef[] = [];
  
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, match => ' '.repeat(match.length))
    .replace(/\/\/.*/g, match => ' '.repeat(match.length))
    .replace(/"(?:\\.|[^"\\])*"/g, match => ' '.repeat(match.length));
    
  const varDeclarations: Record<string, string> = {};
  const declRegex = /var\s+([a-zA-Z0-9_,\s]+)\s+([a-zA-Z0-9_]+)/g;
  let declMatch;
  while ((declMatch = declRegex.exec(cleanCode)) !== null) {
    const vars = declMatch[1].split(',').map(v => v.trim());
    const type = declMatch[2];
    for (const v of vars) {
      varDeclarations[v] = type;
    }
  }

  const matches: { index: number; varName: string; type: string }[] = [];

  const scanRegex = /fmt\.Scan(?:f|ln)?\s*\(\s*([^)]+)\s*\)/g;
  let scanMatch;
  while ((scanMatch = scanRegex.exec(cleanCode)) !== null) {
    let currentIdx = scanMatch.index;
    const args = scanMatch[1].split(',').map(v => v.trim().replace(/^&/, ''));
    
    for (const v of args) {
      // In Scanf, the first arg is the format string, ignore it if it starts with quote.
      if (v.startsWith('"') || v.startsWith("'")) continue;
      
      matches.push({ index: currentIdx++, varName: v, type: varDeclarations[v] || 'string' });
    }
  }

  matches.sort((a, b) => a.index - b.index);

  matches.forEach((m, i) => {
    const label = formatLabel(m.varName);
    const dt = mapDatatype(m.type);
    inputs.push({
      id: `${m.varName}-${i}`,
      variable: m.varName,
      label,
      datatype: dt,
      placeholder: `Enter ${label.toLowerCase()}`,
      required: true,
      order: i,
    });
  });

  return inputs;
};
