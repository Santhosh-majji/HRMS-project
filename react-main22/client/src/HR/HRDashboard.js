import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './HRDashboard.css';
import HRSideBar from '../components/Sidebar/HRSideBar';
import { FaUserAlt, FaEye, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoNotificationsOff } from "react-icons/io5";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AiOutlineLogout } from "react-icons/ai";
import { Card, CardHeader, CardContent, Badge, List, ListItem, ListItemText, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
const HRDashboard = () => {
    const [theme, setTheme] = useState('light');
    const [totalApplicants, setTotalApplicants] = useState(0);
    const [totalJobOpenings, setTotalJobOpenings] = useState(0);
    const [invitedInterviews, setInvitedInterviews] = useState(0);
    const [hiredApplications, setHiredApplications] = useState(0);
    const [genderComposition, setGenderComposition] = useState({ labels: [], data: [] });
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [jobStats, setJobStats] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5001/api/total-applicants')
            .then(response => {
                setTotalApplicants(response.data.count);
            })
            .catch(error => {
                console.error('Error fetching total applicants:', error);
            });

        axios.get('http://localhost:5001/api/total-job-openings')
            .then(response => {
                setTotalJobOpenings(response.data.count);
            })
            .catch(error => {
                console.error('Error fetching total job openings:', error);
            });

        axios.get('http://localhost:5001/api/invited-interviews')
            .then(response => {
                setInvitedInterviews(response.data.count);
            })
            .catch(error => {
                console.error('Error fetching invited interviews:', error);
            });

        axios.get('http://localhost:5001/api/gender-composition')
            .then(response => {
                console.log('Gender Composition Data:', response.data);
                const labels = response.data.map(item => item.Gender);
                const data = response.data.map(item => item.count);
                setGenderComposition({ labels, data });
            })
            .catch(error => {
                console.error('Error fetching gender composition:', error);
            });

        axios.get('http://localhost:5001/api/hired-applications')
            .then(response => {
                setHiredApplications(response.data.count);
            })
            .catch(error => {
                console.error('Error fetching hired applications:', error);
            });

        axios.get('http://localhost:5001/api/leave-request')
            .then(response => {
                setLeaveRequests(response.data);
            })
            .catch(error => {
                console.error('Error fetching leave requests:', error);
            });

        axios.get('http://localhost:5001/api/job-stats')
            .then(response => {
                setJobStats(response.data);
            })
            .catch(error => {
                console.error('Error fetching job statistics:', error);
            });

        axios.get('http://localhost:5001/api/applicants')
            .then(response => {
                setApplicants(response.data.map(applicant => ({
                    ...applicant,
                    Onboarding_Date: new Date(applicant.Onboarding_Date).toISOString().split('T')[0]
                })));
            })
            .catch(error => {
                console.error('Error fetching applicants:', error);
            });
    }, []);

    const markAsRead = () => {
        setLeaveRequests([]);
    };

    const handleNotificationClick = (index) => {
        const updatedRequests = leaveRequests.filter((_, i) => i !== index);
        setLeaveRequests(updatedRequests);
        navigate('/hrLeave');
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:5001/logout');
            if (response.data.success) {
                Cookies.remove('token');
                toast.success('Logged out successfully!');
                setTimeout(() => {
                    navigate('/');
                }, 2000); // Give time for the toast to display
            }
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Failed to log out!');
        }
    };

    const confirmLogout = () => {
        confirmAlert({
            title: 'Confirm to logout',
            message: 'Are you sure you want to logout?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: handleLogout
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    const jobStatsData = {
        labels: jobStats.map(job => job.jobPosition),
        datasets: [
            {
                label: 'Applicants Applied',
                data: jobStats.map(job => job.applicants),
                borderWidth: 1,
                backgroundColor: '#333'
            },
            {
                label: 'Job Openings',
                data: jobStats.map(job => job.jobOpenings),
                borderWidth: 1,
                backgroundColor: '#D2D2D2'
            }
        ]
    };

    const employeeCompositionData = {
        labels: genderComposition.labels,
        datasets: [{
            data: genderComposition.data,
            hoverBackgroundColor: theme === 'light' ? ['#FF6384', '#36A2EB'] : ['#FFA07A', '#20B2AA'],
            backgroundColor: ['#333', '#d2d2d2']
        }]
    };

    return (
        <div className={`dashboard-container ${theme}`}>
            <HRSideBar />
            <div className="dashboard-content">
                <div className="header">
                    <h1>Welcome to the Dashboard</h1>
                    <div className="logout-section" onClick={confirmLogout} title='Logout'>
                        <h5>Logout</h5>
                        <div className="logout-icons" style={{ fontWeight: 'bold', color: 'blue' }}>
                            <AiOutlineLogout />
                        </div>
                    </div>
                </div>

                <div className="dashboard">
                    <div className="summary">
                        <div className="summary-card">
                            <FaUserAlt className="card-icon" />
                            <h3>Total Applicants</h3>
                            <p className="value">{totalApplicants}</p>
                        </div>
                        <div className="summary-card">
                            <FaEye className="card-icon" />
                            <h3>Job Openings</h3>
                            <p className="value">{totalJobOpenings}</p>
                        </div>
                        <div className="summary-card">
                            <FaCheckCircle className="card-icon" />
                            <h3>Invited Interviews</h3>
                            <p className="value">{invitedInterviews}</p>
                        </div>
                        <div className="summary-card">
                            <FaSignOutAlt className="card-icon" />
                            <h3>Hired Applications</h3>
                            <p className="value">{hiredApplications}</p>
                        </div>
                    </div>
                    <div className="job-statistics">
                        <div className="chart-container">
                            <Bar data={jobStatsData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                        </div>
                        <div className="notification-card">
                            <div className="notification-wrapper">
                                <div className="notification-header">
                                    <h3>Notifications</h3>
                                    <div className="mark-read" onClick={markAsRead}>
                                        <img src="https://www.svgrepo.com/show/391355/tick-double.svg" alt="Mark as read" />
                                        <a href="#">Mark all as read</a>
                                    </div>
                                </div>
                                <div className="notification-body">
                                    {leaveRequests.length > 0 ? (
                                        leaveRequests.map((request, index) => (
                                            <div
                                                className="notification-container"
                                                key={index}
                                                onClick={() => handleNotificationClick(index)}
                                            >
                                                <div className="notification-text">
                                                    <div className="indicator-wrapper">
                                                        <div className="indicator"></div>
                                                    </div>
                                                    <div className="notification-messages">
                                                        <h4><span className="employee-name">{request.EmployeeName}</span> has requested {request.LeaveType}</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-notifications">
                                            <IoNotificationsOff />
                                            <p>You don't have any notifications</p>
                                        </div>
                                    )}
                                </div>
                                <div className="notification-footer">
                                    <a href="#">View all notifications</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="employee-info">
                        <div className="employee-status">
                            <h3>Applicant Status</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Applicant ID</th>
                                        <th>Applicant Name</th>
                                        <th>Email ID</th>
                                        <th>Job Position</th>
                                        <th>Onboarding Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map(applicant => (
                                        <tr key={applicant.Applicant_ID}>
                                            <td>{applicant.Applicant_ID}</td>
                                            <td>{applicant.Applicant_Name}</td>
                                            <td>{applicant.Email_ID}</td>
                                            <td>{applicant.Job_Position}</td>
                                            <td>{applicant.Onboarding_Date}</td>
                                            <td className={`status ${applicant.Status.toLowerCase()}`}>
                                                {applicant.Status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="employee-composition">
                            <h3>Employee Composition</h3>
                            <div className="chart-container">
                                <Doughnut data={employeeCompositionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;

