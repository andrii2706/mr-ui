#!/usr/bin/env node
/**
 * axe-core (WCAG 2.0–2.2 A + AA) over every page of the built gallery, in the 4 module themes and with high contrast.
 * Serves dist/gallery/browser itself; exit 1 on any violation.   npm run a11y
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Потрібен Playwright: npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'dist/gallery/browser');
if (!existsSync(join(dir, 'index.html'))) {
  console.error('Немає dist/gallery — спершу npm run build:gallery');
  process.exit(2);
}
const axe = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};
const server = createServer((req, res) => {
  const path = join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = existsSync(path) && extname(path) ? path : join(dir, 'index.html');
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
}).listen(0);
const base = `http://localhost:${server.address().port}/`;

const routes = ['', 'theme', 'icons', 'loaders', 'long-action', 'a11y', 'apps'];
const themes = ['projects', 'kadry', 'oblik', 'portal'];
const browser = await chromium.launch();
let failed = 0;
try {
  for (const contrast of ['normal', 'high']) {
    const context = await browser.newContext();
    await context.addInitScript((c) => {
      try {
        localStorage.setItem('mr-a11y', JSON.stringify({ contrast: c === 'high' }));
      } catch {}
    }, contrast);
    const page = await context.newPage();
    for (const theme of themes) {
      for (const route of routes) {
        await page.goto(`${base}#/${route}`);
        await page.waitForSelector('main#main h1');
        await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
        await page.addScriptTag({ content: axe });
        const violations = await page.evaluate(async () => {
          const r = await window.axe.run(document, {
            runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
          });
          return r.violations.map(
            (v) => `${v.id} (${v.nodes.length}): ${v.nodes[0].target.join(' ')}`,
          );
        });
        const name = `${theme.padEnd(8)} ${contrast.padEnd(6)} /${route}`;
        if (violations.length) {
          failed++;
          console.error(`✗ ${name}\n  ${violations.join('\n  ')}`);
        } else console.log(`✓ ${name}`);
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}
if (failed) process.exit(1);
console.log('WCAG 2.2 AA: порушень немає');
