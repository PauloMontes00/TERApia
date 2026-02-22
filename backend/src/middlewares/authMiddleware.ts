import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret-keep-it-safe';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: 'PATIENT' | 'PROFESSIONAL';
    };
}

/**
 * Filtro de Extração Identity (JWT Verification):
 * Processa cabeçalho Authorization do padrão Bearer interceptando as APIs privadas.
 * Em vulnerabilidades (Token expirado/Forjado), corta a requisição mantendo estanque a malha da rede.
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: 'PATIENT' | 'PROFESSIONAL' };
        req.user = decoded; // Injeção transacional - Repassada nativamente para as chamadas seguintes (Controllers).
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/**
 * Guardião RBAC (Role-Based Access Control):
 * Função de Ordem Superior acionada especificando Arrays de Papéis permitidos.
 * Bloqueia um Paciente tentando, por exemplo, escrever um Laudo (Privilégio do Psicólogo).
 */
export const roleCheck = (roles: Array<'PATIENT' | 'PROFESSIONAL'>) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Unauthorized role.' });
        }
        next();
    };
};
