import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHistory, deleteHistory, clearAllHistory } from '../lib/history'
import { IconPlay } from '../assets/icons'

function timeAgo(d) {
  const diff = (Date.now() - new Date(d)) / 1000
  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff/60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff/3600)} jam lalu`
  return `${Math.floor(diff/86400)} hari lalu`
}

export default function HistoryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getHistory(user.id).then(data => { setHistory(data); setLoading(false) })
  }, [user])

  const handleDelete = async (episodeUrl) => {
    await deleteHistory(user.id, episodeUrl)
    setHistory(prev => prev.filter(h => h.episode_url !== episodeUrl))
  }

  const handleClearAll = async () => {
    if (!confirm('Hapus semua riwayat nonton?')) return
    await clearAllHistory(user.id)
    setHistory([])
  }

  if (!user) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 text-gray-700"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
      <p className="text-gray-400 font-medium mb-2">Login untuk melihat riwayat nonton</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1"><div className="w-1 h-7 bg-purple-500 rounded-full"/><h1 className="text-2xl font-bold text-white">Riwayat Nonton</h1></div>
          <p className="text-gray-500 text-sm ml-4">{history.length} episode ditonton</p>
        </div>
        {history.length > 0 && <button onClick={handleClearAll} className="px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 rounded-lg transition-all">Hapus Semua</button>}
      </div>
      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="flex gap-4 bg-darkCard rounded-xl p-3 border border-white/5"><div className="w-24 h-16 rounded-lg shimmer-bg flex-shrink-0"/><div className="flex-1 space-y-2 py-1"><div className="h-3 shimmer-bg rounded w-3/4"/><div className="h-3 shimmer-bg rounded w-1/2"/></div></div>)}</div>
      ) : history.length === 0 ? (
        <div className="text-center py-20">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 text-gray-700"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
          <p className="text-gray-500">Belum ada riwayat nonton</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map(item => {
            const isDonghua = item.content_type === 'donghua'
            const videoPath = isDonghua ? '/donghua/video' : '/video'
            const detailPath = isDonghua ? '/donghua/detail' : '/detail'
            return (
              <div key={item.id} className="flex gap-4 bg-darkCard rounded-xl p-3 border border-white/5 hover:border-purple-700/30 transition-all group">
                <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer bg-purple-900/20" onClick={() => navigate(`${videoPath}?url=${encodeURIComponent(item.episode_url)}`)}>
                  {item.thumbnail && <img src={item.thumbnail} alt="" className="w-full h-full object-cover"/>}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconPlay size={20} className="text-white ml-0.5"/>
                  </div>
                  {isDonghua && <div className="absolute top-1 left-1 bg-red-600/80 text-white text-xs font-bold px-1 rounded">DH</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white hover:text-purple-300 cursor-pointer truncate transition-colors" onClick={() => navigate(`${detailPath}?url=${encodeURIComponent(item.anime_url)}`)}>
                    {item.anime_title || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.episode_title || 'Episode'}</p>
                  <p className="text-xs text-gray-700 mt-1">{timeAgo(item.watched_at)}</p>
                </div>
                <button onClick={() => handleDelete(item.episode_url)} className="text-gray-700 hover:text-red-400 transition-colors self-center flex-shrink-0 p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
