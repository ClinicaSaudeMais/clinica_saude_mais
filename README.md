# Clínica Saúde Mais

Este é um projeto full-stack para a M3 da matéria de Melhoria de Processos de Software, configurado como um monorepo usando npm Workspaces para gerenciar o frontend e o backend de forma integrada.

## Tecnologias Utilizadas

- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Gerenciador de Pacotes**: npm Workspaces
- **Utilitários**: `concurrently` para executar os projetos simultaneamente, `nodemon` para reiniciar o servidor backend automaticamente.

## Estrutura do Projeto

O projeto está dividido em dois workspaces principais gerenciados a partir da raiz:

- `frontend/`: Contém a aplicação React.
- `backend/`: Contém a aplicação Node.js/Express.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- npm (versão 7 ou superior, para suporte a Workspaces)
- [PostgreSQL](https://www.postgresql.org/download/): Um servidor de banco de dados PostgreSQL em execução.

## Instalação e Configuração

1.  **Clone o repositório** (se estiver no Git):
    ```sh
    git clone https://github.com/ClinicaSaudeMais/clinica_saude_mais
    cd clinica_saude_mais
    ```

2.  **Instale as dependências do projeto:**
    Na **raiz do projeto**, execute o comando abaixo. Ele irá instalar as dependências tanto do frontend quanto do backend.
    ```sh
    npm install
    ```

3.  **Configure o Banco de Dados (Backend):**
    a. Navegue até o diretório do backend:
    ```sh
    cd backend
    ```
    b. Crie um arquivo `.env` a partir do exemplo `.env.example` (se existir) ou crie um novo.
    c. Adicione a sua connection string do PostgreSQL ao arquivo `.env`:
    ```env
    DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/clinica_db"
    ```
    d. Execute as migrações do Prisma para criar as tabelas no banco de dados:
    ```sh
    npx prisma migrate dev
    ```
    e. Volte para o diretório raiz:
    ```sh
    cd ..
    ```

## Como Executar o Projeto

Com a instalação e configuração concluídas, você pode iniciar ambos os servidores (frontend e backend) com um **único comando** a partir da **raiz do projeto**:

```sh
npm run dev
```

Este comando fará o seguinte:
- Iniciará o servidor de desenvolvimento do Vite para o frontend (geralmente em `http://localhost:5173`).
- Iniciará o servidor Express para o backend com `nodemon` (em `http://localhost:5000`).

## Documentação da API com Swagger

A API do backend é documentada com Swagger para facilitar os testes e o desenvolvimento.

Para acessar a documentação:
1. Inicie o servidor backend (usando `npm run dev` na raiz).
2. Abra seu navegador e acesse [http://localhost:5000/api-docs](http://localhost:5000/api-docs).

A interface do Swagger UI permitirá que você visualize todas as rotas da API, seus parâmetros e respostas, além de permitir o teste direto dos endpoints.

## Banco de Dados

Este projeto utiliza **PostgreSQL** com o **Prisma ORM** para gerenciar o acesso ao banco de dados.

-   **Schema**: A estrutura do banco de dados (tabelas, colunas, relações) é definida no arquivo `backend/prisma/schema.prisma`.
-   **Migrações**: As alterações no schema são aplicadas ao banco de dados através do comando `npx prisma migrate dev`.
-   **Conexão**: A aplicação se conecta ao banco de dados usando a variável de ambiente `DATABASE_URL` definida no arquivo `backend/.env`.

## Inspecionando o Banco de Dados PostgreSQL

Você pode inspecionar o banco de dados PostgreSQL usando uma ferramenta gráfica como o **DBeaver** ou o **pgAdmin**, ou através da linha de comando com `psql`.

### Opção 1: Ferramenta Gráfica (GUI) - DBeaver

1.  **Baixe e instale o DBeaver:**
    *   Vá para a página oficial: [https://dbeaver.io/download/](https://dbeaver.io/download/)
    *   Baixe e instale a edição "Community".

2.  **Conecte-se ao seu banco de dados:**
    *   Abra o DBeaver e clique em "Nova Conexão" (ícone de tomada).
    *   Selecione "PostgreSQL" e clique em "Próximo".
    *   Preencha as credenciais de conexão (Host, Porta, Nome do banco de dados, Usuário e Senha) que correspondem à sua `DATABASE_URL`.
    *   Clique em "Testar Conexão" para verificar se tudo está correto e, em seguida, em "Finalizar".

3.  **Explore o banco de dados:**
    *   No painel "Navegador de Banco de Dados", expanda a sua conexão e navegue por `Schemas -> public -> Tabelas`.
    *   Clique duas vezes em uma tabela para ver sua estrutura e os dados contidos nela.

### Opção 2: Linha de Comando (CLI) com `psql`

Se você tem o `psql` instalado e no seu PATH, pode acessar o banco de dados diretamente.

1.  **Abra o terminal e conecte-se:**
    ```bash
    psql -U SEU_USUARIO -d clinica_db -h localhost
    ```
    (Você será solicitado a fornecer a senha).

2.  **Comandos úteis:**
    *   `\dt` - Lista todas as tabelas no schema público.
    *   `\d <nome_da_tabela>` - Mostra a estrutura de uma tabela específica (ex: `\d "User"`). Note que o Prisma pode criar tabelas com nomes em maiúsculas, exigindo aspas.
    *   `SELECT * FROM "<nome_da_tabela>";` - Exibe todos os registros de uma tabela (ex: `SELECT * FROM "User";`).
    *   `\q` - Sai do prompt `psql`.

Essas ferramentas o ajudarão a verificar os dados, depurar e entender melhor como as informações estão sendo armazenadas.