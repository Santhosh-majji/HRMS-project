
import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, Menu, MenuItem, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
// import SideBar from './components/SideBar';
import HRSideBar from '../components/Sidebar/HRSideBar';
import JobopeningsOverview from '../HR/JobopeningsOverview'
import Addjobandapplicant from '../HR/Addjobandapplicant';
import Applicants from '../HR/Applicants';
import InterviewScheduling from '../HR/InterviewScheduling';
import OfferLetter from '../HR/OfferLetter';
 
function HRInterviewprocess() {
  const [view, setView] = useState('JobopeningsOverview');
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
    <div>
    <Box sx={{ height: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <HRSideBar
        // sx={{
        //   position: 'fixed',
        //   height: '100vh',
        //   zIndex: 1200,
        //   width: '240px',
        // }}
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
                      onClick={() => { setView('JobopeningsOverview'); handleMenuClose(); }}
                      sx={{ color: 'inherit' }}
                    >
                     Job openings Overview
                    </MenuItem>
                    <MenuItem
                      onClick={() => { setView('addjobandapplicant'); handleMenuClose(); }}
                      sx={{ color: 'inherit' }}
                    >
                      add job opening and applicant
                    </MenuItem>
                    <MenuItem
                      onClick={() => { setView('Applicants'); handleMenuClose(); }}
                      sx={{ color: 'inherit' }}
                    >
                      Applicant Tracking
                    </MenuItem>
                    <MenuItem
                      onClick={() => { setView('InterviewScheduling'); handleMenuClose(); }}
                      sx={{ color: 'inherit' }}
                    >
                      Schedule an Interview
                    </MenuItem>
                    <MenuItem
                      onClick={() => { setView('OfferLetter'); handleMenuClose(); }}
                      sx={{ color: 'inherit' }}
                    >
                     Offer Letter
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant={view === 'JobopeningsOverview' ? "contained" : "text"}
                    color="inherit"
                    sx={{
                      backgroundColor: view === 'JobopeningsOverview' ? 'white' : 'primary.main',
                      color: view === 'JobopeningsOverview' ? 'primary.main' : 'white',
                      '&:hover': {
                        backgroundColor: view === 'JobopeningsOverview' ? 'white' : 'primary.dark',
                      },
                      marginRight: 2,
                    }}
                    onClick={() => setView('JobopeningsOverview')}
                  >
                   Job openings Overview
                  </Button>
                  <Button
                    variant={view === 'addjobandapplicant' ? "contained" : "text"}
                    color="inherit"
                    sx={{
                      backgroundColor: view === 'addjobandapplicant' ? 'white' : 'primary.main',
                      color: view === 'addjobandapplicant' ? 'primary.main' : 'white',
                      '&:hover': {
                        backgroundColor: view === 'addjobandapplicant' ? 'white' : 'primary.dark',
                      },
                      marginRight: 2,
                    }}
                    onClick={() => setView('addjobandapplicant')}
                  >
                   add job opening and applicant
                  </Button>
                  <Button
                    variant={view === 'Applicants' ? "contained" : "text"}
                    color="inherit"
                    sx={{
                      backgroundColor: view === 'Applicants' ? 'white' : 'primary.main',
                      color: view === 'Applicants' ? 'primary.main' : 'white',
                      '&:hover': {
                        backgroundColor: view === 'Applicants' ? 'white' : 'primary.dark',
                      },
                      marginRight: 2,
                    }}
                    onClick={() => setView('Applicants')}
                  >
                   Applicant Tracking
                  </Button>
                  <Button
                    variant={view === 'InterviewScheduling' ? "contained" : "text"}
                    color="inherit"
                    sx={{
                      backgroundColor: view === 'InterviewScheduling' ? 'white' : 'primary.main',
                      color: view === 'InterviewScheduling' ? 'primary.main' : 'white',
                      '&:hover': {
                        backgroundColor: view === 'InterviewScheduling' ? 'white' : 'primary.dark',
                      },
                      marginRight: 2,
                    }}
                    onClick={() => setView('InterviewScheduling')}
                  >
                  Schedule an Interview
                  </Button>
                  <Button
                    variant={view === 'OfferLetter' ? "contained" : "text"}
                    color="inherit"
                    sx={{
                      backgroundColor: view === 'OfferLetter' ? 'white' : 'primary.main',
                      color: view === 'OfferLetter' ? 'primary.main' : 'white',
                      '&:hover': {
                        backgroundColor: view === 'OfferLetter' ? 'white' : 'primary.dark',
                      },
                      marginRight: 2,
                    }}
                    onClick={() => setView('OfferLetter')}
                  >
                  Offer Letter
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, paddingTop: 2, overflow: 'auto' }}>
          {view === 'JobopeningsOverview' && <JobopeningsOverview />}
          {view === 'addjobandapplicant' && <Addjobandapplicant />}
          {view === 'Applicants' && <Applicants />}
          {view === 'InterviewScheduling' && <InterviewScheduling />}
          {view === 'OfferLetter' && <OfferLetter />}
        </Box>
      </Box>
    </Box>
    </div>
  );
}
 
export default HRInterviewprocess;
 
 