import React, { useEffect, useState } from 'react';
import './HROnboarding.css';
import { Link, useLocation } from 'react-router-dom';
import HRSideBar from '../components/Sidebar/HRSideBar';
const CustomNavbar = () => {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsActive(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <HRSideBar />
      </div>
    <div >
    
    <nav className={`custom-navbar1 ${isActive ? 'active' : ''}`} style={{width:'100%',gap:'50px'}} >
      <Link className='nav-text1' to="/Summary">
        <p className={`nav-item1 ${location.pathname === '/Summary' ? 'active' : ''}`}>
          Summary
        </p>
      </Link>
      <Link className='nav-text1' to="/initiate-onboarding">
        <p className={`nav-item1 ${location.pathname === '/initiate-onboarding' ? 'active' : ''}`}>
          InitiateOnboarding
        </p>
      </Link>
      
    </nav>
    </div>
    </div>
  );
};

export default CustomNavbar;
