import { IconChevronLeft, IconChevronRight } from '../assets/icons'
export default function Pagination({ currentPage, hasNext, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}
        className="flex items-center gap-2 px-4 py-2 bg-darkCard border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-purple-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        <IconChevronLeft size={16}/>Sebelumnya
      </button>
      <span className="w-9 h-9 rounded-lg text-sm font-bold text-white bg-purple-700 border border-purple-500 flex items-center justify-center">{currentPage}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext}
        className="flex items-center gap-2 px-4 py-2 bg-darkCard border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-purple-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        Selanjutnya<IconChevronRight size={16}/>
      </button>
    </div>
  )
}
