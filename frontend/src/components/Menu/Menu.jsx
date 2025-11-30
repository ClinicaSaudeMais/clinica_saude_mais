import React, { useState } from 'react';
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
                            <li className="submenu-item"><a href="#">Ver todos</a></li>
                            <li className="submenu-item"><a href="#">Grupo de acesso</a></li>
                            <li className="submenu-item"><a href="#">Meu perfil</a></li>
                            <li className="submenu-item"><a href="#">Novo usuário</a></li>
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
                            <li className="submenu-item"><a href="#">Ver todos</a></li>
                            <li className="submenu-item"><a href="#">Meus agendamentos</a></li>
                            <li className="submenu-item"><a href="#">Novo agendamento</a></li>
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
                            <li className="submenu-item"><a href="#">Ver todos</a></li>
                            <li className="submenu-item"><a href="#">Meu cronograma</a></li>
                            <li className="submenu-item"><a href="#">Novo cronograma</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Menu;
