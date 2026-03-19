import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Home from './pages/Home'
import PodcastDetail from './pages/PodcastDetail'
import Player from './pages/Player'
import CreatePodcast from './pages/CreatePodcast'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  const isPlayer = location.pathname.startsWith('/player')

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/podcast/:id" element={<PodcastDetail />} />
            <Route path="/player/:podcastId/:episodeIndex" element={<Player />} />
            <Route path="/create" element={<CreatePodcast />} />
          </Routes>
          {!isPlayer && <Footer />}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
