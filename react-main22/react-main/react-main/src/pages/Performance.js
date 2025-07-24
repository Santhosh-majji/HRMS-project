// Navbar.js
import React, { useEffect, useState } from 'react';
import './Performance.css';
import { Link, useLocation } from 'react-router-dom';
import SideBar from '../components/Sidebar/SideBar';

const Navbar = () => {
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
      <SideBar />
      <nav className={`custom-navbars ${isActive ? 'active' : ''}`}>
        <Link className='custom-texts' to="/PIP">
          <p className={`custom-nav-items ${location.pathname === '/PIP' ? 'active' : ''}`} style={{color:'black',fontWeight:'bold',fontSize:'18px'}}>PIP</p>
        </Link>
        <Link className='custom-texts' to="/onetoone">
          <p className={`custom-nav-items ${location.pathname === '/onetoone' ? 'active' : ''}`} style={{color:'black',fontWeight:'bold',fontSize:'18px'}}>OnetoOneMeeting</p>
        </Link>
        <Link className='custom-texts' to="/ContinuousFeedback">
          <p className={`custom-nav-items ${location.pathname === '/ContinuousFeedback' ? 'active' : ''}`} style={{color:'black',fontWeight:'bold',fontSize:'18px'}}>ContinuousFeedback</p>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
