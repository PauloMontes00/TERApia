import { motion } from 'framer-motion'
import { Heart, Activity, Star, Calendar, Shield, Video, Users, Check, AlertCircle, Info } from 'lucide-react'

export default function StyleGuide() {
    const colors = [
        { name: 'Primary', var: '--color-primary', bg: '#4A8FD4' },
        { name: 'Secondary', var: '--color-secondary', bg: '#52B788' },
        { name: 'Danger', var: '--color-danger', bg: '#E85D5D' },
        { name: 'Warning', var: '--color-warning', bg: '#F5A623' },
        { name: 'Background', var: '--color-bg', bg: '#F6F8FB' },
        { name: 'Text', var: '--color-text', bg: '#1A2540' },
    ]

    return (
        <div style={{ padding: 'var(--sp-2xl)', maxWidth: 1000, margin: '0 auto' }}>
            <header style={{ marginBottom: 'var(--sp-3xl)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--sp-md)' }}>TERApia Style Guide</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>Manual de identidade visual e componentes do sistema.</p>
            </header>

            {/* Colors */}
            <section style={{ marginBottom: 'var(--sp-3xl)' }}>
                <h2 className="section-title">Paleta de Cores</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--sp-lg)' }}>
                    {colors.map(c => (
                        <div key={c.name} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ height: 80, background: c.bg }} />
                            <div style={{ padding: 'var(--sp-md)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{c.var}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Typography */}
            <section style={{ marginBottom: 'var(--sp-3xl)' }}>
                <h2 className="section-title">Tipografia</h2>
                <div className="card" style={{ padding: 'var(--sp-xl)' }}>
                    <div style={{ marginBottom: 'var(--sp-xl)' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>Heading: Outfit</p>
                        <h1>Heading 1 - Resiliência e Autoconhecimento</h1>
                        <h2 style={{ fontSize: '1.8rem' }}>Heading 2 - Cuidado especializado para você</h2>
                        <h3 style={{ fontSize: '1.4rem' }}>Heading 3 - Encontre o profissional ideal</h3>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>Body: Inter</p>
                        <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                            A saúde mental é um pilar fundamental para uma vida plena e equilibrada. Através do TERApia, facilitamos o acesso a profissionais qualificados, garantindo sigilo, segurança e uma jornada de acolhimento personalizada.
                        </p>
                    </div>
                </div>
            </section>

            {/* Buttons */}
            <section style={{ marginBottom: 'var(--sp-3xl)' }}>
                <h2 className="section-title">Botões</h2>
                <div className="card" style={{ padding: 'var(--sp-xl)', display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-md)', alignItems: 'center' }}>
                    <button className="btn btn-primary">Primary Button</button>
                    <button className="btn btn-secondary">Secondary Button</button>
                    <button className="btn btn-ghost">Ghost Button</button>
                    <button className="btn btn-danger">Danger Button</button>
                    <button className="btn btn-primary btn-lg">Large Button</button>
                    <button className="btn btn-primary btn-sm">Small Button</button>
                    <button className="btn btn-primary btn-icon"><Activity size={20} /></button>
                </div>
            </section>

            {/* Components */}
            <section style={{ marginBottom: 'var(--sp-3xl)' }}>
                <h2 className="section-title">Componentes</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-lg)' }}>
                    <div className="card" style={{ padding: 'var(--sp-lg)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--sp-md)' }}>Badges / Status</h3>
                        <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                            <span className="badge badge-primary">Pendente</span>
                            <span className="badge badge-success">Confirmado</span>
                            <span className="badge badge-warning">Aguardando</span>
                            <span className="badge badge-danger">Cancelado</span>
                        </div>
                    </div>
                    <div className="card" style={{ padding: 'var(--sp-lg)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--sp-md)' }}>Avatares</h3>
                        <div className="flex items-center gap-md">
                            <div className="avatar avatar-sm">SM</div>
                            <div className="avatar avatar-md">MD</div>
                            <div className="avatar avatar-lg">LG</div>
                            <div className="avatar avatar-xl">XL</div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: 'var(--sp-lg)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--sp-md)' }}>Inputs</h3>
                        <div className="form-group">
                            <label className="form-label">Nome de Usuário</label>
                            <input className="form-input" placeholder="Digite seu nome..." />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
