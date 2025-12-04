import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Usuarios/Usuarios.css'; // Reusing the same styles

const MeusAgendamentos = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMinhasConsultas() {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Token exists:', !!token);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/consultas/meus-agendamentos`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          let errorData;
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
            console.error("Backend error details (JSON):", errorData);
            throw new Error(errorData.message || 'Falha ao buscar seus agendamentos.');
          } else {
            errorData = await response.text();
            console.error("Backend error details (text):", errorData);
            throw new Error(errorData || 'Falha ao buscar seus agendamentos: Resposta inesperada do servidor.');
          }
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
    fetchMinhasConsultas();
  }, [navigate]);

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
    return <div className="users-container"><p>Carregando seus agendamentos...</p></div>;
  }

  if (error) {
    return <div className="users-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="users-container">
      <h1>Meus Agendamentos</h1>

      {consultas.length === 0 ? (
        <p>Você ainda não possui agendamentos.</p>
      ) : (
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
      )}
    </div>
  );
};

export default MeusAgendamentos;