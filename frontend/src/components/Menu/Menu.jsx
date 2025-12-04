import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaUsers, FaCalendarAlt, FaChartBar, FaChevronRight } from 'react-icons/fa';
import './Menu.css';
import logo from '../../assets/logo_branca.png';

const Menu = () => {
    const [openMenu, setOpenMenu] = useState(''); // 'usuarios', 'agendamentos', 'cronograma'
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPaciente, setIsPaciente] = useState(false); // Novo estado para paciente
    const [isMedico, setIsMedico] = useState(false); // Novo estado para médico
    const navigate = useNavigate(); // Adicionar useNavigate para redirecionamento em caso de token inválido

    const toggleMenu = (menuName) => {
        setOpenMenu(openMenu === menuName ? '' : menuName);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // O backend retorna perfis como array de strings (ex: ['Administrador', 'Medico'])
                const userProfiles = decodedToken.perfis.map(p => p.toLowerCase()); // Garantir minúsculas
                
                if (userProfiles.includes('administrador')) {
                    setIsAdmin(true);
                } else { // Resetar isAdmin se não for admin
                    setIsAdmin(false);
                }

                if (userProfiles.includes('paciente')) { // Verificar se é paciente
                    setIsPaciente(true);
                } else { // Resetar isPaciente se não for paciente
                    setIsPaciente(false);
                }

                if (userProfiles.includes('medico')) { // Verificar se é médico
                    setIsMedico(true);
                } else { // Resetar isMedico se não for médico
                    setIsMedico(false);
                }

            } catch (err) {
                console.error("Erro ao decodificar token no Menu:", err);
                // Se o token for inválido/expirado, redirecionar para login
                localStorage.removeItem('token');
                navigate('/login');
            }
        } else {
            // Se não houver token, garantir que todos os estados de perfil são falsos
            setIsAdmin(false);
            setIsPaciente(false);
            setIsMedico(false);
            // navigate('/login'); // Decida se quer redirecionar automaticamente se o token sumir
        }
    }, [navigate]); // navigate deve ser uma dependência do useEffect

    return (
        <aside className="sidebar">
            <div className="logo-container">
                <img src={logo} alt="Logo Saúde+" className="logo" />
            </div>
            <nav>
                <ul className="menu-list">
                    {/* Seção Usuários */}
                    <li className="menu-section">
                        <button className="menu-title" onClick={() => toggleMenu('usuarios')}>
                            {/* <FaUsers className="menu-icon" /> */}
                            <span className="menu-text">Usuários</span>
                            <FaChevronRight className={`arrow-icon ${openMenu === 'usuarios' ? 'open' : ''}`} />
                        </button>
                        <ul className={`submenu ${openMenu === 'usuarios' ? 'open' : ''}`}>
                            {isAdmin && <li className="submenu-item"><Link to="/usuarios">Ver todos</Link></li>}
                            {isAdmin && <li className="submenu-item"><Link to="/usuarios/grupos-de-acesso">Grupo de acesso</Link></li>}
                            <li className="submenu-item"><Link to="/usuarios/meu-perfil">Meu perfil</Link></li>
                            {isAdmin && <li className="submenu-item"><Link to="/usuarios/novo">Novo usuário</Link></li>}
                        </ul>
                    </li>

                    {/* Seção Agendamentos */}
                    <li className="menu-section">
                        <button className="menu-title" onClick={() => toggleMenu('agendamentos')}>
                            {/* <FaCalendarAlt className="menu-icon" /> */}
                            <span className="menu-text">Agendamentos</span>
                            <FaChevronRight className={`arrow-icon ${openMenu === 'agendamentos' ? 'open' : ''}`} />
                        </button>
                        <ul className={`submenu ${openMenu === 'agendamentos' ? 'open' : ''}`}>
                            {isAdmin && <li className="submenu-item"><Link to="/agendamentos">Ver todos</Link></li>}
                            {!isAdmin && <li className="submenu-item"><Link to="/agendamentos/meus">Meus agendamentos</Link></li>}
                            {(!isAdmin && !isMedico) && <li className="submenu-item"><Link to="/agendamentos/novo">Novo agendamento</Link></li>}
                        </ul>
                    </li>

                    {/* Seção Cronograma */}
                    {!isPaciente && ( // <--- Condição para não mostrar a seção Cronograma para pacientes
                        <li className="menu-section">
                            <button className="menu-title" onClick={() => toggleMenu('cronograma')}>
                                {/* <FaChartBar className="menu-icon" /> */}
                                <span className="menu-text">Cronograma</span>
                                <FaChevronRight className={`arrow-icon ${openMenu === 'cronograma' ? 'open' : ''}`} />
                            </button>
                            <ul className={`submenu ${openMenu === 'cronograma' ? 'open' : ''}`}>
                                {isAdmin && <li className="submenu-item"><Link to="/cronogramas">Ver todos</Link></li>}
                                {!isAdmin && <li className="submenu-item"><Link to="/cronogramas/meus">Meu cronograma</Link></li>}
                                {!isAdmin && <li className="submenu-item"><Link to="/cronogramas/novo">Novo cronograma</Link></li>}
                            </ul>
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default Menu;
