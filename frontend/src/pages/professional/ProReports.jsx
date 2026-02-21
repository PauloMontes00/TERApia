import { motion } from 'framer-motion'
import { TrendingUp, Users, Calendar, Download, ChevronRight, PieChart, BarChart2 } from 'lucide-react'

const TRANSACTIONS = [
    { id: '1', patient: 'João Silva', date: '2026-02-18', value: 180, status: 'paid' },
    { id: '2', patient: 'Maria Fernandes', date: '2026-02-15', value: 160, status: 'paid' },
    { id: '3', patient: 'Lucas Mendes', date: '2026-02-14', value: 200, status: 'pending' },
    { id: '4', patient: 'Ana Luíza', date: '2026-02-12', value: 180, status: 'paid' },
    { id: '5', patient: 'Carlos Eduardo', date: '2026-02-10', value: 320, status: 'paid' },
]

export default function ProReports() {
    const stats = [
        { label: 'Receita Total', value: 'R$ 8.420', sub: '+12% vs mês ant.', color: 'var(--color-primary)' },
        { label: 'Consultas Realizadas', value: '42', sub: 'Média 10.5/sem', color: 'var(--color-secondary)' },
        { label: 'Ticket Médio', value: 'R$ 210', sub: 'Estável', color: '#F5A623' },
        { label: 'Crescimento', value: '+4', sub: 'Novos pacientes', color: '#7C3AED' },
    ]

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-xl)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Financeiro e Relatórios</h2>
                <button className="btn btn-secondary btn-sm">
                    <Download size={16} /> Exportar CSV
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-lg)', marginBottom: 'var(--sp-xl)' }}>
                {stats.map((s, i) => (
                    <motion.div key={s.label} className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 2 }}>{s.value}</div>
                            <div style={{ fontSize: '0.75rem', color: s.sub.includes('+') ? 'var(--color-success)' : 'var(--color-text-muted)', fontWeight: 600 }}>{s.sub}</div>
                        </div>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {i === 0 ? <TrendingUp size={18} color={s.color} /> : i === 1 ? <Calendar size={18} color={s.color} /> : i === 2 ? <PieChart size={18} color={s.color} /> : <Users size={18} color={s.color} />}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--sp-xl)', flexWrap: 'wrap' }}>
                {/* Recent Transactions */}
                <div className="card">
                    <div style={{ padding: 'var(--sp-lg)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>Últimos Recebimentos</h3>
                        <button className="btn btn-ghost btn-sm">Ver todos</button>
                    </div>
                    <div style={{ padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--color-bg-subtle)' }}>
                                    <th style={{ textAlign: 'left', padding: '12px var(--sp-lg)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Paciente</th>
                                    <th style={{ textAlign: 'left', padding: '12px var(--sp-lg)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Data</th>
                                    <th style={{ textAlign: 'right', padding: '12px var(--sp-lg)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Valor</th>
                                    <th style={{ textAlign: 'center', padding: '12px var(--sp-lg)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TRANSACTIONS.map(tx => (
                                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-bg-subtle)' }}>
                                        <td style={{ padding: '14px var(--sp-lg)', fontSize: '0.9rem', fontWeight: 600 }}>{tx.patient}</td>
                                        <td style={{ padding: '14px var(--sp-lg)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                                        <td style={{ padding: '14px var(--sp-lg)', textAlign: 'right', fontSize: '0.9rem', fontWeight: 700 }}>R$ {tx.value}</td>
                                        <td style={{ padding: '14px var(--sp-lg)', textAlign: 'center' }}>
                                            <span className={`badge ${tx.status === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>{tx.status === 'paid' ? 'Pago' : 'Processando'}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chart Mockup */}
                <div className="flex-col gap-lg">
                    <div className="card" style={{ padding: 'var(--sp-lg)', flex: 1 }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--sp-xl)' }}>Atendimento por Canal</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                            {[
                                { l: 'Videochamada', p: 85, c: 'var(--color-primary)' },
                                { l: 'Chat de Match', p: 10, c: 'var(--color-secondary)' },
                                { l: 'Presencial', p: 5, c: 'var(--color-text-muted)' },
                            ].map(item => (
                                <div key={item.l}>
                                    <div className="flex items-center justify-between" style={{ marginBottom: 4, fontSize: '0.82rem' }}>
                                        <span style={{ fontWeight: 600 }}>{item.l}</span>
                                        <span style={{ color: 'var(--color-text-muted)' }}>{item.p}%</span>
                                    </div>
                                    <div style={{ height: 6, width: '100%', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                        <div style={{ width: `${item.p}%`, height: '100%', background: item.c }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: 'var(--sp-lg)', background: 'var(--gradient-primary)', color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
                            <BarChart2 size={24} color="#fff" />
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Insights Profissionais</h3>
                        </div>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 'var(--sp-md)', opacity: 0.9 }}>
                            Seu faturamento cresceu <b>12%</b> este mês devido ao aumento de buscas por "Ansiedade" na sua região.
                        </p>
                        <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff' }}>Ver detalhes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
