import { useCallback, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getDetail } from '../api/animeApi'
import { useAnimeAPI } from '../hooks/useAnimeAPI'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/auth/AuthModal'
import BackButton from '../components/BackButton'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import LikeButton from '../components/LikeButton'
import CommentsSection from '../components/CommentsSection'
import { IconPlay, IconFilm } from '../assets/icons'

export default function DetailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const animeUrl = searchParams.get('url')

  const fetchFn = useCallback(() => {
    if (!animeUrl) throw new Error('URL tidak ditemukan')
    return getDetail(animeUrl)
  }, [animeUrl])

  const { data, loading, error, refetch } = useAnimeAPI(fetchFn, [animeUrl])
  const detail = data?.results || null
  const info = detail?.info || {}
  const rawName = detail?.name || ''
  const title = rawName.replace(/^Nonton\s+(Streaming\s+&\s+Download\s+)?Anime\s+/i,'').replace(/\s+Sub(title)?\s+Indonesia.*$/i,'').trim() || 'Unknown'
  const status = info['Status'] || null
  const durasi = info['Durasi'] || null
  const rilis = info['Rilis'] || null
  const studio = info['Studio'] || null
  const jenis = info['Jenis'] || null
  const musim = info['Musim'] || null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6"><BackButton/></div>
      {loading && <LoadingSpinner text="Memuat detail anime..."/>}
      {error && <ErrorMessage message={error} onRetry={refetch}/>}
      {!loading && !error && detail && (
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="flex-shrink-0">
              <div className="w-48 md:w-56 mx-auto md:mx-0 rounded-2xl overflow-hidden border border-white/10 purple-glow">
                {detail.image ? <img src={detail.image} alt={title} className="w-full aspect-[3/4] object-cover" onError={e => { e.target.style.display='none' }}/> : <div className="w-full aspect-[3/4] bg-purple-900/20 flex items-center justify-center"><IconFilm size={48} className="text-purple-700"/></div>}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{title}</h1>
              <div className="flex flex-wrap gap-2 mb-5">
                {status && <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.toLowerCase().includes('tayang') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>{status}</span>}
                {jenis && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">{jenis}</span>}
                {musim && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">{musim}</span>}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
                {[{label:'Rilis',value:rilis},{label:'Durasi',value:durasi},{label:'Studio',value:studio},{label:'Jenis',value:jenis}].filter(i=>i.value).map(item=>(
                  <div key={item.label}><p className="text-xs text-gray-600 uppercase tracking-wider mb-0.5">{item.label}</p><p className="text-sm text-gray-300">{item.value}</p></div>
                ))}
              </div>
              {detail.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {detail.genres.map(g => <button key={g.slug} onClick={() => navigate(`/search?genre=${g.slug}`)} className="px-3 py-1 bg-darkCard border border-white/10 text-gray-400 text-xs rounded-lg hover:border-purple-500/50 hover:text-purple-300 transition-all">{g.name}</button>)}
                </div>
              )}
              <LikeButton animeUrl={animeUrl} animeTitle={title} onAuthRequired={() => setShowAuth(true)}/>
              {detail.description && <div className="mt-5"><p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Sinopsis</p><p className="text-gray-400 text-sm leading-relaxed">{detail.description}</p></div>}
            </div>
          </div>

          {detail.episodes?.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4"><div className="w-1 h-6 bg-purple-500 rounded-full"/><h2 className="text-lg font-bold text-white">Daftar Episode</h2><span className="text-xs text-gray-500 bg-darkCard px-2 py-0.5 rounded-full border border-white/10">{detail.episodes.length} ep</span></div>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {detail.episodes.map(ep => {
                  const epUrl = ep.url || ep.playback_url
                  return <button key={ep.number} onClick={() => epUrl && navigate(`/video?url=${encodeURIComponent(epUrl)}`)} disabled={!epUrl}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 bg-darkCard border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:border-purple-500 hover:text-purple-300 hover:bg-purple-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    <IconPlay size={10} className="text-purple-500 flex-shrink-0"/>{ep.title || `Ep ${ep.number}`}
                  </button>
                })}
              </div>
            </div>
          )}
          <div className="border-t border-white/5 pt-10">
            <CommentsSection animeUrl={animeUrl} animeTitle={title} onAuthRequired={() => setShowAuth(true)}/>
          </div>
        </div>
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)}/>}
    </div>
  )
}
