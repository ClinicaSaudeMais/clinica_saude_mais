import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Usuarios/Usuarios.css'; // Reusing styles

const NovoAgendamento = () => {
  const [medicos, setMedicos] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [selectedMedico, setSelectedMedico] = useState('');
  const [selectedAgenda, setSelectedAgenda] = useState('');
  
  const [loading, setLoading] = useState({
    medicos: true,
    agendas: false,
    submit: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 1. Fetch all doctors on component mount
  useEffect(() => {
    async function fetchMedicos() {
      setError('');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/role/medicos`);
        if (!response.ok) {
          let errorData;
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
            console.error("Backend error details (JSON):", errorData);
            throw new Error(errorData.message || 'Não foi possível carregar a lista de médicos.');
          } else {
            errorData = await response.text();
            console.error("Backend error details (text):", errorData);
            throw new Error(errorData || 'Não foi possível carregar a lista de médicos: Resposta inesperada do servidor.');
          }
        }
        const data = await response.json();
        console.log("Fetched Medicos:", data); // Log fetched doctors
        setMedicos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, medicos: false }));
      }
    }
    fetchMedicos();
  }, []);

  // 2. Fetch doctor's schedule when a doctor is selected
  useEffect(() => {
    if (!selectedMedico) {
      setAgendas([]);
      return;
    }
    
    async function fetchAgendas() {
      setLoading(prev => ({ ...prev, agendas: true }));
      setSelectedAgenda('');
      setError('');
      console.log("Fetching agendas for medicoId:", selectedMedico); // Added log
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agenda/${selectedMedico}`); // Corrected URL
        if (!response.ok) {
          let errorData;
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
            console.error("Backend error details (JSON):", errorData);
            throw new Error(errorData.message || 'Não foi possível carregar os horários deste médico.');
          } else {
            errorData = await response.text();
            console.error("Backend error details (text):", errorData);
            throw new Error(errorData || 'Não foi possível carregar os horários deste médico: Resposta inesperada do servidor.');
          }
        }
        const data = await response.json();
        console.log("Fetched Agendas:", data); // Log fetched agendas
        // O backend já filtra por disponibilidade, então o filtro do frontend é redundante aqui
        setAgendas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, agendas: false }));
      }
    }
    fetchAgendas();
  }, [selectedMedico]);

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedico || !selectedAgenda) {
      setError('Por favor, selecione um médico e um horário.');
      return;
    }

    setLoading(prev => ({ ...prev, submit: true }));
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const dataToSend = {
      medico_id: Number(selectedMedico),
      agenda_id: Number(selectedAgenda),
    };
    console.log("Submitting appointment data:", dataToSend);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/consultas/minha-consulta`, {
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
          throw new Error(errorData.message || 'Falha ao agendar consulta.');
        } else {
          errorData = await response.text();
          console.error("Backend error details (text):", errorData);
          throw new Error(errorData || 'Falha ao agendar consulta: Resposta inesperada do servidor.');
        }
      }

      alert('Consulta agendada com sucesso!');
      navigate('/agendamentos/meus');

    } catch (err) {
      setError(err.message);
      console.error("Erro ao agendar consulta:", err);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  return (
    <div className="users-container">
      <h1>Novo Agendamento</h1>
      <p>Selecione um médico e um horário disponível para agendar sua consulta.</p>

      <form className="profile-card" onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        {error && <p className="error-message" style={{ textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
        
        {/* Step 1: Select Doctor */}
        <div className="form-group">
          <label htmlFor="medico">Médico</label>
          <select 
            id="medico" 
            name="medico"
            value={selectedMedico}
            onChange={(e) => {
              console.log("Médico selecionado ID:", e.target.value); // Log de depuração
              setSelectedMedico(e.target.value);
            }}
            disabled={loading.medicos}
            required
          >
            <option value="">{loading.medicos ? 'Carregando...' : 'Selecione um médico'}</option>
            {medicos.map(medico => (
              <option key={medico.id} value={medico.id_med}>
                {medico.nome} {medico.sobrenome}
              </option>
            ))}
          </select>
        </div>
        
        {/* Step 2: Select Time Slot */}
        {selectedMedico && (
          <div className="form-group">
            <label htmlFor="agenda">Horários Disponíveis</label>
            {loading.agendas ? <p>Carregando horários...</p> : (
              agendas.length > 0 ? (
                <select 
                  id="agenda" 
                  name="agenda"
                  value={selectedAgenda}
                  onChange={(e) => setSelectedAgenda(e.target.value)}
                  required
                >
                  <option value="">Selecione um horário</option>
                  {agendas.map(agenda => {
                    console.log("Gerando opção para agenda:", agenda); // Log de depuração
                    return (
                      <option key={agenda.id} value={agenda.id}>
                        {new Date(agenda.data).toLocaleDateString('pt-BR')} - {agenda.hora}
                      </option>
                    );
                  })}
                </select>
              ) : <p>Nenhum horário disponível para este médico.</p>
            )}
          </div>
        )}
        
        <button type="submit" className="submit-btn" disabled={loading.submit || !selectedAgenda} style={{ width: 'auto', padding: '10px 30px', marginTop: '20px' }}>
          {loading.submit ? 'Agendando...' : 'Agendar Consulta'}
        </button>
      </form>
    </div>
  );
};

export default NovoAgendamento;