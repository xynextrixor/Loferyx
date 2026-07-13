import { useState, useEffect, useCallback, useRef } from 'react';
import { InputDetector } from '../services/InputDetector';
import { InputFieldDef } from '../types/InputField';

export const useProgramInputs = (code: string, language: string) => {
  const [inputs, setInputs] = useState<InputFieldDef[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  
  // Ref to hold current values so debounce doesn't wipe them
  const valuesRef = useRef(values);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const detected = InputDetector.detect(code, language);
      
      // Merge detected inputs while preserving existing values
      const newValues: Record<string, string> = {};
      detected.forEach(field => {
        if (valuesRef.current[field.id] !== undefined) {
          newValues[field.id] = valuesRef.current[field.id];
        } else {
          newValues[field.id] = field.datatype === 'checkbox' ? 'false' : '';
        }
      });
      
      setInputs(detected);
      setValues(newValues);
    }, 300); // 300ms debounce
    
    return () => clearTimeout(handler);
  }, [code, language]);

  const handleValueChange = useCallback((id: string, value: string | boolean) => {
    setValues(prev => ({
      ...prev,
      [id]: String(value)
    }));
  }, []);

  const generateStdin = useCallback(() => {
    return inputs.map(input => {
      const val = values[input.id] || '';
      return val;
    }).join('\n');
  }, [inputs, values]);

  return {
    inputs,
    values,
    handleValueChange,
    generateStdin
  };
};
