import { useState, useEffect } from 'react'
import SocialButton from '../components/SocialButton'
import { IconWhatsapp, IconGithub, IconInstagram, IconGmail } from '../assets/icons'
import ramPhoto from '../assets/ram.png'

const TECH_STACK = ['React 18', 'Vite 5', 'Tailwind CSS', 'React Router', 'HLS.js', 'Supabase', 'Daunscode API']
const SOCIAL_LINKS = [
  { href: 'https://wa.me/6285147142116', icon: IconWhatsapp, label: 'WhatsApp', color: 'bg-green-600/20 text-green-400 hover:bg-green-600/40 border border-green-600/30' },
  { href: 'https://github.com/renntie', icon: IconGithub, label: 'GitHub', color: 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20' },
  { href: 'https://instagram.com/wakeupmarz', icon: IconInstagram, label: 'Instagram', color: 'bg-pink-600/20 text-pink-400 hover:bg-pink-600/40 border border-pink-600/30' },
  { href: 'mailto:ammarashim18@gmail.com', icon: IconGmail, label: 'Gmail', color: 'bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-600/30' },
]

export default function AboutPage() {
  const [imgError, setImgError] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent))
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true)
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (isIOS) { setShowIOSGuide(true); return }
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setDeferredPrompt(null)
  }

  const canInstall = !installed && (deferredPrompt || isIOS)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2"><div className="w-1 h-7 bg-purple-500 rounded-full"/><h1 className="text-2xl font-bold text-white">Tentang</h1></div>
        <p className="text-gray-500 text-sm ml-4">Developer & platform di balik Ryustream</p>
      </div>

      {installed ? (
        <div className="mb-8 bg-green-500/10 border border-green-500/30 rounded-2xl px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400"><polyline points="20,6 9,17 4,12"/></svg>
          </div>
          <div><p className="text-green-400 font-semibold text-sm">Ryustream sudah terpasang!</p><p className="text-gray-500 text-xs mt-0.5">Buka dari layar utama HP kamu</p></div>
        </div>
      ) : canInstall ? (
        <div className="mb-8 bg-purple-900/20 border border-purple-600/30 rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/icons/icon-72x72.png" alt="Ryustream" className="w-12 h-12 rounded-xl"/>
            <div><p className="text-white font-semibold">Install Ryustream</p><p className="text-gray-500 text-xs mt-0.5">Pasang di HP kamu, akses lebih cepat</p></div>
          </div>
          <button onClick={handleInstall} className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold rounded-xl transition-colors purple-glow flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Install
          </button>
        </div>
      ) : null}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowIOSGuide(false)}/>
          <div className="relative bg-darkCard border border-white/10 rounded-2xl p-6 w-full max-w-md animate-slide-up">
            <h3 className="text-lg font-bold text-white mb-4">Install di iPhone/iPad</h3>
            <div className="space-y-4">
              {[{step:'1',text:'Tap tombol Share di toolbar Safari'},{step:'2',text:'Scroll ke bawah dan tap "Tambahkan ke Layar Utama"'},{step:'3',text:'Tap "Tambahkan" di pojok kanan atas'}].map(item=>(
                <div key={item.step} className="flex gap-3">
                  <div className="w-7 h-7 bg-purple-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{item.step}</div>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowIOSGuide(false)} className="mt-5 w-full py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors">Mengerti</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col items-center text-center bg-darkCard rounded-2xl p-8 border border-white/5 animate-slide-up">
          <div className="relative mb-5">
            <div className="w-36 h-36 rounded-full border-4 border-purple-600 purple-glow overflow-hidden bg-purple-900/30 flex items-center justify-center">
              {!imgError ? (
                <img src={ramPhoto} alt="Ram Ofc." className="w-full h-full object-cover" onError={() => setImgError(true)}/>
              ) : (
                <span className="text-6xl font-bold text-gradient select-none">R</span>
              )}
            </div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-darkCard"/>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Ram Ofc.</h2>
          <p className="text-purple-400 text-sm font-medium mb-1">Fullstack Developer</p>
          <p className="text-gray-500 text-xs mb-6">&amp; Founder Ryustream</p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(s => <SocialButton key={s.label} href={s.href} icon={s.icon} label={s.label} color={s.color}/>)}
          </div>
        </div>

        <div className="flex flex-col gap-6 animate-slide-up" style={{animationDelay:'0.1s'}}>
          <div className="bg-darkCard rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full"/>Tentang Ryustream</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Ryustream adalah platform streaming anime & donghua subtitle Indonesia yang dibangun untuk memberikan pengalaman menonton yang cepat, bersih, dan bebas gangguan. Hadir dengan koleksi anime dan donghua yang selalu diperbarui.</p>
            <p className="text-gray-500 text-sm leading-relaxed mt-3">Dibangun dengan teknologi modern, Ryustream adalah tempat favorit para wibu dan donghua lover Indonesia.</p>
          </div>
          <div className="bg-darkCard rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full"/>Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map(tech => <span key={tech} className="px-3 py-1.5 bg-purple-900/30 border border-purple-700/40 text-purple-300 text-xs font-medium rounded-lg">{tech}</span>)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{label:'Anime',value:'1000+'},{label:'Donghua',value:'500+'},{label:'Update',value:'Daily'}].map(stat=>(
              <div key={stat.label} className="bg-darkCard rounded-xl p-4 border border-white/5 text-center">
                <p className="text-xl font-bold text-gradient">{stat.value}</p>
                <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
