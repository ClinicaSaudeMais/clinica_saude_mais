import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cadastro from './pages/Cadastro/Cadastro';
import Login from './pages/Login/Login'; // Assuming you have a Login component
import Menu from './components/Menu/Menu';
import Header from './components/Header/Header';
import './App.css';

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

// A simple placeholder for the main page
const MainPage = () => <h1>Página Principal</h1>;

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
            <MainLayout>
              <MainPage />
            </MainLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;