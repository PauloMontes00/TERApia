import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret-keep-it-safe';

export class AuthController {
    static async register(req: Request, res: Response) {
        const { email, password, name, role } = req.body;

        try {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: role as 'PATIENT' | 'PROFESSIONAL',
                },
            });

            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (err) {
            res.status(500).json({ error: 'Failed to register user' });
        }
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

            res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (err) {
            res.status(500).json({ error: 'Failed to login' });
        }
    }
}
