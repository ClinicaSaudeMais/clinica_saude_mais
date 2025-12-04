import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState('Paciente'); // Placeholder for current profile
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUser({
                    name: decodedToken.nome,
                    profiles: decodedToken.perfis,
                });
                // Set initial selected profile if available in decoded token, or default
                if (decodedToken.perfis && decodedToken.perfis.length > 0) {
                  setSelectedProfile(decodedToken.perfis[0]);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

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
        // Here you might want to update the user's active profile in a global state or context
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedInUser(null);
        navigate('/login');
    };

    if (!loggedInUser) {
        return null; // Or a loading spinner
    }

    return (
        <header className="header">
            <div className="profile-section">
                {loggedInUser.profiles && loggedInUser.profiles.length > 1 && (
                    <div className="dropdown-container">
                        <button className="dropdown-toggle" onClick={toggleSectorDropdown}>
                            Setor: {selectedProfile} <FaChevronDown style={{ marginLeft: '10px' }} />
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

