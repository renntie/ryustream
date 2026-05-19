import { useCallback, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getDonghuaDetail } from '../api/animeApi'
import { useAnimeAPI } from '../hooks/useAnimeAPI'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/auth/AuthModal'
import BackButton from '../components/BackButton'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import LikeButton from '../components/LikeButton'
import CommentsSection from '../components/CommentsSection'
import { IconPlay, IconFilm } from '../assets/icons'

export default function DonghuaDetailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const contentUrl = searchParams.get('url')

  const fetchFn = useCallback(() => {
    if (!contentUrl) throw new Error('URL tidak ditemukan')
    return getDonghuaDetail(contentUrl)
  }, [contentUrl])

  const { data, loading, error, refetch } = useAnimeAPI(fetchFn, [contentUrl])
  const detail = data?.results || null
  const title = detail?.title || detail?.name || 'Unknown'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6"><BackButton/></div>
      {loading && <LoadingSpinner text="Memuat detail donghua..."/>}
      {error && <ErrorMessage message={error} onRetry={refetch}/>}
      {!loading && !error && detail && (
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="flex-shrink-0">
              <div className="w-48 md:w-56 mx-auto md:mx-0 rounded-2xl overflow-hidden border border-white/10" style={{boxShadow:'0 0 20px rgba(239,68,68,0.3)'}}>
                {detail.image || detail.thumbnail ? <img src={detail.image || detail.thumbnail} alt={title} className="w-full aspect-[3/4] object-cover"/> : <div className="w-full aspect-[3/4] bg-red-900/20 flex items-center justify-center"><IconFilm size={48} className="text-red-700"/></div>}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-full">DONGHUA</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{title}</h1>
              <div className="flex flex-wrap gap-2 mb-5">
                {detail.status && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">{detail.status}</span>}
                {detail.type && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">{detail.type}</span>}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
                {[
                  {label:'Studio', value: detail.studio || detail.studios?.[0]?.name},
                  {label:'Tahun', value: detail.year || detail.tahun},
                  {label:'Durasi', value: detail.duration || detail.durasi},
                  {label:'Status', value: detail.status},
                ].filter(i=>i.value).map(item=>(
                  <div key={item.label}><p className="text-xs text-gray-600 uppercase tracking-wider mb-0.5">{item.label}</p><p className="text-sm text-gray-300">{item.value}</p></div>
                ))}
              </div>
              {detail.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {detail.genres.map((g,i) => <span key={i} className="px-3 py-1 bg-darkCard border border-white/10 text-gray-400 text-xs rounded-lg">{g.name || g}</span>)}
                </div>
              )}
              <LikeButton animeUrl={contentUrl} animeTitle={title} onAuthRequired={() => setShowAuth(true)}/>
              {(detail.description || detail.synopsis || detail.sinopsis) && (
                <div className="mt-5"><p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Sinopsis</p><p className="text-gray-400 text-sm leading-relaxed">{detail.description || detail.synopsis || detail.sinopsis}</p></div>
              )}
            </div>
          </div>

          {detail.episodes?.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4"><div className="w-1 h-6 bg-red-500 rounded-full"/><h2 className="text-lg font-bold text-white">Daftar Episode</h2><span className="text-xs text-gray-500 bg-darkCard px-2 py-0.5 rounded-full border border-white/10">{detail.episodes.length} ep</span></div>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {detail.episodes.map((ep, i) => {
                  const epUrl = ep.url || ep.playback_url || ep.link
                  return <button key={i} onClick={() => epUrl && navigate(`/donghua/video?url=${encodeURIComponent(epUrl)}`)} disabled={!epUrl}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 bg-darkCard border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:border-red-500/50 hover:text-red-300 hover:bg-red-900/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    <IconPlay size={10} className="text-red-500 flex-shrink-0"/>{ep.title || ep.episode || `Ep ${i+1}`}
                  </button>
                })}
              </div>
            </div>
          )}
          <div className="border-t border-white/5 pt-10">
            <CommentsSection animeUrl={contentUrl} animeTitle={title} onAuthRequired={() => setShowAuth(true)}/>
          </div>
        </div>
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)}/>}
    </div>
  )
}
