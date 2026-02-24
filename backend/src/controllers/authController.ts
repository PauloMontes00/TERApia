import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { handleError } from '../utils/error';
import * as dbh from '../utils/dbHelpers';

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

            const exists = await dbh.findUserByEmail(email);
            if (exists.rowCount > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const id = uuidv4();
            const roleVal = (role as 'PATIENT' | 'PROFESSIONAL') || 'PATIENT';

            console.log('AuthController.register inserting user id:', id, 'role:', roleVal);

            const insert = await dbh.insertUser({
                id,
                email,
                password: hashedPassword,
                name,
                role: roleVal,
            });

            console.log('AuthController.register insert rowCount:', insert.rowCount);
            const user = insert.rows[0];
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (err) {
            return handleError(res, 'Failed to register user', err);
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
            const resUser = await dbh.findUserByEmail(email);
            const user = resUser.rows[0];
            if (!user) return res.status(401).json({ error: 'Invalid credentials' });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (err) {
            return handleError(res, 'Failed to login', err);
        }
    }
}
