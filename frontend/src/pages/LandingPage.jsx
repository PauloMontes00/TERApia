import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Shield, Video, Star, ArrowRight, Activity, CheckCircle } from 'lucide-react'

const features = [
    { icon: Heart, title: 'Match Personalizado', desc: 'Encontre o psicólogo ideal para você com nosso sistema inteligente de compatibilidade.', color: '#E85D8A' },
    { icon: Video, title: 'Consultas Online', desc: 'Sessões por videochamada de alta qualidade, de onde você estiver, com segurança total.', color: '#4A8FD4' },
    { icon: Shield, title: 'Privacidade Total', desc: 'Seus dados e conversas são protegidos por criptografia de ponta a ponta (LGPD).', color: '#52B788' },
]

const testimonials = [
    { name: 'Ana Luíza', text: 'Encontrei minha terapeuta perfeita em menos de 5 minutos. O processo é incrível!', stars: 5 },
    { name: 'Pedro H.', text: 'A videochamada é estável e a interface muito intuitiva. Super recomendo!', stars: 5 },
    { name: 'Mariana C.', text: 'Finalmente um app de saúde mental que entende minhas necessidades.', stars: 5 },
]

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100dvh', background: '#F6F8FB' }}>
            {/* Header */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: 'rgba(246,248,251,0.85)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                padding: '0 var(--sp-xl)',
                height: 'var(--header-h)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div className="flex items-center gap-sm">
                    <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Activity size={20} color="#fff" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TERApia</span>
                </div>
                <div className="flex gap-sm">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')} id="header-login">Entrar</button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')} id="header-register">Começar</button>
                </div>
            </header>

            {/* Hero */}
            <section style={{
                background: 'var(--gradient-hero)',
                padding: 'var(--sp-3xl) var(--sp-xl)',
                textAlign: 'center',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}
                >
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-full)',
                        padding: '6px 14px', marginBottom: 'var(--sp-lg)',
                        fontSize: '0.82rem', fontWeight: 600, backdropFilter: 'blur(8px)',
                    }}>
                        <Heart size={14} fill="currentColor" /> Saúde mental acessível para todos
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: 'var(--sp-lg)', lineHeight: 1.15 }}>
                        Encontre o psicólogo<br />
                        <span style={{ color: '#74C9A4' }}>certo para você</span>
                    </h1>

                    <p style={{ fontSize: '1.05rem', opacity: 0.85, maxWidth: 500, margin: '0 auto var(--sp-xl)', lineHeight: 1.7 }}>
                        O TERApia conecta você ao profissional de saúde mental ideal através de match personalizado e consultas por vídeo seguras.
                    </p>

                    <div className="flex items-center justify-center gap-md" style={{ flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-lg"
                            style={{ background: '#fff', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
                            onClick={() => navigate('/register')}
                            id="hero-start-patient"
                        >
                            Sou Paciente <ArrowRight size={18} />
                        </button>
                        <button
                            className="btn btn-lg"
                            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}
                            onClick={() => navigate('/register?type=pro')}
                            id="hero-start-pro"
                        >
                            Sou Profissional
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-lg" style={{ marginTop: 'var(--sp-xl)', flexWrap: 'wrap' }}>
                        {['+5.000 pacientes', '+1.200 profissionais', '4.9★ avaliação'].map(stat => (
                            <span key={stat} style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: 600 }}>{stat}</span>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section style={{ padding: 'var(--sp-3xl) var(--sp-xl)', maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--sp-2xl)' }}>
                    <h2 style={{ fontSize: '1.9rem', marginBottom: 'var(--sp-sm)' }}>Por que o TERApia?</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>Uma plataforma pensada para o seu bem-estar</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-lg)' }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            className="card"
                            style={{ padding: 'var(--sp-xl)' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.2 }}
                        >
                            <div style={{
                                width: 52, height: 52, borderRadius: 'var(--radius-md)',
                                background: f.color + '18',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 'var(--sp-md)'
                            }}>
                                <f.icon size={24} color={f.color} />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: 'var(--sp-sm)' }}>{f.title}</h3>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: '0.92rem' }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section style={{ padding: 'var(--sp-2xl) var(--sp-xl)', background: 'var(--color-bg-subtle)' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.9rem', marginBottom: 'var(--sp-2xl)' }}>Como funciona</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--sp-xl)' }}>
                        {[
                            { n: '01', title: 'Crie seu perfil', desc: 'Cadastre-se e informe suas necessidades em minutos.' },
                            { n: '02', title: 'Encontre o match', desc: 'Deslize os perfis e dê like nos que te interessam.' },
                            { n: '03', title: 'Agende sua sessão', desc: 'Escolha o horário ideal na agenda do profissional.' },
                            { n: '04', title: 'Comece o cuidado', desc: 'Consulta por vídeo segura, direto pelo app.' },
                        ].map(step => (
                            <div key={step.n} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: 'var(--radius-full)',
                                    background: 'var(--gradient-primary)', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto var(--sp-md)',
                                    fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800
                                }}>{step.n}</div>
                                <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 4 }}>{step.title}</h4>
                                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={{ padding: 'var(--sp-3xl) var(--sp-xl)', maxWidth: 1100, margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.9rem', marginBottom: 'var(--sp-2xl)' }}>O que dizem nossos usuários</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-lg)' }}>
                    {testimonials.map(t => (
                        <div key={t.name} className="card" style={{ padding: 'var(--sp-xl)' }}>
                            <div className="flex gap-xs" style={{ marginBottom: 'var(--sp-md)' }}>
                                {Array.from({ length: t.stars }).map((_, i) => (
                                    <Star key={i} size={16} fill="var(--color-warning)" color="var(--color-warning)" />
                                ))}
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-md)', fontStyle: 'italic', lineHeight: 1.6 }}>"{t.text}"</p>
                            <div className="flex items-center gap-sm">
                                <div className="avatar avatar-sm">{t.name[0]}</div>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{
                padding: 'var(--sp-3xl) var(--sp-xl)',
                background: 'var(--gradient-hero)',
                textAlign: 'center',
                color: '#fff'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--sp-md)', color: '#fff' }}>Cuide da sua saúde mental hoje</h2>
                <p style={{ opacity: 0.85, marginBottom: 'var(--sp-xl)', fontSize: '1.05rem' }}>Prime consulta gratuita para novos usuários</p>
                <button
                    className="btn btn-lg"
                    style={{ background: '#fff', color: 'var(--color-primary)' }}
                    onClick={() => navigate('/register')}
                    id="cta-register"
                >
                    Começar agora <ArrowRight size={18} />
                </button>
            </section>

            {/* Footer */}
            <footer style={{
                background: 'var(--color-text)', color: 'rgba(255,255,255,0.5)',
                padding: 'var(--sp-xl)',
                textAlign: 'center', fontSize: '0.85rem'
            }}>
                <div className="flex items-center justify-center gap-sm" style={{ marginBottom: 'var(--sp-sm)' }}>
                    <Activity size={16} color="#fff" />
                    <span style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontWeight: 700, fontSize: '1rem' }}>TERApia</span>
                </div>
                <p>© 2026 TERApia. Todos os direitos reservados. Protegido pela LGPD.</p>
                <div className="flex items-center justify-center gap-md" style={{ marginTop: 'var(--sp-md)' }}>
                    {['Privacidade', 'Termos de Uso', 'Segurança', 'Contato'].map(link => (
                        <span key={link} style={{ cursor: 'pointer' }}>{link}</span>
                    ))}
                </div>
            </footer>
        </div>
    )
}
