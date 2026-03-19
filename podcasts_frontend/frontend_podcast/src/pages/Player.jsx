import { useParams, Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { podcasts } from '../data/sampleData'

export default function Player() {
  const { podcastId, episodeIndex } = useParams()
  const podcast = podcasts.find(p => p.id === parseInt(podcastId)) || podcasts[0]
  const epIdx = parseInt(episodeIndex) || 0
  const episode = podcast.episodes[epIdx] || podcast.episodes[0]

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [volume, setVolume] = useState(80)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()

    const bars = 80
    const barValues = new Array(bars).fill(0).map(() => Math.random() * 0.3 + 0.05)

    function animate() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const barWidth = (w / bars) - 2

      for (let i = 0; i < bars; i++) {
        if (isPlaying) {
          const target = Math.abs(Math.sin(Date.now() * 0.003 + i * 0.2)) * 0.6 +
                         Math.random() * 0.25 +
                         Math.sin(Date.now() * 0.001 + i * 0.5) * 0.15
          barValues[i] += (target - barValues[i]) * 0.15
        } else {
          barValues[i] *= 0.97
          barValues[i] = Math.max(0.03, barValues[i])
        }

        const barHeight = barValues[i] * h * 0.85
        const x = i * (barWidth + 2)
        const y = (h - barHeight) / 2

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.9)')
        gradient.addColorStop(0.4, 'rgba(99, 102, 241, 0.8)')
        gradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.7)')
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0.6)')

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, barHeight)

        ctx.fillStyle = gradient
        ctx.globalAlpha = 0.15
        ctx.fillRect(x, y + barHeight + 4, barWidth, barHeight * 0.3)
        ctx.globalAlpha = 1
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    window.addEventListener('resize', resize)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setIsPlaying(false); return 0 }
        const newP = p + 0.05
        const totalSeconds = Math.floor((newP / 100) * 3600)
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        setCurrentTime(`${mins}:${secs.toString().padStart(2, '0')}`)
        return newP
      })
    }, 100)
    return () => clearInterval(interval)
  }, [isPlaying])

  const goToEpisode = (idx) => {
    if (idx >= 0 && idx < podcast.episodes.length) {
      setProgress(0)
      setCurrentTime('0:00')
      setIsPlaying(false)
      window.location.href = `/player/${podcast.id}/${idx}`
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '100px 40px 60px',
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: podcast.gradient,
        opacity: 0.06,
        filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, #030014 70%)',
        pointerEvents: 'none',
      }} />

      {/* Back button */}
      <Link to={`/podcast/${podcast.id}`} style={{ position: 'fixed', top: 90, left: 40, zIndex: 10 }}>
        <motion.button
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 50,
            padding: '10px 20px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 14,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Back
        </motion.button>
      </Link>

      {/* Album art */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        whileHover={{ scale: 1.03 }}
        style={{
          width: 260,
          height: 260,
          borderRadius: 32,
          background: podcast.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 100,
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${podcast.glowColor || 'rgba(139,92,246,0.2)'}`,
          marginBottom: 44,
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <motion.span
          animate={isPlaying ? { scale: [1, 1.08, 1], rotate: [0, 3, 0] } : {}}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          {podcast.icon}
        </motion.span>

        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: 36,
              border: '2px solid rgba(139,92,246,0.15)',
              animation: 'pulseRing 2s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </motion.div>

      {/* Track info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ textAlign: 'center', marginBottom: 36, position: 'relative', zIndex: 1 }}
      >
        <h2 style={{
          fontSize: 26,
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
          marginBottom: 8,
        }}>
          {episode.title}
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>
          {podcast.title} · {podcast.host}
        </p>
      </motion.div>

      {/* Visualizer */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: 600,
          height: 130,
          marginBottom: 36,
          position: 'relative',
          zIndex: 1,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        maxWidth: 600,
        marginBottom: 32,
        position: 'relative',
        zIndex: 1,
      }}>
        <div
          style={{
            width: '100%',
            height: 5,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.08)',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const newProgress = ((e.clientX - rect.left) / rect.width) * 100
            setProgress(newProgress)
            const totalSeconds = Math.floor((newProgress / 100) * 3600)
            setCurrentTime(`${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, '0')}`)
          }}
        >
          <motion.div
            style={{
              height: '100%',
              borderRadius: 3,
              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
              width: `${progress}%`,
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#ffffff',
              transform: 'translate(50%, -50%)',
              boxShadow: '0 0 12px rgba(139,92,246,0.5)',
              border: '2px solid #8b5cf6',
            }} />
          </motion.div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Grotesk', sans-serif" }}>
            {currentTime}
          </span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Grotesk', sans-serif" }}>
            {episode.duration}
          </span>
        </div>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          position: 'relative',
          zIndex: 1,
          marginBottom: 32,
        }}
      >
        <ControlButton onClick={() => goToEpisode(epIdx - 1)} disabled={epIdx <= 0}>
          ⏮
        </ControlButton>
        <motion.button
          whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(139,92,246,0.5)' }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            border: 'none',
            color: 'white',
            fontSize: 22,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(139,92,246,0.3)',
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </motion.button>
        <ControlButton onClick={() => goToEpisode(epIdx + 1)} disabled={epIdx >= podcast.episodes.length - 1}>
          ⏭
        </ControlButton>
      </motion.div>

      {/* Volume */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 240,
      }}>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>🔈</span>
        <div
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.08)',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100))
          }}
        >
          <div style={{
            height: '100%',
            borderRadius: 2,
            background: 'rgba(255,255,255,0.3)',
            width: `${volume}%`,
          }} />
        </div>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>🔊</span>
      </div>

      {/* Episode list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          width: '100%',
          maxWidth: 600,
          marginTop: 48,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h4 style={{
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 16,
          color: 'rgba(255,255,255,0.6)',
        }}>
          Up Next
        </h4>
        {podcast.episodes.map((ep, i) => (
          <motion.div
            key={i}
            whileHover={{ background: 'rgba(255,255,255,0.04)', x: 4 }}
            onClick={() => goToEpisode(i)}
            style={{
              padding: '14px 16px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              background: i === epIdx ? 'rgba(139,92,246,0.08)' : 'transparent',
              borderLeft: i === epIdx ? '3px solid #8b5cf6' : '3px solid transparent',
              transition: 'all 0.2s',
              marginBottom: 4,
            }}
          >
            <span style={{
              fontSize: 12,
              color: i === epIdx ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
              fontWeight: 600,
              width: 20,
              textAlign: 'center',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {i === epIdx && isPlaying ? '♫' : String(i + 1).padStart(2, '0')}
            </span>
            <span style={{
              flex: 1,
              fontSize: 14,
              fontWeight: i === epIdx ? 600 : 400,
              color: i === epIdx ? '#ffffff' : 'rgba(255,255,255,0.5)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {ep.title}
            </span>
            <span style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.2)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {ep.duration}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function ControlButton({ children, onClick, disabled }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.1, background: 'rgba(255,255,255,0.08)' }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.65)',
        fontSize: 16,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </motion.button>
  )
}
