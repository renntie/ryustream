export default function LoadingSpinner({ text = 'Memuat...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-purple-900"/>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin"/>
      </div>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  )
}
