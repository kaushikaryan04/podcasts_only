import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { podcasts } from '../data/sampleData'
import PodcastCard from '../components/PodcastCard'
import ParticleField from '../components/ParticleField'

export default function PodcastDetail() {
  const { id } = useParams()
  const podcast = podcasts.find(p => p.id === parseInt(id)) || podcasts[0]
  const related = podcasts
    .filter(p => p.id !== podcast.id && p.category === podcast.category)
    .slice(0, 5)
  const moreToExplore = podcasts
    .filter(p => p.id !== podcast.id && p.category !== podcast.category)
    .slice(0, 6)

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', position: 'relative' }}>
      <ParticleField particleCount={30} color="139, 92, 246" />

      {/* ─── HERO BANNER ─── */}
      <section style={{
        height: 440,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: podcast.gradient,
          opacity: 0.25,
          filter: 'blur(80px)',
          transform: 'scale(1.2)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(3,0,20,0.3) 0%, #030014 100%)',
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '60px 40px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 40,
          height: '100%',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              width: 220,
              height: 220,
              borderRadius: 28,
              background: podcast.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 90,
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {podcast.icon}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ paddingBottom: 4 }}
          >
            <span style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#8b5cf6',
              marginBottom: 12,
              padding: '5px 12px',
              borderRadius: 20,
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}>
              {podcast.category}
            </span>
            <h1 style={{
              fontSize: 48,
              fontWeight: 800,
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: 8,
              lineHeight: 1.1,
            }}>
              {podcast.title}
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>
              By {podcast.host}
            </p>
            <p style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.35)',
              maxWidth: 500,
              lineHeight: 1.75,
              marginBottom: 24,
            }}>
              {podcast.description}
            </p>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link to={`/player/${podcast.id}/0`}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139,92,246,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '14px 32px',
                    borderRadius: 50,
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 14,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 12 }}>▶</span> Play Latest
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '14px 24px',
                  borderRadius: 50,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                }}
              >
                + Follow
              </motion.button>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                color: 'rgba(255,255,255,0.35)',
                fontSize: 13,
                marginLeft: 8,
              }}>
                <span>⭐ {podcast.rating}</span>
                <span>{podcast.listeners} listeners</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── EPISODES LIST ─── */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '48px 40px 40px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}>
          <h3 style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            All Episodes
          </h3>
          <span style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.35)',
          }}>
            {podcast.episodes.length} episodes
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {podcast.episodes.map((episode, i) => (
            <Link key={i} to={`/player/${podcast.id}/${i}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                whileHover={{
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(139,92,246,0.25)',
                  x: 6,
                }}
                style={{
                  padding: '20px 24px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: podcast.gradient,
                  opacity: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flexShrink: 0,
                  color: 'white',
                }}>
                  ▶
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  color: 'rgba(255,255,255,0.2)',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Space Grotesk', sans-serif",
                  flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: 15,
                    fontWeight: 600,
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {episode.title}
                  </h4>
                  <p style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.35)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {episode.description}
                  </p>
                </div>

                <div style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.25)',
                  flexShrink: 0,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 500,
                }}>
                  {episode.duration}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── RELATED PODCASTS ─── */}
      {related.length > 0 && (
        <section style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '40px 40px 20px',
          position: 'relative',
          zIndex: 1,
        }}>
          <h3 style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: 24,
          }}>
            More in {podcast.category}
          </h3>
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 20 }} className="hide-scrollbar">
            {related.map((p, i) => (
              <PodcastCard key={p.id} podcast={p} index={i} size="medium" />
            ))}
          </div>
        </section>
      )}

      {/* ─── MORE TO EXPLORE ─── */}
      {moreToExplore.length > 0 && (
        <section style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '20px 40px 80px',
          position: 'relative',
          zIndex: 1,
        }}>
          <h3 style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: 24,
          }}>
            You Might Also Like
          </h3>
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 20 }} className="hide-scrollbar">
            {moreToExplore.map((p, i) => (
              <PodcastCard key={p.id} podcast={p} index={i} size="medium" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
