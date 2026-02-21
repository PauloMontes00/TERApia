import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare } from 'lucide-react'

export default function VideoRoomPatient() {
    const navigate = useNavigate()
    const [muted, setMuted] = useState(false)
    const [camOff, setCamOff] = useState(false)
    const [duration] = useState('24:13')

    return (
        <div className="video-room">
            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-md) var(--sp-lg)', background: 'rgba(13,17,23,0.8)' }}>
                <div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>Dra. Camila Rocha</p>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Psicóloga · Em sessão</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{duration}</span>
                </div>
            </div>

            {/* Remote video (therapist) */}
            <div className="video-main">
                <div style={{
                    width: '100%', maxWidth: 600, aspectRatio: '16/9',
                    borderRadius: 'var(--radius-xl)',
                    background: 'linear-gradient(135deg, #1a2f4a, #2d4a6e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
                }}>
                    <div style={{
                        width: 100, height: 100, borderRadius: '50%', background: '#4A8FD4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800
                    }}>CR</div>
                </div>

                {/* Self view */}
                <div className="video-self">
                    <div style={{
                        width: '100%', height: '100%',
                        background: camOff ? '#1a1a2e' : 'linear-gradient(135deg, #2b6cb0, #3a9068)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {camOff
                            ? <VideoOff size={28} color="rgba(255,255,255,0.4)" />
                            : <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', color: '#fff', fontWeight: 700 }}>EU</div>
                        }
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="video-controls">
                <motion.button
                    className={`video-btn ${muted ? '' : 'active'}`}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setMuted(m => !m)}
                    id="toggle-mic"
                    title={muted ? 'Ativar microfone' : 'Silenciar'}
                >
                    {muted ? <MicOff size={22} /> : <Mic size={22} />}
                </motion.button>

                <motion.button
                    className={`video-btn ${camOff ? '' : 'active'}`}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setCamOff(c => !c)}
                    id="toggle-camera"
                    title={camOff ? 'Ativar câmera' : 'Desativar câmera'}
                >
                    {camOff ? <VideoOff size={22} /> : <Video size={22} />}
                </motion.button>

                <motion.button
                    className="video-btn end"
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/patient/matches')}
                    id="end-call"
                    title="Encerrar chamada"
                >
                    <PhoneOff size={26} />
                </motion.button>

                <motion.button
                    className="video-btn"
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
                    id="chat-btn"
                    title="Chat"
                >
                    <MessageSquare size={22} />
                </motion.button>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
        </div>
    )
}
