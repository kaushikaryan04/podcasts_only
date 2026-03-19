import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 40px',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(3, 0, 20, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-bottom 0.3s ease',
      }}
    >
      <Link to="/">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            fontSize: 24,
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            cursor: 'pointer',
          }}
        >
          Yapster
        </motion.div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <NavLink to="/home" active={location.pathname === '/home'}>
          {isLanding ? 'Explore' : 'Browse'}
        </NavLink>
        <NavLink to="/create" active={location.pathname === '/create'}>
          {isLanding ? 'Start Yapping ?' : 'Create'}
        </NavLink>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '10px 24px',
            borderRadius: 50,
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            color: 'white',
            fontWeight: 600,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(139,92,246,0.2)',
          }}
        >
          Sign In
        </motion.button>
      </div>
    </motion.nav>
  )
}

function NavLink({ to, children, active }) {
  return (
    <Link to={to}>
      <motion.span
        whileHover={{ color: '#ffffff' }}
        style={{
          color: active ? '#ffffff' : 'rgba(255,255,255,0.6)',
          fontSize: 14,
          fontWeight: 500,
          position: 'relative',
          cursor: 'pointer',
          transition: 'color 0.2s',
          padding: '4px 0',
        }}
      >
        {children}
        {active && (
          <motion.div
            layoutId="navIndicator"
            style={{
              position: 'absolute',
              bottom: -4,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
              borderRadius: 1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </motion.span>
    </Link>
  )
}
