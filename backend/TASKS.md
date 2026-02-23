# Development Tasks

Baseado nas análises já realizadas (`DB_ANALYSIS.md` e
`CODE_QUALITY_ANALYSIS.md`), aqui estão as tarefas que podem ser criadas como
issues no GitHub para corrigir gradualmente o projeto.

Cada item abaixo pode virar um issue separado, com título e descrição
 apropriados.

1. **Unificar módulo de conexão com PostgreSQL**
   - Remover duplicação entre `src/config/db.ts` e `db.js`.
   - Exportar um único helper reutilizável por scripts e pelo servidor.
   - Refatorar `run-db-init.js`, `diagnostic.js` e quaisquer scripts para usar
o novo módulo.

2. **Centralizar o carregamento de variáveis de ambiente**
   - Simplificar `bootstrap.ts` e garantir que apenas um lugar chame
     `dotenv.config()`.
   - Remover chamadas adicionais redundantes de `dotenv` em outros arquivos.

3. **Corrigir credenciais e fluxo de conexão**
   - Ajustar `.env.example` e documentação para explicar como configurar a
     senha correta ou usar `trust`.
   - Adicionar endpoint `/internal/dbinfo` para debug (não expor senha).
   - Talvez validar a presença de `DATABASE_URL` no startup e abortar se
     estiver ausente.

4. **Padronizar e centralizar tratamento de erros**
   - Extrair utilitário `handleError(res, msg, err)` que loga e responde
     consistentemente.
   - Remover uso direto de `fs.appendFileSync('error.log')` do
     `authController` ou mover para utilitário de logging.

5. **Refatorar consultas SQL repetidas**
   - Introduzir funções helpers para `insertUser`, `updateMatchStatus`, etc.
   - Reutilizar nos testes (`registerSim.js`) para evitar divergência.

6. **Unificar estilos e remover código morto**
   - Roda ESLint/Prettier ou ajusta comentários para idioma unificado.
   - Verificar imports não utilizados e remover.

7. **Racionalizar os testes de integração**
   - Extrair função de requisição HTTP comum (já quase feito em `e2e.js`).
   - Ajustar porta e tornar configurável por variável de ambiente.

8. **Migrar utilitários JS para TypeScript (opcional)**
   - Converter `db.js`, `run-db-init.js`, `diagnostic.js` para TS ou mover
     para `src/utils`.

9. **Gerenciar o arquivo `.env` no GitHub**
   - Adicionar instruções de commit na documentação.
   - Confirmar `.gitignore` evita qualquer `.env` em nenhum lugar do repo.

> Cada uma dessas tarefas pode ser criada no GitHub como um *issue* com o
> título e descrição acima. Prioridade pode seguir a ordem númerica, pois
> algumas tarefas (1–3) são pré-requisitos para que o banco funcione.


**Referências:**
- `backend/DB_ANALYSIS.md`
- `backend/CODE_QUALITY_ANALYSIS.md`

*Este arquivo foi gerado automaticamente como ponto de partida para gestão de
issues.*