import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Faz a requisição para o backend
    axios.get('http://localhost:5000/api/mensagem')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar dados do backend!', error);
        setMessage('Falha ao conectar com o servidor. Verifique o console.');
      });
  }, []); // O array vazio garante que o useEffect será executado apenas uma vez

  return (
    <>
      <h1>Teste</h1>
      <div className="card">
        <h2>Mensagem do Backend:</h2>
        <p>{message}</p>
      </div>

    </>
  )
}

export default App;
