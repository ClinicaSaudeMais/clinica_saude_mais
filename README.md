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

## Inspecionando o Banco de Dados SQLite

O projeto utiliza SQLite, que armazena todos os dados em um único arquivo (`database.db`). Existem duas formas principais de inspecionar o conteúdo do seu banco de dados: via linha de comando ou com uma ferramenta gráfica (GUI).

### Opção 1: Linha de Comando (CLI) com `sqlite3`

Se você preferir a linha de comando, pode usar o utilitário `sqlite3` (parte das ferramentas SQLite).

1.  **Baixe as ferramentas SQLite CLI (se necessário):**
    *   Vá para a página de download oficial do SQLite: [https://www.sqlite.org/download.html](https://www.sqlite.org/download.html)
    *   Procure pela seção "Precompiled Binaries for Windows" e baixe o arquivo `sqlite-tools-win32-x86-...zip`.
    *   Descompacte o arquivo em um local de fácil acesso (ex: `C:\sqlite`).

2.  **Abra o terminal e navegue até o diretório do banco de dados:**
    ```bash
    cd C:\xampp\htdocs\clinica_saude_mais\backend\server\db
    ```
    (Ajuste o caminho se o seu projeto estiver em outro local.)

3.  **Acesse o banco de dados:**
    Assumindo que você descompactou o `sqlite3.exe` em `C:\sqlite`:
    ```bash
    C:\sqlite\sqlite3 database.db
    ```
    Você verá o prompt `sqlite>`.

4.  **Comandos úteis:**
    *   `.tables` - Lista todas as tabelas no banco de dados.
    *   `.schema <nome_da_tabela>` - Mostra o esquema (estrutura) de uma tabela específica (ex: `.schema usuario`).
    *   `SELECT * FROM <nome_da_tabela>;` - Exibe todos os registros de uma tabela (ex: `SELECT * FROM usuario;`). Não esqueça o `;` no final.
    *   `.quit` - Sai do prompt `sqlite>`.

### Opção 2: Ferramenta Gráfica (GUI) - DB Browser for SQLite

Para uma visualização mais amigável, o **DB Browser for SQLite** é uma excelente opção.

1.  **Baixe e instale o DB Browser for SQLite:**
    *   Vá para a página oficial: [https://sqlitebrowser.org/dl/](https://sqlitebrowser.org/dl/)
    *   Baixe o instalador adequado para o seu sistema operacional (Windows de 64 bits, geralmente).
    *   Siga as instruções de instalação.

2.  **Abra o `database.db`:**
    *   Abra o DB Browser for SQLite.
    *   Clique em "Abrir Banco de Dados" (ou "Open Database").
    *   Navegue até `C:\xampp\htdocs\clinica_saude_mais\backend\server\db\` (ou onde seu projeto estiver) e selecione o arquivo `database.db`.

3.  **Explore o banco de dados:**
    *   Na aba "Estrutura de Dados" (Database Structure), você verá a lista de tabelas e seus esquemas.
    *   Na aba "Procurar Dados" (Browse Data), você pode selecionar uma tabela no dropdown e visualizar todos os seus registros de forma paginada.

Essas ferramentas o ajudarão a verificar os dados, depurar e entender melhor como as informações estão sendo armazenadas.