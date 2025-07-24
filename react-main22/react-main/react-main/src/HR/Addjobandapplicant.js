
import React, { useState } from 'react';
import { Box, AppBar, Tabs, Tab, Typography } from '@mui/material';
 
import Addjobopening from '../HR/Addjobopening';
import AddApplicant from '../HR/AddApplicant';
 
 
const Addjobandapplicant = () => {
  const [selectedTab, setSelectedTab] = useState(0);
 
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
 
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <Addjobopening />;
      case 1:
        return <AddApplicant />;
     
      default:
        return null;
    }
  };
 
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Horizontal Bar */}
      <AppBar position="static" color="default">
       
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Add Job Opening" />
          <Tab label="Add Applicant" />
         
        </Tabs>
      </AppBar>
 
      {/* Content */}
      <Box sx={{ p: 3 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
};
 
export default Addjobandapplicant;
 
 