import { useEffect, useRef } from 'react'

export default function ParticleField({ particleCount = 80, color = '139, 92, 246', connectDistance = 150 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    let mouse = { x: -1000, y: -1000 }

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function createParticles() {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const time = Date.now() * 0.001

      particles.forEach((p, i) => {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const mouseDist = Math.sqrt(dx * dx + dy * dy)
        if (mouseDist < 200) {
          p.vx -= dx * 0.00005
          p.vy -= dy * 0.00005
        }

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const pulse = Math.sin(time * p.pulseSpeed * 10 + p.pulseOffset) * 0.3 + 0.7
        const currentOpacity = p.opacity * pulse

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${currentOpacity})`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const dx2 = p.x - particles[j].x
          const dy2 = p.y - particles[j].y
          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2)

          if (dist < connectDistance) {
            const lineOpacity = 0.06 * (1 - dist / connectDistance)
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${color}, ${lineOpacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    function handleMouse(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function handleResize() {
      resize()
      createParticles()
    }

    resize()
    createParticles()
    animate()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouse)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [particleCount, color, connectDistance])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
