import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Menu from './components/Menu/Menu';
import Header from './components/Header/Header';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // This is just a test call, it can be removed later
    axios.get('http://localhost:5000/api/mensagem')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar dados do backend!', error);
        setMessage('Falha ao conectar com o servidor.');
      });
  }, []);

  return (
    <div className="app-container">
      <Menu />
      <Header />
      <main className="main-content">
        <h1>Página Principal</h1>
        <div className="card">
          <h2>Mensagem de Teste do Backend:</h2>
          <p>{message}</p>
        </div>
        {/* O conteúdo das páginas será renderizado aqui no futuro */}
      </main>
    </div>
  )
}

export default App;
