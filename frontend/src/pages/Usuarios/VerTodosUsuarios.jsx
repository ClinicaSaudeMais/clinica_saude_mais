import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Usuarios.css';

const VerTodosUsuarios = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/api/usuarios");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${id}/ativar`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Falha ao ativar usuário');
      }
      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user.id === id ? updatedUser : user
      ));
      alert(`Usuário ${updatedUser.nome} ativado!`);
    } catch (error) {
      console.error("Erro ao ativar usuário:", error);
      alert("Erro ao ativar usuário.");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${id}/desativar`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Falha ao desativar usuário');
      }
      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user.id === id ? updatedUser : user
      ));
      alert(`Usuário ${updatedUser.nome} desativado!`);
    } catch (error) {
      console.error("Erro ao desativar usuário:", error);
      alert("Erro ao desativar usuário.");
    }
  };

  return (
    <div className="users-container">
      <h1>Ver Todos os Usuários</h1>

      <table className="users-table">
        <thead>
          <tr style={{ backgroundColor: '#108052', color: 'white' }}>
            <th>ID</th>
            <th>Nome</th>
            <th>Perfil</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>
                {user.perfis?.length > 0
                  ? user.perfis.map(p => p.perfil.nome).join(", ")
                  : "Sem perfil"}
              </td>
              <td>{user.ativo ? 'Ativo' : 'Inativo'}</td>
              <td>
                {user.ativo ? (
                  <button onClick={() => handleDeactivate(user.id)} className="action-button deactivate">Desativar</button>
                ) : (
                  <button onClick={() => handleActivate(user.id)} className="action-button activate">Ativar</button>
                )}
                <Link to={`/usuarios/editar/${user.id}`} className="action-button edit">Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerTodosUsuarios;
