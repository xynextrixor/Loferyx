import { InputFieldDef } from '../types/InputField';
import { formatLabel, mapDatatype } from './utils';

export const parseC = (code: string): InputFieldDef[] => {
  const inputs: InputFieldDef[] = [];
  
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, match => ' '.repeat(match.length))
    .replace(/\/\/.*/g, match => ' '.repeat(match.length));
    
  // var declarations
  const varDeclarations: Record<string, string> = {};
  const declRegex = /(int|float|double|char|long|short)\s+([a-zA-Z0-9_,\s*\[\]]+);/g;
  let declMatch;
  while ((declMatch = declRegex.exec(cleanCode)) !== null) {
    const type = declMatch[1];
    const vars = declMatch[2].split(',').map(v => v.trim());
    for (const v of vars) {
      const isArray = v.includes('[');
      const isPtr = v.includes('*');
      const varName = v.replace(/[*]/g, '').split(/[[=]/)[0].trim();
      varDeclarations[varName] = type + (isArray ? '[]' : '') + (isPtr ? '*' : '');
    }
  }

  const matches: { index: number; varName: string; type: string }[] = [];

  // scanf("%d%s", &a, b);
  // Using a simpler regex that matches the whole statement
  const scanfRegex = /scanf\s*\(\s*"([^"]+)"\s*,([^;]+)\)/g;
  let scanfMatch;
  while ((scanfMatch = scanfRegex.exec(cleanCode)) !== null) {
    const formatString = scanfMatch[1];
    const varArgs = scanfMatch[2].split(',').map(v => v.trim().replace(/^&/, ''));
    
    // Attempt to parse format string to assign types
    const formats = formatString.match(/%[a-zA-Z]/g) || [];
    
    for (let i = 0; i < varArgs.length; i++) {
      const v = varArgs[i];
      let typeStr = varDeclarations[v];
      if (!typeStr) {
        const fmt = formats[i] || '%s';
        if (fmt === '%d' || fmt === '%f' || fmt === '%lf') typeStr = 'number';
        else if (fmt === '%c') typeStr = 'char';
        else typeStr = 'string';
      }
      matches.push({ index: scanfMatch.index + i, varName: v, type: typeStr });
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
