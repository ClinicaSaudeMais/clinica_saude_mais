import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Usuarios/Usuarios.css'; // Reusing the same styles

const MeusCronogramas = () => {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMinhasAgendas() {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/agendas/meus-cronogramas/medico", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          setError("Você não possui um perfil de médico para ter cronogramas.");
          return;
        }

        if (!response.ok) {
          throw new Error('Falha ao buscar seus cronogramas.');
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
    fetchMinhasAgendas();
  }, [navigate]);

  if (loading) {
    return <div className="users-container"><p>Carregando seus cronogramas...</p></div>;
  }

  if (error) {
    return <div className="users-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="users-container">
      <h1>Meus Cronogramas</h1>

      {agendas.length === 0 ? (
        <p>Você ainda não possui horários cadastrados no seu cronograma.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr style={{ backgroundColor: '#108052', color: 'white' }}>
              <th>ID</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Disponibilidade</th>
            </tr>
          </thead>
          <tbody>
            {agendas.map(agenda => (
              <tr key={agenda.id}>
                <td>{agenda.id}</td>
                <td>{new Date(agenda.data).toLocaleDateString('pt-BR')}</td>
                <td>{agenda.hora}</td>
                <td>{agenda.disponibilidade ? 'Disponível' : 'Indisponível'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MeusCronogramas;