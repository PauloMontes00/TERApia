# TERApia — Plataforma Completa de Saúde Mental

O **TERApia** é um sistema SaaS (Software as a Service) focado em revolucionar a saúde mental. A plataforma utiliza um modelo inovador de **Matchmaking Assíncrono** (Swipe) conectando pacientes aos melhores profissionais (psicólogos e psiquiatras) com base em especialidades, valores de consulta e proximidade.

O modelo central foi arquitetado pensando em **Privacidade by-Design**, aderência estrita à **LGPD/HIPAA** e uma **Integração Real-Time** responsiva.

---

## 🚀 Arquitetura Atual

A base de código deste repositório constitui o Sistema Web contendo:

1. **Frontend (App Web)**: SPA desenvolvida em **React** (Vite), gerenciamento global via Context API e Animações complexas gestuais usando Framer Motion. Desenvolvido para altíssima conversão de funil de cadastro.
2. **Backend (Core API)**: Servidor escalável em **Node.js (TypeScript)**. Persistência de dados relacional (PostgreSQL) via queries SQL ou drivers nativos.
3. **Comunicação Duplex**: Infraestrutura **Event-Driven via Socket.io** para emitir notificações de 'Match' em tempo real.

*(Nota da Infraestrutura: Componentes como Flutter para o Mobile, sinalização descentralizada no Redis e o Motor WebRTC de vídeo do Agora.io são abstrações de evolução arquitetural projetados para a próxima release estrutural).*

---

## ✨ Funcionalidades Principais

* **Matchmaking Gestual (Patient Journey):** Lógica interativa tipo "Swipe", permitindo a formação de vínculos terapêuticos sem atrito relacional, otimizado para não causar fadiga decisória.
* **Notificações Real-Time:** Redução direta da latência de conversão entre o interesse do paciente e o aceite do médico usando conectividade contínua por WebSockets.
* **Prontuário Eletrônico Criptografado:** Isolamento total do texto das evoluções clínicas do fluxo comum da aplicação.
* **Role-Based Access Control (RBAC):** Roteamento JWT segregando estritamente os painéis de visualização (Patient Dashboard vs. Professional CRM).

---

## 🔒 Segurança e LGPD (Privacidade de Dados em Saúde)

O projeto emprega implementações agressivas para proteção a dados sensíveis de saúde mental (SPI):

1. **Criptografia Simétrica Híbrida (AES-256-GCM):** O prontuário dos pacientes não trafega livremente e nem é armazenado limpo no banco. O motor de criptografia acopla Vetores de Inicialização (IV), Salts randômicos e Authentication Tags assegurando **Confidencialidade** e proteção a **Adulteração** via DBA (Data Tampering).
2. **Identidade JWT Transacional:** Middlewares impedem ataques *IDOR* (Insecure Direct Object Reference). O Payload não carrega dados críticos, e as sessões assinam os requests nas lógicas operacionais em Background.
3. **Hashing Irreversível:** As credenciais baseiam-se em derivação intensiva (`bcrypt` com 10 *salt rounds*).

---

## ⚙️ Guia de Instalação e Execução Local

Requisitos: `Node.js` v18+ e uma Database relacional (Ex: PostgreSQL Neon).

### 1️⃣ Backend (API & WebSockets)

Abra um terminal e acesse a pasta raiz:

```bash
cd backend
npm install
```

Configure o arquivo `.env` na raiz da pasta `backend`:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@seu-host:5432/dbname"

# Segurança
JWT_SECRET="chave-secreta-para-tokens"
ENCRYPTION_KEY="chave-de-32-caracteres-para-AES!" # Mínimo 32 caractéres
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```
> Serviço irá rodar por padrão na porta **3000**.

### 2️⃣ Frontend (Interface UI)

Em um outro terminal, vá até a pasta `frontend`:

```bash
cd frontend
npm install --force
```

Inicie o servidor local do ecossistema Frontend:

```bash
npm run dev
```

> Acesse a plataforma pelo navegador: `http://localhost:5173`
