#!/usr/bin/env node
// Converts SVG brand marks → 2x PNG fallbacks and copies SVGs to public/marks/.
// Run once after `npm install`: npm run generate-pngs
// Then update SYMBOL_W/H and WORDMARK_MAX_W in src/lib/generateSignature.ts
// with the display dimensions printed below.

import sharp from 'sharp'
import { copyFileSync, mkdirSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const out = join(root, 'public', 'marks')

mkdirSync(out, { recursive: true })

// Target display heights in px — the PNG is generated at 2× for retina
const DISPLAY_H = { Symbol: 36, Wordmark: 22 }

const marks = [
  { src: 'Logo SVG/Symbol/Somana-Symbol-Black.svg',   kind: 'Symbol' },
  { src: 'Logo SVG/Symbol/Somana-Symbol-White.svg',   kind: 'Symbol' },
  { src: 'Logo SVG/Wordmark/Somana-Wordmark-Black.svg', kind: 'Wordmark' },
  { src: 'Logo SVG/Wordmark/Somana-Wordmark-White.svg', kind: 'Wordmark' },
]

const displaySizes = {}

for (const { src, kind } of marks) {
  const srcPath = join(root, src)
  const stem = basename(src, '.svg')

  // Copy SVG into public/marks/ for direct serving
  copyFileSync(srcPath, join(out, `${stem}.svg`))

  // Resolve natural dimensions from the SVG
  const meta = await sharp(srcPath).metadata()
  const natW = meta.width ?? 100
  const natH = meta.height ?? 100

  const displayH = DISPLAY_H[kind]
  const displayW = Math.round((natW / natH) * displayH)
  const pngW = displayW * 2
  const pngH = displayH * 2

  await sharp(srcPath)
    .resize(pngW, pngH)
    .png()
    .toFile(join(out, `${stem}.png`))

  console.log(`✓ ${stem}  display ${displayW}×${displayH}  →  PNG ${pngW}×${pngH}`)

  if (!displaySizes[kind]) displaySizes[kind] = { w: displayW, h: displayH }
}

const sym = displaySizes.Symbol ?? { w: 36, h: 36 }
const wm  = displaySizes.Wordmark ?? { w: 120, h: 22 }

console.log(`
Update these constants in src/lib/generateSignature.ts:

  const SYMBOL_W    = ${sym.w}
  const SYMBOL_H    = ${sym.h}
  const WORDMARK_H  = ${wm.h}
  const WORDMARK_MAX_W = ${wm.w}
`)
