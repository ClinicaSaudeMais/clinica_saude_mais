import React, { useState } from 'react';
import { FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
    const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState('Paciente'); // Placeholder for current profile

    // Placeholder data for logged-in user
    const loggedInUser = {
        name: 'Nome do usuário',
        profiles: ['Paciente', 'Medico', 'Administrativo'] // Example profiles
    };

    const toggleSectorDropdown = () => {
        setIsSectorDropdownOpen(!isSectorDropdownOpen);
        setIsUserMenuOpen(false); // Close user menu when opening sector menu
    };
    
    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
        setIsSectorDropdownOpen(false); // Close sector menu when opening user menu
    };

    const handleProfileChange = (profile) => {
        setSelectedProfile(profile);
        setIsSectorDropdownOpen(false);
        console.log(`Switching to profile: ${profile}`);
    };

    const handleLogout = () => {
        console.log('User logged out');
        alert('Saindo...');
    };

    return (
        <header className="header">
            <div className="profile-section">
                {loggedInUser.profiles.length > 1 && (
                    <div className="dropdown-container">
                        <button className="dropdown-toggle" onClick={toggleSectorDropdown}>
                            Setor <FaChevronDown style={{ marginLeft: '10px' }} />
                        </button>
                        <ul className={`dropdown-menu ${isSectorDropdownOpen ? '' : 'hidden'}`}>
                            {loggedInUser.profiles.map(profile => (
                                <li 
                                    key={profile} 
                                    className="dropdown-item" 
                                    onClick={() => handleProfileChange(profile)}
                                >
                                    {profile}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="dropdown-container">
                    <button onClick={toggleUserMenu} className="username-button">
                        {loggedInUser.name}
                    </button>
                    <ul className={`dropdown-menu ${isUserMenuOpen ? '' : 'hidden'}`}>
                        <li className="dropdown-item" onClick={handleLogout}>
                            <FaSignOutAlt className="button-icon" />
                            Sair
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;

