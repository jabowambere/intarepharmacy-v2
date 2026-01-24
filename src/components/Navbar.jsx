import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from './logo.png';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, getStockAlerts } = useAuth();
  const navigate = useNavigate();
  const alerts = getStockAlerts();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={logoImg} alt="Intare Pharmacy Logo" className="navbar-logo" />
          <span>Intare Pharmacy</span>
        </Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/medicines" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Medicines</Link>
          <Link to="/appointment" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Book an Appointment</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>          
          {user ? (
            <>
              {alerts.length > 0 && (
                <div className="alert-badge" title={`${alerts.length} stock alert(s)`}>
                  ⚠️ {alerts.length}
                </div>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
              )}
              {(user.role === 'pharmacist' || user.role === 'admin') && (
                <Link to="/pharmacist" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pharmacist Dashboard</Link>
              )}
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

