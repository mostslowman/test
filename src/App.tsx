import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ConfigPage from '@/pages/ConfigPage'
import EnvelopePage from '@/pages/EnvelopePage'
import LetterPage from '@/pages/LetterPage'
import GalleryPage from '@/pages/GalleryPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConfigPage onPreview={() => window.location.href = '/envelope'} />} />
        <Route path="/envelope" element={<EnvelopePage />} />
        <Route path="/letter" element={<LetterPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </Router>
  )
}
