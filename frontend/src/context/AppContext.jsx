import { useState, useEffect, useRef } from 'react'
import { AppContext } from './context'

/**
 * AppContext: gerenciamento global do frontend com conexão real à API.
 * Substitui mocks por chamadas HTTP e gerencia autenticação JWT/usuário.
 */
// AppContext é importado de context.js

// helper para requisições autenticadas; usa token do localStorage
// devolve a `Response` quando sucesso e rejeita com um Error em caso de
// status >= 400. O objeto Error contém `status` e mensagem extraída do
// corpo JSON/texto para auxiliar na depuração.
async function authFetch(path, options = {}) {
    const token = localStorage.getItem('token');
    const res = await fetch(path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    if (!res.ok) {
        let text;
        try { text = await res.text(); } catch { text = ''; }
        let message = res.statusText;
        try {
            const json = JSON.parse(text);
            if (json && json.error) message = json.error;
        } catch {
            // parsing failed, ignore non-JSON error body
        }
        const err = new Error(message || `HTTP ${res.status}`);
        // anexa o status para quem precisar
        // adiciona status ao erro para permitir tratamento posterior
        err.status = res.status;
        throw err;
    }
    return res;
}

export function AppProvider({ children }) {
    // Estado principal que define qual "módulo" (Paciente ou Psicólogo) está sendo exibido na tela

    // autenticação/token
    // (user definido mais abaixo via lazy init)

    // inicializa `user` e `userType` a partir do localStorage
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {
                console.warn('Failed to parse stored user', e);
                localStorage.removeItem('user');
            }
        }
        return null;
    });
    const [userType, setUserType] = useState(() => user ? user.role.toLowerCase() : null);

    // Estados Globais de Dados provenientes da API
    const [professionals, setProfessionals] = useState([])
    const [matches, setMatches] = useState([])
    const [patients, setPatients] = useState([]) // somente para profissional

    // notificações reais serão recebidas via socket.io mais tarde
    const [notifications, setNotifications] = useState([])

    // Sistema global de Toasts (Avisos efêmeros no canto da tela)
    const [toasts, setToasts] = useState([])
    const toastTimeouts = useRef({});

    /**
     * Função auxiliar genérica para disparar Toasts visuais a partir de qualquer página.
     * Ela insere na fila e apaga automaticamente após 3.5 segundos.
     */
    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        const t = setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
            delete toastTimeouts.current[id];
        }, 3500);
        toastTimeouts.current[id] = t;
        return id;
    };

    // limpa timeouts quando o provedor desmontar
    useEffect(() => {
        return () => {
            Object.values(toastTimeouts.current).forEach(clearTimeout);
            toastTimeouts.current = {};
        };
    }, []);

    // --- Autenticação real ---
    const login = async (email, password) => {
        try {
            const res = await authFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            setUser(data.user);
            setUserType(data.user.role.toLowerCase());
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.user;
        } catch (err) {
            addToast(err.message || 'Erro no login', 'error');
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        setUserType(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // --- fetchers ---
    useEffect(() => {
        // quando muda userType, buscar dados iniciais
        let cancelled = false;
        const fetchData = async () => {
            try {
                if (userType === 'patient') {
                    const proRes = await authFetch('/api/patient/discover');
                    const proJson = await proRes.json();
                    if (!cancelled) {
                        // mapeia a resposta para o formato esperado pela UI antiga
                        const normalized = (proJson || []).map(p => {
                            const name = p.name || '';
                            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                            const hue = name
                                .split('')
                                .reduce((h, c) => (h + c.charCodeAt(0)) % 360, 0);
                            const color = `hsl(${hue},60%,50%)`;
                            return {
                                ...p,
                                initials,
                                color,
                                available: true,
                                specialty: Array.isArray(p.specialties) && p.specialties.length ? p.specialties[0] : '',
                                price: p.hourlyRate || 0,
                                crp: p.crp || '',
                            };
                        });
                        setProfessionals(normalized);
                    }

                    const matchRes = await authFetch('/api/patient/matches');
                    const matchJson = await matchRes.json();
                    if (!cancelled) {
                        const norm = (matchJson || []).map(m => {
                            const name = m.professional_name || '';
                            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                            const hue = name
                                .split('')
                                .reduce((h, c) => (h + c.charCodeAt(0)) % 360, 0);
                            const color = `hsl(${hue},60%,50%)`;
                            return {
                                ...m,
                                name,
                                initials,
                                color,
                                specialty: '',
                                price: m.hourlyRate || 0,
                                available: true,
                            };
                        });
                        setMatches(norm);
                    }
                } else if (userType === 'professional') {
                    const pendingRes = await authFetch('/api/pro/pending-matches');
                    const pendingJson = await pendingRes.json();
                    if (!cancelled) {
                        const norm = (pendingJson || []).map(m => {
                            const name = m.patient_name || '';
                            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                            const hue = name
                                .split('')
                                .reduce((h, c) => (h + c.charCodeAt(0)) % 360, 0);
                            const color = `hsl(${hue},60%,50%)`;
                            return { ...m, initials, color };
                        });
                        setMatches(norm);
                        setPatients(norm);
                    }
                }
            } catch (err) {
                if (err.status === 401) {
                    logout();
                    addToast('Sessão expirada, faça login novamente', 'error');
                } else {
                    console.error('Failed to fetch initial data', err);
                    addToast('Erro ao carregar dados iniciais', 'error');
                }
            }
        };
        if (userType) fetchData();
        return () => {
            cancelled = true;
        };
    }, [userType]);

    /**
     * Chamadas à API para ações de swipe / resposta de match
     */
    const swipe = async (toProfessionalId, direction) => {
        try {
            const res = await authFetch('/api/patient/swipe', {
                method: 'POST',
                body: JSON.stringify({ toProfessionalId, direction }),
            });
            const body = await res.json();
            if (direction === 'LIKE' && body.match) {
                setMatches(prev => [...prev, body.match]);
            }
            return body;
        } catch (err) {
            addToast(err.message || 'Erro ao enviar swipe', 'error');
            throw err;
        }
    };

    const respondToMatch = async (matchId, status) => {
        try {
            const res = await authFetch('/api/pro/respond', {
                method: 'POST',
                body: JSON.stringify({ matchId, status }),
            });
            const updated = await res.json();
            setMatches(prev => prev.filter(m => m.id !== matchId));
            setPatients(prev => prev.filter(p => p.id !== matchId));
            return updated;
        } catch (err) {
            addToast(err.message || 'Erro ao responder ao match', 'error');
            throw err;
        }
    };

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
            swipe,
            respondToMatch,
            notifications,
            setNotifications,
            toasts,
            addToast,
            authFetch,
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




