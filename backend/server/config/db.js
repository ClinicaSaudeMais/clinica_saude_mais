const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../db/database.db');
const schemaPath = path.resolve(__dirname, '../db/schema.sql');

// Checa se o arquivo do banco de dados existe.
const dbExists = fs.existsSync(dbPath);

// Conecta ao banco de dados SQLite. O arquivo é criado se não existir.
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados SQLite:', err.message);
  } else {
    console.log('Conexão com o banco de dados SQLite estabelecida com sucesso!');
    
    // Se o banco de dados não existia, cria o schema.
    if (!dbExists) {
      console.log('Criando o schema do banco de dados...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      db.exec(schema, (execErr) => {
        if (execErr) {
          console.error('Erro ao criar o schema do banco de dados:', execErr.message);
        } else {
          console.log('Schema do banco de dados criado com sucesso!');
        }
      });
    }
  }
});

// A biblioteca sqlite3 não possui um "pool" como o mysql2.
// A própria biblioteca gerencia a serialização de comandos.
// Para consultas, você usará os métodos db.get(), db.all(), db.run(), etc.
// Para compatibilidade com o código existente que pode esperar um pool,
// vamos exportar o objeto 'db' e adaptar as rotas para usá-lo.

// Adicionando um método 'query' para simular a interface do pool do mysql2
// Isso ajuda a reduzir a quantidade de alterações necessárias no código das rotas.
db.query = (sql, params) => {
    return new Promise((resolve, reject) => {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // O mysql2 retorna um array [rows, fields]
                    resolve([rows, []]);
                }
            });
        } else {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Simplificado para retornar o objeto diretamente
                    resolve([{ affectedRows: this.changes, insertId: this.lastID }]);
                }
            });
        }
    });
};

// Adiciona um método 'exec' que retorna uma Promise para controle de transações
db.execQuery = (sql) => {
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports = db;