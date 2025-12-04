import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cadastro from './pages/Cadastro/Cadastro';
import Login from './pages/Login/Login';
import Menu from './components/Menu/Menu';
import Header from './components/Header/Header';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Home from './pages/Home/Home';
import './App.css';
import VerTodosUsuarios from './pages/Usuarios/VerTodosUsuarios';
import GrupoAcesso from './pages/Usuarios/GrupoAcesso';
import MeuPerfil from './pages/Usuarios/MeuPerfil';
import NovoUsuario from './pages/Usuarios/NovoUsuario';
import VerTodosAgendamentos from './pages/Agendamentos/VerTodosAgendamentos';
import MeusAgendamentos from './pages/Agendamentos/MeusAgendamentos';
import NovoAgendamento from './pages/Agendamentos/NovoAgendamento';
import VerTodosCronogramas from './pages/Cronogramas/VerTodosCronogramas';
import MeusCronogramas from './pages/Cronogramas/MeusCronogramas';
import NovoCronograma from './pages/Cronogramas/NovoCronograma';

// A simple layout component for authenticated routes
const MainLayout = ({ children }) => (
  <div className="app-container">
    <Menu />
    <Header />
    <main className="main-content">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        {/* Redirect root to login for now */}
        <Route path="/" element={<Navigate to="/login" />} /> 
        
        {/* Example of a protected route */}
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/usuarios" 
          element={
            <PrivateRoute>
              <MainLayout>
                <VerTodosUsuarios />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/usuarios/grupos-de-acesso" 
          element={
            <PrivateRoute>
              <MainLayout>
                <GrupoAcesso />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/usuarios/meu-perfil" 
          element={
            <PrivateRoute>
              <MainLayout>
                <MeuPerfil />
              </MainLayout>
            </PrivateRoute>
          } 
        />
                <Route
                  path="/usuarios/novo"
                  element={
                    <PrivateRoute>
                      <MainLayout>
                        <NovoUsuario />
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/agendamentos"          element={
            <PrivateRoute>
              <MainLayout>
                <VerTodosAgendamentos />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/agendamentos/meus" 
          element={
            <PrivateRoute>
              <MainLayout>
                <MeusAgendamentos />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/agendamentos/novo" 
          element={
            <PrivateRoute>
              <MainLayout>
                <NovoAgendamento />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cronogramas" 
          element={
            <PrivateRoute>
              <MainLayout>
                <VerTodosCronogramas />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cronogramas/meus" 
          element={
            <PrivateRoute>
              <MainLayout>
                <MeusCronogramas />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cronogramas/novo" 
          element={
            <PrivateRoute>
              <MainLayout>
                <NovoCronograma />
              </MainLayout>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;