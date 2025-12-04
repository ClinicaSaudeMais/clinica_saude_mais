import React, { useState, useEffect } from 'react';
import './Usuarios.css';

const GrupoAcesso = () => {
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPerfis() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/perfis`);
        if (!response.ok) {
          throw new Error('Falha ao buscar os grupos de acesso.');
        }
        const data = await response.json();
        setPerfis(data);
      } catch (error) {
        setError(error.message);
        console.error("Erro ao buscar grupos de acesso:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPerfis();
  }, []);

  if (loading) {
    return <div className="users-container"><p>Carregando grupos de acesso...</p></div>;
  }

  if (error) {
    return <div className="users-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="users-container">
      <h1>Grupos de Acesso</h1>

      <table className="users-table">
        <thead>
          <tr style={{ backgroundColor: '#108052', color: 'white' }}>
            <th>ID</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {perfis.map(perfil => (
            <tr key={perfil.id}>
              <td>{perfil.id}</td>
              <td>{perfil.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GrupoAcesso;