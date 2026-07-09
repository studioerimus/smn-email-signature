#!/usr/bin/env node
// Copies the real brand SVGs into src/assets/marks/, replacing the placeholders.
// Run once from your terminal: npm run setup-marks
// Then commit the result: git add src/assets/marks/ && git commit -m "feat: add brand SVGs" && git push

import { copyFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

mkdirSync(join(root, 'src', 'assets', 'marks'), { recursive: true })

const files = [
  ['Logo SVG/Symbol/Somana-Symbol-Black.svg',     'src/assets/marks/Somana-Symbol-Black.svg'],
  ['Logo SVG/Symbol/Somana-Symbol-White.svg',     'src/assets/marks/Somana-Symbol-White.svg'],
  ['Logo SVG/Wordmark/Somana-Wordmark-Black.svg', 'src/assets/marks/Somana-Wordmark-Black.svg'],
  ['Logo SVG/Wordmark/Somana-Wordmark-White.svg', 'src/assets/marks/Somana-Wordmark-White.svg'],
]

for (const [src, dest] of files) {
  copyFileSync(join(root, src), join(root, dest))
  console.log(`✓ ${dest}`)
}

console.log('\nDone. Now run:')
console.log('  git add src/assets/marks/ && git commit -m "feat: add brand SVGs" && git push')
