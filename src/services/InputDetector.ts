import { InputFieldDef } from '../types/InputField';
import { parseCpp } from '../parsers/cpp';
import { parseC } from '../parsers/c';
import { parseJava } from '../parsers/java';
import { parsePython } from '../parsers/python';
import { parseJs } from '../parsers/js';
import { parseGo } from '../parsers/go';
import { parseRust } from '../parsers/rust';

export class InputDetector {
  static detect(code: string, language: string): InputFieldDef[] {
    try {
      switch (language) {
        case 'cpp':
          return parseCpp(code);
        case 'c':
          return parseC(code);
        case 'java':
          return parseJava(code);
        case 'python':
          return parsePython(code);
        case 'javascript':
        case 'typescript':
          return parseJs(code);
        case 'go':
          return parseGo(code);
        case 'rust':
          return parseRust(code);
        case 'csharp':
          // C# Parser fallback: Console.ReadLine()
          return this.parseCsharp(code);
        default:
          return [];
      }
    } catch (e) {
      console.error("Error parsing inputs for", language, e);
      return [];
    }
  }

  private static parseCsharp(code: string): InputFieldDef[] {
    const inputs: InputFieldDef[] = [];
    const cleanCode = code
      .replace(/\/\*[\s\S]*?\*\//g, match => ' '.repeat(match.length))
      .replace(/\/\/.*/g, match => ' '.repeat(match.length));
    
    const readLineRegex = /([a-zA-Z0-9_]+)\s*=\s*Console\.ReadLine\(\)/g;
    let match;
    let order = 0;
    while ((match = readLineRegex.exec(cleanCode)) !== null) {
      const varName = match[1];
      let label = varName.replace(/([A-Z])/g, ' $1').trim();
      label = label.charAt(0).toUpperCase() + label.slice(1);
      
      inputs.push({
        id: `${varName}-${order}`,
        variable: varName,
        label,
        datatype: 'text',
        placeholder: `Enter ${label.toLowerCase()}`,
        required: true,
        order: order++,
      });
    }
    return inputs;
  }
}
