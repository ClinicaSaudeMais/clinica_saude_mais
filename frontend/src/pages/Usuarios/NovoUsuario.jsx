import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';
import './Usuarios.css';

const NovoUsuario = () => {
  const [errors, setErrors] = useState({});
  const [perfis, setPerfis] = useState([]);
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    sobrenome: '',
    data_nascimento: '',
    email: '',
    senha: '',
    confirmar_senha: '',
    perfil_id: '',
    crm: '',
    convenio: '',
    contato: {
      tipo_contato: 'Celular',
      valor: '',
      principal: true,
    },
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
    }
  });

  const navigate = useNavigate();

  // Buscar perfis
  useEffect(() => {
    async function fetchPerfis() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/perfis`);
        const data = await response.json();
        setPerfis(data);
      } catch (error) {
        console.error('Erro ao buscar perfis:', error);
        setErrors(prev => ({ ...prev, form: 'Erro ao carregar perfis.' }));
      }
    }
    fetchPerfis();
  }, []);

  // Retorna o nome do perfil selecionado
  const getSelectedProfileName = () => {
    const id = parseInt(formData.perfil_id);
    const p = perfis.find(perfil => perfil.id === id);
    return p ? p.nome.toLowerCase() : '';
  };

  // Validação
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) error = 'O e-mail é obrigatório.';
        else if (!emailRegex.test(value)) error = 'E-mail inválido.';
        break;

      case 'senha':
        if (!value) error = 'A senha é obrigatória.';
        else if (value.length < 8) error = 'Mínimo 8 caracteres.';
        break;

      case 'confirmar_senha':
        if (value !== formData.senha) error = 'Senhas não coincidem.';
        break;

      case 'cpf':
        if (!value) error = 'O CPF é obrigatório.';
        break;

      case 'nome':
        if (!value) error = 'O nome é obrigatório.';
        break;

      case 'data_nascimento':
        if (!value) error = 'A data de nascimento é obrigatória.';
        break;

      case 'perfil_id':
        if (!value) error = 'Selecione um perfil.';
        break;

      case 'crm':
        if (getSelectedProfileName() === 'medico' && !value)
          error = 'CRM é obrigatório para médicos.';
        break;

      default:
        break;
    }

    return error;
  };


  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };


  // Mudanças gerais
  const handleChange = (e) => {
    const { name, value } = e.target;

    // se trocar o perfil, limpar crm/convenio e erros
    if (name === 'perfil_id') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        crm: '',
        convenio: ''
      }));
      setErrors(prev => ({ ...prev, crm: '', convenio: '' }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [name]: value }
    }));
  };

  // CPF formatado
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    setFormData(prev => ({ ...prev, cpf: value }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');

    setFormData(prev => ({
      ...prev,
      contato: { ...prev.contato, valor: value }
    }));
  };

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');

    setFormData(prev => ({
      ...prev,
      endereco: { ...prev.endereco, cep: value }
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = [
      'cpf', 'nome', 'data_nascimento', 'email',
      'senha', 'confirmar_senha', 'perfil_id', 'crm'
    ];

    const newErrors = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const profileName = getSelectedProfileName();
    let role_data = {};

    if (profileName === 'medico') {
      role_data = { crm: formData.crm };
    } else if (profileName === 'paciente') {
      role_data = { convenio: formData.convenio };
    }

    const dataToSend = {
      cpf: formData.cpf.replace(/\D/g, ''),
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      data_nascimento: formData.data_nascimento,
      email: formData.email,
      senha: formData.senha,
      perfil_id: parseInt(formData.perfil_id),
      role_data,
      contatos: formData.contato.valor ? [formData.contato] : [],
      enderecos: formData.endereco.cep
        ? [{ ...formData.endereco, numero: String(formData.endereco.numero) }]
        : [],
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        alert('Usuário criado!');
        navigate('/home');
      } else {
        const err = await response.json();
        setErrors({ form: err.message || 'Erro no servidor.' });
      }
    } catch (error) {
      setErrors({ form: 'Erro de conexão.' });
    }
  };


  const selectedProfile = getSelectedProfileName();


  return (
    <div className="users-container">
      <h1>Novo Usuário</h1>

      <form className="profile-card" onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        {errors.form && (
          <p className="error-message" style={{ textAlign: 'center' }}>{errors.form}</p>
        )}

        <div className="form-grid">

          {/* Campos principais */}
          <div className="form-group">
            <label>Nome</label>
            <input name="nome" value={formData.nome} onChange={handleChange} onBlur={handleBlur} />
            {errors.nome && <p className="error-message">{errors.nome}</p>}
          </div>

          <div className="form-group">
            <label>Sobrenome</label>
            <input name="sobrenome" value={formData.sobrenome} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>CPF</label>
            <input name="cpf" maxLength="14" value={formData.cpf} onChange={handleCpfChange} onBlur={handleBlur} />
            {errors.cpf && <p className="error-message">{errors.cpf}</p>}
          </div>

          <div className="form-group">
            <label>Data de Nascimento</label>
            <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} />
            {errors.data_nascimento && <p className="error-message">{errors.data_nascimento}</p>}
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input type="password" name="senha" value={formData.senha} onChange={handleChange} onBlur={handleBlur} />
            {errors.senha && <p className="error-message">{errors.senha}</p>}
          </div>

          <div className="form-group">
            <label>Confirmar Senha</label>
            <input type="password" name="confirmar_senha" value={formData.confirmar_senha} onChange={handleChange} onBlur={handleBlur} />
            {errors.confirmar_senha && <p className="error-message">{errors.confirmar_senha}</p>}
          </div>

          <div className="form-group">
            <label>Perfil</label>
            <select name="perfil_id" value={formData.perfil_id} onChange={handleChange}>
              <option value="">Selecione</option>
              {perfis.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
            {errors.perfil_id && <p className="error-message">{errors.perfil_id}</p>}
          </div>

          {/* Condicionais */}
          {selectedProfile === 'medico' && (
            <div className="form-group">
              <label>CRM</label>
              <input name="crm" value={formData.crm} onChange={handleChange} onBlur={handleBlur} />
              {errors.crm && <p className="error-message">{errors.crm}</p>}
            </div>
          )}

          {selectedProfile === 'paciente' && (
            <div className="form-group">
              <label>Convênio</label>
              <input name="convenio" value={formData.convenio} onChange={handleChange} />
            </div>
          )}
        </div>

        <h3 style={{ marginTop: '20px' }}>Contato e Endereço (Opcional)</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Celular</label>
            <input maxLength="15" value={formData.contato.valor} onChange={handlePhoneChange} />
          </div>

          <div className="form-group">
            <label>CEP</label>
            <input maxLength="9" value={formData.endereco.cep} onChange={handleCepChange} />
          </div>

          <div className="form-group">
            <label>Logradouro</label>
            <input name="logradouro" value={formData.endereco.logradouro} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>

          <div className="form-group">
            <label>Número</label>
            <input name="numero" value={formData.endereco.numero} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>

          <div className="form-group">
            <label>Complemento</label>
            <input name="complemento" value={formData.endereco.complemento} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>

          <div className="form-group">
            <label>Bairro</label>
            <input name="bairro" value={formData.endereco.bairro} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>

          <div className="form-group">
            <label>Cidade</label>
            <input name="cidade" value={formData.endereco.cidade} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <input name="estado" value={formData.endereco.estado} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>
        </div>

        <button type="submit" className="submit-btn" style={{ marginTop: '20px' }}>
          Criar Usuário
        </button>
      </form>
    </div>
  );
};

export default NovoUsuario;
