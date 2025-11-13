# Clínica Saúde Mais

Este é um projeto full-stack para a M3 da matéria de Melhoria de Processos de Software, configurado como um monorepo usando npm Workspaces para gerenciar o frontend e o backend de forma integrada.

## Tecnologias Utilizadas

- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Banco de Dados**: MySQL
- **Gerenciador de Pacotes**: npm Workspaces
- **Utilitários**: `concurrently` para executar os projetos simultaneamente, `nodemon` para reiniciar o servidor backend automaticamente.

## Estrutura do Projeto

O projeto está dividido em dois workspaces principais gerenciados a partir da raiz:

- `frontend/`: Contém a aplicação React.
- `backend/server/`: Contém a aplicação Node.js/Express.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- npm (versão 7 ou superior, para suporte a Workspaces)
- MySQL (instalado e em execução)

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

3.  **Configure as Variáveis de Ambiente:**
    - Navegue até a pasta do backend: `cd backend/server`
    - Renomeie o arquivo `.env_exemple` para `.env`.
    - Abra o arquivo `.env` e adicione as credenciais de acesso ao seu banco de dados MySQL.

## Como Executar o Projeto

Com a instalação concluída, você pode iniciar ambos os servidores (frontend e backend) com um **único comando** a partir da **raiz do projeto**:

```sh
npm run dev
```

Este comando fará o seguinte:
- Iniciará o servidor de desenvolvimento do Vite para o frontend (geralmente em `http://localhost:5173`).
- Iniciará o servidor Express para o backend com `nodemon` (em `http://localhost:5000`).

## Banco de Dados

Os scripts para criação do banco de dados e tabelas estão localizados em `backend/server/db/banco.sql`.
