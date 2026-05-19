import { useState, useCallback } from 'react'
import { getDonghuaLatest } from '../api/animeApi'
import { useAnimeAPI } from '../hooks/useAnimeAPI'
import AnimeGrid from '../components/AnimeGrid'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import Pagination from '../components/Pagination'

export default function DonghuaPage() {
  const [page, setPage] = useState(1)
  const fetchFn = useCallback(() => getDonghuaLatest(page), [page])
  const { data, loading, error, refetch } = useAnimeAPI(fetchFn, [page])
  const animes = data?.results || data?.data || []
  const hasNext = !!data?.next_page

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-7 bg-red-500 rounded-full"/>
          <h1 className="text-2xl font-bold text-white">Donghua Terbaru</h1>
          <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-full">DH</span>
        </div>
        <p className="text-gray-500 text-sm ml-4">Serial donghua China terbaru subtitle Indonesia</p>
      </div>
      {loading && <LoadingSkeleton count={12}/>}
      {error && <ErrorMessage message={error} onRetry={refetch}/>}
      {!loading && !error && (<><AnimeGrid animes={animes} type="donghua"/>{animes.length > 0 && <Pagination currentPage={page} hasNext={hasNext} onPageChange={setPage}/>}</>)}
    </div>
  )
}
