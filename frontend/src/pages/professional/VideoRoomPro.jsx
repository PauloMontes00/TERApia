import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, FileText, ChevronRight, Save } from 'lucide-react'

export default function VideoRoomPro() {
    const navigate = useNavigate()
    const [muted, setMuted] = useState(false)
    const [camOff, setCamOff] = useState(false)
    const [notes, setNotes] = useState('')
    const [showNotes, setShowNotes] = useState(true)

    return (
        <div className="video-room" style={{ flexDirection: 'row', overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Top bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-md) var(--sp-lg)', background: 'rgba(13,17,23,0.8)', zIndex: 10 }}>
                    <div>
                        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>João Silva</p>
                        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Paciente · 32 anos</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#fff' }}
                            onClick={() => setShowNotes(!showNotes)}
                        >
                            {showNotes ? 'Esconder Notas' : 'Ver Notas'}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4444', display: 'inline-block' }} />
                            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>45:12</span>
                        </div>
                    </div>
                </div>

                {/* Remote video (patient) */}
                <div className="video-main">
                    <div style={{
                        width: '100%', maxWidth: 800, aspectRatio: '16/9',
                        borderRadius: 'var(--radius-xl)',
                        background: 'linear-gradient(135deg, #1D3461, #2B6CB0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
                    }}>
                        <div style={{
                            width: 120, height: 120, borderRadius: '50%', background: '#4A8FD4',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800
                        }}>JS</div>
                    </div>

                    {/* Self view */}
                    <div className="video-self">
                        <div style={{
                            width: '100%', height: '100%',
                            background: camOff ? '#1a1a2e' : 'linear-gradient(135deg, #2D3A54, #4A5D7A)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {camOff
                                ? <VideoOff size={28} color="rgba(255,255,255,0.4)" />
                                : <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', color: '#fff', fontWeight: 700 }}>DR</div>
                            }
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="video-controls">
                    <motion.button className={`video-btn ${muted ? '' : 'active'}`} onClick={() => setMuted(!muted)}>
                        {muted ? <MicOff size={22} /> : <Mic size={22} />}
                    </motion.button>
                    <motion.button className={`video-btn ${camOff ? '' : 'active'}`} onClick={() => setCamOff(!camOff)}>
                        {camOff ? <VideoOff size={22} /> : <Video size={22} />}
                    </motion.button>
                    <motion.button className="video-btn end" onClick={() => navigate('/pro/dashboard')}>
                        <PhoneOff size={26} />
                    </motion.button>
                    <motion.button className="video-btn">
                        <MessageSquare size={22} />
                    </motion.button>
                </div>
            </div>

            {/* Pro side panel (Notes) */}
            {showNotes && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 360, opacity: 1 }}
                    style={{
                        background: 'var(--color-bg-card)',
                        height: '100%',
                        borderLeft: '1px solid var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        color: 'var(--color-text)'
                    }}
                >
                    <div style={{ padding: 'var(--sp-lg)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>Anotações da Sessão</h3>
                    </div>
                    <div style={{ flex: 1, padding: 'var(--sp-lg)' }}>
                        <div style={{ marginBottom: 'var(--sp-md)' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>Histórico do paciente</p>
                            <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-sm)', fontSize: '0.82rem' }}>
                                Paciente com histórico de ansiedade social...
                            </div>
                        </div>
                        <textarea
                            className="form-input"
                            style={{ width: '100%', height: 'calc(100% - 100px)', resize: 'none', border: 'none', background: 'transparent' }}
                            placeholder="Digite suas notas aqui durante a sessão..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>
                    <div style={{ padding: 'var(--sp-md)', borderTop: '1px solid var(--color-border)' }}>
                        <button className="btn btn-primary btn-block btn-sm" onClick={() => { }}>
                            <Save size={14} /> Salvar no Prontuário
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
