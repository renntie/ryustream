import AnimeCard from './AnimeCard'

export default function AnimeGrid({ animes, type = 'anime' }) {
  if (!animes || animes.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 text-gray-700">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
        </svg>
        <p>Tidak ada konten ditemukan</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
      {animes.map((anime, i) => <AnimeCard key={anime?.url || i} anime={anime} type={type}/>)}
    </div>
  )
}
