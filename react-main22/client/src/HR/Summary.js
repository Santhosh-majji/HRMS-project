import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { FaUser, FaTasks, FaChalkboardTeacher, FaUsers, FaUserClock, FaChartBar, FaChartPie } from 'react-icons/fa';
import { RiTaskLine } from 'react-icons/ri';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import { LinearProgress, CircularProgress } from '@mui/material';
import './Summary.css';
import HROnboarding from './HROnboarding';


const Summary = () => {
    
    const barChartData = {
        series: [{
            name: 'Sales',
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
           
        }],
        options: {
            chart: {
                type: 'bar',
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            },
        },
    };

    const pieChartData = {
        series: [30, 70,40,20],
        options: {
            labels: ['Engineers', 'Analysts','projectManager','datascience'],
            colors: ['#1abc9c', '#3498db'],
            height:'1200px',
        }
    };

    
    const recentEmployeesData = [
        { id: 1, name: 'Emma Watson', position: 'Marketing Analyst', backgroundColor: '#f9d5e5', icon: <FaUserClock />, textColor: '#9c27b0' },
        { id: 2, name: 'Chris Hemsworth', position: 'Sales Manager', backgroundColor: '#b3e5fc', icon: <FaTasks />, textColor: '#0288d1' },
        { id: 3, name: 'Gal Gadot', position: 'Software Engineer', backgroundColor: '#c5e1a5', icon: <FaUserClock />, textColor: '#689f38' },
        { id: 4, name: 'Gal Gadot', position: 'Software Engineer', backgroundColor: '#c5e1a5', icon: <FaUserClock />, textColor: '#689f38' },
        { id: 4, name: 'Gal Gadot', position: 'Software Engineer', backgroundColor: '#c5e1a5', icon: <FaUserClock />, textColor: '#689f38' },
    ];
    
    const upcomingOnboardingData = [
        { id: 1, name: 'Emily Johnson', position: 'Software Developer', department: 'IT', offerDate: '2024/03/01', icon: <FaUserClock />, backgroundColor: '#f5f5f5' },
        { id: 2, name: 'Michael Smith', position: 'Marketing Coordinator', department: 'Marketing', offerDate: '2024/03/05', icon: <FaTasks />, backgroundColor: '#f9d5e5' },
        { id: 3, name: 'Jessica Brown', position: 'Graphic Designer', department: 'Creative', offerDate: '2024/03/10', icon: <FaUserClock />, backgroundColor: '#c5e1a5' },
    
        { id: 4, name: 'Daniel Lee', position: 'Project Manager', department: 'Operations', offerDate: '2024/03/15', icon: <RiTaskLine />, backgroundColor: '#ffe0b2' },
        
        
    ];

    
    const totalOnboardings = upcomingOnboardingData.length;

    return (
        <div className="container-summary">
         <HROnboarding/>
            <div className="header-summary">
           
                <div className="header-content-summary">
                    <h1 className="welcome-heading-summary" style={{fontSize:'26px',color:'whitesmoke',margin:'10px'}}>Welcome, Good Morning Santhosh Majji</h1>
                    <p className="header-para-summary">Today you Have {totalOnboardings} onboardings. You have a lot of work today.</p>
                    <p className="header-para-summary">Let's Start</p>
                </div>
                <div className="icons-summary" >
                    <FaUserClock />
                    <FaUser />
                    <FaTasks />
    
                </div>
            </div>
            <div className="chart-and-data-section-summary">
                <div className="chart-section-summary cards-summary" style={{  margin:'10px', }}>
                    <h2>monthlyOnboardings</h2>
                    <ReactApexChart options={barChartData.options} series={barChartData.series} type="bar" />
                </div>
                <div className="chart-section-summary cards-summary" style={{  margin:'10px' }}>
                    <h2>Positions</h2>
                    <ReactApexChart options={pieChartData.options} series={pieChartData.series} type="pie" />
                </div>
                <div className="recent-employees-section-summary card-summary" style={{  margin:'10px' }}>
                    <h2>Recently Added Employees</h2>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                {recentEmployeesData.map((employee) => (
                                    <TableRow key={employee.id} style={{ backgroundColor: employee.backgroundColor, color: employee.textColor }}>
                                        <TableCell>{employee.icon}</TableCell>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>{employee.position}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <div className="upcoming-onboarding-section-summary" style={{  margin:'20px',color:'black' }}>
                <h2>Upcoming Onboardings</h2>
                <div className="upcoming-onboarding-cards-summary" style={{  gap: '50px' }}>
                    {upcomingOnboardingData.map((employee) => (
                        <div key={employee.id} className="upcoming-onboarding-card-summary" style={{ backgroundColor: employee.backgroundColor }}>
                            <div className="icon-summary">{employee.icon}</div>
                            <p><strong>Name:</strong> {employee.name}</p>
                            <p><strong>Position:</strong> {employee.position}</p>
                            <p><strong>Department:</strong> {employee.department}</p>
                            <p><strong>Offer Date:</strong> {employee.offerDate}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Summary;
