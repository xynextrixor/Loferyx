import React, { useState } from 'react';
import { InputFieldDef } from '../types/InputField';
import { ChevronDown, ChevronUp, TerminalSquare } from 'lucide-react';

interface Props {
  inputs: InputFieldDef[];
  values: Record<string, string>;
  onChange: (id: string, value: string | boolean) => void;
  generatedStdin: string;
}

export const ProgramInputsPanel: React.FC<Props> = ({
  inputs,
  values,
  onChange,
  generatedStdin
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const hasValue = (field: InputFieldDef) =>
    field.datatype === 'checkbox' || Boolean(values[field.id]);

  if (inputs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <TerminalSquare size={16} className="text-[#61BB46]" />
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
          Program Inputs
        </h3>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {inputs.map((field) => (
          <div key={field.id} className="flex flex-col gap-1.5 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm transition-all focus-within:border-[#61BB46]/50 focus-within:ring-1 focus-within:ring-[#61BB46]/20">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
              {field.label}
              {field.required && <span className="text-red-500 text-[10px] uppercase font-bold tracking-widest">*</span>}
            </label>
            
            {field.datatype === 'checkbox' ? (
              <div className="flex items-center h-9">
                <input
                  type="checkbox"
                  checked={values[field.id] === 'true'}
                  onChange={(e) => onChange(field.id, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#61BB46] focus:ring-[#61BB46] bg-zinc-50 dark:bg-zinc-900"
                />
                <span className="ml-2 text-xs text-gray-500">True / False</span>
              </div>
            ) : (
              <input
                type={field.datatype === 'number' ? 'number' : 'text'}
                value={values[field.id] || ''}
                onChange={(e) => {
                  let val = e.target.value;
                  if (field.datatype === 'single_char' && val.length > 1) {
                    val = val.substring(0, 1);
                  }
                  onChange(field.id, val);
                }}
                placeholder={field.placeholder}
                maxLength={field.datatype === 'single_char' ? 1 : undefined}
                className="w-full h-9 px-3 text-sm rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-[#61BB46] transition-colors font-mono"
              />
            )}
            
            {field.required && !hasValue(field) && (
              <span className="text-[10px] text-red-500 font-medium">{field.label} is required</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <button 
          onClick={() => setShowPreview(!showPreview)}
          className="w-full flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-900 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <span>Preview Generated STDIN</span>
          {showPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showPreview && (
          <pre className="p-3 text-xs font-mono text-zinc-900 dark:text-white bg-zinc-50 dark:bg-black/50 border-t border-zinc-200 dark:border-zinc-800 min-h-[60px] whitespace-pre-wrap">
            {generatedStdin || <span className="text-gray-500 italic">No inputs yet...</span>}
          </pre>
        )}
      </div>
    </div>
  );
};
