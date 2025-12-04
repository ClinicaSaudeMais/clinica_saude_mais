import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import
import '../Usuarios/Usuarios.css'; // Reusing styles

const NovoCronograma = () => {
  const [formData, setFormData] = useState({
    data: '',
    hora: '',
    medico_id: '' // Add medico_id to form data
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isUserDoctor, setIsUserDoctor] = useState(false);
  const [userMedicoId, setUserMedicoId] = useState(null); // To store the medico_id of the logged-in doctor
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userProfiles = decodedToken.perfis.map(profileName => profileName.toLowerCase());
        if (userProfiles.includes('medico')) {
          setIsUserDoctor(true);
          // If the user is a doctor, their medico_id will be handled by the backend
          // We can pre-select it or let the backend infer it. For now, let backend infer.
        }
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
        // Token might be invalid, redirect to login
        navigate('/login');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    async function fetchDoctors() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/role/medicos`, {
          headers: {
            'Authorization': `Bearer ${token}` // Assuming this endpoint requires auth
          }
        });
        if (!response.ok) {
          throw new Error('Falha ao buscar médicos.');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error("Erro ao buscar médicos:", err);
        setError(err.message || 'Erro ao carregar lista de médicos.');
      }
    }
    fetchDoctors();
  }, [navigate]);

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

    if (!isUserDoctor && !formData.medico_id) {
      setError('Por favor, selecione um médico.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const dataToSend = {
      data: formData.data,
      hora: formData.hora,
    };

    // Only add medico_id to dataToSend if the user is not a doctor, or if they explicitly selected one
    if (!isUserDoctor && formData.medico_id) {
      dataToSend.medico_id = formData.medico_id;
    } else if (isUserDoctor && !formData.medico_id) {
      // If user is a doctor and didn't select a medico_id, let the backend infer it from their user ID
      // No need to add medico_id to dataToSend here, as backend will derive it from req.user
    } else if (isUserDoctor && formData.medico_id) {
      // If user is a doctor and selected a medico_id (e.g., for another doctor)
      dataToSend.medico_id = formData.medico_id;
    }


    console.log('Sending formData:', dataToSend);
    console.log('Token exists:', !!token);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agenda/meus-cronogramas/medico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
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
        
        {/* Doctor selection dropdown for non-doctors, or for doctors wanting to select another doctor */}
        {(!isUserDoctor || (isUserDoctor && doctors.length > 0)) && ( // Show if not a doctor, or if a doctor and there are other doctors to select
          <div className="form-group">
            <label htmlFor="medico_id">Médico</label>
            <select
              id="medico_id"
              name="medico_id"
              value={formData.medico_id}
              onChange={handleChange}
              required={!isUserDoctor} // Required only if user is not a doctor
            >
              <option value="">Selecione um Médico</option>
              {doctors.map(doctor => (
                <option key={doctor.id_med} value={doctor.id_med}>
                  {doctor.nome} {doctor.sobrenome}
                </option>
              ))}
            </select>
            {error && error.includes('médico') && <p className="error-message">{error}</p>}
          </div>
        )}

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