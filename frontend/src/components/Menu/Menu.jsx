import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaChartBar, FaChevronRight } from 'react-icons/fa';
import './Menu.css';
import logo from '../../assets/logo_branca.png';

const Menu = () => {
    const [openMenu, setOpenMenu] = useState(''); // 'usuarios', 'agendamentos', 'cronograma'

    const toggleMenu = (menuName) => {
        setOpenMenu(openMenu === menuName ? '' : menuName);
    };

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
                            <li className="submenu-item"><Link to="/usuarios">Ver todos</Link></li>
                            <li className="submenu-item"><Link to="/usuarios/grupos-de-acesso">Grupo de acesso</Link></li>
                            <li className="submenu-item"><Link to="/usuarios/meu-perfil">Meu perfil</Link></li>
                            <li className="submenu-item"><Link to="/usuarios/novo">Novo usuário</Link></li>
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
                            <li className="submenu-item"><Link to="/agendamentos">Ver todos</Link></li>
                            <li className="submenu-item"><Link to="/agendamentos/meus">Meus agendamentos</Link></li>
                            <li className="submenu-item"><Link to="/agendamentos/novo">Novo agendamento</Link></li>
                        </ul>
                    </li>

                    {/* Seção Cronograma */}
                    <li className="menu-section">
                        <button className="menu-title" onClick={() => toggleMenu('cronograma')}>
                            {/* <FaChartBar className="menu-icon" /> */}
                            <span className="menu-text">Cronograma</span>
                            <FaChevronRight className={`arrow-icon ${openMenu === 'cronograma' ? 'open' : ''}`} />
                        </button>
                        <ul className={`submenu ${openMenu === 'cronograma' ? 'open' : ''}`}>
                            <li className="submenu-item"><Link to="/cronogramas">Ver todos</Link></li>
                            <li className="submenu-item"><Link to="/cronogramas/meus">Meu cronograma</Link></li>
                            <li className="submenu-item"><Link to="/cronogramas/novo">Novo cronograma</Link></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Menu;
