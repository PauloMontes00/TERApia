import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, Calendar, Video, Shield, Heart } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function ProfessionalProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { professionals, matches, setMatches, addToast } = useApp()

    const pro = professionals.find(p => p.id === id) || professionals[0]
    const isMatched = matches.some(m => m.id === pro.id)

    const handleLike = () => {
        if (!isMatched) {
            setMatches(m => [...m, { ...pro, matchDate: new Date().toISOString().split('T')[0], status: 'active', nextSession: null }])
            addToast(`Match com ${pro.name}! 💚`, 'success')
        }
        navigate('/patient/matches')
    }

    if (!pro) return null

    return (
        <div>
            {/* Header photo */}
            <div style={{
                height: 280, background: `linear-gradient(180deg, ${pro.color}30, ${pro.color}60)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative'
            }}>
                <button
                    className="btn btn-ghost"
                    style={{ position: 'absolute', top: 'var(--sp-lg)', left: 'var(--sp-lg)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-full)', padding: 10 }}
                    onClick={() => navigate(-1)}
                    id="back-btn"
                >
                    <ChevronLeft size={20} />
                </button>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{
                        width: 120, height: 120, borderRadius: '50%', background: pro.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800,
                        boxShadow: `0 12px 40px ${pro.color}60`, border: '4px solid #fff'
                    }}
                >{pro.initials}</motion.div>

                {pro.available && (
                    <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
                        <span className="badge badge-success" style={{ background: 'var(--color-success)', color: '#fff', padding: '5px 14px' }}>● Disponível agora</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: 'var(--sp-lg)', paddingBottom: 120 }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--sp-xl)' }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>{pro.name}</h1>
                    <p style={{ color: 'var(--color-text-secondary)', margin: '4px 0' }}>{pro.specialty}</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: 'var(--sp-md)' }}>CRP {pro.crp}</p>
                    <div className="flex items-center justify-center gap-md">
                        <div className="flex items-center gap-xs">
                            <Star size={16} fill="var(--color-warning)" color="var(--color-warning)" />
                            <span style={{ fontWeight: 700 }}>{pro.rating}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>({pro.reviews} avaliações)</span>
                        </div>
                        <span style={{ color: 'var(--color-text-muted)' }}>·</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>R$ {pro.price}/sessão</span>
                    </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-xl)' }}>
                    {[{ v: '8+', l: 'Anos exp.' }, { v: pro.reviews, l: 'Pacientes' }, { v: '100%', l: 'Online' }].map(s => (
                        <div key={s.l} className="card" style={{ padding: 'var(--sp-md)', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)' }}>{s.v}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.l}</div>
                        </div>
                    ))}
                </div>

                {/* Bio */}
                <div style={{ marginBottom: 'var(--sp-xl)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--sp-sm)' }}>Sobre</h3>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, fontSize: '0.92rem' }}>{pro.bio}</p>
                </div>

                {/* Specialties */}
                <div style={{ marginBottom: 'var(--sp-xl)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--sp-md)' }}>Especialidades</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {pro.specialties.map(s => (
                            <span key={s} className="badge badge-primary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>{s}</span>
                        ))}
                    </div>
                </div>

                {/* Languages */}
                <div style={{ marginBottom: 'var(--sp-xl)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--sp-md)' }}>Idiomas</h3>
                    <div className="flex gap-sm">
                        {pro.languages.map(l => <span key={l} className="badge badge-neutral">{l}</span>)}
                    </div>
                </div>

                {/* Privacy note */}
                <div className="card" style={{ padding: 'var(--sp-md)', display: 'flex', gap: 'var(--sp-sm)', alignItems: 'flex-start', background: 'rgba(82,183,136,0.06)', border: '1px solid rgba(82,183,136,0.2)' }}>
                    <Shield size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        Suas consultas são protegidas por sigilo profissional e criptografia de ponta a ponta. Seus dados estão seguros conforme a LGPD.
                    </p>
                </div>
            </div>

            {/* Fixed action bar */}
            <div style={{
                position: 'fixed', bottom: 'var(--bottom-nav-h)', left: 0, right: 0,
                background: 'rgba(246,248,251,0.95)', backdropFilter: 'blur(10px)',
                borderTop: '1px solid var(--color-border)', padding: 'var(--sp-md) var(--sp-lg)',
                display: 'flex', gap: 'var(--sp-md)'
            }}>
                <button
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => navigate(`/patient/schedule/${pro.id}`)}
                    id="schedule-btn"
                >
                    <Calendar size={18} /> Agendar
                </button>
                {isMatched ? (
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/patient/video')} id="video-btn">
                        <Video size={18} /> Consulta
                    </button>
                ) : (
                    <button className="btn btn-primary" style={{ flex: 1, background: 'var(--color-match)' }} onClick={handleLike} id="like-btn">
                        <Heart size={18} fill="white" /> Dar Like
                    </button>
                )}
            </div>
        </div>
    )
}
