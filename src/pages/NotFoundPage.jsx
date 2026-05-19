import { useNavigate } from 'react-router-dom'
export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-fade-in">
      <p className="text-[8rem] font-black leading-none text-gradient select-none">404</p>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-500 text-sm max-w-sm">Sepertinya konten yang kamu cari telah pergi ke isekai lain.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-darkCard border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:border-purple-600/50 hover:text-white transition-all">Kembali</button>
        <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium rounded-xl transition-colors purple-glow">Ke Beranda</button>
      </div>
    </div>
  )
}
