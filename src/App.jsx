import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LatestPage from './pages/LatestPage'
import SearchPage from './pages/SearchPage'
import AboutPage from './pages/AboutPage'
import DetailPage from './pages/DetailPage'
import VideoPage from './pages/VideoPage'
import HistoryPage from './pages/HistoryPage'
import DonghuaPage from './pages/DonghuaPage'
import DonghuaDetailPage from './pages/DonghuaDetailPage'
import DonghuaVideoPage from './pages/DonghuaVideoPage'
import SchedulePage from './pages/SchedulePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="min-h-screen bg-dark text-gray-100">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/terbaru" element={<LatestPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/detail" element={<DetailPage />} />
              <Route path="/video" element={<VideoPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/donghua" element={<DonghuaPage />} />
              <Route path="/donghua/detail" element={<DonghuaDetailPage />} />
              <Route path="/donghua/video" element={<DonghuaVideoPage />} />
              <Route path="/jadwal" element={<SchedulePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
