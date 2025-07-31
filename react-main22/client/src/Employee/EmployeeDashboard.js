import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import {
  FaBriefcase,
  FaSignOutAlt,
} from 'react-icons/fa';
import './EmployeeDashboard.css';
import EmployeeSideBar from '../components/Sidebar/EmployeeSidebar';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import Cookies from 'js-cookie';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiCalendarCloseFill } from "react-icons/ri";
import { FcApprove } from "react-icons/fc";
import { MdPendingActions } from "react-icons/md";

const DonutChart = ({ username }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:5001/employee-leaves/${username}`)
      .then(response => {
        const { sick_leaves, casual_leaves } = response.data;

        const options = {
          chart: {
            type: 'donut',
          },
          series: [sick_leaves, casual_leaves],
          labels: ['Sick Leaves', 'Casual Leaves'],
          colors: ['#FF4560', '#FEB019'],
        };

        const chart = new ApexCharts(chartRef.current, options);
        chart.render();

        return () => {
          chart.destroy();
        };
      })
      .catch(error => {
        console.error('Error fetching leaves data:', error);
      });
  }, [username]);

  return <div ref={chartRef} />;
};

const MonthlyAttendanceChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const options = {
      chart: {
        height: 350,
        type: 'bar',
      },
      series: [
        {
          name: 'Present Days',
          data: [22, 20, 23, 21, 25, 26, 22, 23, 24, 22, 23, 25], // Example data
        },
        {
          name: 'Absent Days',
          data: [8, 13, 11, 12, 11, 10, 12, 11, 11, 12, 11, 11], // Example data
        },
        {
          name: 'Leaves',
          data: [10, 11, 12, 12, 21, 11, 11, 12, 1, 1, 1, 0], // Example data
        },
      ],
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '50%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        title: {
          text: 'Months',
        },
      },
      yaxis: {
        title: {
          text: 'Days',
        },
      },
      colors: ['#00E396', '#FF4560', '#FEB019'],
      legend: {
        position: 'top',
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return <div ref={chartRef} />;
};

const MonthlyLeavesChart = ({ username }) => {
  const chartRef = useRef(null);
  const [leaveData, setLeaveData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/employee-leaves/${username}`);
        setLeaveData(response.data);
      } catch (error) {
        console.error('Error fetching leaves data:', error);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    if (leaveData.length > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const leaveDays = Array(12).fill(0);

      leaveData.forEach(data => {
        leaveDays[data.month - 1] = data.total_leave_days;
      });

      const options = {
        chart: {
          height: 350,
          type: 'line',
        },
        series: [
          {
            name: 'Total Leave Days',
            data: leaveDays,
          },
        ],
        xaxis: {
          categories: months,
          title: {
            text: 'Months',
          },
        },
        yaxis: {
          title: {
            text: 'Number of Leave Days',
          },
        },
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [leaveData]);

  return <div ref={chartRef} />;
};

const Dashboard = () => {
  const [leaveData, setLeaveData] = useState({
    totalLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    pendingLeaves: 0,
  });
  const [First_Name, setFirstName] = useState('');
  const navigate = useNavigate();

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
    confirmAlert({
      title: 'Confirm to logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          label: 'Yes',
          onClick: handleLogout,
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem('username');
      try {
        const response = await axios.get(`http://localhost:5001/api/employee-dashboard/${username}`);
        setLeaveData(response.data);
        setFirstName(response.data.First_Name); 
      } catch (error) {
        console.error('Error fetching leave data:', error);
      }
    };

    fetchData();
  }, []);

  const cardData = [
    { id: leaveData.totalLeaves, text: 'Total Leaves', icon: <FaBriefcase />, color: '#fff3cd' },
    { id: leaveData.approvedLeaves, text: 'Approved', icon: <FcApprove />, color: '#d1ecf1' },
    { id: leaveData.rejectedLeaves, text: 'Rejected', icon: <RiCalendarCloseFill />, color: '#f8d7da' },
    { id: leaveData.pendingLeaves, text: 'Pending', icon: <MdPendingActions />, color: '#d1ecf1' }
  ];

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <EmployeeSideBar />
      </div>
      <div className='dashboard'>
        <div className='header'>
          <h1>Welcome to the Dashboard, {First_Name}!</h1>
          <div className='logout-section' onClick={confirmLogout} title='Logout'>
            <h3>Logout</h3>
            <div className='logout-icons'>
              <FaSignOutAlt />
            </div>
          </div>
        </div>
        <div className='flex-container'>
          <div className='row-container'>
            <div className='donut' style={{ flex: '30%' }}>
              <h4>Statistics</h4>
              <DonutChart username={localStorage.getItem('username')} />
            </div>
            <div className='text' style={{ flex: '70%' }}>
              <h4>Attendance</h4>
              <div className='cadds'>
                {cardData.map((card) => (
                  <div key={card.text} className='cadd' style={{ backgroundColor: card.color }}>
                    <div className='icon'>{card.icon}</div>
                    <p>{card.text}</p>
                    <p>{card.id}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='second-row'>
            <div className='apex'>
              <h4>Monthly Attendance Statistics</h4>
              <MonthlyAttendanceChart />
            </div>
            <div className='apex'>
              <h4>Monthly Leaves Statistics</h4>
              <MonthlyLeavesChart username={localStorage.getItem('username')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
