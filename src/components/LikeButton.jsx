import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function LikeButton({ animeUrl, animeTitle, onAuthRequired }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchLikes() }, [animeUrl, user]) // eslint-disable-line

  const fetchLikes = async () => {
    const { count: total } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('anime_url', animeUrl)
    setCount(total || 0)
    if (user) {
      const { data } = await supabase.from('likes').select('id').eq('anime_url', animeUrl).eq('user_id', user.id).single()
      setLiked(!!data)
    }
  }

  const toggleLike = async () => {
    if (!user) { onAuthRequired(); return }
    setLoading(true)
    try {
      if (liked) {
        await supabase.from('likes').delete().eq('anime_url', animeUrl).eq('user_id', user.id)
        setLiked(false); setCount(c => c - 1)
      } else {
        await supabase.from('likes').insert({ anime_url: animeUrl, anime_title: animeTitle, user_id: user.id })
        setLiked(true); setCount(c => c + 1)
      }
    } finally { setLoading(false) }
  }

  return (
    <button onClick={toggleLike} disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${liked ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30' : 'bg-darkCard border-white/10 text-gray-400 hover:border-red-500/50 hover:text-red-400'}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <span>{count > 0 ? count : ''} {liked ? 'Disukai' : 'Suka'}</span>
    </button>
  )
}
