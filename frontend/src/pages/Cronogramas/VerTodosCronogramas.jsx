import React, { useState, useEffect } from 'react';
import '../Usuarios/Usuarios.css'; // Reusing the same styles

const VerTodosCronogramas = () => {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAgendas() {
      try {
        const response = await fetch("http://localhost:3000/api/agendas");
        if (!response.ok) {
          throw new Error('Falha ao buscar cronogramas.');
        }
        const data = await response.json();
        setAgendas(data);
      } catch (error) {
        setError(error.message);
        console.error("Erro ao buscar cronogramas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAgendas();
  }, []);

  if (loading) {
    return <div className="users-container"><p>Carregando todos os cronogramas...</p></div>;
  }

  if (error) {
    return <div className="users-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="users-container">
      <h1>Todos os Cronogramas</h1>

      <table className="users-table">
        <thead>
          <tr style={{ backgroundColor: '#108052', color: 'white' }}>
            <th>ID</th>
            <th>Médico</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Disponibilidade</th>
          </tr>
        </thead>
        <tbody>
          {agendas.map(agenda => (
            <tr key={agenda.id}>
              <td>{agenda.id}</td>
              <td>{agenda.medico?.usuario.nome || 'N/A'}</td>
              <td>{new Date(agenda.data).toLocaleDateString('pt-BR')}</td>
              <td>{agenda.hora}</td>
              <td>{agenda.disponibilidade ? 'Disponível' : 'Indisponível'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerTodosCronogramas;