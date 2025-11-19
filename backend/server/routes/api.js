const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Importa o pool de conexões

router.get('/mensagem', async (req, res) => {
  try {
    // Exemplo de consulta: seleciona o resultado de 1+1
    const [rows, fields] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ 
      message: 'Consulta ao banco de dados bem-sucedida!',
      data: rows[0] 
    });
  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    res.status(500).json({ message: 'Erro ao conectar com o banco de dados.' });
  }
});

module.exports = router;
