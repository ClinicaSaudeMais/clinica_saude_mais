require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor da Clínica está conectado!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});

// Conexão com o MongoDB Atlas
// A string de conexão será adicionada aqui quando você a fornecer.
/*
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("Conexão com o MongoDB estabelecida com sucesso");
})
*/
