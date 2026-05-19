const ANIME_GENRES = [
  { label: 'Semua', slug: '' }, { label: 'Aksi', slug: 'aksi' }, { label: 'Komedi', slug: 'komedi' },
  { label: 'Romantis', slug: 'romantis' }, { label: 'Fantasi', slug: 'fantasi' },
  { label: 'Horror', slug: 'horror' }, { label: 'Slice of Life', slug: 'slice-of-life' }, { label: 'Sport', slug: 'sport' },
]
const DONGHUA_GENRES = [
  { label: 'Semua', slug: '' }, { label: 'Action', slug: 'action' }, { label: 'Fantasy', slug: 'fantasy' },
  { label: 'Romance', slug: 'romance' }, { label: 'Comedy', slug: 'comedy' },
  { label: 'Adventure', slug: 'adventure' }, { label: 'Martial Arts', slug: 'martial-arts' },
]

export default function GenreFilter({ activeGenre, onChange, type = 'anime' }) {
  const genres = type === 'donghua' ? DONGHUA_GENRES : ANIME_GENRES
  return (
    <div className="flex gap-2 flex-wrap">
      {genres.map(genre => (
        <button key={genre.slug} onClick={() => onChange(genre.slug)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeGenre === genre.slug ? 'bg-purple-600 text-white purple-glow' : 'bg-darkCard text-gray-400 border border-white/10 hover:border-purple-600/50 hover:text-white'}`}>
          {genre.label}
        </button>
      ))}
    </div>
  )
}
