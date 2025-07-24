import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import EmployeeSideBar from '../components/Sidebar/EmployeeSidebar';
import { AppBar, Toolbar, Box } from '@mui/material';

const EmployeeProjects = () => {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <EmployeeSideBar />

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <AppBar position="static" sx={{ backgroundColor: '#333' }}>
          <Toolbar>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link 
                to="/PreviousProjects" 
                style={{ 
                  textDecoration: 'none', 
                  color: location.pathname === '/PreviousProjects' ? '#ff4081' : '#fff',
                  padding: '8px 16px',
                  borderBottom: location.pathname === '/PreviousProjects' ? '2px solid #ff4081' : 'none'
                }}
              >
                Previous Projects
              </Link>
              <Link 
                to="/OnGoingProjects" 
                style={{ 
                  textDecoration: 'none', 
                  color: location.pathname === '/OnGoingProjects' ? '#ff4081' : '#fff',
                  padding: '8px 16px',
                  borderBottom: location.pathname === '/OnGoingProjects' ? '2px solid #ff4081' : 'none'
                }}
              >
                On Going Projects
              </Link>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content area */}
        <Box sx={{ p: 2 }}>
          {/* Place your main content here */}
        </Box>
      </Box>
    </div>
  );
};

export default EmployeeProjects;
