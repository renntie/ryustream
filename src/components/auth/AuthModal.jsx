import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { IconX, IconGithub, IconGoogle } from '../../assets/icons'

export default function AuthModal({ onClose }) {
  const { signInWithEmail, signUpWithEmail, signInWithGithub, signInWithGoogle } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') { await signInWithEmail(email, password); onClose() }
      else { await signUpWithEmail(email, password, username); setSuccess('Cek email kamu untuk verifikasi akun!') }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-darkCard border border-white/10 rounded-2xl p-6 w-full max-w-md animate-slide-up shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><IconX size={20}/></button>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">{mode === 'login' ? 'Masuk ke Ryustream' : 'Daftar Ryustream'}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setSuccess(null) }}
              className="text-purple-400 hover:text-purple-300 ml-1 font-medium">
              {mode === 'login' ? 'Daftar' : 'Masuk'}
            </button>
          </p>
        </div>

        {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl">{error}</div>}
        {success && <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1.5">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username kamu" required
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"/>
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@kamu.com" required
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"/>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"/>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors purple-glow">
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10"/>
          <span className="text-xs text-gray-600">atau</span>
          <div className="flex-1 h-px bg-white/10"/>
        </div>

        <div className="space-y-2">
          <button onClick={() => signInWithGoogle().catch(e => setError(e.message))}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
            <IconGoogle size={18}/> Lanjut dengan Google
          </button>
          <button onClick={() => signInWithGithub().catch(e => setError(e.message))}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
            <IconGithub size={18}/> Lanjut dengan GitHub
          </button>
        </div>
      </div>
    </div>
  )
}
