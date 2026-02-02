import { useEffect, useRef, useState } from 'react'

export default function App() {
  const [serverUrl, setServerUrl] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const pcRef = useRef(null)
  const localStreamRef = useRef(null)

  useEffect(() => {
    return () => {
      stopStreaming()
    }
  }, [])

  async function requestMic() {
    if (localStreamRef.current) return localStreamRef.current
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      localStreamRef.current = stream
      return stream
    } catch (err) {
      throw new Error('Microphone permission denied or unavailable')
    }
  }

  async function startStreaming() {
    setErrorMessage('')
    if (!serverUrl) {
      setErrorMessage('Please enter a server URL')
      return
    }
    if (isStreaming || isConnecting) return
    setIsConnecting(true)
    try {
      const stream = await requestMic()

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      })

      pcRef.current = pc

      // Add audio track
      for (const track of stream.getAudioTracks()) {
        pc.addTrack(track, stream)
      }

      // Some servers require a receive-only transceiver; keep simple sendonly
      // Create SDP offer
      const offer = await pc.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false })
      await pc.setLocalDescription(offer)

      // Wait for ICE gathering to complete to include candidates in SDP
      await waitForIceGatheringComplete(pc)

      const localSdp = pc.localDescription?.sdp || ''
      console.log("offer " , offer)
      console.log("localSdp " , localSdp)

      // POST as application/sdp (common for WHIP-like endpoints)
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp'
        },
        body: localSdp
      })

      if (!response.ok) {
        throw new Error(`Server responded ${response.status}`)
      }

      const answerSdp = await response.text()

      const answer = { type: 'answer', sdp: answerSdp }
      await pc.setRemoteDescription(answer)

      setIsStreaming(true)
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to start streaming')
      stopStreaming()
    } finally {
      setIsConnecting(false)
    }
  }

  function stopStreaming() {
    try {
      if (pcRef.current) {
        pcRef.current.getSenders().forEach(sender => {
          try { sender.track && sender.track.stop() } catch (e) {}
        })
        pcRef.current.close()
      }
    } catch {}
    pcRef.current = null
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => {
        try { t.stop() } catch (e) {}
      })
    }
    localStreamRef.current = null
    setIsStreaming(false)
  }

  function handleUrlChange(e) {
    setServerUrl(e.target.value)
  }

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <h2>WebRTC Audio Uplink</h2>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="serverUrl" style={{ display: 'block', marginBottom: 6 }}>Server URL</label>
        <input
          id="serverUrl"
          type="text"
          placeholder="https://example.com/webrtc/ingest"
          value={serverUrl}
          onChange={handleUrlChange}
          style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={startStreaming} disabled={isConnecting || isStreaming} style={{ padding: '8px 12px' }}>
          {isConnecting ? 'Connecting…' : 'Start'}
        </button>
        <button onClick={stopStreaming} disabled={!isStreaming && !pcRef.current} style={{ padding: '8px 12px' }}>
          Stop
        </button>
      </div>

      {errorMessage && (
        <div style={{ color: 'crimson', marginTop: 12 }}>
          {errorMessage}
        </div>
      )}

      <details style={{ marginTop: 16 }}>
        <summary>Notes</summary>
        <div style={{ fontSize: 14, color: '#444', marginTop: 8 }}>
          <p>
            This requests microphone access and sends audio via WebRTC by POSTing an SDP offer
            to the server URL as <code>application/sdp</code>, then applying the SDP answer response.
          </p>
          <p>
            Ensure your server accepts SDP offers at the provided URL and returns an answer in the response body.
          </p>
        </div>
      </details>
    </div>
  )
}

function waitForIceGatheringComplete(pc) {
  if (pc.iceGatheringState === 'complete') {
    return Promise.resolve()
  }
  return new Promise(resolve => {
    function checkState() {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', checkState)
        resolve()
      }
    }
    pc.addEventListener('icegatheringstatechange', checkState)
  })
}
