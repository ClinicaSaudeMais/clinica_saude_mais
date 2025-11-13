require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Servidor da Clínica está conectado!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});

// Inicializa a conexão com o banco de dados
require('./config/db');

