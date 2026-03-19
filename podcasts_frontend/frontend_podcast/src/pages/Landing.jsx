import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import ParticleField from '../components/ParticleField'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

const features = [
  {
    icon: '⚡',
    title: 'Launch in Seconds',
    desc: 'Go from idea to live podcast in under 60 seconds. No complex setup, no expensive equipment, no technical skills needed.',
    color: '#8b5cf6',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Studio',
    desc: 'Automatic transcriptions, smart chapter detection, AI-generated show notes, and intelligent content suggestions.',
    color: '#06b6d4',
  },
  {
    icon: '🎵',
    title: 'Studio Quality Audio',
    desc: 'Professional-grade noise cancellation, real-time audio enhancement, and broadcast-quality mastering — all automatic.',
    color: '#ec4899',
  },
  {
    icon: '🌍',
    title: 'Global Distribution',
    desc: 'One-click publishing to Spotify, Apple Podcasts, YouTube, Amazon Music, and 50+ platforms worldwide.',
    color: '#f59e0b',
  },
  {
    icon: '📊',
    title: 'Deep Analytics',
    desc: 'Real-time listener analytics, geographic demographics, engagement heatmaps, and predictive growth insights.',
    color: '#10b981',
  },
  {
    icon: '💰',
    title: 'Built-in Monetization',
    desc: 'Integrated sponsorship marketplace, premium subscriber tiers, listener tips, and automated ad placement.',
    color: '#f43f5e',
  },
]

const stats = [
  { number: '10M+', label: 'Active Listeners' },
  { number: '50K+', label: 'Creators' },
  { number: '120+', label: 'Countries' },
  { number: '99.9%', label: 'Uptime' },
]

const steps = [
  {
    step: '01',
    title: 'Record',
    desc: 'Hit record and start talking. Our AI handles noise cancellation, audio leveling, and enhancement in real-time. No studio needed — just your voice and a story worth telling.',
    color: '#8b5cf6',
    emoji: '🎙️',
  },
  {
    step: '02',
    title: 'Enhance',
    desc: 'AI automatically generates transcripts, show notes, chapters, and even suggests clip-worthy moments for social media. Your content, supercharged.',
    color: '#06b6d4',
    emoji: '✨',
  },
  {
    step: '03',
    title: 'Publish',
    desc: 'One click distributes your podcast everywhere — Spotify, Apple, YouTube, and 50+ platforms. Reach millions instantly with zero extra effort.',
    color: '#ec4899',
    emoji: '🚀',
  },
]

