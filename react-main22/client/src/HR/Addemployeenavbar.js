
import React, { useState } from 'react';
import { Box, AppBar, Tabs, Tab, Typography } from '@mui/material';
 
 
import AddEmployeeDirectly from './AddEmployeeDirectly';
import Applicanttoemployee from './Applicanttoemployee';
 
 
const Addemployeenavbar = () => {
  const [selectedTab, setSelectedTab] = useState(0);
 
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
 
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <Applicanttoemployee />;
      case 1:
        return <AddEmployeeDirectly />;
     
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
          <Tab label="Add employee from applicant" />
          <Tab label="Add employee" />
         
        </Tabs>
      </AppBar>
 
      {/* Content */}
      <Box sx={{ p: 3 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
};
 
export default Addemployeenavbar;
 
 