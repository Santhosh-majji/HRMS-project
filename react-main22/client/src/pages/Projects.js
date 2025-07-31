import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import Add_Client from '../pages/Add_Client';
import ProjectManagement from '../pages/ProjectManagement';
import ResourceManagement from '../pages/ResourceManagement';
import SideBar from '../components/Sidebar/SideBar';

function PSA_Navbar() {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <SideBar />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="nav tabs example"
                        
                    >
                        <Tab label="Client Management" />
                        <Tab label="Project Management" />
                        {/* Uncomment this line if you want to include Resource Management */}
                        {/* <Tab label="Resource Management" /> */}
                    </Tabs>
                </AppBar>

                <Box sx={{ padding: 3 }}>
                    {selectedTab === 0 && <Add_Client />}
                    {selectedTab === 1 && <ProjectManagement />}
                    {selectedTab === 2 && <ResourceManagement />}
                </Box>
            </Box>
        </Box>
    );
}

export default PSA_Navbar;
