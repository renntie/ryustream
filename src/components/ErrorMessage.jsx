import { IconRefresh } from '../assets/icons'
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-red-400 font-medium">Terjadi Kesalahan</p>
        <p className="text-gray-500 text-sm mt-1">{message || 'Gagal memuat data'}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors">
          <IconRefresh size={16}/>Coba Lagi
        </button>
      )}
    </div>
  )
}
