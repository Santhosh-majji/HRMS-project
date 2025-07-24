import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { FaUserClock, FaTasks } from 'react-icons/fa';
import { RiTaskLine } from 'react-icons/ri';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper,TableHead } from '@mui/material';
import SideBar from '../components/Sidebar/SideBar';
import OnBoarding from './OnBoarding';
import './Summary.css';
import { MdCancel } from "react-icons/md";
import { GoSkip } from "react-icons/go";
import { SiOpenapiinitiative } from "react-icons/si";
import { MdIncompleteCircle } from "react-icons/md";
const Summary = () => {
    const [barChartData, setBarChartData] = useState({
        series: [{
            name: 'Onboardings',
            data: Array(12).fill(0),
        }],
        options: {
            chart: {
                type: 'bar',
                height: '100%',
                width: '100%'
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
        },
    });

    const [pieChartData, setPieChartData] = useState({
        series: [],
        options: {
            labels: [],
            colors: ['#1abc9c', '#3498db', '#f39c12', '#e74c3c', '#9b59b6'],
            height: '100%',
            width: '100%'
        }
    });

    const [statusCounts, setStatusCounts] = useState({
        NotInitiated: 0,
        Initiated: 0,
        Skipped: 0,
        Cancelled: 0,
    });
    const [recentlyOfferedApplicants, setRecentlyOfferedApplicants] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5001/api/recently-offered-applicants')
            .then(response => response.json())
            .then(data => {
                setRecentlyOfferedApplicants(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:5001/api/onboardings')
            .then(response => response.json())
            .then(data => {
                setBarChartData(prevData => ({
                    ...prevData,
                    series: [{ ...prevData.series[0], data }],
                }));
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5001/api/job-positions')
            .then(response => response.json())
            .then(data => {
                setPieChartData(prevData => ({
                    ...prevData,
                    series: data.series,
                    options: { ...prevData.options, labels: data.labels },
                }));
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5001/api/status-counts')
            .then(response => response.json())
            .then(data => setStatusCounts(data))
            .catch(error => console.error('Error fetching status counts:', error));
    }, []);

    const recentEmployeesData = [
        { id: 1, name: 'Emma Watson', position: 'Marketing Analyst', backgroundColor: '#f9d5e5', icon: <FaUserClock />, textColor: '#9c27b0' },
        { id: 2, name: 'Chris Hemsworth', position: 'Sales Manager', backgroundColor: '#b3e5fc', icon: <FaTasks />, textColor: '#0288d1' },
        { id: 3, name: 'Gal Gadot', position: 'Software Engineer', backgroundColor: '#c5e1a5', icon: <FaUserClock />, textColor: '#689f38' },
        { id: 4, name: 'Gal Gadot', position: 'Software Engineer', backgroundColor: '#c5e1a5', icon: <FaUserClock />, textColor: '#689f38' },
    ];

    const totalOnboardings = Object.values(statusCounts).reduce((acc, count) => acc + count, 0);

    return (
        <div style={{ display: 'flex' }}>
            <div>
                <SideBar />
            </div>
            <div className="summary-container" style={{ width: '100%' }}>
                <OnBoarding />
                <div className="header" style={{ backgroundColor: '#fff', textAlign: 'left' }}>
                    <div className="header-contents">
                        <h1 className="welcome-heading" style={{ fontSize: '26px', color: 'black', margin: '10px', textAlign: 'left', fontWeight: 'bold' }}>Welcome, Good Morning</h1>
                        {/* <p className="header-para" style={{ color: 'black', fontWeight: 'bold' }}>Today you have {totalOnboardings} onboardings. You have a lot of work today.</p> */}
                    </div>
                </div>
                <div className="chart-and-data-section">
                    <div className="chart-section cards" style={{ margin: '5px', width: '100%' }}>
                        <h4>Monthly Onboardings</h4>
                        <ReactApexChart options={barChartData.options} series={barChartData.series} type="bar" />
                    </div>
                    <div className="chart-section cards" style={{ margin: '10px', width: '100%' }}>
                        <h4>Positions</h4>
                        <ReactApexChart options={pieChartData.options} series={pieChartData.series} type="pie" />
                    </div>
                    <div className="recent-employees-section card">
                        <h2>Recently Offered  Applicants</h2>
                        <TableContainer component={Paper} style={{ maxHeight: 280, overflow: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Applicant ID</TableCell>
                                    <TableCell>Applicant Name</TableCell>
                                    <TableCell>Job Position</TableCell>
                                    <TableCell>Onboarding Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentlyOfferedApplicants.map(applicant => (
                                    <TableRow key={applicant.Applicant_ID}>
                                        <TableCell>{applicant.Applicant_ID}</TableCell>
                                        <TableCell>{applicant.Applicant_Name}</TableCell>
                                        <TableCell>{applicant.Job_Position}</TableCell>
                                        <TableCell style={{fontWeight:'bold',color:'green'}}>{new Date(applicant.Onboarding_Date).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </div>
                </div>
                <div className="upcoming-onboarding-section" style={{ margin: '10px', color: 'black' }}>
                    <h2 style={{ margin: '10px', color: 'black', fontFamily: 'bold' }}>Upcoming Onboardings</h2>
                    <div className="upcoming-onboarding-cards" style={{ display: 'flex', gap: '20px' }}>
                        <div className="upcoming-onboarding-card" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                            {/* <FaUserClock size={30} /> */}
                            <MdIncompleteCircle  size={30}/>
                            <h3 style={{fontWeight:'bold',fontSize:'25px',margin:'5px'}}>Not Initiated</h3>
                            <p style={{fontWeight:'bold',fontSize:'25px',margin:'5px'}}>{statusCounts.NotInitiated || 0}</p>
                        </div>
                        <div className="upcoming-onboarding-card" style={{ backgroundColor: '#f9d5e5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                            {/* <FaTasks size={30} /> */}
                            <SiOpenapiinitiative size={30} />

                            <h3 style={{fontWeight:'bold',fontSize:'25px',margin:'5px'}}>Initiated</h3>
                            <p style={{fontWeight:'bold',fontSize:'25px',margin:'5px'}}> {statusCounts.Initiated || 0}</p>
                        </div>
                        <div className="upcoming-onboarding-card" style={{ backgroundColor: '#c5e1a5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                            {/* <FaUserClock size={30} /> */}
                            <GoSkip size={30} />
                            <h3 style={{fontWeight:'bold',fontSize:'25px',margin:'5px'}}>Skipped</h3>
                                <p style={{fontWeight:'bold',fontSize:'25px',margin:'5px'}}>{statusCounts.Skipped || 0}</p>
                            </div>
                            <div className="upcoming-onboarding-card" style={{ backgroundColor: '#ffe0b2', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                                {/* <RiTaskLine size={30} /> */}
                                <MdCancel size={30} />
                                <h3 style={{fontWeight:'bold',fontSize:'25px',margin:'5px'}}>Cancelled</h3>
                                <p style={{fontWeight:'bold',fontSize:'25px',margin:'5px'}}>{statusCounts.Cancelled || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
    );
};

export default Summary;

