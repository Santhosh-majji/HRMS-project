
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EmployeeAttendance.css';
import EmployeeSideBar from '../components/Sidebar/EmployeeSidebar';
import { FaClock, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Pagination from 'react-js-pagination';
 
function AttendanceList() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const timerRef = useRef(null);
  const username = localStorage.getItem('username');
 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
 
  useEffect(() => {
    fetchAttendanceData();
    fetchLeaveData();
    const checkInStatus = localStorage.getItem('isCheckedIn');
    const checkInTime = localStorage.getItem('checkInTime');
    if (checkInStatus === 'true' && checkInTime) {
      setIsCheckedIn(true);
      const elapsedTime = Math.floor((Date.now() - new Date(checkInTime).getTime()) / 1000);
      setTimer(elapsedTime);
      setIsTimerRunning(true);
    }
  }, []);
 
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
 
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);
 
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/attendance', {
        params: { username },
      });
      setAttendanceData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };
 
  const fetchLeaveData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/leave-request/${username}`);
      setLeaveData(response.data);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  };
 
  const handleCheckIn = async () => {
    Swal.fire({
      title: 'Check In',
      text: 'Are you sure you want to check in?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, check in',
      cancelButtonText: 'No, cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Check if already checked in for today
          const isAlreadyCheckedIn = attendanceData.some(record => {
            const recordDate = new Date(record.date).toLocaleDateString();
            const todayDate = new Date().toLocaleDateString();
            return record.Username === username && recordDate === todayDate && record.Check_In;
          });
 
          if (isAlreadyCheckedIn) {
            Swal.fire({
              title: 'Already Checked In',
              text: 'You have already checked in for today. Come again tomorrow.',
              icon: 'warning',
            });
            return;
          }
 
          await axios.post('http://localhost:5001/checkin', { username });
          toast.success('Checked in successfully');
          const checkInTime = new Date().toISOString();
          localStorage.setItem('checkInTime', checkInTime);
          setIsTimerRunning(true);
          setIsCheckedIn(true);
          localStorage.setItem('isCheckedIn', 'true');
          setTimer(0);
          fetchAttendanceData();
        } catch (error) {
          console.error('Error on check-in:', error);
        }
      }
    });
  };
 
  const handleCheckOut = async () => {
    Swal.fire({
      title: 'Check Out',
      text: 'Are you sure you want to check out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, check out',
      cancelButtonText: 'No, cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('http://localhost:5001/checkout', { username, workingHours: timer });
          toast.success('Checked out successfully');
          setIsTimerRunning(false);
          setIsCheckedIn(false);
          localStorage.removeItem('isCheckedIn');
          localStorage.removeItem('checkInTime');
          fetchAttendanceData();
        } catch (error) {
          console.error('Error on check-out:', error);
        }
      }
    });
  };
 
  const handleAttendanceAction = () => {
    if (isCheckedIn) {
      handleCheckOut();
    } else {
      handleCheckIn();
    }
  };
 
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = attendanceData.filter(row =>
      row.Username.toLowerCase().includes(query) ||
      new Date(row.date).toLocaleDateString().toLowerCase().includes(query) ||
      row.Check_In.toLowerCase().includes(query) ||
      row.Check_Out.toLowerCase().includes(query) ||
      row.Working_hours.toLowerCase().includes(query) ||
      row.Status.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };
 
  const formatTime = (time) => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = Math.floor(time / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
 
    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };
 
  const mergeAttendanceAndLeaveData = () => {
    const leaveDates = leaveData.reduce((acc, leave) => {
      const startDate = new Date(leave.StartDate);
      const endDate = new Date(leave.EndDate);
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        acc.add(date.toISOString().split('T')[0]);
      }
      return acc;
    }, new Set());
 
    const attendanceMap = attendanceData.reduce((acc, record) => {
      acc[new Date(record.date).toISOString().split('T')[0]] = record;
      return acc;
    }, {});
 
    const combinedData = [];
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the month
    for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      if (attendanceMap[dateString]) {
        combinedData.push({
          ...attendanceMap[dateString],
          Status: 'Present'
        });
      } else if (leaveDates.has(dateString)) {
        combinedData.push({
          id: `leave-${dateString}`,
          Username: username,
          date: dateString,
          Check_In: '',
          Check_Out: '',
          Working_hours: '',
          Status: 'Leave'
        });
      } else {
        combinedData.push({
          id: `absent-${dateString}`,
          Username: username,
          date: dateString,
          Check_In: '',
          Check_Out: '',
          Working_hours: '',
          Status: 'Absent'
        });
      }
    }
 
    setFilteredData(combinedData);
  };
 
  useEffect(() => {
    mergeAttendanceAndLeaveData();
  }, [attendanceData, leaveData]);
 
  const handleRequest = () => {
    Swal.fire({
      title: 'Attendance Request',
      html:
        '<input id="date" class="swal2-input" placeholder="Date (YYYY-MM-DD)">' +
        '<textarea id="reason" class="swal2-textarea" placeholder="Enter your reason"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const date = document.getElementById('date').value;
        const reason = document.getElementById('reason').value;
        if (!date || !reason) {
          Swal.showValidationMessage('Please enter both date and reason');
        }
        return { date, reason };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { date, reason } = result.value;
          await axios.post('http://localhost:5001/attendance-request', { username, date, reason });
          toast.success('Request submitted successfully');
        } catch (error) {
          console.error('Error submitting request:', error);
          toast.error('Failed to submit request');
        }
      }
    });
  };
 
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
 
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <EmployeeSideBar />
      </div>
      <div className="attendance-container">
        <div className="attendance-header">Attendance List</div>
        <div className="button-container">
          <button
            className="buttons"
            style={{ backgroundColor: isCheckedIn ? '#f44336' : '#4CAF50' }}
            onClick={handleAttendanceAction}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
          <button
            className="buttons"
            style={{ backgroundColor: '#FFA500', marginLeft: '10px' }}
            onClick={handleRequest}
          >
            Request Update
          </button>
        </div>
        <div className="search-containers">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-boxes"
          />
          <FaSearch className="search-icons" />
        </div>
        <div className="timer">
          <FaClock className="timer-icon" />
          Timer: {formatTime(timer)}
        </div>
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="attendance-th">S.No</th>
              <th className="attendance-th">EmployeeID</th>
              <th className="attendance-th">Date</th>
              <th className="attendance-th">Check In</th>
              <th className="attendance-th">Check Out</th>
              <th className="attendance-th">Working Hours</th>
              <th className="attendance-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, index) => (
              <tr key={row.id} className="attendance-row">
                <td className="attendance-td">{indexOfFirstItem + index + 1}</td>
                <td className="attendance-td">{row.Username}</td>
                <td className="attendance-td">{new Date(row.date).toLocaleDateString()}</td>
                <td className="attendance-td">{row.Check_In}</td>
                <td className="attendance-td">{row.Check_Out}</td>
                <td className="attendance-td">{row.Working_hours}</td>
                <td className="attendance-td">
                  <span
                    style={{
                      color: row.Status === 'Absent' ? 'red' : row.Status === 'Leave' ? 'blue' : 'green'
                    }}
                  >
                    {row.Status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={filteredData.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
        <ToastContainer />
      </div>
    </div>
  );
}
 
export default AttendanceList;
 
 