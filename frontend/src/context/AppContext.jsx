import { createContext, useContext, useState } from 'react'

/**
 * AppContext: Coração do gerenciamento de estado global do Frontend.
 * Em um cenário real, este arquivo faria chamadas HTTP para nossa API Express/PostgreSQL.
 * Atualmente ele usa "Mock Data" (dados estáticos) para manter a interface funcionando fluida.
 */
const AppContext = createContext(null)
// Mock data
const MOCK_PROFESSIONALS = [
    {
        id: '1',
        name: 'Dra. Camila Rocha',
        specialty: 'Psicóloga Clínica',
        crp: '06/123456',
        bio: 'Especialista em ansiedade e depressão com 8 anos de experiência. Abordagem humanista e acolhedora para adultos e jovens adultos.',
        photo: null,
        initials: 'CR',
        rating: 4.9,
        reviews: 127,
        price: 180,
        gender: 'Feminino',
        languages: ['Português'],
        specialties: ['Ansiedade', 'Depressão', 'Autoestima', 'Relacionamentos'],
        available: true,
        color: '#4A8FD4',
    },
    {
        id: '2',
        name: 'Dr. Lucas Mendes',
        specialty: 'Psicólogo Comportamental',
        crp: '06/654321',
        bio: 'TCC e mindfulness para gerenciamento de estresse, TDAH e TOC. Consultas objetivas com foco em resultados práticos.',
        photo: null,
        initials: 'LM',
        rating: 4.8,
        reviews: 89,
        price: 160,
        gender: 'Masculino',
        languages: ['Português', 'Inglês'],
        specialties: ['Estresse', 'TDAH', 'TOC', 'Mindfulness'],
        available: true,
        color: '#52B788',
    },
    {
        id: '3',
        name: 'Dra. Fernanda Lima',
        specialty: 'Psiquiatra',
        crp: 'CRM/SP 98765',
        bio: 'Psiquiatra com foco em transtornos de humor, ansiedade e sono. Tratamento integrado com acompanhamento medicamentoso.',
        photo: null,
        initials: 'FL',
        rating: 4.95,
        reviews: 204,
        price: 320,
        gender: 'Feminino',
        languages: ['Português'],
        specialties: ['Transtorno Bipolar', 'Insônia', 'Depressão', 'Ansiedade'],
        available: false,
        color: '#7C3AED',
    },
    {
        id: '4',
        name: 'Dr. Rafael Souza',
        specialty: 'Psicoterapeuta',
        crp: '06/789012',
        bio: 'Psicoterapia psicanalítica para autoconhecimento profundo. Atendo casais, famílias e adultos individualmente.',
        photo: null,
        initials: 'RS',
        rating: 4.7,
        reviews: 63,
        price: 200,
        gender: 'Masculino',
        languages: ['Português', 'Espanhol'],
        specialties: ['Casal', 'Família', 'Autoconhecimento', 'Psicanálise'],
        available: true,
        color: '#D97706',
    },
    {
        id: '5',
        name: 'Dra. Ana Beatriz Costa',
        specialty: 'Neuropsicóloga',
        crp: '06/345678',
        bio: 'Avaliação e reabilitação neuropsicológica. Especialista em transtornos do neurodesenvolvimento em crianças e adultos.',
        photo: null,
        initials: 'AC',
        rating: 4.85,
        reviews: 41,
        price: 250,
        gender: 'Feminino',
        languages: ['Português'],
        specialties: ['Autismo', 'TDAH', 'Aprendizagem', 'Neuropsicologia'],
        available: true,
        color: '#E85D8A',
    },
]

const MOCK_MATCHES = [
    { ...MOCK_PROFESSIONALS[0], matchDate: '2026-02-18', status: 'active', nextSession: '2026-02-22T10:00:00' },
    { ...MOCK_PROFESSIONALS[1], matchDate: '2026-02-15', status: 'scheduled', nextSession: '2026-02-25T14:00:00' },
]

const MOCK_PATIENTS = [
    { id: 'p1', name: 'João Silva', age: 32, initials: 'JS', color: '#4A8FD4', status: 'active', sessions: 12, lastSession: '2026-02-18', nextSession: '2026-02-22T10:00:00', pending: false },
    { id: 'p2', name: 'Maria Fernandes', age: 27, initials: 'MF', color: '#52B788', status: 'pending', sessions: 0, lastSession: null, nextSession: null, pending: true },
    { id: 'p3', name: 'Carlos Eduardo', age: 45, initials: 'CE', color: '#D97706', status: 'active', sessions: 5, lastSession: '2026-02-17', nextSession: '2026-02-24T16:00:00', pending: false },
    { id: 'p4', name: 'Beatriz Alves', age: 23, initials: 'BA', color: '#E85D8A', status: 'pending', sessions: 0, lastSession: null, nextSession: null, pending: true },
    { id: 'p5', name: 'Roberto Nunes', age: 38, initials: 'RN', color: '#7C3AED', status: 'active', sessions: 20, lastSession: '2026-02-20', nextSession: null, pending: false },
]

export function AppProvider({ children }) {
    // Estado principal que define qual "módulo" (Paciente ou Psicólogo) está sendo exibido na tela
    const [userType, setUserType] = useState(null) // 'patient' | 'professional'

    // Estados Globais de Dados (futuras conexões com o backend)
    const [professionals] = useState(MOCK_PROFESSIONALS)
    const [matches, setMatches] = useState(MOCK_MATCHES)
    const [patients, setPatients] = useState(MOCK_PATIENTS)

    // Fila de notificações que imita o comportamento do Socket.io de Tempo Real que fizemos no backend
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'match', text: 'Você deu match com Dra. Camila Rocha!', read: false, time: '10 min' },
        { id: 2, type: 'session', text: 'Consulta com Dra. Camila amanhã às 10h', read: false, time: '2h' },
        { id: 3, type: 'match', text: 'Dr. Lucas aceitou seu match!', read: true, time: '1 dia' },
    ])

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
            userType, setUserType,
            professionals, matches, setMatches,
            patients, setPatients, acceptPatient, declinePatient,
            notifications, setNotifications,
            toasts, addToast,
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

export { MOCK_PROFESSIONALS, MOCK_PATIENTS }
