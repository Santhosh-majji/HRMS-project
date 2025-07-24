
import React, { useState } from 'react';
import { Box, AppBar, Tabs, Tab, Typography } from '@mui/material';
import NotInitiated from './Notinitiated';
import Skipped from '../pages/Skipped';
import Canceled from '../pages/Cancelled';
import Initiated from '../pages/Initiated';
import OnBoarding from '../pages/OnBoarding';
 
const HRInitiateOnboarding = () => {
  const [selectedTab, setSelectedTab] = useState(0);
 
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
 
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <NotInitiated />;
      case 1:
        return <Initiated />;
      case 2:
        return <Skipped />;
      case 3:
        return <Canceled />;
      default:
        return null;
    }
  };
 
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Horizontal Bar */}
      <AppBar position="static" color="default">
        <OnBoarding />
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Not Initiated" />
          <Tab label="Initiated" />
          <Tab label="Skipped" />
          <Tab label="Cancelled" />
        </Tabs>
      </AppBar>
 
      {/* Content */}
      <Box sx={{ p: 3 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
};
 
export default HRInitiateOnboarding;
 
 