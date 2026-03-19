import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleField from '../components/ParticleField'

const stepNames = ['Setup', 'Record', 'Enhance', 'Publish']
const categoryOptions = ['Science & Tech', 'True Crime', 'Comedy', 'Business', 'Health & Wellness', 'Music', 'Education', 'Society & Culture']

const inputStyle = {
  width: '100%',
  padding: '16px 20px',
  borderRadius: 16,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'white',
  fontSize: 16,
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.3s, box-shadow 0.3s',
}

export default function CreatePodcast() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [category, setCategory] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingDone, setRecordingDone] = useState(false)
  const timerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRecording])

  useEffect(() => {
    if (step !== 1) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    function resize() {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()

    const points = new Array(120).fill(0)

    function animate() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      for (let i = points.length - 1; i > 0; i--) {
        points[i] = points[i - 1] * 0.98
      }
      points[0] = isRecording
        ? Math.sin(Date.now() * 0.004) * 0.3 + Math.random() * 0.7
        : points[0] * 0.95

      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      for (let i = 0; i < points.length; i++) {
        const x = (i / points.length) * w
        const amp = points[i] * h * 0.35
        ctx.lineTo(x, h / 2 + Math.sin(i * 0.08 + Date.now() * 0.002) * amp)
      }
      ctx.strokeStyle = isRecording ? '#8b5cf6' : 'rgba(139,92,246,0.2)'
      ctx.lineWidth = 2.5
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      for (let i = 0; i < points.length; i++) {
        const x = (i / points.length) * w
        const amp = points[i] * h * 0.35
        ctx.lineTo(x, h / 2 - Math.sin(i * 0.08 + Date.now() * 0.002) * amp)
      }
      ctx.strokeStyle = isRecording ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.1)'
      ctx.lineWidth = 2
      ctx.stroke()

      animId = requestAnimationFrame(animate)
    }
    animate()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [step, isRecording])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const next = () => setStep(s => Math.min(s + 1, 3))
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const handleFocus = (e) => {
    e.target.style.borderColor = 'rgba(139,92,246,0.4)'
    e.target.style.boxShadow = '0 0 20px rgba(139,92,246,0.1)'
  }
  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', position: 'relative' }}>
      <ParticleField particleCount={30} color="236, 72, 153" />

      <div style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '60px 40px 120px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h1 style={{
            fontSize: 48,
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: 12,
          }}>
            Create Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Podcast
            </span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)' }}>
            From idea to published in minutes
          </p>
        </motion.div>

        {/* Step progress */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 56,
        }}>
          {stepNames.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                animate={{
                  background: i <= step
                    ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)'
                    : 'rgba(255,255,255,0.04)',
                  scale: i === step ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  border: i <= step ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onClick={() => setStep(i)}
              >
                {i < step ? '✓' : i + 1}
              </motion.div>
              <span style={{
                fontSize: 13,
                color: i === step ? '#ffffff' : 'rgba(255,255,255,0.35)',
                marginLeft: 8,
                fontWeight: i === step ? 600 : 400,
              }}>
                {s}
              </span>
              {i < stepNames.length - 1 && (
                <div style={{
                  width: 48,
                  height: 2,
                  background: i < step
                    ? 'linear-gradient(90deg, #8b5cf6, #06b6d4)'
                    : 'rgba(255,255,255,0.06)',
                  margin: '0 14px',
                  borderRadius: 1,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepContainer key="setup">
              <div style={{ marginBottom: 24 }}>
                <Label>Podcast Name</Label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Give your podcast a name..."
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Label>Description</Label>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="What's your podcast about?"
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div style={{ marginBottom: 32 }}>
                <Label>Category</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {categoryOptions.map(cat => (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 50,
                        background: category === cat
                          ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${category === cat ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                        color: category === cat ? 'white' : 'rgba(255,255,255,0.55)',
                        fontSize: 13,
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                      }}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </div>

              <ActionButton onClick={next}>Next: Record →</ActionButton>
            </StepContainer>
          )}

          {step === 1 && (
            <StepContainer key="record">
              <div style={{
                width: '100%',
                height: 200,
                borderRadius: 24,
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: 36,
                overflow: 'hidden',
              }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
              </div>

              <div style={{
                fontSize: 56,
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                marginBottom: 32,
                textAlign: 'center',
                color: isRecording ? '#ffffff' : 'rgba(255,255,255,0.3)',
                letterSpacing: '0.05em',
              }}>
                {fmt(recordingTime)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (isRecording) {
                      setIsRecording(false)
                      setRecordingDone(true)
                    } else {
                      setIsRecording(true)
                      setRecordingDone(false)
                    }
                  }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: isRecording
                      ? '#ef4444'
                      : 'linear-gradient(135deg, #ef4444, #ec4899)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    color: 'white',
                    boxShadow: isRecording
                      ? '0 0 40px rgba(239,68,68,0.4)'
                      : '0 0 30px rgba(239,68,68,0.2)',
                  }}
                >
                  {isRecording ? '⏹' : '●'}
                </motion.button>
              </div>

              <p style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.35)',
                textAlign: 'center',
                marginBottom: 36,
              }}>
                {isRecording ? 'Recording... Click to stop' : recordingDone ? 'Recording complete!' : 'Click to start recording'}
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <SecondaryButton onClick={prev}>← Back</SecondaryButton>
                <ActionButton onClick={next}>Next: Enhance →</ActionButton>
              </div>
            </StepContainer>
          )}

          {step === 2 && (
            <StepContainer key="enhance">
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  style={{ fontSize: 56, display: 'block', marginBottom: 16 }}
                >
                  ✨
                </motion.span>
                <h3 style={{
                  fontSize: 26,
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  marginBottom: 8,
                }}>
                  AI Enhancement
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>
                  Our AI is processing your audio
                </p>
              </div>

              {[
                { label: 'Noise Reduction', status: 'complete', icon: '🔇' },
                { label: 'Audio Leveling', status: 'complete', icon: '📊' },
                { label: 'Auto-Transcription', status: 'processing', icon: '📝' },
                { label: 'Chapter Detection', status: 'pending', icon: '📑' },
                { label: 'Show Notes Generation', status: 'pending', icon: '✍️' },
                { label: 'Clip Suggestions', status: 'pending', icon: '✂️' },
              ].map((task, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '18px 22px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.015)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    marginBottom: 10,
                    transition: 'border-color 0.2s',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{task.icon}</span>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{task.label}</span>
                  <span style={{
                    fontSize: 11,
                    padding: '5px 12px',
                    borderRadius: 20,
                    fontWeight: 600,
                    background:
                      task.status === 'complete' ? 'rgba(34,197,94,0.1)' :
                      task.status === 'processing' ? 'rgba(139,92,246,0.1)' :
                      'rgba(255,255,255,0.03)',
                    color:
                      task.status === 'complete' ? '#22c55e' :
                      task.status === 'processing' ? '#a78bfa' :
                      'rgba(255,255,255,0.3)',
                    border: `1px solid ${
                      task.status === 'complete' ? 'rgba(34,197,94,0.15)' :
                      task.status === 'processing' ? 'rgba(139,92,246,0.15)' :
                      'rgba(255,255,255,0.05)'
                    }`,
                  }}>
                    {task.status === 'complete' ? '✓ Done' : task.status === 'processing' ? '⟳ Processing' : 'Queued'}
                  </span>
                </motion.div>
              ))}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
                <SecondaryButton onClick={prev}>← Back</SecondaryButton>
                <ActionButton onClick={next}>Next: Publish →</ActionButton>
              </div>
            </StepContainer>
          )}

          {step === 3 && (
            <StepContainer key="publish">
              <div style={{ textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 56,
                    margin: '0 auto 36px',
                    border: '1px solid rgba(139,92,246,0.2)',
                  }}
                >
                  🚀
                </motion.div>

                <h3 style={{
                  fontSize: 32,
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  marginBottom: 12,
                }}>
                  Ready to Launch!
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 40,
                  maxWidth: 420,
                  margin: '0 auto 40px',
                  lineHeight: 1.7,
                  fontSize: 15,
                }}>
                  Your podcast "{name || 'Untitled Podcast'}" will be distributed to all major platforms instantly
                </p>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  justifyContent: 'center',
                  marginBottom: 48,
                }}>
                  {['Spotify', 'Apple Podcasts', 'YouTube Music', 'Amazon Music', 'Google Podcasts', 'Overcast', 'Pocket Casts', 'Castro'].map((platform, i) => (
                    <motion.div
                      key={platform}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span style={{ color: '#22c55e', fontSize: 12 }}>✓</span>
                      {platform}
                    </motion.div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <SecondaryButton onClick={prev}>← Back</SecondaryButton>
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(139,92,246,0.5)' }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      padding: '16px 44px',
                      borderRadius: 50,
                      background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #06b6d4)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 16,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 0 30px rgba(139,92,246,0.3)',
                    }}
                  >
                    🚀 Publish Now
                  </motion.button>
                </div>
              </div>
            </StepContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StepContainer({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

function Label({ children }) {
  return (
    <label style={{
      display: 'block',
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 10,
      color: 'rgba(255,255,255,0.7)',
      letterSpacing: '0.02em',
    }}>
      {children}
    </label>
  )
}

function ActionButton({ onClick, children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        padding: '16px 32px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
        color: 'white',
        fontWeight: 600,
        fontSize: 15,
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(139,92,246,0.2)',
      }}
    >
      {children}
    </motion.button>
  )
}

function SecondaryButton({ onClick, children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        padding: '16px 28px',
        borderRadius: 16,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'border-color 0.2s',
      }}
    >
      {children}
    </motion.button>
  )
}
