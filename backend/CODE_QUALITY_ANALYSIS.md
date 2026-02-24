# Code Redundancy & Inconsistencies Analysis

Este documento identifica trechos de código que aparecem repetidos,
contraditórios ou desnecessariamente dispersos no projeto. O objetivo é
apontar locais onde a manutenção será mais difícil e onde pode haver
confusão futura. **Nada foi alterado**; trata-se apenas de localização e
documentação.

---

## 1. Conexão com o banco – duplicação de lógica

Existem **dois** módulos distintos que encapsulam a conexão PostgreSQL:

1. `backend/src/config/db.ts` – usado pelo backend TypeScript normal.
2. `backend/db.js` – script de utilitários (testes, inicialização, diagnóstico).

Ambos fazem praticamente a mesma coisa:

- carregam `dotenv` (em caminhos ligeiramente diferentes);
- constroem um `Pool` preferindo `DATABASE_URL` ou caindo em parâmetros
  individuais;
- expõem uma função `query` ou o `pool` diretamente;
- ambos conseguem fazer testes de conexão/listagem de tabelas.

Essa redundância significa que qualquer alteração no método de conexão
(depuração, erro, parâmetros) deve ser repetida em dois lugares, o que
facilita a inconsistência.

### Possível refatoração

Unir os dois no mesmo módulo exportado, e reusar em scripts. Ou manter o
`backend/src/config/db.ts` como fonte única e fazer `db.js` simplesmente
`require('./src/config/db')` em vez de replicar a lógica.

---

## 2. Carregamento de variáveis de ambiente distribuído

Várias partes do backend chamam `require('dotenv').config(...)` com caminhos
diferentes:

- `src/bootstrap.ts` carrega `../../.env`
- `src/config/db.js` carrega `../../.env` novamente
- `backend/db.js` carrega `./.env` local
- `backend/diagnostic.js` carrega `./.env`
- `backend/run-db-init.js` não carrega, mas usa o pool importado
- scripts em `backend/tests` não carregam nada (presumem estar no mesmo
  ambiente do servidor)

Embora seja razoável garantir que cada contexto carregue o `.env` correto, o
número de chamadas repetidas poderia ser reduzido a uma função utilitária ou
módulo comum.

---

## 3. Tratamento de erros repetido e inconsistência nos controllers

Examinando os controladores (`authController`, `patientController`, etc.) há
padrões repetidos:

- `try { ... } catch (err) { res.status(500).json({ error: 'Failed ...' }); }`
  aparece em quase todos os métodos. A mensagem de erro varia ligeiramente.

- O `authController` escreve em `error.log` usando `require('fs').appendFileSync`
  com blocos try/catch ao redor; nenhum outro controlador faz logging similar.
  A existência de um único arquivo de log para autenticação é arbitrária e
dificulta auditoria de outras falhas.

- Alguns catchs simplesmente retornam `500` sem imprimir nada no console,
  enquanto o `authController` imprime o erro (e grava no arquivo).
  Inconsistência no nível de verbosidade.

### Possível refatoração

Extrair uma função utilitária `handleError(res, 'message', err)` que faz log
consistente e envia resposta genérica. Unificar mensagens ou classificar por
módulo.

---

## 4. Consultas SQL repetidas com pequenas diferenças

Em vários controladores, a construção de SQL é quase idêntica e poderia ser
parametrizada:

- Instruções `INSERT INTO users` aparecem em `authController` e nos scripts de
  teste (`registerSim.js`).
- A lógica de `UPDATE matches` em `proController.respondToMatch` e em
  `appointmentController.book` (que também atualiza status) é parecida.

O problema não é apenas repetição, mas risco de divergência quando a
estrutura da tabela mudar.

---

## 5. Variáveis não utilizadas / código morto

Busca rápida por símbolos mostra algumas importações que nunca são usadas:

- Em `patientController.ts` a importação `import { Response } from 'express';` é
  usada, mas o `io` também é importado (também usado). Nenhuma importação
  claramente não utilizada.
- No `run-db-init.js` o módulo `path` é usado, mas `const sqlPath = path.join(...)`
  poderia usar apenas string.

(Aqui não achei muitos exemplos, mas vale revisitar periodicamente.)

---

## 6. Tests duplicam lógica de request

`backend/tests/e2e.js`, `registerSim.js` e `insertTest.js` todos implementam
funções parecidas de `fetch`/`query` e de geração de IDs. Isto é aceitável em
testes, mas nota-se pouca extração para biblioteca comum.

---

## 7. Configuração de porta inconsistente nos testes

O script E2E usa `http://localhost:3000/api`, mas o `.env.example` recomenda
`PORT=3000` com comentário opcional. A API de login foi chamada manualmente em
outras portas, gerando confusão. Essa discrepância entre ambiente real e valores
de teste pode levar a testes silenciosamente falhando.

---

## 8. Gênero misto de JavaScript/TypeScript nas ferramentas

A raiz `backend` contém arquivos JS (`db.js`, `run-db-init.js`, `diagnostic.js`)
e a pasta `src` contém TS. Para manter consistência, poderia haver apenas TS
(e gerar JS em build), ou fazer todos utilitários JS. A mistura força o
uso de `ts-node/register` em alguns casos e traz potencial de incompatibilidade
de sintaxe.

---

## 9. Uso inconsistente de formatação e aspas

- Algumas queries usam aspas duplas escapadas (`"createdAt"`) e outras
  usam template literals. Essa variação não é crítica, mas indica falta de
  linting/estilo unificado.

- Comentários variam entre Português e Inglês, o que pode confundir
  colaboradores internacionais.

---

## Síntese

As redundâncias e inconsistências não impedem o funcionamento do sistema,
mas aumentam a chance de erros e tornam o código mais difícil de manter. A
lista acima fornece pontos de partida para limpar:

1. Consolidar a lógica de conexão em um único módulo.
2. Unificar o carregamento de `.env`.
3. Padronizar tratamento de erros e logging.
4. Extrair utilitários comuns dos testes.
5. Harmonizar idiomas/comentários e estilo de código.
6. Considerar migrar utilitários JS para TS ou vice‑versa.

Nenhuma alteração foi feita; este relatório serve como guia para futuras
refatorações.

---

*Gerado automaticamente pelo analisador de workspace de 23/02/2026.*
