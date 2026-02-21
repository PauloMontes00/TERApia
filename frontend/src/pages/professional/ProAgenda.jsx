import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const DAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const EVENTS = {
    '2026-02-22': [{ time: '09:00', patient: 'João Silva', initials: 'JS', color: '#4A8FD4', duration: 1 }],
    '2026-02-24': [{ time: '16:00', patient: 'Carlos Eduardo', initials: 'CE', color: '#D97706', duration: 1 }],
    '2026-02-25': [{ time: '14:00', patient: 'Maria Fernandes', initials: 'MF', color: '#52B788', duration: 1 }],
}

function getWeek(base) {
    const s = new Date(base)
    s.setDate(s.getDate() - s.getDay())
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(s); d.setDate(s.getDate() + i); return d })
}

export default function ProAgenda() {
    const navigate = useNavigate()
    const [weekOffset, setWeekOffset] = useState(0)
    const today = new Date()
    const base = new Date(today)
    base.setDate(today.getDate() + weekOffset * 7)
    const week = getWeek(base)

    const toKey = (d) => d.toISOString().split('T')[0]

    return (
        <div>
            {/* Week nav */}
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-lg)' }}>
                <button className="btn btn-ghost btn-icon" onClick={() => setWeekOffset(w => w - 1)} id="prev-week">
                    <ChevronLeft size={20} />
                </button>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                    {week[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} — {week[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <button className="btn btn-ghost btn-icon" onClick={() => setWeekOffset(w => w + 1)} id="next-week">
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Calendar grid */}
            <div className="card" style={{ overflow: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '56px repeat(7, 1fr)', minWidth: 600 }}>
                    {/* Header row */}
                    <div style={{ borderBottom: '1px solid var(--color-border)', padding: 'var(--sp-sm)' }} />
                    {week.map(d => {
                        const isToday = d.toDateString() === today.toDateString()
                        return (
                            <div
                                key={d.toDateString()}
                                style={{
                                    borderBottom: '1px solid var(--color-border)',
                                    borderLeft: '1px solid var(--color-border)',
                                    padding: 'var(--sp-sm)',
                                    textAlign: 'center',
                                    background: isToday ? 'rgba(74,143,212,0.06)' : 'transparent'
                                }}
                            >
                                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)', fontWeight: 600, textTransform: 'uppercase' }}>{DAYS_SHORT[d.getDay()]}</div>
                                <div style={{
                                    fontSize: '1.1rem', fontFamily: 'var(--font-heading)', fontWeight: 800,
                                    color: isToday ? '#fff' : 'var(--color-text)',
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: isToday ? 'var(--color-primary)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '4px auto 0'
                                }}>{d.getDate()}</div>
                            </div>
                        )
                    })}

                    {/* Time rows */}
                    {HOURS.map(hour => (
                        <>
                            <div key={hour + '-label'} style={{
                                borderTop: '1px solid var(--color-border)',
                                padding: '8px 4px',
                                fontSize: '0.72rem', color: 'var(--color-text-muted)',
                                fontFamily: 'var(--font-heading)', fontWeight: 600,
                                textAlign: 'center'
                            }}>{hour}</div>
                            {week.map(d => {
                                const events = (EVENTS[toKey(d)] || []).filter(e => e.time === hour)
                                return (
                                    <div
                                        key={d.toDateString() + hour}
                                        style={{
                                            borderTop: '1px solid var(--color-border)',
                                            borderLeft: '1px solid var(--color-border)',
                                            minHeight: 52,
                                            padding: 4,
                                            background: d.toDateString() === today.toDateString() ? 'rgba(74,143,212,0.03)' : 'transparent'
                                        }}
                                    >
                                        {events.map(ev => (
                                            <motion.div
                                                key={ev.patient}
                                                whileHover={{ scale: 1.03 }}
                                                onClick={() => navigate('/pro/patients')}
                                                style={{
                                                    background: ev.color + '22',
                                                    borderLeft: `3px solid ${ev.color}`,
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '4px 6px',
                                                    cursor: 'pointer',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: ev.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.patient}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )
                            })}
                        </>
                    ))}
                </div>
            </div>
        </div>
    )
}
