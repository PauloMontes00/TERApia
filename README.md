# TERApia — Full Stack Platform

Plataforma completa de saúde mental com interface para pacientes e profissionais.

## Estrutura do Projeto
- `/frontend`: Aplicação React (Vite) + Design System Premium.
- `/backend`: API Node.js (TypeScript) + Prisma ORM + Socket.io.

## Como Executar

### Backend
1. Entre na pasta `backend`.
2. Execute `npm install`.
3. Configure o seu `.env` com a `DATABASE_URL` do PostgreSQL.
4. Execute `npm run dev`.

### Frontend
1. Entre na pasta `frontend`.
2. Execute `npm install`.
3. Execute `npm run dev`.

## Funcionalidades
- **Matching Estilo Swipe**: Conexão intuitiva entre pacientes e terapeutas.
- **Prontuário Eletrônico**: Registro clínico com criptografia AES-256-GCM (LGPD).
- **Agenda & Agendamento**: Gestão completa de horários e sessões.
- **Notificações Real-time**: Alertas de matches e agendamentos via WebSockets.
