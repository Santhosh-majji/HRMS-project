import React, { useEffect, useState } from 'react';
import './EmployeePerformance.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
 import EmployeeSideBar from '../components/Sidebar/EmployeeSidebar';
const EmployeePerformance = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showNavbarItems, setShowNavbarItems] = useState(false);
 
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsSmallScreen(mediaQuery.matches);
 
    const handleResize = () => {
      setIsSmallScreen(mediaQuery.matches);
    };
 
    mediaQuery.addListener(handleResize);
 
    return () => mediaQuery.removeListener(handleResize);
  }, []);
 
  const handleNavItemClicked = (link) => {
    setShowNavbarItems(true);
  };
 
  return (
    <div style={{display:'flex'}}>
    <div>
    <EmployeeSideBar/>
    </div>
    <nav className={`bar ${showNavbarItems ? 'active' : ''} ${isSmallScreen ? 'small-screen' : ''}`}>
      <div className="bar-items">
      <Link className='text' to="/Objectives" onClick={() => handleNavItemClicked("/Objectives")}> <p className="item">Objectives</p></Link>
      <Link className='text' to="/1:1Meetings" onClick={() => handleNavItemClicked("/1:1Meetings")}> <p className="item">1:1 Meetings</p></Link>
      <Link className='text' to="/Reviews" onClick={() => handleNavItemClicked("/Reviews")}> <p className="item">Reviews</p></Link>
      <Link className='text' to="/Skills" onClick={() => handleNavItemClicked("/Skills")}> <p className="item">Skills</p></Link>
      </div>
      {isSmallScreen && (
        <button className="toggle-button" onClick={() => setShowNavbarItems(!showNavbarItems)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}
    </nav>
    </div>
  );
};
 
export default EmployeePerformance;
 