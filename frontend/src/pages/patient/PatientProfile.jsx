import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Bell, Shield, LogOut, ChevronRight, Edit2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PatientProfile() {
    const navigate = useNavigate()
    const [name, setName] = useState('João Silva')
    const [editing, setEditing] = useState(false)

    const menuItems = [
        { icon: Bell, label: 'Notificações', sub: 'Gerenciar alertas', action: () => navigate('/patient/notifications') },
        { icon: Shield, label: 'Privacidade e Segurança', sub: 'Dados e LGPD', action: () => { } },
        { icon: LogOut, label: 'Sair', sub: 'Desconectar da conta', action: () => navigate('/'), danger: true },
    ]

    return (
        <div style={{ padding: 'var(--sp-lg)' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--sp-xl)' }}>Meu Perfil</h1>

            {/* Avatar section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--sp-xl)' }}>
                <div style={{ position: 'relative', marginBottom: 'var(--sp-md)' }}>
                    <div className="avatar avatar-xl" style={{ background: 'var(--gradient-primary)', fontSize: '2rem' }}>JS</div>
                    <button style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--color-primary)', border: '3px solid var(--color-bg-card)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                    }}>
                        <Camera size={14} color="#fff" />
                    </button>
                </div>
                {editing ? (
                    <input
                        className="form-input"
                        style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', maxWidth: 240 }}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onBlur={() => setEditing(false)}
                        autoFocus
                    />
                ) : (
                    <div className="flex items-center gap-sm">
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>{name}</h2>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)} id="edit-name">
                            <Edit2 size={14} />
                        </button>
                    </div>
                )}
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>Paciente · Membro desde 2026</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
                {[{ v: 2, l: 'Matches' }, { v: 12, l: 'Sessões' }, { v: '4.8⭐', l: 'Avaliação' }].map(s => (
                    <div key={s.l} className="card" style={{ padding: 'var(--sp-md)', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-primary)' }}>{s.v}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.l}</div>
                    </div>
                ))}
            </div>

            {/* Menu */}
            <div className="card" style={{ overflow: 'hidden' }}>
                {menuItems.map((item, i) => (
                    <motion.button
                        key={item.label}
                        id={`profile-${item.label.toLowerCase().replace(/ /g, '-')}`}
                        onClick={item.action}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)',
                            padding: 'var(--sp-lg)', background: 'none', border: 'none',
                            borderBottom: i < menuItems.length - 1 ? '1px solid var(--color-border)' : 'none',
                            cursor: 'pointer', textAlign: 'left', color: item.danger ? 'var(--color-danger)' : 'var(--color-text)'
                        }}
                        whileHover={{ background: 'var(--color-bg-subtle)' }}
                    >
                        <div style={{
                            width: 40, height: 40, borderRadius: 'var(--radius-md)',
                            background: item.danger ? 'rgba(232,93,93,0.1)' : 'var(--color-bg-subtle)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <item.icon size={18} color={item.danger ? 'var(--color-danger)' : 'var(--color-text-secondary)'} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.92rem' }}>{item.label}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.sub}</div>
                        </div>
                        <ChevronRight size={18} color="var(--color-text-muted)" />
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
