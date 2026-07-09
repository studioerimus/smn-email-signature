import { useState, FormEvent } from 'react'

interface Props {
  onUnlock: () => void
}

export default function PasswordGate({ onUnlock }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const expected = import.meta.env.VITE_ACCESS_PASSWORD
    if (!expected || value === expected) {
      onUnlock()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#E4E4E0] p-8 w-full max-w-sm shadow-sm">
        <p className="text-xs font-medium text-[#9C9C98] uppercase tracking-wider mb-6">
          SMN Email Signature
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[#5C5C5A] uppercase tracking-wider mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={value}
              onChange={e => {
                setValue(e.target.value)
                setError(false)
              }}
              autoFocus
              autoComplete="current-password"
              className={[
                'w-full border rounded-lg px-3.5 py-2.5 text-sm text-[#1A1A18]',
                'focus:outline-none focus:ring-2 focus:ring-[#1A1A18]/15 focus:border-[#1A1A18]',
                'transition-colors',
                error ? 'border-red-400 bg-red-50' : 'border-[#E4E4E0]',
              ].join(' ')}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1.5">Incorrect password.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#1A1A18] text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-[#363634] transition-colors cursor-pointer"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
