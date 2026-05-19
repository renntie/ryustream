import { supabase } from './supabase'

export async function addToHistory(userId, { animeUrl, animeTitle, episodeUrl, episodeTitle, thumbnail, type = 'anime' }) {
  if (!userId) return
  await supabase.from('watch_history').upsert({
    user_id: userId, anime_url: animeUrl, anime_title: animeTitle,
    episode_url: episodeUrl, episode_title: episodeTitle, thumbnail,
    content_type: type, watched_at: new Date().toISOString()
  }, { onConflict: 'user_id,episode_url' })
}

export async function getHistory(userId) {
  if (!userId) return []
  const { data } = await supabase.from('watch_history').select('*')
    .eq('user_id', userId).order('watched_at', { ascending: false }).limit(50)
  return data || []
}

export async function deleteHistory(userId, episodeUrl) {
  await supabase.from('watch_history').delete().eq('user_id', userId).eq('episode_url', episodeUrl)
}

export async function clearAllHistory(userId) {
  await supabase.from('watch_history').delete().eq('user_id', userId)
}
