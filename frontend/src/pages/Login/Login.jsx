import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Auth.css';
import logoFundoBranco from '../../assets/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (errors.form) {
        setErrors({ ...errors, form: '' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    const senhaError = validateField('senha', formData.senha);
    if (senhaError) newErrors.senha = senhaError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    let response; // Define response outside the try block to have access in the catch block
    try {
      response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the JWT token
        navigate('/home'); // Redirect to the home page
      } else {
        const error = await response.json();
        setErrors({ form: error.message || 'E-mail ou senha inválidos.' });
      }
    } catch (error) {
      console.error('Erro detalhado ao fazer login:', {
        errorMessage: error.message,
        errorStack: error.stack,
        responseStatus: response?.status,
        responseStatusText: response?.statusText,
        responseBody: response // Log the whole response object
      });
      setErrors({ form: `Erro ao processar a resposta do servidor (Status: ${response?.status}). Verifique o console para mais detalhes.` });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logoFundoBranco} alt="Logo" className="logo" />
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {errors.form && <p className="error-message" style={{ textAlign: 'center', marginBottom: '10px' }}>{errors.form}</p>}
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="email@gmail.com" 
              value={formData.email} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email ? 'error' : ''}
              required 
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-group password-wrapper">
            <label htmlFor="senha">Senha</label>
            <input 
              type={showPassword ? "text" : "password"} 
              id="senha" 
              name="senha" 
              placeholder="********" 
              value={formData.senha} 
              onChange={handleChange} 
              onBlur={handleBlur}
              minLength="8" 
              maxLength="20"
              className={errors.senha ? 'error' : ''}
              required 
            />
            <span onClick={togglePasswordVisibility} className="password-toggle-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.senha && <p className="error-message">{errors.senha}</p>}
          </div>
          <button type="submit" className="submit-btn">Entrar</button>
          <div className="link">
            <p>Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
