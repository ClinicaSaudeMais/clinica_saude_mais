import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Usuarios/Usuarios.css'; // Reusing the same styles

const VerTodosAgendamentos = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchConsultas() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/consultas`);
        if (!response.ok) {
          throw new Error('Falha ao buscar agendamentos.');
        }
        const data = await response.json();
        setConsultas(data);
      } catch (error) {
        setError(error.message);
        console.error("Erro ao buscar agendamentos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchConsultas();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'agendada':
        return 'status-agendada';
      case 'realizada':
        return 'status-realizada';
      case 'cancelada':
        return 'status-cancelada';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="users-container"><p>Carregando todos os agendamentos...</p></div>;
  }

  if (error) {
    return <div className="users-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="users-container">
      <h1>Todos os Agendamentos</h1>

      <table className="users-table">
        <thead>
          <tr style={{ backgroundColor: '#108052', color: 'white' }}>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map(consulta => (
            <tr key={consulta.id}>
              <td>{consulta.id}</td>
              <td>{consulta.paciente?.usuario.nome || 'N/A'}</td>
              <td>{consulta.medico?.usuario.nome || 'N/A'}</td>
              <td>{new Date(consulta.agenda.data).toLocaleDateString('pt-BR')}</td>
              <td>{consulta.agenda.hora}</td>
              <td>
                <span className={`status-badge ${getStatusClass(consulta.status)}`}>
                  {consulta.status}
                </span>
              </td>
              <td>
                <Link to={`/agendamentos/${consulta.id}`} className="action-button edit">Ver Detalhes</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerTodosAgendamentos;