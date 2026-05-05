# Backend Todo List / Menu

Projeto backend desenvolvido utilizando o framework [NestJS](https://nestjs.com/) para gerenciamento de usuários, tarefas e autenticação.

## 🏗 Arquitetura do Projeto

A arquitetura foi desenhada buscando modularidade e separação de responsabilidades (conceitos semelhantes a Clean Architecture/Domain-Driven Design):

*   **`src/main.ts`**: Ponto de entrada da aplicação, onde o servidor é instanciado, o CORS é habilitado e a documentação do Swagger é configurada.
*   **`src/app.module.ts`**: Módulo raiz da aplicação que orquestra todos os outros módulos.
*   **`src/modules/`**: Módulos que representam a lógica de negócio do sistema:
    *   **`auth/`**: Responsável pelo fluxo de autenticação e autorização (login, verificação de token JWT, criptografia de senhas com bcrypt e estratégias do Passport).
    *   **`user/`**: Gerencia as operações referentes a usuários (CRUD).
    *   **`task/`**: Gerencia o domínio de tarefas e todo lists.
*   **`src/infra/`**: Camada de infraestrutura:
    *   **`database/`**: Configurações de conexão com o banco de dados MySQL utilizando o **TypeORM**.
*   **`src/shared/`**: Recursos, utilitários ou serviços compartilhados por vários módulos em toda a aplicação.

### Tecnologias Utilizadas

*   **Linguagem de Programação**: TypeScript / Node.js
*   **Framework Base**: NestJS v11
*   **Banco de Dados**: MySQL (Integrado com a ORM TypeORM)
*   **Segurança / Autenticação**: Autenticação com JWT e encriptação de senhas com Bcryptjs
*   **Testes**: Jest (Unitários) e Supertest (E2E)
*   **Documentação**: Configurado com Swagger.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados no seu ambiente local:

*   [Node.js](https://nodejs.org/) (Versão LTS recomendada: v18 ou v20+)
*   [MySQL](https://www.mysql.com/) rodando localmente (ou conteinerizado via Docker)
*   Gerenciador de pacotes NPM (já vem com o Node)

### Passo a Passo

**1. Clone ou acesse o repositório:**
```bash
git clone <https://github.com/Carlosjunior2215/todo-list-back>
cd todoListBack
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as variáveis de ambiente:**
Verifique dentro de `app.module.ts` ou nos módulos de infraestrutura as configurações sensíveis. Provavelmente você precisará criar um arquivo `.env` na raiz do projeto contendo as credenciais de banco (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME), JWT_SECRET, entre outros.

**4. Execute o servidor de desenvolvimento:**

Para executar o servidor com *hot-reload* (observando as modificações dos arquivos):
```bash
npm run start:dev
```

A aplicação deverá rodar, por padrão, na porta `3030` de acordo com a configuração em `main.ts` (ou a porta especificada no `process.env.PORT`).

### Outros scripts disponíveis

*   `npm run build`: Compila o projeto TypeScript para JavaScript na pasta `/dist/`.
*   `npm run start:prod`: Inicializa o projeto em modo produção usando os arquivos gerados em `/dist/`.
*   `npm run lint`: Realiza análise de estilo e sintaxe usando o ESLint.
*   `npm run test`: Roda os testes configurados com o Jest.

---

## 📖 Documentação da API

A documentação dos endpoints é gerada de maneira interativa via **Swagger**. 
Para acessar as rotas disponíveis (como as do `auth`, `user` e `task`), inicie a aplicação localmente e acesse o link no seu navegador:

[🔗 http://localhost:3030/api](http://localhost:3030/api)
