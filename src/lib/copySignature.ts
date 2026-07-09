// Copies the signature HTML as rich text so it pastes with formatting
// into Gmail, Apple Mail, and Outlook signature editors.
export async function copySignatureAsRich(html: string): Promise<void> {
  // Modern Clipboard API — preferred; works in Chrome, Safari, Edge
  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    try {
      const blob = new Blob([html], { type: 'text/html' })
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': blob })])
      return
    } catch {
      // Fall through to execCommand
    }
  }

  // Fallback: render into an off-screen contenteditable and copy the selection
  const div = document.createElement('div')
  div.setAttribute('contenteditable', 'true')
  div.style.cssText =
    'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;'
  div.innerHTML = html
  document.body.appendChild(div)
  div.focus()

  const sel = window.getSelection()
  if (sel) {
    const range = document.createRange()
    range.selectNodeContents(div)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  try {
    document.execCommand('copy')
  } finally {
    document.body.removeChild(div)
    window.getSelection()?.removeAllRanges()
  }
}
