import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, Users, Calendar, BarChart2, Settings,
    ChevronLeft, ChevronRight, Activity, Bell
} from 'lucide-react'
import { useApp } from '../context/useApp'
import Toast from './Toast'

const navItems = [
    { path: '/pro/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/pro/patients', icon: Users, label: 'Pacientes' },
    { path: '/pro/agenda', icon: Calendar, label: 'Agenda' },
    { path: '/pro/reports', icon: BarChart2, label: 'Relatórios' },
    { path: '/pro/settings', icon: Settings, label: 'Configurações' },
]

const PAGE_TITLES = {
    '/pro/dashboard': 'Dashboard',
    '/pro/patients': 'Pacientes',
    '/pro/agenda': 'Minha Agenda',
    '/pro/reports': 'Relatórios',
    '/pro/settings': 'Configurações',
}

export default function ProLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { toasts } = useApp()

    const title = PAGE_TITLES[location.pathname] || 'TERApia Pro'

    return (
        <div className="pro-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-logo">
                    <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <Activity size={20} color="#fff" strokeWidth={2.5} />
                    </div>
                    {!collapsed && <span className="sidebar-logo-text">TERApia</span>}
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => {
                        const active = location.pathname === item.path
                        const Icon = item.icon
                        return (
                            <button
                                key={item.path}
                                id={`sidebar-${item.label.toLowerCase()}`}
                                className={`sidebar-item ${active ? 'active' : ''}`}
                                onClick={() => navigate(item.path)}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                                {!collapsed && <span>{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>

                <div style={{ padding: 'var(--sp-md) var(--sp-sm)', borderTop: '1px solid var(--color-border)' }}>
                    <button
                        className="sidebar-item"
                        onClick={() => setCollapsed(c => !c)}
                        title="Recolher menu"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <><ChevronLeft size={20} /><span>Recolher</span></>}
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="pro-main">
                <header className="pro-header">
                    <h1 className="pro-header-title">{title}</h1>
                    <div className="flex items-center gap-md">
                        <button className="btn btn-ghost btn-icon" style={{ position: 'relative' }}>
                            <Bell size={20} />
                            <span style={{
                                position: 'absolute', top: 6, right: 6,
                                width: 8, height: 8, borderRadius: '50%',
                                background: 'var(--color-danger)',
                                border: '2px solid var(--color-bg-card)'
                            }} />
                        </button>
                        <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)', cursor: 'pointer' }}>
                            DR
                        </div>
                    </div>
                </header>

                <main className="pro-content">
                    <Outlet />
                </main>
            </div>

            <Toast toasts={toasts} />
        </div>
    )
}
