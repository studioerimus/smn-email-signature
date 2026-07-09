// Both marks render at a fixed 30px height; widths are derived from each
// asset's own native aspect ratio (symbol 200x200, wordmark 572.33x80) so
// neither is stretched. The embedded PNGs are rasterized well above this
// display size, so downscaling here stays crisp on retina.
const MARK_H      = 30
const SYMBOL_W    = 30
const WORDMARK_W  = 215

const FONT_BASE = 'font-family:Arial,Helvetica,sans-serif;font-size:15px;letter-spacing:-0.48px'
const TEXT_BOLD    = `${FONT_BASE};font-weight:bold`
const TEXT_REGULAR = `${FONT_BASE};font-weight:normal`

const MARGIN_V = 20

export interface SignatureFields {
  name: string
  role: string
  phone: string
}

export interface SignatureMarks {
  symbolLight: string
  symbolDark: string
  wordmarkLight: string
  wordmarkDark: string
}

export type SignatureMode = 'preview-light' | 'preview-dark' | 'email'

export function generatePlainTextSignature({ name, role, phone }: SignatureFields): string {
  return [name, role, phone].filter(Boolean).join('\n')
}

export function generateSignature(
  fields: SignatureFields,
  mode: SignatureMode,
  signatureMarks: SignatureMarks,
): string {
  if (mode === 'email') return buildEmailHtml(fields, signatureMarks)

  const dark = mode === 'preview-dark'
  const colors = dark
    ? { primary: '#FFFFFF', secondary: '#A6A6A6', divider: '#A6A6A6', bg: '#1C1C1C' }
    : { primary: '#000000', secondary: '#595959', divider: '#595959', bg: '#FFFFFF' }
  const symbol   = dark ? signatureMarks.symbolDark   : signatureMarks.symbolLight
  const wordmark = dark ? signatureMarks.wordmarkDark : signatureMarks.wordmarkLight

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:${colors.bg};">
${wrapWithMargin(signatureTable(fields, colors.primary, colors.secondary, colors.divider, symbol, wordmark))}
</body></html>`
}

function wrapWithMargin(inner: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:${MARGIN_V}px 0;">${inner}</td></tr></table>`
}

function buildEmailHtml(fields: SignatureFields, m: SignatureMarks): string {
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
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:${MARGIN_V}px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;border-collapse:collapse;">

<tr><td style="padding:0 0 2px 0;">
  <span class="smn-p" style="${TEXT_BOLD};color:#000000;display:block;margin:0;padding:0;line-height:1;">${esc(name) || '&nbsp;'}</span>
</td></tr>

<tr><td style="padding:0 0 20px 0;">
  <span class="smn-p" style="${TEXT_BOLD};color:#000000;display:block;margin:0;padding:0;line-height:1;">${esc(role) || '&nbsp;'}</span>
</td></tr>

<tr><td style="padding:0 0 10px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td class="smn-s" style="${TEXT_REGULAR};color:#595959;">${esc(phone) || '&nbsp;'}</td>
    <td class="smn-s" style="${TEXT_REGULAR};color:#595959;text-align:right;white-space:nowrap;">Operate as One</td>
  </tr>
  </table>
</td></tr>

<tr><td class="smn-d" bgcolor="#595959" height="1" style="background-color:#595959;font-size:0;line-height:0;padding:0;">&nbsp;</td></tr>

<tr><td style="height:10px;font-size:0;line-height:0;">&nbsp;</td></tr>

<tr><td style="padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="width:50%;vertical-align:bottom;">
      <img class="smn-lo" src="${m.symbolLight}" width="${SYMBOL_W}" height="${MARK_H}" alt="" border="0"
           style="display:block;border:0;width:${SYMBOL_W}px;height:${MARK_H}px;">
      <img class="smn-do" src="${m.symbolDark}" width="${SYMBOL_W}" height="${MARK_H}" alt="" border="0"
           style="display:none;border:0;width:${SYMBOL_W}px;height:${MARK_H}px;">
    </td>
    <td style="width:50%;text-align:right;vertical-align:bottom;">
      <img class="smn-lo" src="${m.wordmarkLight}" width="${WORDMARK_W}" height="${MARK_H}" alt="" border="0"
           style="display:block;border:0;width:${WORDMARK_W}px;height:${MARK_H}px;margin-left:auto;">
      <img class="smn-do" src="${m.wordmarkDark}" width="${WORDMARK_W}" height="${MARK_H}" alt="" border="0"
           style="display:none;border:0;width:${WORDMARK_W}px;height:${MARK_H}px;margin-left:auto;">
    </td>
  </tr>
  </table>
</td></tr>

</table>
</td></tr></table>
</body>
</html>`
}

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
  <span style="${TEXT_BOLD};color:${primary};display:block;margin:0;padding:0;line-height:1;">${esc(name) || '&nbsp;'}</span>
</td></tr>

<tr><td style="padding:0 0 20px 0;">
  <span style="${TEXT_BOLD};color:${primary};display:block;margin:0;padding:0;line-height:1;">${esc(role) || '&nbsp;'}</span>
</td></tr>

<tr><td style="padding:0 0 10px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="${TEXT_REGULAR};color:${secondary};">${esc(phone) || '&nbsp;'}</td>
    <td style="${TEXT_REGULAR};color:${secondary};text-align:right;white-space:nowrap;">Operate as One</td>
  </tr>
  </table>
</td></tr>

<tr><td bgcolor="${divColor}" height="1" style="background-color:${divColor};font-size:0;line-height:0;padding:0;">&nbsp;</td></tr>

<tr><td style="height:10px;font-size:0;line-height:0;">&nbsp;</td></tr>

<tr><td style="padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="width:50%;vertical-align:bottom;">
      <img src="${symbol}" width="${SYMBOL_W}" height="${MARK_H}" alt="" border="0"
           style="display:block;border:0;width:${SYMBOL_W}px;height:${MARK_H}px;">
    </td>
    <td style="width:50%;text-align:right;vertical-align:bottom;">
      <img src="${wordmark}" width="${WORDMARK_W}" height="${MARK_H}" alt="" border="0"
           style="display:block;border:0;width:${WORDMARK_W}px;height:${MARK_H}px;margin-left:auto;">
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