export default function Landing() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.92])
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -80])

  return (
    <div style={{ position: 'relative' }}>
      <ParticleField />

      {/* ─── HERO ─── */}
      <motion.section
        ref={heroRef}
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          opacity: heroOpacity,
          scale: heroScale,
          y: heroY,
        }}
      >
        <div style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 20px' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 50,
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', letterSpacing: '0.05em' }}>
              The Future of Podcasting
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontSize: 'clamp(64px, 13vw, 160px)',
              fontWeight: 900,
              fontFamily: "'Space Grotesk', sans-serif",
              background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 40%, #06b6d4 70%, #ec4899 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 8s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: 28,
            }}
          >
            Yapster
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 580,
              margin: '0 auto 44px',
              lineHeight: 1.65,
              fontWeight: 300,
            }}
          >
            Create, share, and discover incredible podcasts with the power of AI. Your voice deserves to be heard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/home">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139,92,246,0.5)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '16px 40px',
                  borderRadius: 50,
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 16,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(139,92,246,0.3)',
                }}
              >
                Start Listening
              </motion.button>
            </Link>
            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '16px 40px',
                  borderRadius: 50,
                  background: 'rgba(255,255,255,0.04)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 16,
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Start Yapping ?
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,0.25)',
            fontSize: 12,
            letterSpacing: '0.05em',
          }}
        >
          <span>Scroll to explore</span>
          <div style={{
            width: 24,
            height: 38,
            borderRadius: 12,
            border: '1.5px solid rgba(255,255,255,0.15)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 8,
          }}>
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.4)',
              }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* ─── FEATURES ─── */}
      <section style={{
        padding: '140px 40px',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <motion.p variants={fadeUp} style={{
            color: '#06b6d4',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Why Yapster
          </motion.p>
          <motion.h2 variants={fadeUp} style={{
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: 16,
            lineHeight: 1.1,
          }}>
            Everything you need.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Nothing you don't.
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} style={{
            fontSize: 17,
            color: 'rgba(255,255,255,0.4)',
            maxWidth: 500,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Built for creators who demand the best. Every tool you need, seamlessly integrated.
          </motion.p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{
                y: -8,
                borderColor: `${feature.color}40`,
                boxShadow: `0 20px 60px ${feature.color}10`,
              }}
              style={{
                padding: 36,
                borderRadius: 24,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
                cursor: 'default',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${feature.color}08, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: `${feature.color}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                marginBottom: 20,
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 12,
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.75,
              }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{
        padding: '80px 40px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                textAlign: 'center',
                padding: '32px 20px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{
                fontSize: 'clamp(36px, 4.5vw, 56px)',
                fontWeight: 900,
                fontFamily: "'Space Grotesk', sans-serif",
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 8,
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.45)',
                fontWeight: 500,
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{
        padding: '120px 40px',
        maxWidth: 1000,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <motion.p variants={fadeUp} style={{
            color: '#ec4899',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            How It Works
          </motion.p>
          <motion.h2 variants={fadeUp} style={{
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            Three steps to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ec4899, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              greatness
            </span>
          </motion.h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 60,
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: 72,
                  fontWeight: 900,
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: item.color,
                  opacity: 0.2,
                  display: 'block',
                  lineHeight: 1,
                  marginBottom: -8,
                }}>
                  {item.step}
                </span>
                <h3 style={{
                  fontSize: 36,
                  fontWeight: 700,
                  marginBottom: 16,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.85,
                }}>
                  {item.desc}
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                style={{
                  flex: 1,
                  height: 320,
                  borderRadius: 28,
                  background: `linear-gradient(135deg, ${item.color}12, ${item.color}04)`,
                  border: `1px solid ${item.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 100,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${item.color}15, transparent 70%)`,
                  filter: 'blur(20px)',
                }} />
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: i * 0.3 }}
                >
                  {item.emoji}
                </motion.span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS MARQUEE ─── */}
      <section style={{
        padding: '80px 0',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          gap: 20,
          animation: 'marquee 30s linear infinite',
          width: 'max-content',
        }}>
          {[...Array(2)].flatMap((_, setIdx) => [
            { quote: '"Yapster made me go from zero to 10K listeners in a month."', author: 'Sarah K.', role: 'Tech Podcaster' },
            { quote: '"The AI transcription alone saves me 5 hours per episode."', author: 'James R.', role: 'True Crime Creator' },
            { quote: '"Best audio quality from a browser-based tool. Period."', author: 'DJ Luna', role: 'Music Producer' },
            { quote: '"I launched my first episode in literally 3 minutes."', author: 'Priya M.', role: 'Wellness Coach' },
            { quote: '"The analytics dashboard is on another level."', author: 'Alex T.', role: 'Business Podcaster' },
            { quote: '"Distribution to 50+ platforms with one click? Game changer."', author: 'Mia R.', role: 'Comedy Host' },
          ].map((t, i) => (
            <div
              key={`${setIdx}-${i}`}
              style={{
                minWidth: 320,
                padding: 28,
                borderRadius: 20,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <p style={{
                fontSize: 15,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
                marginBottom: 16,
                fontStyle: 'italic',
              }}>
                {t.quote}
              </p>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{t.author}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{t.role}</p>
              </div>
            </div>
          )))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{
        padding: '120px 40px 180px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{
            fontSize: 'clamp(40px, 6vw, 76px)',
            fontWeight: 900,
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: 24,
            lineHeight: 1.05,
          }}>
            Ready to start your
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              podcast journey?
            </span>
          </h2>
          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.45)',
            marginBottom: 44,
            maxWidth: 480,
            margin: '0 auto 44px',
            lineHeight: 1.7,
          }}>
            Join 50,000+ creators who chose the future of podcasting. Free to start, no credit card required.
          </p>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(139,92,246,0.5)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '20px 52px',
                borderRadius: 50,
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #06b6d4)',
                color: 'white',
                fontWeight: 700,
                fontSize: 18,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(139,92,246,0.3)',
                letterSpacing: '0.01em',
              }}
            >
              Get Started — It's Free
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
