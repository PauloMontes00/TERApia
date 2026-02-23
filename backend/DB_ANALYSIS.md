# Database Integration Analysis

Este documento reúne uma análise completa das razões que explicam por que o
projeto **não está enviando dados para o banco** nem **consumindo dados dele**
quando executado no ambiente atual.

## 1. Arquivos de ambiente duplicados

Há dois `.env` no repositório:

- `/.env` na raiz do workspace (exemplos e variáveis globais);
- `/backend/.env` usado pelo servidor.

O código do servidor e os scripts utilitários às vezes carregavam o `.env` da
raiz e, outras vezes, o de `backend/`, gerando valores diferentes. Essa
inconsistência levou a:

1. Pool de conexão sendo criado sem variáveis de ambiente (portas,
   credenciais, URL) quando o import de `db.js` ocorria antes de `dotenv` ser
   inicializado.
2. O servidor ficar *aparentemente inoperante* (sem comunicar qualquer base de
   dados conhecida) enquanto scripts executados manualmente viam variáveis
   diferentes.

### Solução aplicada

- Introduzido `src/bootstrap.ts` e importado *antes de tudo* em `index.ts`.
  Esse arquivo carrega explicitamente `backend/.env`.
- Os arquivos utilitários (`db.js`, `diagnostic.js`, `scripts/*`) passam a
  carregar de `backend/.env` também.

> **Resultado:** o ambiente agora é determinístico, mas o valor dentro do
> `.env` ainda pode ser inválido — veja abaixo.


## 2. Pool de `pg` inicializado antes do `dotenv`

Originalmente, `src/config/db.js` criava o `new Pool({...})` logo na carga do
módulo. No fluxo do Node, as declarações `import` (CommonJS `require`) são
resolvidas antes do corpo do arquivo `index.ts`, portanto o pool era criado
quando `process.env` ainda estava vazio.

Isso era observado pelo log de **autenticação falhou para usuário "postgres"**
mesmo quando `backend/.env` tinha um `DATABASE_URL` válido; o pool nem sequer
via a variável.

### Ajuste implementado

- `bootstrap.ts` carrega `dotenv` logo na inicialização.
- `src/config/db.js` agora imprime qual método de conexão está usando, 
  e só constrói o pool **depois** de `dotenv` ter sido executado.


## 3. URL de conexão e credenciais incorretas

Mesmo após os passos acima, o backend continuava a falhar com:

```
error: autenticação do tipo senha falhou para o usuário "postgres"
```

Isso significa que o *Postgres* estava rodando, mas a senha usada em
`DATABASE_URL` não correspondia à que o servidor esperava. A string usada era
`postgres:postgres@localhost:5432/postgis_36_sample`.

Tentativas de "remover a senha" resultaram em outro erro:
`SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` — o driver
espera sempre um campo `password` (não vazio) ao usar SCRAM.

A análise dos logs (`error.log`) mostrou que todos os `query()` falhavam antes
mesmo de chegar ao SQL: o pool não conseguia autenticar.

### Conclusão

O projeto *não estava alimentando o banco* porque **a conexão nunca era
estabelecida**. Em todos os endpoints a execução caía no catch do controller com
`error: 'Failed to register user'` — a mensagem genérica não revelava a falha
docasa, mas o `error.log` revelava a autenticação rejeitada.

Para que o serviço comece a escrever/ler dados, é preciso:

1. garantir que `DATABASE_URL` (ou os campos individuais) contenha a senha
   correta para o usuário Postgres em uso na máquina de desenvolvimento;
2. ou configurar o PostgreSQL local para aceitar `trust`/ident na interface
   `localhost`, o que elimina a necessidade de senha.


## 4. Porta errada e confusão de serviço

Um detalhe secundário, mas relevante para entender a "não consumir dados":

- O backend por padrão escuta na porta **3000**.
- O frontend Vite escuta na porta **5173**.

Se você fizer uma requisição `curl` para `localhost:5173/api/auth/register`, na
62ª linha verá apenas o servidor Vite (ou nenhum serviço), portanto a
requisão **não atinge o backend** e obviamente não escreve nada no banco.

Esse engano levou a acreditar que o projeto estava completamente desacoplado do
banco — na verdade a API nunca era chamada.

### Testes

O script `backend/tests/e2e.js` falha em `register` porque, embora ele aponte
para `localhost:3000`, o servidor nunca conclui a conexão com o banco (erro de
senha). Quando você usou a porta 5173 ficou ainda mais invisível que as APIs
nem sequer iam para o backend.


## 5. Inspeção de código

- **Controllers**: todos invocam `query('...', params)` exportado de
  `src/config/db.ts`. Não há lógica de fallback ou cache; basta que `query`
  funcione corretamente para que o CRUD inteiro opere.
- **Rotas**: estão corretamente montadas em `/api/auth`, `/api/patient`, etc.
- **Initialização**: nenhum outro código toca o DB além do `query` importado.

Portanto, o único ponto de falha técnico era a conexão (não os controladores).


## Resumo das causas

1. *Ambiente mal carregado* – `dotenv` antes do pool + `.env` duplicado. Pool usava
   senha padrão `'ADMIN'` e database `'terapia'` (não existente).
2. *Credenciais inválidas* – `DATABASE_URL` apontava para o banco correto, mas a
   senha estava errada. Postgres rejeitava cada tentativa de conexão, abortando
   a escrita/leitura.
3. *Porta equivocada* – chamadas feitas em 5173 atingiram o frontend, não o
   backend, reforçando a impressão de que nada acontecia.
4. *Containers/desenvolvimento* – se houver contêineres ou outros serviços,
   nenhum deles foi configurado aqui; apenas um Postgres local no `localhost`
   é usado.


## Próximos passos para restaurar funcionamento

1. **Corrigir ou fornecer a senha** adequada no `.env` (`DATABASE_URL` ou
   `DB_PASSWORD`). Ex.:
   `DATABASE_URL=postgresql://postgres:<<senha real>>@localhost:5432/postgis_36_sample`.
2. Se não quiser senha, reconfigure o `pg_hba.conf` para `trust` na linha local;
   então passe `password=` vazio ou remova o campo.
3. Garantir que o backend rode na porta esperada e que os testes apontem para ela.
4. Opcionalmente, adicionar um endpoint `/internal/dbinfo` para expor em runtime
   as variáveis de conexão (omitir senha) para debugging futuro.

Até que a autenticação do Postgres seja resolvida, **nenhum dado será escrito ou
lido** do banco — é exatamente por isso que parecia "não estar alimentando o
banco".


---

Esse documento foi gerado automaticamente pela análise do workspace; salve-o
comitá-lo se desejar como referência para outros desenvolvedores.