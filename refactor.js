import fs from 'fs';
import path from 'fs'; // wait, need to import path correctly

const mappings = {
  'bg-zinc-950': 'bg-zinc-50 dark:bg-zinc-950',
  'bg-zinc-900': 'bg-zinc-100 dark:bg-zinc-900',
  'bg-zinc-800': 'bg-zinc-200 dark:bg-zinc-800',
  'border-zinc-800': 'border-zinc-200 dark:border-zinc-800',
  'border-zinc-700': 'border-zinc-300 dark:border-zinc-700',
  'text-white': 'text-zinc-900 dark:text-white',
  'text-gray-400': 'text-gray-600 dark:text-gray-400',
  'text-gray-300': 'text-gray-700 dark:text-gray-300',
  'text-gray-200': 'text-gray-800 dark:text-gray-200',
  'bg-black': 'bg-white dark:bg-black',
  'bg-zinc-900/50': 'bg-zinc-100/50 dark:bg-zinc-900/50',
  'bg-zinc-800/50': 'bg-zinc-200/50 dark:bg-zinc-800/50'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // We need to match words.
  for (const [key, value] of Object.entries(mappings)) {
    // using regex with word boundary, but note that hyphens and slashes are not word characters for \b
    // A safe way is to split the content by ' ' or '"' or '`' or just use regex with lookaround
    // lookbehind for whitespace or quote, lookahead for whitespace or quote
    const regex = new RegExp(`(?<=[\\s"'\\\`])(${key})(?=[\\s"'\\\`])`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, value);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = dir + '/' + file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

walk(__dirname + '/src/pages');
walk(__dirname + '/src/components');
