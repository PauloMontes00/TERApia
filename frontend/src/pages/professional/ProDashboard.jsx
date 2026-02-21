import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Calendar, TrendingUp, Clock, Check, X, Video, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function ProDashboard() {
    const navigate = useNavigate()
    const { patients, acceptPatient, declinePatient } = useApp()
    const pending = patients.filter(p => p.pending)
    const active = patients.filter(p => !p.pending)

    const stats = [
        { label: 'Pacientes', value: active.length, icon: Users, color: '#4A8FD4', sub: '+2 este mês' },
        { label: 'Hoje', value: 3, icon: Calendar, color: '#52B788', sub: 'consultas' },
        { label: 'Pendentes', value: pending.length, icon: Clock, color: '#F5A623', sub: 'aguardando' },
        { label: 'Faturamento', value: 'R$2.8k', icon: TrendingUp, color: '#7C3AED', sub: 'este mês' },
    ]

    const todayAppts = [
        { time: '09:00', patient: 'João Silva', initials: 'JS', color: '#4A8FD4', status: 'confirmed' },
        { time: '10:30', patient: 'Carlos Eduardo', initials: 'CE', color: '#D97706', status: 'confirmed' },
        { time: '14:00', patient: 'Roberto Nunes', initials: 'RN', color: '#7C3AED', status: 'pending' },
    ]

    return (
        <div>
            {/* Welcome */}
            <div style={{ marginBottom: 'var(--sp-xl)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Bom dia, Dr.! 👋</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Você tem {pending.length} novas solicitações de match</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
                {stats.map((s, i) => (
                    <motion.div key={s.label} className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                        <div className="stat-icon" style={{ background: s.color + '18' }}>
                            <s.icon size={22} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text)' }}>{s.label}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.sub}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pending Patients */}
            {pending.length > 0 && (
                <div style={{ marginBottom: 'var(--sp-xl)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 'var(--sp-md)' }}>
                        Solicitações de Match <span className="badge badge-warning">{pending.length}</span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                        {pending.map(p => (
                            <motion.div key={p.id} className="card" style={{ padding: 'var(--sp-lg)' }} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="flex items-center gap-md" style={{ marginBottom: 'var(--sp-md)' }}>
                                    <div className="avatar avatar-md" style={{ background: p.color }}>{p.initials}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{p.age} anos · Aguardando match</div>
                                    </div>
                                </div>
                                <div className="flex gap-sm">
                                    <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => declinePatient(p.id)} id={`decline-${p.id}`}>
                                        <X size={14} /> Recusar
                                    </button>
                                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => acceptPatient(p.id)} id={`accept-${p.id}`}>
                                        <Check size={14} /> Aceitar
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Today's Schedule */}
            <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-md)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Agenda de Hoje</h3>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pro/agenda')} id="view-full-agenda">
                        Ver agenda <ChevronRight size={16} />
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
                    {todayAppts.map(apt => (
                        <div key={apt.time} className="card" style={{ padding: 'var(--sp-md)' }}>
                            <div className="flex items-center gap-md">
                                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-primary)', width: 48, flexShrink: 0 }}>{apt.time}</span>
                                <div className="avatar avatar-sm" style={{ background: apt.color }}>{apt.initials}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.92rem' }}>{apt.patient}</div>
                                    <span className={`badge ${apt.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>{apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}</span>
                                </div>
                                <button className="btn btn-primary btn-sm" onClick={() => navigate('/pro/video')} id={`join-${apt.time}`}>
                                    <Video size={14} /> Entrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
