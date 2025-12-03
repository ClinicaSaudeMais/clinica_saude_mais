import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Auth.css';
import logoFundoBranco from '../../assets/logo.png';

const Cadastro = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    sobrenome: '',
    data_nascimento: '',
    email: '',
    senha: '',
    confirmar_senha: '',
    convenio: '',
    contato: {
      tipo_contato: 'Celular',
      valor: '',
      principal: true,
    },
    endereco: {
      logradouro: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
    },
  });

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) error = 'O e-mail é obrigatório.';
        else if (!emailRegex.test(value)) error = 'Por favor, insira um e-mail válido.';
        break;
      case 'senha':
        if (!value) error = 'A senha é obrigatória.';
        else if (value.length < 8 || value.length > 20) {
          error = 'A senha deve ter entre 8 e 20 caracteres.';
        }
        break;
      case 'confirmar_senha':
        if (!value) error = 'A confirmação da senha é obrigatória.';
        else if (value !== formData.senha) {
          error = 'As senhas não coincidem.';
        }
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
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setFormData({ ...formData, cpf: value });
    if (errors.cpf) {
      setErrors({ ...errors, cpf: '' });
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    setFormData({
      ...formData,
      contato: {
        ...formData.contato,
        valor: value,
      },
    });
  };

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    setFormData({
      ...formData,
      endereco: {
        ...formData.endereco,
        cep: value,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (name === 'senha') {
        const confirmError = validateField('confirmar_senha', formData.confirmar_senha);
        setErrors(prev => ({...prev, confirmar_senha: confirmError}));
    }
  };

  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsToValidate = ['cpf', 'nome', 'data_nascimento', 'email', 'senha', 'confirmar_senha'];
    const newErrors = {};
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      cpf: formData.cpf.replace(/\D/g, ''),
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      data_nascimento: formData.data_nascimento,
      email: formData.email,
      senha: formData.senha,
      perfil_id: 3, // Hardcoded to 'Paciente'
      role_data: {
        convenio: formData.convenio,
      },
      contatos: formData.contato.valor ? [formData.contato] : [],
      enderecos: formData.endereco.cep ? [formData.endereco] : [],
    };

    try {
      const response = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        alert(`Erro ao cadastrar: ${errorData.message || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logoFundoBranco} alt="Logo" className="logo" />
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Cadastro</h2>

          {/* Personal and Auth Fields */}
          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleCpfChange} onBlur={handleBlur} maxLength="14" required className={errors.cpf ? 'error' : ''} />
            {errors.cpf && <p className="error-message">{errors.cpf}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input type="text" id="nome" name="nome" placeholder="Primeiro nome" value={formData.nome} onChange={handleChange} onBlur={handleBlur} required className={errors.nome ? 'error' : ''} />
            {errors.nome && <p className="error-message">{errors.nome}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="sobrenome">Sobrenome</label>
            <input type="text" id="sobrenome" name="sobrenome" placeholder="Sobrenome" value={formData.sobrenome} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="data_nascimento">Data de nascimento</label>
            <input type="date" id="data_nascimento" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} onBlur={handleBlur} required className={errors.data_nascimento ? 'error' : ''} />
            {errors.data_nascimento && <p className="error-message">{errors.data_nascimento}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" placeholder="email@gmail.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} required className={errors.email ? 'error' : ''} />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" name="senha" placeholder="********" value={formData.senha} onChange={handleChange} onBlur={handleBlur} minLength="8" maxLength="20" required className={errors.senha ? 'error' : ''} />
            {errors.senha && <p className="error-message">{errors.senha}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmar_senha">Confirmar Senha</label>
            <input type="password" id="confirmar_senha" name="confirmar_senha" placeholder="********" value={formData.confirmar_senha} onChange={handleChange} onBlur={handleBlur} minLength="8" maxLength="20" required className={errors.confirmar_senha ? 'error' : ''} />
            {errors.confirmar_senha && <p className="error-message">{errors.confirmar_senha}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="convenio">Convênio (Opcional)</label>
            <input type="text" id="convenio" name="convenio" placeholder="Nome do Convênio" value={formData.convenio} onChange={handleChange} />
          </div>

          {/* Contact and Address Fields */}
          <h3>Contato e Endereço (Opcional)</h3>
          <div className="form-group">
            <label htmlFor="contato_valor">Celular</label>
            <input type="text" id="contato_valor" name="valor" placeholder="(00) 00000-0000" value={formData.contato.valor} onChange={handlePhoneChange} maxLength="15" />
          </div>
          <div className="form-group">
            <label htmlFor="cep">CEP</label>
            <input type="text" id="cep" name="cep" placeholder="00000-000" value={formData.endereco.cep} onChange={handleCepChange} maxLength="9" />
          </div>
          <div className="form-group">
            <label htmlFor="logradouro">Logradouro</label>
            <input type="text" id="logradouro" name="logradouro" placeholder="Rua, Avenida, etc." value={formData.endereco.logradouro} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>
          <div className="form-group">
            <label htmlFor="complemento">Complemento</label>
            <input type="text" id="complemento" name="complemento" placeholder="Apto, Bloco, etc." value={formData.endereco.complemento} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>
          <div className="form-group">
            <label htmlFor="bairro">Bairro</label>
            <input type="text" id="bairro" name="bairro" placeholder="Bairro" value={formData.endereco.bairro} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>
          <div className="form-group">
            <label htmlFor="cidade">Cidade</label>
            <input type="text" id="cidade" name="cidade" placeholder="Cidade" value={formData.endereco.cidade} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>
          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <input type="text" id="estado" name="estado" placeholder="UF" value={formData.endereco.estado} onChange={(e) => handleNestedChange(e, 'endereco')} />
          </div>
          
          <button type="submit" className="submit-btn">Cadastrar</button>
          
          <div className="link">
            <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;