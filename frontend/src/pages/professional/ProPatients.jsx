import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { useApp } from '../../context/useApp'

export default function ProPatients() {
    const navigate = useNavigate()
    const { patients } = useApp()
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all') // all | active | pending

    const displayed = patients.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' || (filter === 'active' && !p.pending) || (filter === 'pending' && p.pending)
        return matchSearch && matchFilter
    })

    return (
        <div>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 'var(--sp-md)' }}>
                <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                    id="patient-search"
                    className="form-input"
                    style={{ paddingLeft: 44, width: '100%' }}
                    placeholder="Buscar paciente..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex gap-sm" style={{ marginBottom: 'var(--sp-lg)' }}>
                {[{ v: 'all', l: 'Todos' }, { v: 'active', l: 'Ativos' }, { v: 'pending', l: 'Pendentes' }].map(f => (
                    <button
                        key={f.v}
                        id={`filter-${f.v}`}
                        onClick={() => setFilter(f.v)}
                        className={`badge ${filter === f.v ? 'badge-primary' : 'badge-neutral'}`}
                        style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.82rem' }}
                    >{f.l}</button>
                ))}
            </div>

            {/* Patient list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                {displayed.map((p, i) => (
                    <motion.div
                        key={p.id}
                        className="card"
                        style={{ padding: 'var(--sp-lg)', cursor: 'pointer' }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}
                        onClick={() => navigate(`/pro/patients/${p.id}`)}
                    >
                        <div className="flex items-center gap-md">
                            <div style={{ position: 'relative' }}>
                                <div className="avatar avatar-md" style={{ background: p.color }}>{p.initials}</div>
                                {!p.pending && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, background: 'var(--color-success)', borderRadius: '50%', border: '2px solid var(--color-bg-card)' }} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="flex items-center gap-sm">
                                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{p.name}</span>
                                    <span className={`badge ${p.pending ? 'badge-warning' : 'badge-success'}`}>{p.pending ? 'Pendente' : 'Ativo'}</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{p.age} anos · {p.sessions} sessões</p>
                                {p.lastSession && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Última sessão: {new Date(p.lastSession).toLocaleDateString('pt-BR')}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {displayed.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 'var(--sp-2xl)', color: 'var(--color-text-muted)' }}>
                        <p style={{ fontSize: '1.5rem', marginBottom: 8 }}>🔍</p>
                        <p>Nenhum paciente encontrado</p>
                    </div>
                )}
            </div>
        </div>
    )
}
