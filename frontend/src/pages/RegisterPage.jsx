import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, ArrowRight, ArrowLeft, Check, User, Stethoscope } from 'lucide-react'
import { useApp } from '../context/AppContext'

// Define de antemão um array de especialidades para médicos selecionarem
const SPECIALTIES = ['Ansiedade', 'Depressão', 'Autoestima', 'Relacionamentos', 'Estresse', 'TDAH', 'TOC', 'Trauma', 'Família', 'Casal', 'Luto', 'Sexualidade']

export default function RegisterPage() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const { setUserType } = useApp()

    // Controla qual fluxo renderizar (null = escolhendo, 'patient' = Paciente, 'professional' = Médico)
    const [type, setType] = useState(params.get('type') === 'pro' ? 'professional' : null)

    // Controle de Paginação (Formulário em Etapas / Multi-step Form)
    const [step, setStep] = useState(1)

    // Estado unificado do Formulário - guarda tudo até enviar para a API no último passo
    const [form, setForm] = useState({ name: '', email: '', password: '', crp: '', bio: '', specialties: [], price: '' })

    // Função auxiliar genérica para atualizar qualquer campo do Form
    const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

    // Toggle para arrays: adiciona a especialidade se não tiver, remove se já tiver
    const toggleSpec = (s) =>
        setForm(f => ({ ...f, specialties: f.specialties.includes(s) ? f.specialties.filter(x => x !== s) : [...f.specialties, s] }))

    // Determina a quantidade de passos com base no tipo. Médicos precisam de mais informações que pacientes.
    const totalSteps = type === 'professional' ? 4 : 2
    const progress = (step / totalSteps) * 100

    /**
     * Função Finalizar Cadastro. Aqui, futuramente será feito um POST na `/api/auth/register`.
     * Por enquanto (Mock), ele apenas limpa a tela e leva pro Dashboard correspondente.
     */
    const finish = () => {
        setUserType(type)
        navigate(type === 'professional' ? '/pro/dashboard' : '/patient/home')
    }

    // Step 0 — choose type
    if (!type) {
        return (
            <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: 'var(--sp-lg)' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>
                    <div className="flex items-center justify-center gap-sm" style={{ marginBottom: 'var(--sp-xl)' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={22} color="#fff" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TERApia</span>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--sp-sm)' }}>Como você vai usar o TERApia?</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-xl)', fontSize: '0.92rem' }}>Escolha o tipo de conta para personalizar sua experiência</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-md)' }}>
                        {[
                            { v: 'patient', icon: User, title: 'Paciente', desc: 'Quero encontrar um profissional e cuidar da minha saúde mental', color: '#4A8FD4' },
                            { v: 'professional', icon: Stethoscope, title: 'Profissional', desc: 'Sou psicólogo ou psiquiatra e quero atender pacientes', color: '#52B788' },
                        ].map(opt => (
                            <button
                                key={opt.v}
                                id={`register-type-${opt.v}`}
                                onClick={() => { setType(opt.v); setStep(1) }}
                                style={{
                                    border: '2px solid var(--color-border)', borderRadius: 'var(--radius-xl)',
                                    padding: 'var(--sp-xl)', cursor: 'pointer', background: 'var(--color-bg-card)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-md)',
                                    transition: 'all var(--transition-normal)', textAlign: 'center'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = opt.color; e.currentTarget.style.boxShadow = `0 0 0 4px ${opt.color}20` }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
                            >
                                <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-lg)', background: opt.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <opt.icon size={28} color={opt.color} />
                                </div>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{opt.title}</div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{opt.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <p style={{ marginTop: 'var(--sp-xl)', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                        Já tem conta?{' '}
                        <span style={{ color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/login')}>Entrar</span>
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: 'var(--sp-lg)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 480 }}>
                {/* Progress */}
                <div style={{ marginBottom: 'var(--sp-xl)' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-sm)' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => step > 1 ? setStep(s => s - 1) : setType(null)}>
                            <ArrowLeft size={16} /> Voltar
                        </button>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Passo {step} de {totalSteps}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 'var(--radius-full)' }}>
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            style={{ height: '100%', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)' }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--sp-xl)' }}>
                    <AnimatePresence mode="wait">
                        {/* Step 1: Basic info */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 style={{ marginBottom: 4, fontSize: '1.3rem' }}>Dados básicos</h2>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-xl)', fontSize: '0.9rem' }}>Como devemos te chamar?</p>
                                <div className="flex-col gap-md">
                                    <div className="form-group">
                                        <label className="form-label">Nome completo</label>
                                        <input id="reg-name" type="text" className="form-input" placeholder="Seu nome completo" value={form.name} onChange={e => update('name', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">E-mail</label>
                                        <input id="reg-email" type="email" className="form-input" placeholder="seu@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Senha</label>
                                        <input id="reg-password" type="password" className="form-input" placeholder="Mínimo 8 caracteres" value={form.password} onChange={e => update('password', e.target.value)} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2 (patient) — final */}
                        {step === 2 && type === 'patient' && (
                            <motion.div key="step2p" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 style={{ marginBottom: 4, fontSize: '1.3rem' }}>O que te trouxe aqui?</h2>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-xl)', fontSize: '0.9rem' }}>Selecione os temas que mais te identificam (opcional)</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-xl)' }}>
                                    {SPECIALTIES.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => toggleSpec(s)}
                                            style={{
                                                padding: '8px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem',
                                                fontWeight: 600, fontFamily: 'var(--font-heading)',
                                                border: `2px solid ${form.specialties.includes(s) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                background: form.specialties.includes(s) ? 'rgba(74,143,212,0.1)' : 'transparent',
                                                color: form.specialties.includes(s) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                                cursor: 'pointer', transition: 'all var(--transition-fast)'
                                            }}
                                        >{s}</button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2 (pro) — CRP */}
                        {step === 2 && type === 'professional' && (
                            <motion.div key="step2pro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 style={{ marginBottom: 4, fontSize: '1.3rem' }}>Credenciais profissionais</h2>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-xl)', fontSize: '0.9rem' }}>Necessário para verificar seu registro</p>
                                <div className="flex-col gap-md">
                                    <div className="form-group">
                                        <label className="form-label">CRP / CRM</label>
                                        <input id="reg-crp" type="text" className="form-input" placeholder="Ex: 06/123456" value={form.crp} onChange={e => update('crp', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Valor da consulta (R$)</label>
                                        <input id="reg-price" type="number" className="form-input" placeholder="Ex: 180" value={form.price} onChange={e => update('price', e.target.value)} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3 (pro) — Specialties */}
                        {step === 3 && type === 'professional' && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 style={{ marginBottom: 4, fontSize: '1.3rem' }}>Suas especialidades</h2>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-xl)', fontSize: '0.9rem' }}>Selecione as áreas em que você atua</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-md)' }}>
                                    {SPECIALTIES.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => toggleSpec(s)}
                                            style={{
                                                padding: '8px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem',
                                                fontWeight: 600, fontFamily: 'var(--font-heading)',
                                                border: `2px solid ${form.specialties.includes(s) ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                                                background: form.specialties.includes(s) ? 'rgba(82,183,136,0.1)' : 'transparent',
                                                color: form.specialties.includes(s) ? 'var(--color-secondary-dark)' : 'var(--color-text-secondary)',
                                                cursor: 'pointer', transition: 'all var(--transition-fast)'
                                            }}
                                        >{s}</button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4 (pro) — Bio */}
                        {step === 4 && type === 'professional' && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 style={{ marginBottom: 4, fontSize: '1.3rem' }}>Sua apresentação</h2>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-xl)', fontSize: '0.9rem' }}>Escreva uma bio que os pacientes verão no seu cartão</p>
                                <div className="form-group">
                                    <label className="form-label">Biografia</label>
                                    <textarea
                                        id="reg-bio"
                                        className="form-input"
                                        rows={5}
                                        placeholder="Descreva sua abordagem, experiência e o que te motiva a ajudar as pessoas..."
                                        value={form.bio}
                                        onChange={e => update('bio', e.target.value)}
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ marginTop: 'var(--sp-xl)' }}>
                        {step < totalSteps ? (
                            <button
                                className="btn btn-primary btn-block btn-lg"
                                id="register-next"
                                onClick={() => setStep(s => s + 1)}
                            >
                                Continuar <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button className="btn btn-primary btn-block btn-lg" id="register-finish" onClick={finish}>
                                <Check size={18} /> Criar conta
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
