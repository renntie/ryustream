const BASE_URL = 'https://daunsapi.daunscode.com/api/backend'

async function callAPI(path, body = {}) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, method: 'GET', body })
  })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return response.json()
}

// === ANIME (Animasu) ===
export const getOngoing = (page = 1) => callAPI('/v1/streaming/animasu/ongoing', { page })
export const getLatest = (page = 1) => callAPI('/v1/streaming/animasu/latest', { page })
export const searchAnime = (s, page = 1) => callAPI('/v1/streaming/animasu/search', { s, page })
export const getByGenre = (slug, page = 1) => callAPI(`/v1/streaming/animasu/genres/${slug}`, { genre: slug, page })
export const getDetail = (url) => callAPI('/v1/streaming/animasu/detail', { url })
export const getVideo = (url) => callAPI('/v1/streaming/animasu/video', { url, resolve: true })

// === DONGHUA (Anichin) ===
export const getDonghuaLatest = (page = 1) => callAPI('/v1/streaming/anichin/latest', { page })
export const searchDonghua = (s, page = 1) => callAPI('/v1/streaming/anichin/search', { s, page })
export const getDonghuaByGenre = (genre, page = 1) => callAPI(`/v1/streaming/anichin/genres/${genre}`, { genre, page })
export const getDonghuaSchedule = () => callAPI('/v1/streaming/anichin/schedule', {})
export const getDonghuaDetail = (url) => callAPI('/v1/streaming/anichin/detail', { url })
export const getDonghuaVideo = (url) => callAPI('/v1/streaming/anichin/video', { url })
