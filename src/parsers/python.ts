import { InputFieldDef } from '../types/InputField';
import { formatLabel, mapDatatype } from './utils';

export const parsePython = (code: string): InputFieldDef[] => {
  const inputs: InputFieldDef[] = [];
  
  const cleanCode = code
    .replace(/#.*/g, match => ' '.repeat(match.length))
    // We can't simply strip all strings because python's input("prompt") uses strings
    // We'll parse the prompt from the match.

  const matches: { index: number; varName: string; type: string; prompt: string }[] = [];

  // a = input()
  // name = input("Enter name")
  // age = int(input())
  // salary = float(input("Salary"))
  
  const inputRegex = /([a-zA-Z0-9_]+)\s*=\s*(?:(int|float|bool)\s*\()?\s*input\s*\(\s*(?:['"]([^'"]*)['"])?\s*\)\s*(?:\))?/g;
  let match;
  while ((match = inputRegex.exec(cleanCode)) !== null) {
    const varName = match[1];
    const castType = match[2];
    const promptStr = match[3];
    
    matches.push({
      index: match.index,
      varName,
      type: castType || 'string',
      prompt: promptStr || '',
    });
  }

  matches.sort((a, b) => a.index - b.index);

  matches.forEach((m, i) => {
    let label = m.prompt ? m.prompt.trim() : formatLabel(m.varName);
    // if label is like "Enter name:", strip "Enter" and ":"
    if (label.toLowerCase().startsWith('enter ')) {
      label = label.substring(6).trim();
    }
    if (label.endsWith(':')) {
      label = label.substring(0, label.length - 1).trim();
    }
    // Capitalize
    if (label.length > 0) {
      label = label.charAt(0).toUpperCase() + label.slice(1);
    } else {
      label = formatLabel(m.varName);
    }
    
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
