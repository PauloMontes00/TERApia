// Diagnóstico de variáveis de ambiente (agora usando bootstrap para carregar dotenv)
import '../bootstrap';

console.log('=== DIAGNÓSTICO DE CARREGAMENTO DE ENV ===');

console.log('\n1. Antes de carregar dotenv (deve estar carregado no bootstrap):');
console.log('DATABASE_URL =', process.env.DATABASE_URL);
console.log('DB_PASSWORD =', process.env.DB_PASSWORD);

// bootstrap já carregou a partir de ../.env
console.log('\n2. Depois de carregar dotenv (via bootstrap):');
console.log('DATABASE_URL =', process.env.DATABASE_URL);
console.log('DB_PASSWORD =', process.env.DB_PASSWORD);
console.log('DB_HOST =', process.env.DB_HOST);
console.log('DB_USER =', process.env.DB_USER);

console.log('\n3. Verificação final:');
if (process.env.DATABASE_URL) {
  console.log('✓ DATABASE_URL está definida');
} else {
  console.log('✗ DATABASE_URL NÃO está definida - pool usará parâmetros individuais');
}
