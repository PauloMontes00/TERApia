import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Activity, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const { setUserType } = useApp()
    const [role, setRole] = useState(params.get('type') === 'pro' ? 'professional' : 'patient')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)

    const handleLogin = (e) => {
        e.preventDefault()
        setUserType(role)
        navigate(role === 'patient' ? '/patient/home' : '/pro/dashboard')
    }

    return (
        <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: 'var(--sp-lg)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', maxWidth: 420 }}
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-sm" style={{ marginBottom: 'var(--sp-xl)' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity size={22} color="#fff" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TERApia</span>
                </div>

                <div className="card" style={{ padding: 'var(--sp-xl)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--sp-sm)', fontSize: '1.4rem' }}>Bem-vindo de volta</h2>
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-xl)', fontSize: '0.92rem' }}>Entre na sua conta TERApia</p>

                    {/* Role Selector */}
                    <div style={{ display: 'flex', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 'var(--sp-xl)' }}>
                        {[{ v: 'patient', l: 'Paciente' }, { v: 'professional', l: 'Profissional' }].map(opt => (
                            <button
                                key={opt.v}
                                id={`login-role-${opt.v}`}
                                onClick={() => setRole(opt.v)}
                                style={{
                                    flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)',
                                    border: 'none', cursor: 'pointer',
                                    background: role === opt.v ? 'var(--color-bg-card)' : 'transparent',
                                    color: role === opt.v ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.88rem',
                                    boxShadow: role === opt.v ? 'var(--shadow-sm)' : 'none',
                                    transition: 'all var(--transition-fast)'
                                }}
                            >{opt.l}</button>
                        ))}
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                        <div className="form-group">
                            <label className="form-label">E-mail</label>
                            <input id="login-email" type="email" className="form-input" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Senha</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="login-password"
                                    type={showPass ? 'text' : 'password'}
                                    className="form-input"
                                    style={{ width: '100%', paddingRight: 44 }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(s => !s)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                                >
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <span
                                style={{ fontSize: '0.82rem', color: 'var(--color-primary)', cursor: 'pointer', alignSelf: 'flex-end' }}
                                id="forgot-password"
                            >
                                Esqueci minha senha
                            </span>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-lg" id="login-submit" style={{ marginTop: 'var(--sp-sm)' }}>
                            Entrar <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="divider" />

                    <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                        Não tem conta?{' '}
                        <span style={{ color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/register')}>
                            Criar conta
                        </span>
                    </p>
                </div>

                <p style={{ textAlign: 'center', marginTop: 'var(--sp-lg)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    🔒 Seus dados estão protegidos pela LGPD
                </p>
            </motion.div>
        </div>
    )
}
