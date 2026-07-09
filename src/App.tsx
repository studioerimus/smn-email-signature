import { useState } from 'react'
import PasswordGate from './components/PasswordGate'
import Generator from './components/Generator'

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('smn_unlocked') === '1'
  )

  const handleUnlock = () => {
    sessionStorage.setItem('smn_unlocked', '1')
    setUnlocked(true)
  }

  if (!unlocked) return <PasswordGate onUnlock={handleUnlock} />
  return <Generator />
}
