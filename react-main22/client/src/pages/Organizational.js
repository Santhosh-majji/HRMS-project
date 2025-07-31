import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBuilding, FaUsers, FaUserTie, FaDesktop, FaClock, FaCalendarAlt, FaClipboard, FaBars } from 'react-icons/fa'; // Import icons
import './Organizational.css';
import SideBar from '../components/Sidebar/SideBar';
 
const Nav = [
  { path: '/organizationdetails', name: 'Organization Details', icon: <FaBuilding /> },
  { path: '/Department', name: 'Department', icon: <FaUsers /> },
  { path: '/Position', name: 'Position', icon: <FaUserTie /> },
  { path: '/Assets', name: 'Assets', icon: <FaDesktop /> },
  { path: '/Shift', name: 'Shift', icon: <FaClock /> },
  { path: '/WeekOff', name: 'WeekOff', icon: <FaCalendarAlt /> },
  { path: '/Notice', name: 'Notice Period', icon: <FaClipboard /> },
];
 
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
 
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
 
  return (
    <div className="navbar-container-unique">
      <SideBar />
      <nav className="custom-navbar-unique">
        <div className={`custom-navbar-links-unique ${showMenu ? 'show' : ''}`}>
          {Nav.map((NavbarItem, index) => (
            <NavLink
              key={index}
              to={NavbarItem.path}
              activeClassName="custom-active-unique"
              className="custom-navlink-unique"
              onClick={() => setShowMenu(false)}
            >
              {NavbarItem.icon} {NavbarItem.name}
            </NavLink>
          ))}
        </div>
        <button className="custom-navbar-toggler-unique" onClick={toggleMenu}>
          <FaBars />
        </button>
      </nav>
    </div>
  );
};
 
export default Navbar;
 
 