import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import MapPlaceholder from './pages/MapPlaceholder.jsx'
import ReportPlaceholder from './pages/ReportPlaceholder.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/map" element={<MapPlaceholder />} />
          <Route path="/report" element={<ReportPlaceholder />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
