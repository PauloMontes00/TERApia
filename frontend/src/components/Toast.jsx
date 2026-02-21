import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const icons = {
    success: <CheckCircle size={18} color="var(--color-success)" />,
    error: <AlertCircle size={18} color="var(--color-danger)" />,
    info: <Info size={18} color="var(--color-primary)" />,
}

export default function Toast({ toasts = [] }) {
    return (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div
                        key={t.id}
                        className="toast"
                        style={{ borderLeftColor: t.type === 'success' ? 'var(--color-success)' : t.type === 'error' ? 'var(--color-danger)' : 'var(--color-primary)' }}
                        initial={{ opacity: 0, x: 60, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 60, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                        {icons[t.type] || icons.info}
                        <span style={{ font: '0.88rem var(--font-body)', color: 'var(--color-text)', flex: 1 }}>{t.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
