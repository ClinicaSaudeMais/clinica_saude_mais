import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Auth.css';
import logoFundoBranco from '../../assets/logo_fundo_branco.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    // Client-side validation for password length
    if (formData.senha.length < 8 || formData.senha.length > 12) {
      alert("A senha deve ter entre 8 e 12 caracteres.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the JWT token
        alert("Login bem-sucedido!");
        navigate('/home'); // Redirect to the home page
      } else {
        const error = await response.json();
        alert(`Erro ao fazer login: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert("Erro ao conectar com o servidor.");
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
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="email@gmail.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input 
              type="password" 
              id="senha" 
              name="senha" 
              placeholder="********" 
              value={formData.senha} 
              onChange={handleChange} 
              minLength="8" 
              maxLength="12" 
              required 
            />
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
