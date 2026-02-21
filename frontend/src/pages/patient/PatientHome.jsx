import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Heart, ChevronRight, Clock, Star, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function PatientHome() {
    const navigate = useNavigate()
    const { matches, professionals } = useApp()

    const nextMatch = matches[0]
    const nextSession = nextMatch?.nextSession ? new Date(nextMatch.nextSession) : null

    return (
        <div style={{ padding: 'var(--sp-lg)', paddingBottom: 'var(--sp-xl)' }}>
            {/* Header */}
            <div style={{ marginBottom: 'var(--sp-xl)' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Olá, bem-vindo 👋</p>
                <h1 style={{ fontSize: '1.7rem', fontFamily: 'var(--font-heading)', fontWeight: 800, lineHeight: 1.2 }}>Como você está<br />hoje?</h1>
            </div>

            {/* Mood Check */}
            <div className="card" style={{ padding: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)', background: 'var(--gradient-primary)' }}>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: 'var(--sp-sm)' }}>Check-in do dia</p>
                <p style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 'var(--sp-md)' }}>Como está seu humor agora?</p>
                <div className="flex gap-sm">
                    {['😔', '😟', '😐', '🙂', '😊'].map((emoji, i) => (
                        <button
                            key={i}
                            style={{
                                flex: 1, padding: '10px 0', borderRadius: 'var(--radius-md)',
                                border: '2px solid rgba(255,255,255,0.3)',
                                background: 'rgba(255,255,255,0.15)',
                                fontSize: '1.3rem', cursor: 'pointer',
                                transition: 'all var(--transition-fast)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                        >{emoji}</button>
                    ))}
                </div>
            </div>

            {/* Next Appointment */}
            {nextMatch && nextSession && (
                <div className="card" style={{ padding: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-md)' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Próxima Consulta</span>
                        <span className="badge badge-success">Confirmada</span>
                    </div>
                    <div className="flex items-center gap-md">
                        <div className="avatar avatar-lg" style={{ background: nextMatch.color }}>{nextMatch.initials}</div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>{nextMatch.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{nextMatch.specialty}</p>
                            <div className="flex items-center gap-sm" style={{ marginTop: 6 }}>
                                <Clock size={14} color="var(--color-primary)" />
                                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                                    {nextSession.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })} às {nextSession.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/patient/video')} id="join-video">
                            Entrar
                        </button>
                    </div>
                </div>
            )}

            {/* Find Therapist CTA */}
            {!nextMatch && (
                <motion.div
                    className="card"
                    style={{ padding: 'var(--sp-xl)', marginBottom: 'var(--sp-lg)', textAlign: 'center', border: '2px dashed var(--color-border)' }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-sm)' }}>💚</div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 4 }}>Encontre seu terapeuta</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: 'var(--sp-lg)' }}>Explore perfis e dê match com o profissional certo para você</p>
                    <button className="btn btn-primary" onClick={() => navigate('/patient/swipe')} id="start-swipe">
                        <Heart size={16} /> Buscar agora
                    </button>
                </motion.div>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
                {[
                    { label: 'Matches', value: matches.length, icon: Heart, color: 'var(--color-match)' },
                    { label: 'Sessões', value: 12, icon: Calendar, color: 'var(--color-primary)' },
                ].map(stat => (
                    <div key={stat.label} className="card" style={{ padding: 'var(--sp-lg)' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: stat.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--sp-sm)' }}>
                            <stat.icon size={20} color={stat.color} />
                        </div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Suggested Professionals */}
            <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-md)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Sugeridos para você</h2>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/patient/swipe')} id="see-all-pros">
                        Ver todos <ChevronRight size={16} />
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                    {professionals.slice(0, 3).map(pro => (
                        <motion.div
                            key={pro.id}
                            className="card"
                            style={{ padding: 'var(--sp-md)', cursor: 'pointer' }}
                            whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}
                            onClick={() => navigate(`/patient/pro/${pro.id}`)}
                        >
                            <div className="flex items-center gap-md">
                                <div className="avatar avatar-md" style={{ background: pro.color }}>{pro.initials}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="flex items-center gap-sm">
                                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>{pro.name}</span>
                                        {pro.available && <span className="badge badge-success">Online</span>}
                                    </div>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>{pro.specialty}</p>
                                    <div className="flex items-center gap-sm" style={{ marginTop: 4 }}>
                                        <Star size={12} fill="var(--color-warning)" color="var(--color-warning)" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{pro.rating} ({pro.reviews})</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>· R$ {pro.price}/sessão</span>
                                    </div>
                                </div>
                                <ChevronRight size={18} color="var(--color-text-muted)" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
