
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { FaUser, FaUsers, FaUserPlus } from 'react-icons/fa';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { GoProject } from "react-icons/go";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import './Dashboard.css';
import SideBar from '../components/Sidebar/SideBar';


const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [totalProjects, setTotalProjects] = useState(0);
  const [projectStartData, setProjectStartData] = useState({
    totalProjects: 0,
    yearlyProjects: [],
    years: []
  });
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [freshersCount, setFreshersCount] = useState(0);
  const [experiencedCount, setExperiencedCount] = useState(0);
  const [employeeDetails, setEmployeeDetails] = useState([]); // Add this state
 
  useEffect(() => {
    const token = Cookies.get('token');
    const { state } = location;
 
    if (!token) {
      navigate('/Admin');
      return;
    }
 
    if (!state || !state.username || !state.role) {
      if (location.pathname !== '/Admin') {
        navigate('/Admin');
      }
      return;
    }
 
    setUsername(state.username);
    setRole(state.role);
    console.log(state.username, state.role);
  }, [location, navigate]);
 
  useEffect(() => {
    const fetchProjectStartData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/project-starts');
        const projectStarts = response.data;
 
        const years = projectStarts.map(project => project.year);
        const counts = projectStarts.map(project => project.projectCount);
 
        setProjectStartData({
          totalProjects: counts.reduce((sum, count) => sum + count, 0),
          yearlyProjects: counts,
          years: years,
        });
      } catch (error) {
        console.error('Error fetching project start data:', error);
      }
    };
 
    fetchProjectStartData();







    
 
    const fetchTotalProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/projects');
        const totalProjectsCount = response.data.length;
        setTotalProjects(totalProjectsCount);
      } catch (error) {
        console.error('Error fetching total projects:', error);
      }
    };
 
    fetchTotalProjects();
 
    const fetchEmployeeStats = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/employee-stats');
        const { totalEmployees, freshers, experienced } = response.data;
        setTotalEmployees(totalEmployees);
        setFreshersCount(freshers);
        setExperiencedCount(experienced);
      } catch (error) {
        console.error('Error fetching employee statistics:', error);
      }
    };
 
    fetchEmployeeStats();
 
    // Fetch employee details from the new endpoint
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/employee-details');
        setEmployeeDetails(response.data); // Update the state with the fetched data
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };
 
    fetchEmployeeDetails();
 
  }, []);
 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsDashboardVisible(true);
    }, 2000);
 
    return () => clearTimeout(timeoutId);
  }, []);
 
  const toggleTheme = () => {
    setIsDarkMode(prevIsDarkMode => !prevIsDarkMode);
  };
 
  const theme = isDarkMode ? 'dark' : 'light';
 
  const employeeData = {
    totalEmployees: totalEmployees,
    freshers: freshersCount,
    experienced: experiencedCount,
  };
 
  const employeeChartOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Total Employees', 'Freshers', 'Experienced'],
    colors: ['#3498db', '#2ecc71', '#e74c3c'],
  };
 
  const projectStartChartOptions = {
    chart: {
      type: 'bar',
      
    },
    xaxis: {
      categories: projectStartData.years,
    
    },
  };
 
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5001/logout');
      if (response.data.success) {
        Cookies.remove('token');
        toast.success('Logged out successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000); 
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out!');
    }
  };
 
  const confirmLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };
 
  return (
    <div style={{ display: 'flex' }}>
    <div>
      <SideBar />
    </div>
    
      <div className={`dashboard-main-container ${theme}`}>
        <div className="dashboard-main-header" style={{ height: '70px' }}>
          <h1>Admin Dashboard</h1>
          <div className="header-main-icons">
            <FontAwesomeIcon icon={faSignOutAlt} className="dashboard-main-icon" title="Logout" onClick={confirmLogout} />
          </div>
        </div>
 
        {isDashboardVisible && (
          <>
            <div className="charts-main-container">
              <div className="chart-main">
                <h2>Employee Statistics</h2>
                <ReactApexChart
                  options={employeeChartOptions}
                  series={[employeeData.totalEmployees, employeeData.freshers, employeeData.experienced]}
                  type="donut"
                />
              </div>
 
              <div className="chart-main">
                <h2>Projects</h2>
                <ReactApexChart
                  options={projectStartChartOptions}
                  series={[{ name: 'Projects', data: projectStartData.yearlyProjects }]}
                  type="bar"
                  
                />
              </div>
            </div>
            <div className="info-main-container">
              <div className="info-main-box">
                <FaUsers className="info-main-icon" style={{ color: '#3489db' }} />
                <h4>Total Employees</h4>
                <p>{employeeData.totalEmployees}</p>
              </div>
              <div className="info-main-box">
                <FaUserPlus className="info-main-icon" style={{ color: '#2ecc71' }} />
                <h4>Freshers</h4>
                <p>{employeeData.freshers}</p>
              </div>
              <div className="info-main-box">
                <FaUser className="info-main-icon" style={{ color: '#e74c3c' }} />
                <h4>Experienced</h4>
                <p>{employeeData.experienced}</p>
              </div>
              <div className="info-main-box">
  <GoProject className="info-main-icon" style={{ color: '#e74c3c' }} />
  <h4>Total Projects</h4>
  <p>{totalProjects}</p> {/* Display the count of total projects */}
</div>

            </div>
            <div className="employee-grids" style={{ backgroundColor: '#fff' }}>
              <h2 style={{fontWeight:'bold',fontSize:'25px',margin:'10px',color:'#3489db'}}>Employees Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Email ID</th>
                    <th>Joining Date</th>
                    <th>Job Position</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeDetails.map((employee) => (
                    <tr key={employee.EmployeeID}>
                    <td style={{ color: '#e74c3c', fontWeight: 'bold' }}>{employee.EmployeeID}</td>
                      <td>{employee.EmployeeName}</td>
                      <td>{employee.Email_ID}</td>
                      <td>{new Date(employee.Joining_Date).toLocaleDateString()}</td>
                      <td>{employee.Job_Position}</td>
                      <td>{employee.Role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
 
        <footer className="footer-main">
          <div className="footer-main-content">
            <p>&copy; copyright 2024 Modern HRMS Admin</p>
          </div>
        </footer>
      </div>
      <ToastContainer />
    
    </div>
  );
};
 
export default Dashboard;
 