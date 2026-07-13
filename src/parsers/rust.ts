import { InputFieldDef } from '../types/InputField';

export const parseRust = (code: string): InputFieldDef[] => {
  const inputs: InputFieldDef[] = [];
  
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, match => ' '.repeat(match.length))
    .replace(/\/\/.*/g, match => ' '.repeat(match.length));
    
  const matches: { index: number; varName: string }[] = [];

  const readLineRegex = /io::stdin\(\)\s*\.read_line\(\s*&mut\s*([a-zA-Z0-9_]+)\s*\)/g;
  let match;
  while ((match = readLineRegex.exec(cleanCode)) !== null) {
    matches.push({ index: match.index, varName: match[1] });
  }

  matches.sort((a, b) => a.index - b.index);

  matches.forEach((m, i) => {
    // Rust usually reads into strings
    let label = m.varName.replace(/_/g, ' ');
    label = label.charAt(0).toUpperCase() + label.slice(1);
    
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
