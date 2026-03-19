import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PodcastCard from '../components/PodcastCard'
import { podcasts, categories } from '../data/sampleData'
import ParticleField from '../components/ParticleField'

export default function Home() {
  const featured = podcasts[0]
  const trending = podcasts.slice(0, 8)
  const newReleases = [...podcasts].reverse().slice(0, 8)

  const grouped = {}
  categories.forEach(cat => {
    grouped[cat] = podcasts.filter(p => p.category === cat)
  })

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', position: 'relative' }}>
      <ParticleField particleCount={40} color="99, 102, 241" />

      {/* ─── FEATURED HERO ─── */}
      <section style={{ padding: '40px 40px 0', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to={`/podcast/${featured.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.3 }}
              style={{
                height: 420,
                borderRadius: 28,
                background: featured.gradient,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-end',
                padding: 52,
                cursor: 'pointer',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(3,0,20,0.95) 0%, rgba(3,0,20,0.4) 40%, transparent 70%)',
              }} />

              <motion.span
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  right: 80,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 180,
                  opacity: 0.12,
                  filter: 'blur(2px)',
                }}
              >
                {featured.icon}
              </motion.span>

              <div style={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    display: 'inline-block',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#06b6d4',
                    marginBottom: 16,
                    padding: '6px 14px',
                    borderRadius: 20,
                    background: 'rgba(6,182,212,0.1)',
                    border: '1px solid rgba(6,182,212,0.2)',
                  }}
                >
                  ✦ Featured Podcast
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    fontFamily: "'Space Grotesk', sans-serif",
                    marginBottom: 12,
                    lineHeight: 1.1,
                  }}
                >
                  {featured.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.65)',
                    maxWidth: 480,
                    marginBottom: 28,
                    lineHeight: 1.7,
                  }}
                >
                  {featured.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  style={{ display: 'flex', gap: 12, alignItems: 'center' }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.preventDefault()}
                    style={{
                      padding: '14px 32px',
                      borderRadius: 50,
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 12 }}>▶</span> Listen Now
                  </motion.button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                    <span>⭐ {featured.rating}</span>
                    <span>•</span>
                    <span>{featured.listeners} listeners</span>
                    <span>•</span>
                    <span>{featured.episodeCount} episodes</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* ─── PODCAST ROWS ─── */}
      <PodcastRow
        title="🔥 Trending Now"
        subtitle="Most popular this week"
        items={trending}
      />
      <PodcastRow
        title="✨ New Releases"
        subtitle="Fresh episodes just dropped"
        items={newReleases}
      />
      {Object.entries(grouped).map(([category, pods]) => (
        pods.length > 0 && (
          <PodcastRow
            key={category}
            title={category}
            items={pods}
          />
        )
      ))}

      <div style={{ height: 80 }} />
    </div>
  )
}

function PodcastRow({ title, subtitle, items }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const scroll = (direction) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * 500, behavior: 'smooth' })
    setTimeout(checkScroll, 400)
  }

  return (
    <section style={{ padding: '48px 0 0', position: 'relative', zIndex: 1 }}>
      <div style={{
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <div>
          <h3 style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.35)',
              marginTop: 4,
            }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ScrollBtn direction={-1} disabled={!canScrollLeft} onClick={() => scroll(-1)} />
          <ScrollBtn direction={1} disabled={!canScrollRight} onClick={() => scroll(1)} />
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: 20,
          overflowX: 'auto',
          padding: '0 40px 20px',
        }}
      >
        {items.map((podcast, i) => (
          <PodcastCard key={podcast.id} podcast={podcast} index={i} />
        ))}
      </div>
    </section>
  )
}

function ScrollBtn({ direction, disabled, onClick }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.1, background: 'rgba(255,255,255,0.12)' }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'}`,
        color: disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 16,
        transition: 'all 0.2s',
      }}
    >
      {direction === -1 ? '‹' : '›'}
    </motion.button>
  )
}
