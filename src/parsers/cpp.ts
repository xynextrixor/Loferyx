import { InputFieldDef } from '../types/InputField';
import { formatLabel, mapDatatype } from './utils';

export const parseCpp = (code: string): InputFieldDef[] => {
  const inputs: InputFieldDef[] = [];
  
  // Replace comments and strings with spaces to keep indices but avoid false matches
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, match => ' '.repeat(match.length))
    .replace(/\/\/.*/g, match => ' '.repeat(match.length))
    .replace(/"(?:\\.|[^"\\])*"/g, match => ' '.repeat(match.length));
  
  const varDeclarations: Record<string, string> = {};
  const declRegex = /(int|float|double|bool|string|char)\s+([a-zA-Z0-9_,\s]+);/g;
  let declMatch;
  while ((declMatch = declRegex.exec(cleanCode)) !== null) {
    const type = declMatch[1];
    const vars = declMatch[2].split(',').map(v => v.trim());
    for (const v of vars) {
      const varName = v.split(/[[=]/)[0].trim();
      varDeclarations[varName] = type;
    }
  }

  const matches: { index: number; varName: string; type: string }[] = [];

  const cinRegex = /cin\s*((?:>>\s*[a-zA-Z0-9_]+\s*)+);/g;
  let cinMatch;
  while ((cinMatch = cinRegex.exec(cleanCode)) !== null) {
    let currentIdx = cinMatch.index;
    const parts = cinMatch[1].split('>>').map(v => v.trim()).filter(v => v);
    for (const v of parts) {
      matches.push({ index: currentIdx++, varName: v, type: varDeclarations[v] || 'string' });
    }
  }

  const getlineRegex = /getline\s*\(\s*cin\s*,\s*([a-zA-Z0-9_]+)\s*\)/g;
  let getlineMatch;
  while ((getlineMatch = getlineRegex.exec(cleanCode)) !== null) {
    const v = getlineMatch[1].trim();
    matches.push({ index: getlineMatch.index, varName: v, type: 'string' });
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
