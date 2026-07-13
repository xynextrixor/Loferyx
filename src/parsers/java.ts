import { InputFieldDef } from '../types/InputField';
import { formatLabel, mapDatatype } from './utils';

export const parseJava = (code: string): InputFieldDef[] => {
  const inputs: InputFieldDef[] = [];
  
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, match => ' '.repeat(match.length))
    .replace(/\/\/.*/g, match => ' '.repeat(match.length))
    .replace(/"(?:\\.|[^"\\])*"/g, match => ' '.repeat(match.length));
    
  const matches: { index: number; varName: string; type: string }[] = [];

  // Look for int age = sc.nextInt();
  // Also string name = sc.nextLine();
  // char c = sc.next().charAt(0);
  
  // It could be assigned: age = sc.nextInt();
  const nextRegex = /(?:([a-zA-Z0-9_]+)\s+)?([a-zA-Z0-9_]+)\s*=\s*[a-zA-Z0-9_]+\.(next|nextInt|nextLine|nextDouble|nextFloat|nextBoolean|nextLong|nextShort|nextByte)\s*\(\s*\)/g;
  let nextMatch;
  while ((nextMatch = nextRegex.exec(cleanCode)) !== null) {
    const typeDecl = nextMatch[1]; // may be undefined if just assignment
    const varName = nextMatch[2];
    const method = nextMatch[3];
    
    let typeStr = typeDecl;
    if (!typeStr) {
      if (method === 'nextBoolean') typeStr = 'boolean';
      else if (method === 'nextLine' || method === 'next') typeStr = 'String';
      else typeStr = 'int'; // default numeric fallback
    }
    
    matches.push({ index: nextMatch.index, varName, type: typeStr });
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
