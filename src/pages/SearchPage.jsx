import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchAnime, getByGenre, searchDonghua, getDonghuaByGenre } from '../api/animeApi'
import AnimeGrid from '../components/AnimeGrid'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import Pagination from '../components/Pagination'
import GenreFilter from '../components/GenreFilter'
import { IconSearch } from '../assets/icons'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
  const [activeGenre, setActiveGenre] = useState('')
  const [contentType, setContentType] = useState('anime')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const doFetch = useCallback(async () => {
    if (!query && !activeGenre) { setData(null); return }
    setLoading(true); setError(null)
    try {
      let result
      if (contentType === 'donghua') {
        result = activeGenre ? await getDonghuaByGenre(activeGenre, page) : await searchDonghua(query, page)
      } else {
        result = activeGenre ? await getByGenre(activeGenre, page) : await searchAnime(query, page)
      }
      setData(result)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [query, activeGenre, page, contentType])

  useEffect(() => { doFetch() }, [doFetch])
  useEffect(() => { const q = searchParams.get('q'); if (q) { setQuery(q); setInputValue(q) } }, []) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    if (inputValue.trim()) { setActiveGenre(''); setPage(1); setQuery(inputValue.trim()); setSearchParams({ q: inputValue.trim() }) }
  }

  const handleGenreChange = (slug) => { setActiveGenre(slug); setQuery(''); setInputValue(''); setPage(1); setSearchParams({}) }
  const handleTypeChange = (type) => { setContentType(type); setActiveGenre(''); setQuery(''); setInputValue(''); setPage(1); setData(null) }

  const animes = data?.results || []
  const hasNext = !!data?.next_page
  const pageTitle = activeGenre ? `Genre: ${activeGenre}` : query ? `Hasil: "${query}"` : 'Cari Konten'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2"><div className="w-1 h-7 bg-purple-500 rounded-full"/><h1 className="text-2xl font-bold text-white capitalize">{pageTitle}</h1></div>
      </div>

      {/* Content Type Toggle */}
      <div className="flex gap-2 mb-6">
        {['anime','donghua'].map(type => (
          <button key={type} onClick={() => handleTypeChange(type)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize ${contentType === type ? 'bg-purple-600 text-white purple-glow' : 'bg-darkCard text-gray-400 border border-white/10 hover:text-white'}`}>
            {type}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="relative mb-6">
        <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"/>
        <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)}
          placeholder={`Cari ${contentType}...`}
          className="w-full bg-darkCard border border-white/10 rounded-xl pl-11 pr-24 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"/>
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors">Cari</button>
      </form>

      <div className="mb-8">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Filter Genre</p>
        <GenreFilter activeGenre={activeGenre} onChange={handleGenreChange} type={contentType}/>
      </div>

      {!query && !activeGenre && (
        <div className="text-center py-20 text-gray-600">
          <IconSearch size={48} className="mx-auto mb-4 opacity-30"/>
          <p className="text-lg">Ketik judul atau pilih genre</p>
        </div>
      )}
      {loading && <LoadingSkeleton count={12}/>}
      {error && <ErrorMessage message={error} onRetry={doFetch}/>}
      {!loading && !error && (query || activeGenre) && (
        <>
          {animes.length > 0 && <p className="text-gray-500 text-sm mb-4">{animes.length} konten ditemukan</p>}
          <AnimeGrid animes={animes} type={contentType}/>
          {animes.length > 0 && <Pagination currentPage={page} hasNext={hasNext} onPageChange={setPage}/>}
        </>
      )}
    </div>
  )
}
