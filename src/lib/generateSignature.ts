// Display dimensions for the brand marks.
// Run `npm run generate-pngs` once after setup, then update these
// with the values printed to the console.
const SYMBOL_W = 36
const SYMBOL_H = 36
const WORDMARK_H = 22
// WORDMARK_W is intentionally omitted — width scales from the 2x PNG naturally
// via max-width + width:100% on the <img>. Set WORDMARK_MAX_W to the display width
// printed by generate-pngs.
const WORDMARK_MAX_W = 120

export interface SignatureFields {
  name: string
  role: string
  phone: string
}

export type SignatureMode = 'preview-light' | 'preview-dark' | 'email'

export function generateSignature(
  fields: SignatureFields,
  mode: SignatureMode,
  baseUrl: string,
): string {
  const marks = {
    symbolLight:   `${baseUrl}/marks/Somana-Symbol-Black.png`,
    symbolDark:    `${baseUrl}/marks/Somana-Symbol-White.png`,
    wordmarkLight: `${baseUrl}/marks/Somana-Wordmark-Black.png`,
    wordmarkDark:  `${baseUrl}/marks/Somana-Wordmark-White.png`,
  }

  if (mode === 'email') return buildEmailHtml(fields, marks)

  const dark = mode === 'preview-dark'
  const colors = dark
    ? { primary: '#FFFFFF', secondary: '#A6A6A6', divider: '#A6A6A6', bg: '#1C1C1C' }
    : { primary: '#000000', secondary: '#595959', divider: '#595959', bg: '#FFFFFF' }
  const symbol   = dark ? marks.symbolDark   : marks.symbolLight
  const wordmark = dark ? marks.wordmarkDark : marks.wordmarkLight

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:${colors.bg};">
${signatureTable(fields, colors.primary, colors.secondary, colors.divider, symbol, wordmark)}
</body></html>`
}

// Full email-safe HTML — media query dark mode + dual images for light/dark switching
function buildEmailHtml(
  fields: SignatureFields,
  marks: { symbolLight: string; symbolDark: string; wordmarkLight: string; wordmarkDark: string },
): string {
  const { name, role, phone } = fields
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@media (prefers-color-scheme:dark){
  .smn-p{color:#FFFFFF!important}
  .smn-s{color:#A6A6A6!important}
  .smn-d{background-color:#A6A6A6!important}
  .smn-lo{display:none!important}
  .smn-do{display:block!important}
}
</style>
</head>
<body style="margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;border-collapse:collapse;">

<tr><td style="padding:0 0 2px 0;">
  <span class="smn-p" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#000000;display:block;margin:0;padding:0;line-height:1.3;">${esc(name) || '&nbsp;'}</span>
</td></tr>

<tr><td style="padding:0;">
  <span class="smn-p" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#000000;display:block;margin:0;padding:0;line-height:1.3;">${esc(role) || '&nbsp;'}</span>
</td></tr>

<tr><td style="height:16px;font-size:0;line-height:0;">&nbsp;</td></tr>

<tr><td style="padding:0 0 10px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td class="smn-s" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#595959;">${esc(phone) || '&nbsp;'}</td>
    <td class="smn-s" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#595959;text-align:right;white-space:nowrap;">Operate as One</td>
  </tr>
  </table>
</td></tr>

<tr><td class="smn-d" bgcolor="#595959" height="1" style="background-color:#595959;font-size:0;line-height:0;padding:0;">&nbsp;</td></tr>

<tr><td style="height:12px;font-size:0;line-height:0;">&nbsp;</td></tr>

<tr><td style="padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="width:50%;vertical-align:bottom;">
      <img class="smn-lo" src="${marks.symbolLight}" width="${SYMBOL_W}" height="${SYMBOL_H}" alt="" border="0"
           style="display:block;border:0;width:${SYMBOL_W}px;height:${SYMBOL_H}px;">
      <img class="smn-do" src="${marks.symbolDark}" width="${SYMBOL_W}" height="${SYMBOL_H}" alt="" border="0"
           style="display:none;border:0;width:${SYMBOL_W}px;height:${SYMBOL_H}px;">
    </td>
    <td style="width:50%;text-align:right;vertical-align:bottom;">
      <img class="smn-lo" src="${marks.wordmarkLight}" height="${WORDMARK_H}" alt="Somana" border="0"
           style="display:block;border:0;max-width:${WORDMARK_MAX_W}px;width:100%;height:auto;margin-left:auto;">
      <img class="smn-do" src="${marks.wordmarkDark}" height="${WORDMARK_H}" alt="Somana" border="0"
           style="display:none;border:0;max-width:${WORDMARK_MAX_W}px;width:100%;height:auto;margin-left:auto;">
    </td>
  </tr>
  </table>
</td></tr>

</table>
</body>
</html>`
}

// Preview version — single set of images, hard-coded colours (no media query)
function signatureTable(
  { name, role, phone }: SignatureFields,
  primary: string,
  secondary: string,
  divColor: string,
  symbol: string,
  wordmark: string,
): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;border-collapse:collapse;">

<tr><td style="padding:0 0 2px 0;">
  <span style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:${primary};display:block;margin:0;padding:0;line-height:1.3;">${esc(name) || '&nbsp;'}</span>
</td></tr>

<tr><td style="padding:0;">
  <span style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:${primary};display:block;margin:0;padding:0;line-height:1.3;">${esc(role) || '&nbsp;'}</span>
</td></tr>

<tr><td style="height:16px;font-size:0;line-height:0;">&nbsp;</td></tr>

<tr><td style="padding:0 0 10px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:${secondary};">${esc(phone) || '&nbsp;'}</td>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:${secondary};text-align:right;white-space:nowrap;">Operate as One</td>
  </tr>
  </table>
</td></tr>

<tr><td bgcolor="${divColor}" height="1" style="background-color:${divColor};font-size:0;line-height:0;padding:0;">&nbsp;</td></tr>

<tr><td style="height:12px;font-size:0;line-height:0;">&nbsp;</td></tr>

<tr><td style="padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="width:50%;vertical-align:bottom;">
      <img src="${symbol}" width="${SYMBOL_W}" height="${SYMBOL_H}" alt="" border="0"
           style="display:block;border:0;width:${SYMBOL_W}px;height:${SYMBOL_H}px;">
    </td>
    <td style="width:50%;text-align:right;vertical-align:bottom;">
      <img src="${wordmark}" height="${WORDMARK_H}" alt="Somana" border="0"
           style="display:block;border:0;max-width:${WORDMARK_MAX_W}px;width:100%;height:auto;margin-left:auto;">
    </td>
  </tr>
  </table>
</td></tr>

</table>`
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
