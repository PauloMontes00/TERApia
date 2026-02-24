// Load env FIRST before any other code
import './bootstrap';

// Now safe to import other modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import './config/db';
import { testConnection } from './config/db';
import path from 'path';

import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import proRoutes from './routes/proRoutes';
import appointmentRoutes from './routes/appointmentRoutes';

const app = express();

// em produção, serve os arquivos estáticos do frontend build
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.resolve(__dirname, '../..', 'frontend', 'dist');
    app.use(express.static(frontendPath));
    app.get('*', (_req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

// db is available via imports from './config/db'

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/pro', proRoutes);
app.use('/api/appointments', appointmentRoutes);

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Rota simples de verificação de saúde (health check)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    const ok = await testConnection();
    if (!ok) {
        console.error('Unable to verify database connectivity during startup');
    }
});

export { io };
