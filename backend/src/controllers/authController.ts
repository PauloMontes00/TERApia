import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; // Biblioteca utilizada para fazer o hash (criptografia) irreversível de senhas
import jwt from 'jsonwebtoken'; // Biblioteca para criar e validar Tokens de Autenticação (JWT)
import { prisma } from '../index'; // Instância do Prisma Cliente para interagir com o Banco de Dados

// Variável de ambiente contendo o "segredo" usado para assinar e validar os tokens JWT gerados.
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret-keep-it-safe';

export class AuthController {
    /**
     * Função responsável por criar um novo usuário no banco de dados.
     * Recebe os dados básicos (email, senha, nome, role) e faz as seguintes verificações:
     * 1. Confere se o e-mail não foi usado.
     * 2. Hasheia a senha para garantir segurança.
     * 3. Salva no banco.
     * 4. Retorna um Token (JWT) para o novo usuário já logar imediatamente.
     */
    static async register(req: Request, res: Response) {
        // Extrai os campos do corpo da requisição enviada pelo Frontend
        const { email, password, name, role } = req.body;

        try {
            // Verifica no banco de dados se já existe algum usuário cadastrado com este e-mail
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                // Se o e-mail existir, interrompe o fluxo com erro 400 (Bad Request)
                return res.status(400).json({ error: 'User already exists' });
            }

            // Realiza o hash matemático da senha. '10' é o "salt rounds" que define o nível de segurança/esforço computacional
            const hashedPassword = await bcrypt.hash(password, 10);

            // Cria um novo registro na tabela 'User' do banco de dados (Prisma)
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword, // Importante: Salva a senha criptografada e não a original
                    name,
                    role: role as 'PATIENT' | 'PROFESSIONAL',
                },
            });

            // Gera o JSON Web Token (JWT). Embutimos o ID e o Papel(Role) dentro do Token. Este token vence em 7 dias.
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

            // Devolve as informações do usuário criadas junto com o token com sucesso (Status 201 Created)
            res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (err) {
            // Em caso de falha sistêmica (banco fora do ar, erro de conexão, etc) devolve Erro 500
            res.status(500).json({ error: 'Failed to register user' });
        }
    }

    /**
     * Função responsável pelo login de usuários já existentes.
     * Busca o e-mail no banco e compara o hash de senha salvo com a senha fornecida.
     */
    static async login(req: Request, res: Response) {
        // Extrai o email e senha passados no login pelo frontend
        const { email, password } = req.body;

        try {
            // Procura o usuário no banco de dados através da chave única (email)
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                // Se não encotrar, devolve Não Autorizado (401). Retornamos mensagem genérica por motivos de segurança.
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compara a senha crua com a versão hash guardada no BD. O Bcrypt resolve toda a lógica pesada.
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                // Se as senhas baterem falso, bloqueia o acesso
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Acesso liberado! Novamente emitimos um novo Token de 7 dias de duração.
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

            // Emite resposta 200 OK enviando o token que será utilizado pelas próximas requisições desta sessão.
            res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (err) {
            // Em caso de falha de conexão do servidor retornamos erro 500 Interno
            res.status(500).json({ error: 'Failed to login' });
        }
    }
}
