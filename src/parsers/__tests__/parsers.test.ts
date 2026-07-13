import { describe, it, expect } from 'vitest';
import { parseCpp } from '../cpp';
import { parsePython } from '../python';
import { parseJava } from '../java';
import { parseC } from '../c';
import { InputDetector } from '../../services/InputDetector';

describe('Language Parsers', () => {
  it('should parse C++ cin', () => {
    const code = `
      int age;
      string name;
      cin >> age >> name;
      getline(cin, address);
    `;
    const inputs = parseCpp(code);
    expect(inputs).toHaveLength(3);
    expect(inputs[0].variable).toBe('age');
    expect(inputs[0].datatype).toBe('number');
    expect(inputs[1].variable).toBe('name');
    expect(inputs[1].datatype).toBe('text'); // since 'string' -> 'text'
    expect(inputs[2].variable).toBe('address');
  });

  it('should parse Python input', () => {
    const code = `
      a = input()
      name = input("Enter name")
      age = int(input())
      salary = float(input("Salary"))
    `;
    const inputs = parsePython(code);
    expect(inputs).toHaveLength(4);
    expect(inputs[0].variable).toBe('a');
    expect(inputs[1].label).toBe('Name');
    expect(inputs[2].datatype).toBe('number');
    expect(inputs[3].label).toBe('Salary');
  });

  it('should parse Java Scanner', () => {
    const code = `
      Scanner sc = new Scanner(System.in);
      int age = sc.nextInt();
      String name = sc.nextLine();
      double price = sc.nextDouble();
      boolean flag = sc.nextBoolean();
      char c = sc.next().charAt(0);
    `;
    const inputs = parseJava(code);
    expect(inputs).toHaveLength(5);
    expect(inputs[0].datatype).toBe('number');
    expect(inputs[1].datatype).toBe('text');
    expect(inputs[3].datatype).toBe('checkbox');
    expect(inputs[4].datatype).toBe('single_char');
  });

  it('should parse C scanf', () => {
    const code = `
      int age;
      float salary;
      char name[50];
      scanf("%d", &age);
      scanf("%f", &salary);
      scanf("%s", name);
      scanf("%d%d", &a, &b);
    `;
    const inputs = parseC(code);
    expect(inputs).toHaveLength(5);
    expect(inputs[0].datatype).toBe('number');
    expect(inputs[2].datatype).toBe('text');
    expect(inputs[3].variable).toBe('a');
  });
  
  it('should ignore commented code', () => {
    const code = `
      // cin >> a;
      /*
        cin >> b;
      */
      cin >> c;
    `;
    const inputs = parseCpp(code);
    expect(inputs).toHaveLength(1);
    expect(inputs[0].variable).toBe('c');
  });
});
