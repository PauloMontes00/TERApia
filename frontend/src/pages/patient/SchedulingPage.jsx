import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Clock } from 'lucide-react'
import { useApp } from '../../context/useApp'

const TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function getWeekDays(baseDate) {
    const start = new Date(baseDate)
    start.setDate(start.getDate() - start.getDay())
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        return d
    })
}

export default function SchedulingPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { professionals, addToast } = useApp()
    const pro = professionals.find(p => p.id === id) || professionals[0]

    const today = new Date()
    const [weekOffset, setWeekOffset] = useState(0)
    const [selectedDay, setSelectedDay] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [confirmed, setConfirmed] = useState(false)

    const baseDate = new Date(today)
    baseDate.setDate(today.getDate() + weekOffset * 7)
    const weekDays = getWeekDays(baseDate)

    const unavailableTimes = { '09:00': true, '11:00': true, '15:00': true }

    const handleConfirm = () => {
        setConfirmed(true)
        addToast('Consulta agendada com sucesso! ✅', 'success')
        setTimeout(() => navigate('/patient/matches'), 2000)
    }

    if (confirmed) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100dvh - var(--bottom-nav-h))', padding: 'var(--sp-xl)', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-lg)' }}>
                        <Check size={40} color="#fff" strokeWidth={3} />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: 8 }}>Consulta Agendada!</h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Você receberá um lembrete antes da sessão.</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div style={{ padding: 'var(--sp-lg)', paddingBottom: 100 }}>
            {/* Header */}
            <div className="flex items-center gap-md" style={{ marginBottom: 'var(--sp-xl)' }}>
                <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)} id="back-btn">
                    <ChevronLeft size={22} />
                </button>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>Agendar Consulta</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>com {pro.name}</p>
                </div>
            </div>

            {/* Week navigation */}
            <div className="card" style={{ padding: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-md)' }}>
                    <button className="btn btn-ghost btn-icon" onClick={() => setWeekOffset(w => w - 1)} disabled={weekOffset === 0} id="prev-week">
                        <ChevronLeft size={18} />
                    </button>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>
                        {weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} — {weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                    <button className="btn btn-ghost btn-icon" onClick={() => setWeekOffset(w => w + 1)} id="next-week">
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                    {weekDays.map((d, i) => {
                        const isPast = d < today && d.toDateString() !== today.toDateString()
                        const isSelected = selectedDay?.toDateString() === d.toDateString()
                        const isToday = d.toDateString() === today.toDateString()
                        return (
                            <button
                                key={i}
                                disabled={isPast}
                                onClick={() => { setSelectedDay(d); setSelectedTime(null) }}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                    padding: '10px 4px', borderRadius: 'var(--radius-md)',
                                    border: 'none', cursor: isPast ? 'not-allowed' : 'pointer',
                                    background: isSelected ? 'var(--color-primary)' : isToday ? 'rgba(74,143,212,0.1)' : 'transparent',
                                    color: isSelected ? '#fff' : isPast ? 'var(--color-text-muted)' : 'var(--color-text)',
                                    transition: 'all var(--transition-fast)'
                                }}
                            >
                                <span style={{ fontSize: '0.68rem', fontWeight: 600, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>{DAYS[d.getDay()]}</span>
                                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem' }}>{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Time slots */}
            {selectedDay && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 'var(--sp-md)' }}>
                        Horários disponíveis · {selectedDay.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-sm)' }}>
                        {TIMES.map(time => {
                            const busy = unavailableTimes[time]
                            const sel = selectedTime === time
                            return (
                                <button
                                    key={time}
                                    disabled={busy}
                                    onClick={() => setSelectedTime(time)}
                                    style={{
                                        padding: '12px 0', borderRadius: 'var(--radius-md)',
                                        border: `2px solid ${sel ? 'var(--color-primary)' : busy ? 'var(--color-border)' : 'var(--color-border)'}`,
                                        background: sel ? 'rgba(74,143,212,0.1)' : busy ? 'var(--color-bg-subtle)' : 'var(--color-bg-card)',
                                        color: sel ? 'var(--color-primary)' : busy ? 'var(--color-text-muted)' : 'var(--color-text)',
                                        cursor: busy ? 'not-allowed' : 'pointer',
                                        fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.88rem',
                                        textDecoration: busy ? 'line-through' : 'none',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    <Clock size={12} style={{ display: 'inline', marginRight: 4 }} /> {time}
                                </button>
                            )
                        })}
                    </div>
                </motion.div>
            )}

            {/* Summary & Confirm */}
            {selectedDay && selectedTime && (
                <motion.div className="card" style={{ padding: 'var(--sp-lg)', marginTop: 'var(--sp-xl)', position: 'fixed', bottom: 'var(--bottom-nav-h)', left: 'var(--sp-md)', right: 'var(--sp-md)', zIndex: 50 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-md)' }}>
                        <div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                                {selectedDay.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} às {selectedTime}
                            </p>
                            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>{pro.name}</p>
                        </div>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>R$ {pro.price}</span>
                    </div>
                    <button className="btn btn-primary btn-block btn-lg" id="confirm-schedule" onClick={handleConfirm}>
                        <Check size={18} /> Confirmar agendamento
                    </button>
                </motion.div>
            )}
        </div>
    )
}
