import { useState, useRef, useEffect } from 'react'
import { generateSignature, generatePlainTextSignature, SignatureFields, SignatureMode } from '../lib/generateSignature'
import { copySignatureAsRich } from '../lib/copySignature'
import { marks } from '../lib/marks'

type PreviewMode = 'light' | 'dark'

const INPUT_CLASS =
  'w-full border border-[#E4E4E0] rounded-lg px-3.5 py-2.5 text-sm text-[#1A1A18] ' +
  'placeholder:text-[#C4C4C0] focus:outline-none focus:ring-2 focus:ring-[#1A1A18]/10 ' +
  'focus:border-[#1A1A18] transition-colors bg-white'

const LABEL_CLASS =
  'block text-[10px] font-semibold text-[#9C9C98] uppercase tracking-widest mb-1.5'

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  )
}

export default function Generator() {
  const [name, setName] = useState('First Last')
  const [role, setRole] = useState('Job Role')
  const [phone, setPhone] = useState('(XXX) XXX-XXXX')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('light')
  const [copied, setCopied] = useState(false)

  const fields: SignatureFields = { name, role, phone }

  const signatureMode: SignatureMode =
    previewMode === 'light' ? 'preview-light' : 'preview-dark'
  const previewHtml = generateSignature(fields, signatureMode, marks)

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const adjustHeight = () => {
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const h = iframe.contentDocument?.body?.scrollHeight
      if (h) iframe.style.height = h + 'px'
    } catch {}
  }

  useEffect(() => {
    adjustHeight()
  }, [previewHtml])

  const handleCopy = async () => {
    const html = generateSignature(fields, 'email', marks)
    const text = generatePlainTextSignature(fields)
    try {
      await copySignatureAsRich(html, text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {/* Header */}
      <header className="bg-white border-b border-[#E4E4E0] px-6 py-[14px]">
        <span className="text-[11px] font-semibold text-[#9C9C98] uppercase tracking-widest">
          SMN Email Signature
        </span>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto p-5 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">

          {/* Left column */}
          <div className="space-y-4">

            {/* Inputs */}
            <div className="bg-white rounded-xl border border-[#E4E4E0] p-5 space-y-4">
              <p className={LABEL_CLASS}>Signature details</p>
              <Field
                label="Your Name"
                id="field-name"
                value={name}
                onChange={setName}
                placeholder="Full name"
              />
              <Field
                label="Your Role"
                id="field-role"
                value={role}
                onChange={setRole}
                placeholder="Job title"
              />
              <Field
                label="Contact Number"
                id="field-phone"
                value={phone}
                onChange={setPhone}
                placeholder="+61 4xx xxx xxx"
              />
            </div>

            {/* Copy + instructions */}
            <div className="bg-white rounded-xl border border-[#E4E4E0] p-5 space-y-5">
              <button
                onClick={handleCopy}
                className="w-full bg-[#1A1A18] text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-[#363634] active:scale-[0.99] transition-all cursor-pointer"
              >
                {copied ? 'Copied ✓' : 'Copy signature'}
              </button>

              <div className="space-y-3">
                <p className={LABEL_CLASS}>Adding your signature</p>
                <div className="space-y-2.5 text-[12px] text-[#5C5C5A] leading-relaxed">
                  <p>
                    <span className="font-semibold text-[#1A1A18]">Gmail —</span>{' '}
                    Settings (⚙) → See all settings → General → Signature → New → paste → Save changes.
                  </p>
                  <p>
                    <span className="font-semibold text-[#1A1A18]">Apple Mail —</span>{' '}
                    Mail → Settings → Signatures → select account → + → click in the signature area → paste.
                  </p>
                  <p>
                    <span className="font-semibold text-[#1A1A18]">Outlook —</span>{' '}
                    File → Options → Mail → Signatures → New → paste in the edit area → OK.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right column: Preview */}
          <div className="bg-white rounded-xl border border-[#E4E4E0] overflow-hidden self-start">
            {/* Preview toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E4E4E0]">
              <span className={LABEL_CLASS} style={{ marginBottom: 0 }}>
                Preview
              </span>
              <div className="flex items-center gap-0.5 bg-[#F5F5F3] rounded-lg p-0.5">
                <button
                  onClick={() => setPreviewMode('light')}
                  className={[
                    'text-[11px] font-medium px-3 py-1.5 rounded-md transition-all cursor-pointer',
                    previewMode === 'light'
                      ? 'bg-white text-[#1A1A18] shadow-sm'
                      : 'text-[#9C9C98] hover:text-[#1A1A18]',
                  ].join(' ')}
                >
                  Light
                </button>
                <button
                  onClick={() => setPreviewMode('dark')}
                  className={[
                    'text-[11px] font-medium px-3 py-1.5 rounded-md transition-all cursor-pointer',
                    previewMode === 'dark'
                      ? 'bg-[#1A1A18] text-white shadow-sm'
                      : 'text-[#9C9C98] hover:text-[#1A1A18]',
                  ].join(' ')}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Preview iframe */}
            <div className={previewMode === 'dark' ? 'bg-[#1C1C1C]' : 'bg-white'}>
              <iframe
                key={previewMode}
                ref={iframeRef}
                srcDoc={previewHtml}
                sandbox="allow-same-origin"
                scrolling="no"
                title="Signature preview"
                onLoad={adjustHeight}
                className="w-full border-0 block"
                style={{ height: '200px', display: 'block' }}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
