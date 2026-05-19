import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function timeAgo(d) {
  const diff = (Date.now() - new Date(d)) / 1000
  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff/60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff/3600)} jam lalu`
  return `${Math.floor(diff/86400)} hari lalu`
}

export default function CommentsSection({ animeUrl, animeTitle, onAuthRequired }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchComments() }, [animeUrl]) // eslint-disable-line

  const fetchComments = async () => {
    setLoading(true)
    const { data } = await supabase.from('comments').select('*, profiles(username)').eq('anime_url', animeUrl).order('created_at', { ascending: false })
    setComments(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { onAuthRequired(); return }
    if (!content.trim()) return
    setSubmitting(true)
    try {
      const { data, error } = await supabase.from('comments').insert({ anime_url: animeUrl, anime_title: animeTitle, content: content.trim(), user_id: user.id }).select('*, profiles(username)').single()
      if (!error && data) { setComments(prev => [data, ...prev]); setContent('') }
    } finally { setSubmitting(false) }
  }

  const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-purple-500 rounded-full"/>
        <h2 className="text-lg font-bold text-white">Komentar</h2>
        <span className="text-xs text-gray-500 bg-darkCard px-2 py-0.5 rounded-full border border-white/10">{comments.length}</span>
      </div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-700/50 flex items-center justify-center flex-shrink-0 border border-purple-600/30">
            <span className="text-white text-xs font-bold uppercase">{user ? username[0] : '?'}</span>
          </div>
          <div className="flex-1">
            <textarea value={content} onChange={e => setContent(e.target.value)} onClick={() => { if (!user) onAuthRequired() }}
              placeholder={user ? 'Tulis komentar...' : 'Login untuk berkomentar...'} readOnly={!user} rows={3}
              className="w-full bg-darkCard border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"/>
            {user && content.trim() && (
              <div className="flex justify-end mt-2">
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors">
                  {submitting ? 'Mengirim...' : 'Kirim'}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="flex gap-3"><div className="w-8 h-8 rounded-full shimmer-bg flex-shrink-0"/><div className="flex-1 space-y-2"><div className="h-3 shimmer-bg rounded w-32"/><div className="h-3 shimmer-bg rounded w-full"/></div></div>)}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 opacity-50"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p className="text-sm">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map(comment => {
            const cUsername = comment.profiles?.username || 'User'
            const isOwn = user?.id === comment.user_id
            return (
              <div key={comment.id} className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-purple-700/50 flex items-center justify-center flex-shrink-0 border border-purple-600/30">
                  <span className="text-white text-xs font-bold uppercase">{cUsername[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{cUsername}</span>
                    <span className="text-xs text-gray-600">{timeAgo(comment.created_at)}</span>
                    {isOwn && <button onClick={() => { supabase.from('comments').delete().eq('id', comment.id); setComments(p => p.filter(c => c.id !== comment.id)) }} className="ml-auto text-gray-600 hover:text-red-400 transition-colors text-xs">Hapus</button>}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed break-words">{comment.content}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
