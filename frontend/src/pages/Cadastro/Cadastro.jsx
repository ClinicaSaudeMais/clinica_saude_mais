import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Auth.css';
import logoFundoBranco from '../../assets/logo.png';

const Cadastro = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    cpf: '',
    nome: '',
    sobrenome: '',
    data_nascimento: '',
    email: '',
    senha: '',
    confirmar_senha: '',
    convenio: '',
    // Step 2
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

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setFormData({ ...formData, cpf: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmar_senha) {
      alert('As senhas não coincidem.');
      return;
    }
    if (formData.senha.length < 8 || formData.senha.length > 12) {
      alert('A senha deve ter entre 8 e 12 caracteres.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      cpf: formData.cpf.replace(/\D/g, ''),
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      data_nascimento: formData.data_nascimento,
      email: formData.email,
      senha: formData.senha,
      perfil_id: 3,
      role_data: {
        convenio: formData.convenio,
      },
      contatos: formData.contato.valor ? [formData.contato] : [],
      enderecos: formData.endereco.logradouro ? [formData.endereco] : [],
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
        const error = await response.json();
        alert(`Erro ao cadastrar: ${error.message}`);
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
        <form className="auth-form" onSubmit={step === 1 ? handleNextStep : handleSubmit}>
          <h2>Cadastro</h2>

          {step === 1 && (
            <>
              {/* Step 1 Fields */}
              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleCpfChange} maxLength="14" required />
              </div>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" placeholder="Primeiro nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="sobrenome">Sobrenome</label>
                <input type="text" id="sobrenome" name="sobrenome" placeholder="Sobrenome" value={formData.sobrenome} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="data_nascimento">Data de nascimento</label>
                <input type="date" id="data_nascimento" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" name="email" placeholder="email@gmail.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" name="senha" placeholder="********" value={formData.senha} onChange={handleChange} minLength="8" maxLength="12" required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmar_senha">Confirmar Senha</label>
                <input type="password" id="confirmar_senha" name="confirmar_senha" placeholder="********" value={formData.confirmar_senha} onChange={handleChange} minLength="8" maxLength="12" required />
              </div>
               <div className="form-group">
                <label htmlFor="convenio">Convênio (Opcional)</label>
                <input type="text" id="convenio" name="convenio" placeholder="Nome do Convênio" value={formData.convenio} onChange={handleChange} />
              </div>
              <button type="submit" className="submit-btn">Próximo</button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Step 2 Fields */}
              <h3>Contato e Endereço</h3>
              <div className="form-group">
                <label htmlFor="contato_valor">Celular</label>
                <input type="text" id="contato_valor" name="valor" placeholder="(00) 00000-0000" value={formData.contato.valor} onChange={(e) => handleNestedChange(e, 'contato')} />
              </div>
              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input type="text" id="cep" name="cep" placeholder="00000-000" value={formData.endereco.cep} onChange={(e) => handleNestedChange(e, 'endereco')} />
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

              <div className="form-buttons">
                <button type="button" className="submit-btn" onClick={handlePrevStep} style={{backgroundColor: '#6c757d', marginRight: '10px'}}>Voltar</button>
                <button type="submit" className="submit-btn">Cadastrar</button>
              </div>
            </>
          )}
          
          <div className="link">
            <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;