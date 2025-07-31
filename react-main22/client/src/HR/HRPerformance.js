// Navbar.js
import React, { useEffect, useState } from 'react';
import './HRPerformance.css';
import { Link, useLocation } from 'react-router-dom';
import HRSideBar from '../components/Sidebar/HRSideBar';
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
      <div>
        <HRSideBar />
      </div>
    <nav className={`navbar ${isActive ? 'active' : ''}`}>
      <Link className='text' to="/HrPIP">
        <p className={`nav-item ${location.pathname === '/HrPIP' ? 'active' : ''}`}>PIP</p>
      </Link>
      <Link className='text' to="/Hronetoone">
        <p className={`nav-item ${location.pathname === '/Hronetoone' ? 'active' : ''}`}>OnetoOneMeeting</p>
      </Link>
      <Link className='text' to="/HrContinuousFeedback">
        <p className={`nav-item ${location.pathname === '/HrContinuousFeedback' ? 'active' : ''}`}>ContinuousFeedback</p>
      </Link>
    </nav>
    </div>
  );
};

export default Navbar;
