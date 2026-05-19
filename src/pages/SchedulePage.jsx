import { useCallback } from 'react'
import { getDonghuaSchedule } from '../api/animeApi'
import { useAnimeAPI } from '../hooks/useAnimeAPI'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { useNavigate } from 'react-router-dom'

const DAYS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu']

export default function SchedulePage() {
  const navigate = useNavigate()
  const fetchFn = useCallback(() => getDonghuaSchedule(), [])
  const { data, loading, error, refetch } = useAnimeAPI(fetchFn, [])
  const schedule = data?.results || data?.schedule || data || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2"><div className="w-1 h-7 bg-purple-500 rounded-full"/><h1 className="text-2xl font-bold text-white">Jadwal Tayang</h1></div>
        <p className="text-gray-500 text-sm ml-4">Jadwal rilis mingguan donghua</p>
      </div>
      {loading && <LoadingSpinner text="Memuat jadwal..."/>}
      {error && <ErrorMessage message={error} onRetry={refetch}/>}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(schedule).map(([day, items]) => (
            <div key={day} className="bg-darkCard rounded-xl border border-white/5 overflow-hidden">
              <div className="px-4 py-3 bg-purple-900/30 border-b border-white/5">
                <h3 className="font-bold text-white text-sm">{day}</h3>
              </div>
              <div className="p-3 space-y-2">
                {Array.isArray(items) && items.length > 0 ? items.map((item, i) => (
                  <div key={i} onClick={() => item.url && navigate(`/donghua/detail?url=${encodeURIComponent(item.url)}`)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                    {item.thumbnail && <img src={item.thumbnail} alt="" className="w-8 h-10 object-cover rounded flex-shrink-0"/>}
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2">{item.title || item.name}</span>
                  </div>
                )) : <p className="text-gray-600 text-sm text-center py-2">Tidak ada jadwal</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
