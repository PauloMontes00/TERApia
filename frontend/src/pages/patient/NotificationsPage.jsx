import { motion } from 'framer-motion'
import { Bell, Heart, Calendar, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const ICON_MAP = {
    match: <Heart size={18} color="var(--color-match)" fill="var(--color-match)" />,
    session: <Calendar size={18} color="var(--color-primary)" />,
}

export default function NotificationsPage() {
    const { notifications, setNotifications } = useApp()

    const markAll = () => setNotifications(n => n.map(x => ({ ...x, read: true })))

    return (
        <div style={{ padding: 'var(--sp-lg)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-xl)' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Notificações</h1>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{notifications.filter(n => !n.read).length} não lidas</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={markAll} id="mark-all-read">
                    <Check size={14} /> Marcar todas
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
                {notifications.map((n, i) => (
                    <motion.div
                        key={n.id}
                        className="card"
                        style={{
                            padding: 'var(--sp-md) var(--sp-lg)',
                            display: 'flex', alignItems: 'center', gap: 'var(--sp-md)',
                            opacity: n.read ? 0.65 : 1,
                            borderLeft: n.read ? '4px solid var(--color-border)' : '4px solid var(--color-primary)'
                        }}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: n.read ? 0.65 : 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {ICON_MAP[n.type] || <Bell size={18} color="var(--color-text-muted)" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>{n.text}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>há {n.time}</p>
                        </div>
                        {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
