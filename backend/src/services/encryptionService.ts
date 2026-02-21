import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 32;

export class EncryptionService {
    // Chave Mestra Base: Nunca deve ser subida para o GitHub em produção real (vem do .env).
    private static masterKey: string = process.env.ENCRYPTION_KEY || 'default-super-secret-key-32-chars-long!';

    /**
     * Função 'encrypt': Transforma texto puro em base64 ininteligível.
     * Utiliza o padrão AES-256-GCM, que é imune a diversas classes de ataques de manipulação.
     */
    static encrypt(text: string): string {
        // Gera números aleatórios para garantir que a mesma anotação criptografada duas vezes
        // gere textos cifrados totalmente diferentes (Vetor de Inicialização e Salt).
        const iv = crypto.randomBytes(IV_LENGTH);
        const salt = crypto.randomBytes(SALT_LENGTH);

        // PBKDF2Sync: Deriva a chave-mestra adicionando o Salt e rodando 100 mil iterações matemáticas.
        // Isso impede ataques de força bruta.
        const key = crypto.pbkdf2Sync(this.masterKey, salt, ITERATIONS, KEY_LENGTH, 'sha512');

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        // GCM Auth Tag: Uma assinatura digital que garante que o texto cifrado não foi corrompido ou adulterado
        const tag = cipher.getAuthTag();

        // Concatena tudo num pacotão só para salvar numa única coluna do Banco de Dados
        return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
    }

    /**
     * Função 'decrypt': Reverte o Base64 legível de volta para texto puro da consulta clínica.
     */
    static decrypt(cipherText: string): string {
        const data = Buffer.from(cipherText, 'base64');

        // Extrai as partes exatas baseadas nas posições estruturadas durante a encriptação.
        const salt = data.subarray(0, SALT_LENGTH);
        const iv = data.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const tag = data.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
        const encrypted = data.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

        // Deriva exatamente a mesma chave usada antes com o mesmo Salt
        const key = crypto.pbkdf2Sync(this.masterKey, salt, ITERATIONS, KEY_LENGTH, 'sha512');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        // Valida se a mensagem não foi adulterada (Anti-Tampering)
        decipher.setAuthTag(tag);

        // Restaura o arquivo original
        return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
    }
}
