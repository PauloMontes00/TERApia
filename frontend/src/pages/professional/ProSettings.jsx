import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Wallet, Clock, ChevronRight, Camera, Save } from 'lucide-react'

export default function ProSettings() {
    const [name, setName] = useState('Dr. Rodrigo Albuquerque')
    const [crp, setCrp] = useState('06/123456')
    const [bio, setBio] = useState('Psicólogo clínico com especialização em TCC...')

    const sections = [
        { title: 'Perfil Profissional', icon: User, items: ['Dados Pessoais', 'CRP/CRM', 'Especialidades', 'Biografia'] },
        { title: 'Dados da Plataforma', icon: Clock, items: ['Horários de Atendimento', 'Valores das Consultas'] },
        { title: 'Segurança e Pagamentos', icon: Shield, items: ['Senha e Acesso', 'Dados Bancários', 'Histórico de Faturamento'] },
        { title: 'Comunicação', icon: Bell, items: ['Notificações Push', 'Lembretes de E-mail'] },
    ]

    return (
        <div style={{ maxWidth: 800 }}>
            {/* Profile Header */}
            <div className="card" style={{ padding: 'var(--sp-xl)', marginBottom: 'var(--sp-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-xl)' }}>
                    <div style={{ position: 'relative' }}>
                        <div className="avatar avatar-xl" style={{ fontSize: '2rem' }}>RA</div>
                        <button style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'var(--color-primary)', border: '4px solid #fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Camera size={16} color="#fff" />
                        </button>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>{name}</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>{crp} · Psicólogo Clínico</p>
                        <div style={{ display: 'flex', gap: 'var(--sp-sm)', marginTop: 8 }}>
                            <span className="badge badge-success">Verificado</span>
                            <span className="badge badge-primary">Membro Pro</span>
                        </div>
                    </div>
                    <button className="btn btn-secondary">Ver perfil público</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--sp-lg)' }}>
                {sections.map(section => (
                    <div key={section.title} className="card" style={{ overflow: 'hidden' }}>
                        <div style={{ padding: 'var(--sp-lg)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
                            <div style={{ background: 'var(--color-bg-subtle)', padding: 8, borderRadius: 'var(--radius-md)' }}>
                                <section.icon size={18} color="var(--color-primary)" />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>{section.title}</h3>
                        </div>
                        <div style={{ padding: 0 }}>
                            {section.items.map((item, idx) => (
                                <button
                                    key={item}
                                    style={{
                                        width: '100%', padding: '14px var(--sp-lg)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        background: 'none', border: 'none',
                                        borderBottom: idx < section.items.length - 1 ? '1px solid var(--color-bg-subtle)' : 'none',
                                        textAlign: 'left', cursor: 'pointer', transition: 'var(--transition-fast)'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-subtle)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{item}</span>
                                    <ChevronRight size={16} color="var(--color-text-muted)" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 'var(--sp-2xl)', textAlign: 'right' }}>
                <button className="btn btn-danger btn-ghost" style={{ marginRight: 'var(--sp-md)' }}>Desativar minha conta</button>
                <button className="btn btn-primary btn-lg" onClick={() => { }}>
                    <Save size={18} /> Salvar Alterações
                </button>
            </div>
        </div>
    )
}
