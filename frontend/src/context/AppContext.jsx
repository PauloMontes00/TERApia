import { createContext, useContext, useState, useEffect } from 'react'

/**
 * AppContext: gerenciamento global do frontend com conexão real à API.
 * Substitui mocks por chamadas HTTP e gerencia autenticação JWT/usuário.
 */
const AppContext = createContext(null)

// helper para requisições autenticadas; usa token do estado
function authFetch(path, options = {}) {
    const token = localStorage.getItem('token');
    return fetch(path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
}

export function AppProvider({ children }) {
    // Estado principal que define qual "módulo" (Paciente ou Psicólogo) está sendo exibido na tela
    const [userType, setUserType] = useState(null) // 'patient' | 'professional'

    // autenticação/token
    const [user, setUser] = useState(null) // { id, name, email, role }

    // restore from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const u = JSON.parse(stored);
                setUser(u);
                setUserType(u.role.toLowerCase());
            } catch {};
        }
    }, []);

    // Estados Globais de Dados provenientes da API
    const [professionals, setProfessionals] = useState([])
    const [matches, setMatches] = useState([])
    const [patients, setPatients] = useState([]) // somente para profissional

    // notificações reais serão recebidas via socket.io mais tarde
    const [notifications, setNotifications] = useState([])

    // Sistema global de Toasts (Avisos efêmeros no canto da tela)
    const [toasts, setToasts] = useState([])

    /**
     * Função auxiliar genérica para disparar Toasts visuais a partir de qualquer página.
     * Ela insere na fila e apaga automaticamente após 3.5 segundos.
     */
    const addToast = (message, type = 'info') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
    }

    // --- Autenticação real ---
    const login = async (email, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        setUser(data.user);
        setUserType(data.user.role.toLowerCase());
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    };

    const logout = () => {
        setUser(null);
        setUserType(null);
        localStorage.removeItem('token');
    };

    // --- fetchers ---
    useEffect(() => {
        // quando muda userType, buscar dados iniciais
        const fetchData = async () => {
            try {
                if (userType === 'patient') {
                    const proRes = await authFetch('/api/patient/discover');
                    const proJson = await proRes.json();
                    setProfessionals(proJson);

                    const matchRes = await authFetch('/api/patient/matches');
                    const matchJson = await matchRes.json();
                    setMatches(matchJson);
                } else if (userType === 'professional') {
                    const pendingRes = await authFetch('/api/pro/pending-matches');
                    const pendingJson = await pendingRes.json();
                    setMatches(pendingJson);
                }
            } catch (err) {
                console.error('Failed to fetch initial data', err);
                addToast('Erro ao carregar dados iniciais', 'error');
            }
        };
        if (userType) fetchData();
    }, [userType]);

    /**
     * Funções que simulam as chamadas para o controller 'proController.respondToMatch' no Backend.
     */
    const acceptPatient = (patientId) => {
        setPatients(prev => prev.map(p => p.id === patientId ? { ...p, pending: false, status: 'active' } : p))
        addToast('Match aceito! O paciente foi notificado.', 'success')
    }

    const declinePatient = (patientId) => {
        setPatients(prev => prev.filter(p => p.id !== patientId))
        addToast('Solicitação recusada.', 'info')
    }

    return (
        // Provedor que "derrama" todas essas funções e variáveis para os componentes filhos (rotas)
        <AppContext.Provider value={{
            userType,
            setUserType,
            user,
            login,
            logout,
            professionals,
            matches,
            setMatches,
            patients,
            setPatients,
            acceptPatient,
            declinePatient,
            notifications,
            setNotifications,
            toasts,
            addToast,
        }}>
            {children}
        </AppContext.Provider>
    )
}

/**
 * Hook Customizado (Atalho): `useApp()`
 * Usado dentro das páginas (ex: Profile, Dashboard) para capturar imediatamente
 * as funções do AppContext sem precisar rescrever o `useContext(AppContext)`.
 */
export function useApp() {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp must be used within AppProvider')
    return ctx
}

export { AppProvider }
