import { useNavigate } from 'react-router-dom'
import { IconBack } from '../assets/icons'
export default function BackButton({ label = 'Kembali' }) {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-darkCard border border-white/10 flex items-center justify-center group-hover:border-purple-600/50 group-hover:bg-purple-900/20 transition-all">
        <IconBack size={16}/>
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
