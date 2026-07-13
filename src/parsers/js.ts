import { InputFieldDef } from '../types/InputField';
import { formatLabel, mapDatatype } from './utils';

export const parseJs = (code: string): InputFieldDef[] => {
  const inputs: InputFieldDef[] = [];
  
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, match => ' '.repeat(match.length))
    .replace(/\/\/.*/g, match => ' '.repeat(match.length));
    
  const matches: { index: number; varName: string; prompt: string }[] = [];

  const promptRegex = /(?:(?:const|let|var)\s+)?([a-zA-Z0-9_]+)\s*=\s*(?:window\.)?prompt\s*\(\s*(?:['"]([^'"]*)['"])?\s*\)/g;
  let match;
  while ((match = promptRegex.exec(cleanCode)) !== null) {
    const varName = match[1];
    const promptStr = match[2];
    
    matches.push({ index: match.index, varName, prompt: promptStr || '' });
  }

  matches.sort((a, b) => a.index - b.index);

  matches.forEach((m, i) => {
    let label = m.prompt ? m.prompt.trim() : formatLabel(m.varName);
    if (label.toLowerCase().startsWith('enter ')) label = label.substring(6).trim();
    if (label.endsWith(':')) label = label.substring(0, label.length - 1).trim();
    if (label.length > 0) label = label.charAt(0).toUpperCase() + label.slice(1);
    else label = formatLabel(m.varName);

    inputs.push({
      id: `${m.varName}-${i}`,
      variable: m.varName,
      label,
      datatype: 'text',
      placeholder: `Enter ${label.toLowerCase()}`,
      required: true,
      order: i,
    });
  });

  return inputs;
};
