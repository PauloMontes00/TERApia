import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 32;

export class EncryptionService {
    // Chave Mestra Base: Originária do Environment protegido.
    // Ponto de Atenção CISO: Gerenciar rotação via AWS KMS / HashiCorp Vault em produção.
    private static masterKey: string = process.env.ENCRYPTION_KEY || 'default-super-secret-key-32-chars-long!';

    /**
     * [LÓGICA AES-256-GCM] - Previne violação LGPD de dados de saúde.
     * GCM (Galois/Counter Mode) assegura confidencialidade e Autenticidade (AEAD).
     * O Vetor de Inicialização (IV) e Salt garantem cifras distintas mesmo se
     * múltiplos pacientes tiverem anotações textuais idênticas.
     */
    static encrypt(text: string): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const salt = crypto.randomBytes(SALT_LENGTH);

        // Derivação Computacional Intensa de Chave (100k iterações) mitiga vulnerabilidades 
        // em cenários onde a 'masterKey' vaze e hackers apliquem Força-bruta/Dicionário.
        const key = crypto.pbkdf2Sync(this.masterKey, salt, ITERATIONS, KEY_LENGTH, 'sha512');

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

        // GCM Auth Tag: Tag criptográfica que garante que o Banco de Dados não sofreu tampering (adulteração maliciosa das strings cifradas).
        const tag = cipher.getAuthTag();

        // Empacotamento de binários essenciais (Salt, IV, Tag, Ciphertext) na mesma Base64 string para simplificar modelagem (1 coluna).
        return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
    }

    /**
     * Inversão Criptográfica Controlada (Decifragem).
     */
    static decrypt(cipherText: string): string {
        const data = Buffer.from(cipherText, 'base64');

        // Segmentação da string unificada com base nos deltas de tamanho posicional.
        const salt = data.subarray(0, SALT_LENGTH);
        const iv = data.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const tag = data.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
        const encrypted = data.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

        // Refaz derivação de chave exata baseada no salt originador.
        const key = crypto.pbkdf2Sync(this.masterKey, salt, ITERATIONS, KEY_LENGTH, 'sha512');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

        // Bloqueio de Tampering: Recusa decifragem se algum bit foi modificado.
        decipher.setAuthTag(tag);

        return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
    }
}
