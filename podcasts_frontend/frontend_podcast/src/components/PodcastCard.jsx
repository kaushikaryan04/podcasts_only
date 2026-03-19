import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function PodcastCard({ podcast, index = 0, size = 'medium' }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), { stiffness: 300, damping: 30 })
  const brightness = useTransform(mouseY, [0, 0.5, 1], [1.1, 1, 1.1])

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
    setHovered(false)
  }

  const dims = {
    small: { w: 180, h: 260 },
    medium: { w: 220, h: 310 },
    large: { w: 280, h: 380 },
    featured: { w: 320, h: 420 },
  }

  const { w, h } = dims[size] || dims.medium

  return (
    <Link to={`/podcast/${podcast.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
        style={{
          width: w,
          minWidth: w,
          height: h,
          perspective: 1000,
          cursor: 'pointer',
        }}
      >
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 20,
            overflow: 'hidden',
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            filter: hovered ? `brightness(${brightness.get()})` : 'none',
          }}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.25 }}
        >
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                inset: -1,
                borderRadius: 20,
                border: '1px solid rgba(139,92,246,0.3)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />
          )}

          <div style={{
            width: '100%',
            height: '68%',
            background: podcast.gradient,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <motion.span
              animate={hovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: w > 250 ? 64 : 48,
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
                zIndex: 2,
              }}
            >
              {podcast.icon}
            </motion.span>

            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)',
            }} />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: '#ffffff',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                ▶
              </motion.div>
            </motion.div>

            {podcast.rating && (
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                padding: '4px 10px',
                borderRadius: 20,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(10px)',
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                zIndex: 4,
              }}>
                <span style={{ color: '#fbbf24' }}>★</span>
                {podcast.rating}
              </div>
            )}
          </div>

          <div style={{
            padding: '14px 16px',
            height: '32%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
          }}>
            <h4 style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 5,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {podcast.title}
            </h4>
            <p style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.45)',
              marginBottom: 8,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {podcast.host}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 10,
                padding: '3px 8px',
                borderRadius: 20,
                background: 'rgba(139,92,246,0.12)',
                color: '#a78bfa',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}>
                {podcast.category}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                {podcast.episodeCount} eps
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  )
}
