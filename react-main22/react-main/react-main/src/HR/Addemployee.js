
import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, Menu, MenuItem, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import HRSideBar from '../components/Sidebar/HRSideBar';

import Applicanttoemployee from './Applicanttoemployee';
import Allemployees from './Allemployees';
import Employeeassets from './Employeeassets';
import Addemployeenavbar from './Addemployeenavbar';
 
function Addemployee() {
  const [view, setView] = useState('Addemployeenavbar');
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
 
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
 
  return (
    <Box sx={{ height: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <HRSideBar 
        sx={{
          position: 'fixed',
          height: '100vh',
          zIndex: 1200,
          width: '240px',
        }}
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: '50px', overflow: 'hidden' }}>
        <AppBar position="static" color="primary" sx={{ height: 50, width: '100%', left: '240px' }}>
          <Toolbar sx={{ height: '100%', minHeight: 'unset', padding: '0px 16px 13px 16px', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {isMobile ? (
                <>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    color="inherit"
                    onClick={handleMenuClick}
                    sx={{ fontSize: '30px' }}
                  >
                    <ArrowDropDown fontSize="inherit" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      sx: {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => { setView('Addemployeenavbar'); handleMenuClose(); }}
                      sx={{ color: 'inherit' }}
                    >
                      Add Employee
                    </MenuItem>
                    <MenuItem
                      onClick={() => { setView('employeeList'); handleMenuClose(); }}
                      sx={{ color: 'inherit' }}
                    >
                      Employee List
                    </MenuItem>
                    <MenuItem
                      onClick={() => { setView('employeeAssets'); handleMenuClose(); }}
                      sx={{ color: 'inherit' }}
                    >
                      Add Employee Assets
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant={view === 'Addemployeenavbar' ? "contained" : "text"}
                    color="inherit"
                    sx={{
                      backgroundColor: view === 'Addemployeenavbar' ? 'white' : 'primary.main',
                      color: view === 'Addemployeenavbar' ? 'primary.main' : 'white',
                      '&:hover': {
                        backgroundColor: view === 'Addemployeenavbar' ? 'white' : 'primary.dark',
                      },
                      marginRight: 2,
                    }}
                    onClick={() => setView('Addemployeenavbar')}
                  >
                    Add Employee
                  </Button>
                  <Button
                    variant={view === 'employeeList' ? "contained" : "text"}
                    color="inherit"
                    sx={{
                      backgroundColor: view === 'employeeList' ? 'white' : 'primary.main',
                      color: view === 'employeeList' ? 'primary.main' : 'white',
                      '&:hover': {
                        backgroundColor: view === 'employeeList' ? 'white' : 'primary.dark',
                      },
                      marginRight: 2,
                    }}
                    onClick={() => setView('employeeList')}
                  >
                    Employee List
                  </Button>
                  <Button
                    variant={view === 'employeeAssets' ? "contained" : "text"}
                    color="inherit"
                    sx={{
                      backgroundColor: view === 'employeeAssets' ? 'white' : 'primary.main',
                      color: view === 'employeeAssets' ? 'primary.main' : 'white',
                      '&:hover': {
                        backgroundColor: view === 'employeeAssets' ? 'white' : 'primary.dark',
                      },
                      marginRight: 2,
                    }}
                    onClick={() => setView('employeeAssets')}
                  >
                    Add Employee Assets
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, paddingTop: 2, overflow: 'auto' }}>
          {view === 'Addemployeenavbar' && <Addemployeenavbar />}
          {view === 'employeeList' && <Allemployees />}
          {view === 'employeeAssets' && <Employeeassets />}
        </Box>
      </Box>
    </Box>
  );
}
 
export default Addemployee;
 
 