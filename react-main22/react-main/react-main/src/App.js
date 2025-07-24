import React, { useState } from 'react';
import './App.css';
import SideBar from './components/Sidebar/SideBar';
import EmployeeSidebar from './components/Sidebar/EmployeeSidebar';
import HRSideBar from './components/Sidebar/HRSideBar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Holidays from './pages/Holidays';
import OnBoarding from './pages/OnBoarding';
import Leave1 from './pages/Leave1';
import InitiateOnboarding from './pages/InitiateOnboarding';
import Summary from './pages/Summary';
import OnBoardingGroups from './pages/OnBoardingGroups';
import Profile from './pages/Profile';
import Performance from './pages/Performance';
import PIP from './pages/PIP';
import OnetoOneMeeting from './pages/OnetoOneMeeting';
import ContinuousFeedback from './pages/ContinuousFeedback';
import Skills from './pages/Skills';
import Organizational from './pages/Organizational';
import Department from './pages/Department';
import Position from './pages/Position';
import Assets from './pages/Assets';
import Shift from './pages/Shift';
import WeekOff from './pages/WeekOff';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import EmployeeAttendance from './Employee/EmployeeAttendance';
import EmployeeLeave from './Employee/EmployeeLeave';
import EmployeePerformance from './Employee/EmployeePerformance';
import EmployeeProjects from './Employee/EmployeeProjects';
import EmployeeProfile from './Employee/EmployeeProfile';
import Objectives from './Employee/Objectives';
import OnGoingProjects from './Employee/OnGoingProjects';
import PreviousProjects from './Employee/PreviousProjects';
import HRProfile from './HR/HRProfile';
import HRInitiateOnboarding from './HR/HRInitiateOnboarding';
import HRDashboard from './HR/HRDashboard';
import HRHolidays from './HR/HRHolidays';
import Login from './pages/Login';
import HRAttendance from './HR/HRAttendance';
import HRLeave from './HR/HRLeave';
import HROnboarding from './HR/HROnboarding';
import Projects from './pages/Projects';
import Interview from './pages/Interview';
import EmployeeHolidays from './Employee/EmployeeHolidays';
import HRProjects from './HR/HRProjects';
import NoticePeriod from './pages/NoticePeriod';
import Addemployee from './HR/Addemployee';
import OrganizationDetails from './pages/OrganizationDetails';
import HRPerformance from './HR/HRPerformance';
import HrContinuousFeedback from './HR/HrContinuousFeedback';
import HrOnetoOneMeeting from './HR/HrOnetoOneMeeting';
import HrPIP from './HR/HrPIP';
import HRInterviewprocess from './HR/HRInterviewprocess';
import Applicants from './HR/Applicants';
import Addjobopening from './HR/Addjobopening';
import JobopeningsOverview from './HR/JobopeningsOverview';
import Addjobandapplicant from './HR/Addjobandapplicant';
import AddApplicant from './HR/AddApplicant';
import InterviewScheduling from './HR/InterviewScheduling';
import OfferLetter from './HR/OfferLetter';
import Host from './HR/Host';
import AttendedMeetings from './HR/AttendedMeetings';

function App() {
  const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  const renderSidebar = () => {
    switch (role) {
      case 'admin':
        return <SideBar />;
      case 'HR':
        return <HRSideBar />;
      case 'employee':
        return <EmployeeSidebar />;
      default:
        return null;
    }
  };

  return (
    <Router>
      {renderSidebar()} 
      <Routes>
        <Route path="/" element={<Login onClick={handleLogin} />} /> {/* Pass handleLogin function to Login component */}
        <Route path="/Admin" element={<Dashboard />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave1 />} />
        <Route path="/holidays" element={<Holidays />} />
        <Route path="/performance" element={<Navigate to="/PIP" />} />
        <Route path="/onboarding" element={<Navigate to="/summary" />} />
        <Route path="/initiate-onboarding" element={<InitiateOnboarding />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/onboarding-groups" element={<OnBoardingGroups />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/PIP" element={<PIP />} />
        <Route path="/onetoone" element={<OnetoOneMeeting />} />
        <Route path="/ContinuousFeedback" element={<ContinuousFeedback />} />
        <Route path="/Skills" element={<Skills />} />
        <Route path="/organizational" element={<Navigate to="/organizationdetails" />} />
        <Route path="/Department" element={<Department />} />
        <Route path="/Position" element={<Position />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/Assets" element={<Assets />} />
        <Route path="/Shift" element={<Shift />} />
        <Route path="/WeekOff" element={<WeekOff />} />
        <Route path="/Notice" element={<NoticePeriod />} />
        <Route path="/interviews" element={<Interview />} />
        <Route path="/organizationdetails" element={<OrganizationDetails />} />
        <Route path="*" element={<div>Not found</div>} />

        {/* Employee Routes */}
        <Route path="/Employee" element={<EmployeeDashboard />} />
        <Route path="/employeeProfile" element={<EmployeeProfile />} />
        <Route path="/employeeattendance" element={<EmployeeAttendance />} />
        <Route path="/employeeperformance" element={<EmployeePerformance />} />
        <Route path="/employeeleave" element={<EmployeeLeave />} />
        <Route path="/employeeProjects" element={<Navigate to ='/PreviousProjects'/>} />
        <Route path="/PreviousProjects" element={<PreviousProjects />} />
        <Route path="/OnGoingProjects" element={<OnGoingProjects />} />
        <Route path="/Objectives" element={<Objectives />} />
        <Route path="/employeeholidays" element={<EmployeeHolidays />} />

        {/* HR Routes */}
        <Route path="/hrProfile" element={<HRProfile />} />
        <Route path="/Hr" element={<HRDashboard />} />
        <Route path="/hrHolidays" element={<HRHolidays />} />
        <Route path="/initiate-onboarding" element={<HRInitiateOnboarding />} />
        <Route path="/hrattendance" element={<HRAttendance />} />
        <Route path="/hrLeave" element={<HRLeave />} />
        <Route path="/hrOnboarding" element={<HROnboarding />} />
        <Route path="/hrProjects" element={<HRProjects />} />
        <Route path="/addemployees" element={<Addemployee />} />
        <Route path="/hrPerformance" element={<HRPerformance />} />
        <Route path="/HrContinuousFeedback" element={<HrContinuousFeedback />} />
        <Route path="/Hronetoone" element={<HrOnetoOneMeeting />} />
        <Route path="/HrPIP" element={<HrPIP />} />
        {/* <Route path="/hrInterviewprocess" element={<HRInterviewprocess />} />  */}
        <Route path = "/hrInterviewprocess" element ={<HRInterviewprocess/>}/>
        <Route path="/JobopeningsOverview" element={<JobopeningsOverview />} />
        <Route path="/Applicants" element={<Applicants />} />
        <Route path="/InterviewScheduling" element={<InterviewScheduling />} />
        <Route path="/addapplicant" element={<AddApplicant />} />
        <Route path="/addjobopening" element={<Addjobopening />} />
        <Route path="/addjobandapplicant" element={<Addjobandapplicant />} />
        <Route path="/OfferLetter" element={<OfferLetter />} />
        <Route path='/host' element={<Host/>}/>
        <Route path='/attendedmeeting' element={<AttendedMeetings/>}/>
      </Routes>
    </Router>
  );
}

export default App;
