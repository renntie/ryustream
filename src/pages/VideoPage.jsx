import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getVideo } from '../api/animeApi'
import { useAnimeAPI } from '../hooks/useAnimeAPI'
import { useAuth } from '../context/AuthContext'
import { addToHistory } from '../lib/history'
import BackButton from '../components/BackButton'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { IconChevronLeft, IconChevronRight } from '../assets/icons'

export default function VideoPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const episodeUrl = searchParams.get('url')

  const fetchFn = useCallback(() => {
    if (!episodeUrl) throw new Error('URL episode tidak ditemukan')
    return getVideo(episodeUrl)
  }, [episodeUrl])

  const { data, loading, error, refetch } = useAnimeAPI(fetchFn, [episodeUrl])
  const results = data?.results || null
  const allServers = results?.streaming_links || []
  const defaultServer = allServers.find(s => s.direct_url) || allServers[0] || null
  const [activeServer, setActiveServer] = useState(null)

  useEffect(() => { if (defaultServer) setActiveServer(defaultServer) }, [data]) // eslint-disable-line

  useEffect(() => {
    if (!results || !user) return
    const rawTitle = results.title || ''
    const cleanTitle = rawTitle.replace(/^(Nonton\s+|Streaming\s+)/gi,'').replace(/\s+Sub\s+Indo.*$/i,'').trim()
    addToHistory(user.id, { animeUrl: results.all_episode_url || episodeUrl, animeTitle: cleanTitle.replace(/\s+Episode\s+\d+$/i,'').trim(), episodeUrl, episodeTitle: cleanTitle, thumbnail: results.thumbnail, type: 'anime' })
  }, [results, user]) // eslint-disable-line

  const mode = activeServer?.playback_mode || 'embed'
  const directUrl = activeServer?.direct_url || results?.preferred_stream_url || null
  const embedUrl = activeServer?.embed_url || null
  const isHLS = directUrl?.includes('.m3u8')

  useEffect(() => {
    if (mode !== 'direct' || !directUrl || !videoRef.current) return
    const video = videoRef.current
    if (isHLS) {
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          if (hlsRef.current) hlsRef.current.destroy()
          const hls = new Hls()
          hlsRef.current = hls
          hls.loadSource(directUrl)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}))
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) { video.src = directUrl }
      })
    } else { video.src = directUrl; video.load() }
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null } }
  }, [directUrl, mode, isHLS])

  const title = (results?.title || '').replace(/^(Nonton\s+|Streaming\s+)/gi,'').replace(/\s+Sub\s+Indo.*$/i,'').trim()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <BackButton label="Kembali ke Detail"/>
        {title && <h1 className="text-sm font-semibold text-gray-300 text-right truncate max-w-xs hidden sm:block">{title}</h1>}
      </div>
      {loading && <LoadingSpinner text="Memuat video..."/>}
      {error && <ErrorMessage message={error} onRetry={refetch}/>}
      {!loading && !error && results && (
        <div className="animate-fade-in space-y-4">
          <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10 aspect-video">
            {mode === 'direct' && directUrl ? (
              <video ref={videoRef} controls playsInline controlsList="nodownload" className="w-full h-full" key={directUrl}>
                {!isHLS && <source src={directUrl} type="video/mp4"/>}
              </video>
            ) : embedUrl ? (
              <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allowFullScreen allow="autoplay; fullscreen" key={embedUrl}/>
            ) : <div className="w-full h-full flex items-center justify-center text-gray-600"><p>Sumber video tidak tersedia</p></div>}
          </div>
          {allServers.length > 0 && (
            <div className="bg-darkCard rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Pilih Server</p>
              <div className="flex flex-wrap gap-2">
                {allServers.map((server, i) => (
                  <button key={i} onClick={() => setActiveServer(server)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${activeServer?.index === server.index ? 'bg-purple-700 border-purple-500 text-white' : 'bg-darkCard border-white/10 text-gray-400 hover:border-purple-600/50 hover:text-white'}`}>
                    {server.playback_mode === 'direct' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"/>}
                    {server.server || server.provider || `Server ${i+1}`}{server.label && ` · ${server.label}`}
                  </button>
                ))}
              </div>
            </div>
          )}
          {(results?.previous_episode_url || results?.next_episode_url) && (
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => results.previous_episode_url && navigate(`/video?url=${encodeURIComponent(results.previous_episode_url)}`)} disabled={!results.previous_episode_url}
                className="flex items-center gap-2 px-4 py-2.5 bg-darkCard border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:border-purple-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <IconChevronLeft size={16}/>Episode Sebelumnya
              </button>
              <button onClick={() => results.next_episode_url && navigate(`/video?url=${encodeURIComponent(results.next_episode_url)}`)} disabled={!results.next_episode_url}
                className="flex items-center gap-2 px-4 py-2.5 bg-darkCard border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:border-purple-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                Episode Selanjutnya<IconChevronRight size={16}/>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
