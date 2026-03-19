import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const columns = [
  { title: 'Product', links: ['Features', 'Pricing', 'Studio', 'Analytics', 'API'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Partners'] },
  { title: 'Support', links: ['Help Center', 'Community', 'Contact', 'Status', 'Docs'] },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '60px 40px 40px',
      position: 'relative',
      zIndex: 1,
      background: 'linear-gradient(to top, rgba(3,0,20,1) 0%, transparent 100%)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
        gap: 40,
        marginBottom: 48,
      }}>
        <div>
          <Link to="/">
            <h4 style={{
              fontSize: 22,
              fontWeight: 800,
              fontFamily: "'Space Grotesk', sans-serif",
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 16,
              cursor: 'pointer',
            }}>
              Yapster
            </h4>
          </Link>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.8,
            maxWidth: 280,
          }}>
            The future of podcasting. Create, share, and discover amazing content powered by cutting-edge AI.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {['𝕏', 'in', 'yt', 'gh'].map((icon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                {icon}
              </motion.div>
            ))}
          </div>
        </div>

        {columns.map((col, i) => (
          <div key={i}>
            <h5 style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
              color: 'rgba(255,255,255,0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {col.title}
            </h5>
            {col.links.map((link, j) => (
              <motion.p
                key={j}
                whileHover={{ x: 4, color: '#ffffff' }}
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.35)',
                  marginBottom: 14,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              >
                {link}
              </motion.p>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
          © 2026 Yapster. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item, i) => (
            <motion.span
              key={i}
              whileHover={{ color: 'rgba(255,255,255,0.6)' }}
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.25)',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </footer>
  )
}
