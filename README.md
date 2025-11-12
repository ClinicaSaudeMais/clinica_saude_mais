# Clínica Saúde Mais

Este é um projeto full-stack que utiliza React (com Vite) para o frontend e Node.js (com Express) para o backend.

O projeto está configurado como um monorepo usando npm Workspaces para gerenciar o frontend e o backend de forma integrada.

## Tecnologias Utilizadas

- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js, Mongoose
- **Banco de Dados**: MongoDB Atlas
- **Gerenciador de Pacotes**: npm Workspaces
- **Utilitários**: `concurrently` para executar os projetos simultaneamente.

## Estrutura do Projeto

O projeto está dividido em dois workspaces principais:

- `frontend/`: Contém a aplicação React.
- `backend/server/`: Contém a aplicação Node.js/Express.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- npm (geralmente vem com o Node.js)

## Instalação e Configuração

1.  **Clone o repositório** (se estiver no Git):
    ```sh
    git clone <url-do-seu-repositorio>
    cd clinica_saude_mais
    ```

2.  **Instale as dependências:**
    Na raiz do projeto, execute o comando abaixo. Ele irá instalar as dependências tanto do frontend quanto do backend.
    ```sh
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    - Navegue até a pasta do backend: `cd backend/server`
    - Renomeie o arquivo `.env.example` para `.env` (se houver um) ou crie um novo arquivo chamado `.env`.
    - Adicione a sua string de conexão do MongoDB Atlas a este arquivo:
      ```
      PORT=5000
      MONGO_URI=sua_string_de_conexao_do_mongodb_atlas_aqui
      ```

## Como Executar o Projeto

Com a instalação concluída, você pode iniciar ambos os servidores (frontend e backend) com um único comando a partir da **raiz do projeto**:

```sh
npm run dev
```

Este comando fará o seguinte:
- Iniciará o servidor de desenvolvimento do Vite para o frontend (geralmente em `http://localhost:5173`).
- Iniciará o servidor Express para o backend (em `http://localhost:5000`).

A aplicação frontend já está configurada para se comunicar com o backend.
