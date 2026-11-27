import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

let apiPort = '3001';
for (const relativeFile of ['../../lab11/backend/api-port.txt', '../../Работа 11/backend/api-port.txt']) {
  try {
    const candidate = fs.readFileSync(path.resolve(process.cwd(), relativeFile), 'utf8').trim();
    if (candidate.length === 4 && candidate.slice(0, 2) === '30' && Number.isInteger(Number(candidate.slice(2)))) { apiPort = candidate; break; }
  } catch {}
}
const apiTarget = 'http://localhost:' + apiPort;

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true, proxy: { '/api': apiTarget } },
});