import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from './auth/AuthModal'
import { IconSearch, IconX, IconMenu } from '../assets/icons'

const navLinks = [
  { to: '/', label: 'Anime' },
  { to: '/terbaru', label: 'Terbaru' },
  { to: '/donghua', label: 'Donghua' },
  { to: '/jadwal', label: 'Jadwal' },
  { to: '/search', label: 'Search' },
  { to: '/history', label: 'Riwayat' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAuth, setShowAuth] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initial = username?.[0]?.toUpperCase() || '?'

  return (
    <>
      <nav className="glass sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="Ryustream" className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110" />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-gradient">Ryu</span>
                <span className="text-white">stream</span>
              </span>
            </NavLink>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'}
                  className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-purple-700/30 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                {searchOpen ? <IconX size={20}/> : <IconSearch size={20}/>}
              </button>

              {user ? (
                <div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm font-bold hover:bg-purple-600 transition-colors">
                    {initial}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-10 w-48 bg-darkCard border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">{username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button onClick={() => { navigate('/history'); setShowUserMenu(false) }}
                        className="w-full px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 text-left transition-colors">
                        Riwayat Nonton
                      </button>
                      <button onClick={() => { signOut(); setShowUserMenu(false) }}
                        className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 text-left transition-colors">
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)}
                  className="px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors">
                  Masuk
                </button>
              )}

              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                {menuOpen ? <IconX size={20}/> : <IconMenu size={20}/>}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-3 animate-fade-in">
              <form onSubmit={handleSearch} className="relative">
                <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari anime atau donghua..."
                  className="w-full bg-darkCard/80 border border-purple-700/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"/>
              </form>
            </div>
          )}

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-3 animate-slide-up">
              {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `block px-4 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all ${isActive ? 'bg-purple-700/30 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
