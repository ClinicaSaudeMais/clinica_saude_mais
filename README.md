# Clínica Saúde Mais

Este é um projeto full-stack para a M3 da matéria de Melhoria de Processos de Software, configurado como um monorepo usando npm Workspaces para gerenciar o frontend e o backend de forma integrada.

## Tecnologias Utilizadas

- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Banco de Dados**: SQLite
- **Gerenciador de Pacotes**: npm Workspaces
- **Utilitários**: `concurrently` para executar os projetos simultaneamente, `nodemon` para reiniciar o servidor backend automaticamente.

## Estrutura do Projeto

O projeto está dividido em dois workspaces principais gerenciados a partir da raiz:

- `frontend/`: Contém a aplicação React.
- `backend/server/`: Contém a aplicação Node.js/Express.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- npm (versão 7 ou superior, para suporte a Workspaces)

## Instalação e Configuração

1.  **Clone o repositório** (se estiver no Git):
    ```sh
    git clone https://github.com/ClinicaSaudeMais/clinica_saude_mais
    cd clinica_saude_mais
    ```

2.  **Instale as dependências:**
    Na **raiz do projeto**, execute o comando abaixo. Ele irá instalar as dependências tanto do frontend quanto do backend em uma única pasta `node_modules`.
    ```sh
    npm install
    ```

## Como Executar o Projeto

Com a instalação concluída, você pode iniciar ambos os servidores (frontend e backend) com um **único comando** a partir da **raiz do projeto**:

```sh
npm run dev
```

Este comando fará o seguinte:
- Iniciará o servidor de desenvolvimento do Vite para o frontend (geralmente em `http://localhost:5173`).
- Iniciará o servidor Express para o backend com `nodemon` (em `http://localhost:5000`).

## Documentação da API com Swagger

A API do backend é documentada com Swagger para facilitar os testes e o desenvolvimento.

Para acessar a documentação:
1. Inicie o servidor backend (usando `npm run dev` na raiz ou `npm run dev` em `backend/server`).
2. Abra seu navegador e acesse [http://localhost:5000/api-docs](http://localhost:5000/api-docs).

A interface do Swagger UI permitirá que você visualize todas as rotas da API, seus parâmetros e respostas, além de permitir o teste direto dos endpoints.

## Banco de Dados

Este projeto utiliza **SQLite**. O arquivo do banco de dados (`database.db`) é criado automaticamente na pasta `backend/server/db/` na primeira vez que o servidor backend é iniciado.

O schema do banco de dados e os dados iniciais estão definidos no arquivo `backend/server/db/schema.sql`.

