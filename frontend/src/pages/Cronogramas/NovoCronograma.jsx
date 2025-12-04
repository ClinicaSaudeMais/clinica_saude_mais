import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Usuarios/Usuarios.css'; // Reusing styles

const NovoCronograma = () => {
  const [formData, setFormData] = useState({
    data: '',
    hora: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.data || !formData.hora) {
      setError('Por favor, preencha a data e a hora.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    console.log('Sending formData:', formData);
    console.log('Token exists:', !!token); // Log if token exists without revealing the token itself

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agenda/meus-cronogramas/medico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
          console.error("Backend error details (JSON):", errorData);
          throw new Error(errorData.message || 'Falha ao criar horário.');
        } else {
          errorData = await response.text();
          console.error("Backend error details (text):", errorData);
          throw new Error(errorData || 'Falha ao criar horário: Resposta inesperada do servidor.');
        }
      }

      alert('Novo horário adicionado ao seu cronograma!');
      navigate('/cronogramas/meus');

    } catch (err) {
      setError(err.message);
      console.error("Erro ao criar cronograma:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-container">
      <h1>Novo Cronograma</h1>
      <p>Adicione um novo horário disponível à sua agenda.</p>

      <form className="profile-card" onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        {error && <p className="error-message" style={{ textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
        
        <div className="form-group">
          <label htmlFor="data">Data</label>
          <input 
            type="date" 
            id="data" 
            name="data" 
            value={formData.data}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="hora">Hora</label>
          <input 
            type="time" 
            id="hora" 
            name="hora" 
            value={formData.hora}
            onChange={handleChange}
            required 
          />
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading} style={{ width: 'auto', padding: '10px 30px', marginTop: '20px' }}>
          {loading ? 'Adicionando...' : 'Adicionar Horário'}
        </button>
      </form>
    </div>
  );
};

export default NovoCronograma;