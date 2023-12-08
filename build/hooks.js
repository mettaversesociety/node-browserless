import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const beforeHookPath = path.join(__dirname, '..', 'external', 'before.js');
const afterHookPath = path.join(__dirname, '..', 'external', 'after.js');
const browserSetupPath = path.join(__dirname, '..', 'external', 'browser.js');
const pageSetupPath = path.join(__dirname, '..', 'external', 'page.js');
export const beforeRequest = fs.existsSync(beforeHookPath)
    ? (await import(beforeHookPath)).default
    : () => true;
export const afterRequest = fs.existsSync(afterHookPath)
    ? (await import(afterHookPath)).default
    : () => true;
export const browserHook = fs.existsSync(browserSetupPath)
    ? (await import(browserSetupPath)).default
    : () => Promise.resolve(true);
export const pageHook = fs.existsSync(pageSetupPath)
    ? (await import(pageSetupPath)).default
    : () => Promise.resolve(true);
