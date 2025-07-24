import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Tabs, Tab, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const CustomNavbar = () => {
  const [value, setValue] = useState(0);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/Summary':
        setValue(0);
        break;
      case '/initiate-onboarding':
        setValue(1);
        break;
      default:
        setValue(0);
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'primary.main',
        boxShadow: 'none',
        borderBottom: '2px solid #1976d2',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="none"
            sx={{
              '& .MuiTab-root': {
                minWidth: 'auto',
                padding: '10px 25px',
                marginRight: '40px',
                fontWeight: 500,
                fontSize: '16px',
                letterSpacing: '0.5px',
                color: '#fff',
                transition: 'color 0.3s, transform 0.3s, background-color 0.3s',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  transform: 'translateY(-2px)',
                },
              },
              '& .Mui-selected': {
                fontWeight: 600,
                color: '#fff',
                backgroundColor: '#004ba0',
                borderRadius: '8px',
                padding: '10px 30px',
                transition: 'background-color 0.3s, transform 0.3s',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#00397a',
                  transform: 'translateY(-2px)',
                },
              },
            }}
          >
            <Tab label="Summary" component={Link} to="/Summary" />
            <Tab label="Initiate Onboarding" component={Link} to="/initiate-onboarding" />
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomNavbar;
