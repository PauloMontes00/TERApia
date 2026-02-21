import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { X, Heart, Star, Filter, ChevronDown, MapPin } from 'lucide-react'
import { useApp } from '../../context/AppContext'

/**
 * ProCard Component: Renderiza o cartão individual do profissional na tela de Swipe.
 * Recebe se ele é o cartão "do topo" (isTop) para aplicar a física de arrastar (Drag).
 */
function ProCard({ pro, onLike, onPass, isTop }) {
    // Hooks do Framer Motion para controlar a posição X do cartão enquanto ele é arrastado
    const x = useMotionValue(0)

    // Transforma a posição X em Rotação (Efeito Tinder: inclina levemente ao arrastar)
    const rotate = useTransform(x, [-200, 200], [-20, 20])

    // Controla a transparência das etiquetas 'LIKE' (verde) e 'PASS' (vermelho) baseado na distância
    const likeOpacity = useTransform(x, [30, 100], [0, 1])
    const passOpacity = useTransform(x, [-100, -30], [1, 0])

    /**
     * Gatilho disparado quando o usuário solta o cartão.
     * Se arrastou mais de 100px pra direita ativa OnLike, pra esquerda OnPass.
     */
    const handleDragEnd = (_, info) => {
        if (info.offset.x > 100) onLike()
        else if (info.offset.x < -100) onPass()
    }

    return (
        <motion.div
            style={{
                position: 'absolute', x, rotate,
                width: '100%', maxWidth: 400,
                cursor: isTop ? 'grab' : 'default',
                userSelect: 'none',
                zIndex: isTop ? 10 : 5
            }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.03 }}
            initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 12 }}
        >
            <div style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                position: 'relative'
            }}>
                {/* Photo area */}
                <div style={{
                    height: 320,
                    background: `linear-gradient(135deg, ${pro.color}40, ${pro.color}20)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{
                        width: 140, height: 140, borderRadius: '50%',
                        background: pro.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '3.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800,
                        boxShadow: `0 12px 40px ${pro.color}50`
                    }}>{pro.initials}</div>

                    {/* Like / Pass overlays */}
                    {isTop && (
                        <>
                            <motion.div style={{
                                position: 'absolute', top: 20, left: 20, opacity: likeOpacity,
                                border: '3px solid var(--color-secondary)', borderRadius: 8,
                                padding: '6px 14px', color: 'var(--color-secondary)',
                                fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-heading)',
                                transform: 'rotate(-15deg)'
                            }}>LIKE</motion.div>
                            <motion.div style={{
                                position: 'absolute', top: 20, right: 20, opacity: passOpacity,
                                border: '3px solid var(--color-danger)', borderRadius: 8,
                                padding: '6px 14px', color: 'var(--color-danger)',
                                fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-heading)',
                                transform: 'rotate(15deg)'
                            }}>PASS</motion.div>
                        </>
                    )}

                    {pro.available && (
                        <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)' }}>
                            <span className="badge badge-success" style={{ boxShadow: 'var(--shadow-sm)' }}>● Online agora</span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div style={{ padding: 'var(--sp-lg)' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>{pro.name}</h3>
                        <div className="flex items-center gap-xs">
                            <Star size={14} fill="var(--color-warning)" color="var(--color-warning)" />
                            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{pro.rating}</span>
                        </div>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--sp-md)' }}>{pro.specialty} · CRP {pro.crp}</p>
                    <p style={{ color: 'var(--color-text)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 'var(--sp-md)' }}>{pro.bio}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--sp-md)' }}>
                        {pro.specialties.slice(0, 4).map(s => (
                            <span key={s} className="badge badge-primary">{s}</span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>R$ {pro.price}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>/sessão</span>
                        </div>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                            <MapPin size={12} style={{ display: 'inline' }} /> Online
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function SwipeScreen() {
    const navigate = useNavigate()
    // Puxa as funções do contexto global: Lista de Profissionais, e funções para salvar Matches/Toasts
    const { professionals, matches, setMatches, addToast } = useApp()

    // Indice atual de qual profissional estamos vendo na pilha de arrastos
    const [index, setIndex] = useState(0)
    const [showFilter, setShowFilter] = useState(false)
    const [history, setHistory] = useState([])

    // Filtra array a partir do indice atual para evitar mapeamento desnecessário na "pilha"
    const remaining = professionals.slice(index)
    const current = remaining[0]  // O que fica no topo, com evento de clique/arrasto
    const next = remaining[1]     // O que fica logo atrás, borrado/menor

    /**
     * Função Disparada por (1) Swipe pra Direita ou (2) Clique no Botão Coração.
     * Na integração com DB (Node) envia POST para o backend salvando intenção de Match.
     */
    const handleLike = () => {
        if (!current) return // Trava de segurança

        setHistory(h => [...h, { pro: current, action: 'like' }])

        // Simulação MOCK: Já cria um Match ativo automático
        setMatches(m => [...m, { ...current, matchDate: new Date().toISOString().split('T')[0], status: 'active', nextSession: null }])

        addToast(`Você deu like em ${current.name}! 💚`, 'success') // Aviso visual limpo

        // Passa a pilha adiante
        setIndex(i => i + 1)
    }

    /**
     * Função Disparada por Swipe Esquerda ou Botão X. Descarta silenciosamente o Card.
     */
    const handlePass = () => {
        if (!current) return
        setHistory(h => [...h, { pro: current, action: 'pass' }])
        setIndex(i => i + 1)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - var(--bottom-nav-h))' }}>
            {/* Header */}
            <div className="flex items-center justify-between" style={{ padding: 'var(--sp-md) var(--sp-lg)', flexShrink: 0 }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>Explorar</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{remaining.length} profissionais</p>
                </div>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowFilter(s => !s)}
                    id="filter-toggle"
                >
                    <Filter size={16} /> Filtros <ChevronDown size={14} />
                </button>
            </div>

            {/* Filter panel */}
            <AnimatePresence>
                {showFilter && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', padding: '0 var(--sp-lg)' }}
                    >
                        <div style={{ padding: 'var(--sp-md) 0', display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-sm)' }}>
                            {['Todos', 'Psicólogo', 'Psiquiatra', 'Online agora', 'Até R$200'].map(f => (
                                <button key={f} className="badge badge-primary" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.8rem' }}>{f}</button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Card deck */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-lg)', paddingBottom: 0, position: 'relative' }}>
                <AnimatePresence>
                    {!current ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-md)' }}>🎉</div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 4 }}>Você viu todos!</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Novos profissionais em breve</p>
                        </motion.div>
                    ) : (
                        <>
                            {next && <ProCard key={next.id + '-next'} pro={next} onLike={() => { }} onPass={() => { }} isTop={false} />}
                            <ProCard key={current.id} pro={current} onLike={handleLike} onPass={handlePass} isTop={true} />
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Action buttons */}
            {current && (
                <div className="flex items-center justify-center gap-xl" style={{ padding: 'var(--sp-xl) var(--sp-lg)' }}>
                    <motion.button
                        className="btn"
                        style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-bg-card)', border: '2px solid var(--color-danger)', color: 'var(--color-danger)', boxShadow: 'var(--shadow-md)' }}
                        onClick={handlePass}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        id="btn-pass"
                    >
                        <X size={28} strokeWidth={2.5} />
                    </motion.button>

                    <motion.button
                        className="btn"
                        style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gradient-primary)', color: '#fff', boxShadow: '0 8px 24px rgba(74,143,212,0.4)', border: 'none' }}
                        onClick={handleLike}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        id="btn-like"
                    >
                        <Heart size={32} strokeWidth={2.5} fill="white" />
                    </motion.button>
                </div>
            )}
        </div>
    )
}
