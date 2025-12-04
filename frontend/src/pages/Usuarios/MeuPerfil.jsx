import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Usuarios.css';

const MeuPerfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Você precisa estar logado para ver seu perfil.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar dados do perfil.');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div className="users-container"><p>Carregando perfil...</p></div>;
  }

  if (error) {
    return <div className="users-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  if (!user) {
    return <div className="users-container"><p>Nenhum dado de usuário encontrado.</p></div>;
  }
  
  const formattedDate = user.data_nascimento 
    ? new Date(user.data_nascimento).toLocaleDateString('pt-BR')
    : 'Não informado';

  return (
    <div className="users-container">
      <h1>Meu Perfil</h1>
      <div className="profile-card">
        <div className="profile-info">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Nome Completo:</strong> {user.nome} {user.sobrenome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>CPF:</strong> {user.cpf}</p>
          <p><strong>Data de Nascimento:</strong> {formattedDate}</p>
          <p><strong>Perfil de Acesso:</strong> {user.perfis?.length > 0 ? user.perfis.map(p => p.perfil.nome).join(", ") : "Sem perfil"}</p>
          <p><strong>Status:</strong> {user.ativo ? 'Ativo' : 'Inativo'}</p>
        </div>
        <div className="profile-actions">
          <Link to={`/usuarios/editar/${user.id}`} className="action-button edit">Editar Perfil</Link>
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;