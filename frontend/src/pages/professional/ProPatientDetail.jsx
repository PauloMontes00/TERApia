import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Video, FileText, Clock, Calendar, Save } from 'lucide-react'
import { useApp } from '../../context/useApp'

const SESSIONS_HISTORY = [
    { date: '2026-02-18', notes: 'Paciente relata melhora na qualidade do sono. Redução de episódios de ansiedade. Exercícios de respiração sendo praticados diariamente.', duration: 50 },
    { date: '2026-02-11', notes: 'Sessão focada em técnicas de mindfulness. Paciente demonstrou interesse e engajamento nos exercícios propostos.', duration: 50 },
    { date: '2026-02-04', notes: 'Primeira sessão presencial via vídeo. Estabelecimento de rapport. Avaliação inicial. Metas definidas para o processo.', duration: 60 },
]

export default function ProPatientDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { patients } = useApp()
    const patient = patients.find(p => p.id === id) || patients[0]

    const [notes, setNotes] = useState('')
    const [tab, setTab] = useState('prontuario')
    const [saved, setSaved] = useState(false)

    const saveNotes = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    if (!patient) return null

    return (
        <div>
            {/* Patient header */}
            <div className="card" style={{ padding: 'var(--sp-lg)', marginBottom: 'var(--sp-xl)', display: 'flex', alignItems: 'center', gap: 'var(--sp-lg)' }}>
                <div className="avatar avatar-lg" style={{ background: patient.color }}>{patient.initials}</div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>{patient.name}</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: 6 }}>{patient.age} anos · {patient.sessions} sessões realizadas</p>
                    <div className="flex gap-sm">
                        <span className={`badge ${patient.pending ? 'badge-warning' : 'badge-success'}`}>{patient.pending ? 'Pendente' : 'Ativo'}</span>
                        {patient.lastSession && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={12} /> Última: {new Date(patient.lastSession).toLocaleDateString('pt-BR')}
                            </span>
                        )}
                    </div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/pro/video')} id="start-video">
                    <Video size={16} /> Iniciar
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 'var(--sp-xl)' }}>
                {[{ v: 'prontuario', l: '📋 Prontuário' }, { v: 'historico', l: '🕒 Histórico' }].map(t => (
                    <button
                        key={t.v}
                        id={`tab-${t.v}`}
                        onClick={() => setTab(t.v)}
                        style={{
                            flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)',
                            border: 'none', cursor: 'pointer',
                            background: tab === t.v ? 'var(--color-bg-card)' : 'transparent',
                            color: tab === t.v ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.88rem',
                            boxShadow: tab === t.v ? 'var(--shadow-sm)' : 'none',
                            transition: 'all var(--transition-fast)'
                        }}
                    >{t.l}</button>
                ))}
            </div>

            {/* Prontuário Tab */}
            {tab === 'prontuario' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="card" style={{ padding: 'var(--sp-lg)' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-md)' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Notas da Sessão Atual</h3>
                            <button
                                className={`btn btn-sm ${saved ? 'btn-secondary' : 'btn-primary'}`}
                                onClick={saveNotes}
                                id="save-notes"
                            >
                                <Save size={14} /> {saved ? 'Salvo!' : 'Salvar'}
                            </button>
                        </div>
                        <textarea
                            id="prontuario-notes"
                            className="form-input"
                            rows={8}
                            placeholder="Observações, evolução do paciente, técnicas utilizadas, plano de ação..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            style={{ resize: 'vertical', width: '100%', lineHeight: 1.7 }}
                        />
                    </div>

                    {/* Quick snippets */}
                    <div style={{ marginTop: 'var(--sp-lg)' }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: 'var(--sp-sm)', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Inserção rápida</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {['Melhora observada', 'Técnica TCC', 'Exercício de respiração', 'Tarefa para casa', 'Retorno em 1 semana'].map(snippet => (
                                <button
                                    key={snippet}
                                    className="badge badge-neutral"
                                    style={{ cursor: 'pointer', padding: '6px 12px' }}
                                    onClick={() => setNotes(n => n + (n ? '\n' : '') + snippet + ': ')}
                                >{snippet}</button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Histórico Tab */}
            {tab === 'historico' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                        {SESSIONS_HISTORY.map((session, i) => (
                            <div key={i} className="card" style={{ padding: 'var(--sp-lg)' }}>
                                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-md)' }}>
                                    <div className="flex items-center gap-sm">
                                        <Calendar size={16} color="var(--color-primary)" />
                                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>
                                            {new Date(session.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                                        </span>
                                    </div>
                                    <span className="badge badge-neutral">{session.duration} min</span>
                                </div>
                                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, borderLeft: '3px solid var(--color-bg-subtle)', paddingLeft: 'var(--sp-md)' }}>
                                    {session.notes}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
