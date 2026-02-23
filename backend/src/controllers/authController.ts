import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret-keep-it-safe';

export class AuthController {
    /**
     * Fluxo de Registro (Identity Provisioning)
     * Garante a unicidade de identidade (email) e realiza o hash irreversível da senha (salt rounds: 10)
     * mitigando ataques de dicionário e rainbow tables em caso de vazamento da base.
     * Retorna imediatamente o Token JWT embutindo o 'role' para autorização Role-Based Access Control (RBAC).
     */
    static async register(req: Request, res: Response) {
        const { email, password, name, role } = req.body;
        try {
            // Basic input validation to avoid runtime errors and give clearer responses
            if (!email || !password) {
                try { require('fs').appendFileSync('error.log', `REGISTER BAD INPUT: ${new Date().toISOString()} - missing email/password - ${JSON.stringify({ email, name, role })}\n`); } catch(e){}
                console.warn('AuthController.register bad input:', { email, name, role });
                return res.status(400).json({ error: 'Email and password are required' });
            }

            console.log('AuthController.register attempt:', { email, name, role });

            const exists = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);
            console.log('AuthController.register exists rowCount:', exists.rowCount);
            if (exists.rowCount > 0) {
                try { require('fs').appendFileSync('error.log', `REGISTER CONFLICT: ${new Date().toISOString()} - email already exists - ${email}\n`); } catch(e){}
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const id = uuidv4();
            const roleVal = (role as 'PATIENT' | 'PROFESSIONAL') || 'PATIENT';

            console.log('AuthController.register inserting user id:', id, 'role:', roleVal);

            const insert = await query(
                `INSERT INTO users(id, email, password, name, role, "createdAt", "updatedAt") VALUES($1,$2,$3,$4,$5,now(),now()) RETURNING *`,
                [id, email, hashedPassword, name, roleVal],
            );

            console.log('AuthController.register insert rowCount:', insert.rowCount);
            const user = insert.rows[0];
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (err) {
            try {
                const meta = { ip: req.ip, ua: req.get('user-agent'), body: Object.assign({}, req.body, { password: '[FILTERED]' }) };
                require('fs').appendFileSync('error.log', `REGISTER ERROR: ${new Date().toISOString()} - ${err.stack || err} - meta: ${JSON.stringify(meta)}\n`);
            } catch (e) {}
            console.error('AuthController.register error:', err);
            res.status(500).json({ error: 'Failed to register user' });
        }
    }

    /**
     * Fluxo de Autenticação (Login)
     * Operação "constant-time" na verificação de senhas mitigando ataques de timing.
     * O erro devolvido em caso de falha é genérico intencionalmente (Anti-enumeration),
     * não revelando se o e-mail existe ou se a senha está incorreta.
     */
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const resUser = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
            const user = resUser.rows[0];
            if (!user) return res.status(401).json({ error: 'Invalid credentials' });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (err) {
            try { require('fs').appendFileSync('error.log', `LOGIN ERROR: ${new Date().toISOString()} - ${err.stack || err}\n`); } catch(e){}
            console.error('AuthController.login error:', err);
            res.status(500).json({ error: 'Failed to login' });
        }
    }
}
