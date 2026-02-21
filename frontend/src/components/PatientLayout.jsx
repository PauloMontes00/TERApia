import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, Heart, Calendar, User, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Toast from './Toast'

const tabs = [
    { path: '/patient/home', icon: Home, label: 'Início' },
    { path: '/patient/swipe', icon: Heart, label: 'Buscar' },
    { path: '/patient/matches', icon: Heart, label: 'Matches', match: true },
    { path: '/patient/notifications', icon: Bell, label: 'Avisos' },
    { path: '/patient/profile', icon: User, label: 'Perfil' },
]

export default function PatientLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { notifications, toasts } = useApp()
    const unread = notifications.filter(n => !n.read).length

    return (
        <div className="patient-layout">
            <div className="patient-content">
                <Outlet />
            </div>

            <nav className="bottom-nav">
                {tabs.map(tab => {
                    const active = location.pathname === tab.path
                    const Icon = tab.icon
                    const isNotif = tab.path.includes('notifications')
                    return (
                        <button
                            key={tab.path}
                            className={`bottom-nav-item ${active ? 'active' : ''}`}
                            onClick={() => navigate(tab.path)}
                            id={`nav-${tab.label.toLowerCase()}`}
                        >
                            <div style={{ position: 'relative' }}>
                                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                                {isNotif && unread > 0 && (
                                    <span style={{
                                        position: 'absolute', top: -5, right: -8,
                                        background: 'var(--color-danger)', color: '#fff',
                                        fontSize: '0.6rem', fontWeight: 700,
                                        borderRadius: 'var(--radius-full)',
                                        padding: '1px 5px', lineHeight: 1.4
                                    }}>{unread}</span>
                                )}
                            </div>
                            <span className="bottom-nav-label">{tab.label}</span>
                        </button>
                    )
                })}
            </nav>

            <Toast toasts={toasts} />
        </div>
    )
}
