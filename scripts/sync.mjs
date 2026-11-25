#!/usr/bin/env node
/**
 * Copies @mr/ui (projects/ui/src of this repository) into an application repository.
 *
 *   node ../mr-ui/scripts/sync.mjs <repo dir>          — copy
 *   node ../mr-ui/scripts/sync.mjs <repo dir> --check  — exit 1 if the copy differs (CI, pre-push)
 *
 * The target repository says where the copy goes with the "ui" key of its platform.json:
 *   { "ui": "web/src/mr-ui" }
 * The copy is not edited by hand: change mr-ui and run the sync in every repository.
 */
import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'projects/ui/src');
const [target = '.', flag] = process.argv.slice(2);
const repo = resolve(target);
const configFile = join(repo, 'platform.json');
if (!existsSync(configFile)) {
  console.error(`${configFile} не знайдено — додайте { "ui": "web/src/mr-ui" }`);
  process.exit(2);
}
const config = JSON.parse(readFileSync(configFile, 'utf8'));
if (!config.ui) {
  console.error(`${configFile}: немає ключа "ui" — куди копіювати @mr/ui, напр. "web/src/mr-ui"`);
  process.exit(2);
}
const version = JSON.parse(readFileSync(join(root, 'projects/ui/package.json'), 'utf8')).version;
const dest = join(repo, config.ui);
/** What the application does not need: the tests of the library run here. */
const skip = (path) => path.endsWith('.spec.ts');

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : skip(path) ? [] : [path];
  });
}

const digest = (dir) =>
  createHash('sha256')
    .update(
      files(dir)
        .filter((f) => !['README.md', 'VERSION'].includes(relative(dir, f)))
        .sort()
        .map((f) => `${relative(dir, f)}\n${readFileSync(f, 'utf8')}`)
        .join('\n'),
    )
    .digest('hex');

if (flag === '--check') {
  if (!existsSync(dest) || digest(source) !== digest(dest)) {
    console.error(
      `✗ ${relative(repo, dest)} відрізняється від @mr/ui ${version} — npm run ui:sync`,
    );
    process.exit(1);
  }
  console.log(`✓ ${relative(repo, dest)} = @mr/ui ${version}`);
  process.exit(0);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(source, dest, { recursive: true, filter: (from) => !skip(from) });
writeFileSync(
  join(dest, 'README.md'),
  `# @mr/ui ${version}\n\nКопія бібліотеки інтерфейсу з репозиторію mr-ui (projects/ui/src).\n` +
    'Не редагуйте тут: змініть mr-ui і виконайте `npm run ui:sync`. Документація — README.md у mr-ui/projects/ui.\n',
);
writeFileSync(join(dest, 'VERSION'), `${version}\n`);
console.log(`✓ ${relative(repo, dest)} ← @mr/ui ${version}`);
