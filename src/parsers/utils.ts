export function formatLabel(variable: string): string {
  // Convert camelCase, PascalCase, snake_case to Title Case
  let str = variable.replace(/_/g, ' ');
  str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  str = str.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function mapDatatype(type: string): 'text' | 'number' | 'checkbox' | 'single_char' {
  const t = type.toLowerCase();
  if (t.includes('int') || t.includes('float') || t.includes('double') || t.includes('number') || t.includes('long') || t.includes('short')) return 'number';
  if (t.includes('bool') || t.includes('boolean')) return 'checkbox';
  if (t.includes('char') && !t.includes('*') && !t.includes('[')) return 'single_char';
  return 'text';
}
