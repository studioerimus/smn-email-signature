import symbolBlack   from '../assets/marks/Somana-Symbol-Black.svg?raw'
import symbolWhite   from '../assets/marks/Somana-Symbol-White.svg?raw'
import wordmarkBlack from '../assets/marks/Somana-Wordmark-Black.svg?raw'
import wordmarkWhite from '../assets/marks/Somana-Wordmark-White.svg?raw'

function svgToDataUri(svg: string): string {
  const bytes = new TextEncoder().encode(svg)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `data:image/svg+xml;base64,${btoa(binary)}`
}

export const marks = {
  symbolLight:   svgToDataUri(symbolBlack),
  symbolDark:    svgToDataUri(symbolWhite),
  wordmarkLight: svgToDataUri(wordmarkBlack),
  wordmarkDark:  svgToDataUri(wordmarkWhite),
}

export type Marks = typeof marks
