export interface InputFieldDef {
  id: string;
  variable: string;
  label: string;
  datatype: 'text' | 'number' | 'checkbox' | 'single_char';
  placeholder: string;
  required: boolean;
  defaultValue?: string | boolean | number;
  order: number;
}
