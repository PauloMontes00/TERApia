import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MessageCircle, Clock, Heart, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/useApp'

const STATUS_LABELS = { active: { label: 'Ativo', cls: 'badge-success' }, scheduled: { label: 'Agendado', cls: 'badge-primary' }, pending: { label: 'Pendente', cls: 'badge-warning' } }

export default function MatchesList() {
    const navigate = useNavigate()
    const { matches } = useApp()

    if (matches.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100dvh - var(--bottom-nav-h))', padding: 'var(--sp-xl)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-md)' }}>💔</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Nenhum match ainda</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-xl)', fontSize: '0.92rem' }}>Explore os perfis e dê like para encontrar seu terapeuta ideal</p>
                <button className="btn btn-primary" onClick={() => navigate('/patient/swipe')} id="go-swipe">
                    <Heart size={16} /> Explorar profissionais
                </button>
            </div>
        )
    }

    return (
        <div style={{ padding: 'var(--sp-lg)' }}>
            <div style={{ marginBottom: 'var(--sp-xl)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Meus Matches</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{matches.length} conexões ativas</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                {matches.map((pro, i) => {
                    const st = STATUS_LABELS[pro.status] || STATUS_LABELS.active
                    return (
                        <motion.div
                            key={pro.id}
                            className="card"
                            style={{ padding: 'var(--sp-lg)', cursor: 'pointer' }}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}
                            onClick={() => navigate(`/patient/pro/${pro.id}`)}
                        >
                            <div className="flex items-center gap-md">
                                <div style={{ position: 'relative' }}>
                                    <div className="avatar avatar-lg" style={{ background: pro.color }}>{pro.initials}</div>
                                    {pro.available && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, background: 'var(--color-success)', borderRadius: '50%', border: '2px solid var(--color-bg-card)' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="flex items-center gap-sm" style={{ marginBottom: 2 }}>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>{pro.name}</h3>
                                        <span className={`badge ${st.cls}`}>{st.label}</span>
                                    </div>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 6 }}>{pro.specialty}</p>
                                    {pro.nextSession && (
                                        <div className="flex items-center gap-xs">
                                            <Clock size={12} color="var(--color-primary)" />
                                            <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                                {new Date(pro.nextSession).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às {new Date(pro.nextSession).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-sm" style={{ marginTop: 'var(--sp-md)', paddingTop: 'var(--sp-md)', borderTop: '1px solid var(--color-border)' }}>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    style={{ flex: 1 }}
                                    onClick={e => { e.stopPropagation(); navigate(`/patient/schedule/${pro.id}`) }}
                                    id={`schedule-${pro.id}`}
                                >
                                    <Calendar size={14} /> Agendar
                                </button>
                                <button
                                    className="btn btn-primary btn-sm"
                                    style={{ flex: 1 }}
                                    onClick={e => { e.stopPropagation(); navigate('/patient/video') }}
                                    id={`video-${pro.id}`}
                                >
                                    <MessageCircle size={14} /> Consulta
                                </button>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
