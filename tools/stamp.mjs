// Writes the offline file list and a content-based version into sw.js and js/version.js.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const files = [];
const walk = p => (statSync(p).isDirectory() ? readdirSync(p).forEach(f => walk(join(p, f))) : files.push(p));
['index.html', 'manifest.webmanifest', 'css', 'js', 'fonts', 'icons'].forEach(f => walk(join(root, f)));
const list = files.map(f => relative(root, f)).filter(f => !f.endsWith('.txt')).sort();

const hash = createHash('sha256');
for (const f of list) if (f !== 'js/version.js') hash.update(f).update(readFileSync(join(root, f)));
const version = new Date().toISOString().slice(0, 10).replaceAll('-', '') + '-' + hash.digest('hex').slice(0, 7);

const sw = join(root, 'sw.js');
writeFileSync(sw, readFileSync(sw, 'utf8')
  .replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`)
  .replace(/const FILES = \[[^\]]*\];/s, `const FILES = ${JSON.stringify(['./', ...list.map(f => './' + f)], null, 1)};`));
writeFileSync(join(root, 'js/version.js'), `export const VERSION = '${version}';\n`);
console.log(version, list.length + 1, 'files');
