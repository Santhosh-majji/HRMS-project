import React, { useState } from 'react';
import HRNotInitiated from './HRNotinitiated';
import Skipped from '../pages/Skipped';
import Canceled from '../pages/Cancelled';
import './HRInitiateOnboarding.css';
import HRSideBar from '../components/Sidebar/HRSideBar';
// import HROnboarding from './HROnboarding';
const HRInitiateOnboarding = () => {
  const [selectedTab, setSelectedTab] = useState('NotInitiated');
 
  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };
 
  return (
    <div style={{display:'flex'}}>
    <div>
    <HRSideBar/>
    </div>
    <div className="initiate-onboarding">
      {/* Horizontal Bar */}
      <div style={horizontalBarStyle}>
      {/* <HROnboarding/> */}
        <div className="navbar1">
          <div className={`navbar-item1 ${selectedTab === 'HRNotInitiated' ? 'active' : ''}`} onClick={() => handleTabClick('HRNotInitiated')}>
            Not Initiated
          </div>
          <div className={`navbar-item1 ${selectedTab === 'Skipped' ? 'active' : ''}`} onClick={() => handleTabClick('Skipped')}>
            Skipped
          </div>
          <div className={`navbar-item1 ${selectedTab === 'Canceled' ? 'active' : ''}`} onClick={() => handleTabClick('Canceled')}>
            Cancelled
          </div>
        </div>
      </div>
 
      {/* Content */}
      <div className="content">
        {/* Render content based on selected tab */}
         {selectedTab === 'HRNotInitiated' && <HRNotInitiated /> }
         {selectedTab === 'Skipped' && <Skipped />}
        {selectedTab === 'Canceled' && <Canceled />}
      </div>
    </div>
    </div>
  );
};
 
// Inline styles for the horizontal bar
const horizontalBarStyle = {
  backgroundColor: '#f2f2f2',
  padding: '10px',
  color:'black',
};
 
export default HRInitiateOnboarding;