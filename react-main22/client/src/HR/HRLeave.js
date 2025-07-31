
import React, { useState, useEffect } from 'react';
import './HRLeave.css';
import axios from 'axios';
import HRSideBar from '../components/Sidebar/HRSideBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { TextField, Button, Box, Chip } from '@mui/material';
 
function HRLeave() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 
  useEffect(() => {
    fetchLeaveRequests();
  }, [searchTerm]);
 
  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/leave-request');
      let formattedLeaveRequests = response.data.map((leave) => ({
        ...leave,
        StartDate: leave.StartDate.substring(0, 10),
        EndDate: leave.EndDate.substring(0, 10),
      }));
 
      if (searchTerm) {
        formattedLeaveRequests = formattedLeaveRequests.filter((leave) =>
          Object.values(leave).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
 
      setLeaveRequests(formattedLeaveRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };
 
  const calculateDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };
 
  const handleApprove = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to approve this leave request?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:5001/api/leave-request-approve/${id}`);
          fetchLeaveRequests();
          Swal.fire(
            'Approved!',
            'The leave request has been approved.',
            'success'
          );
        } catch (error) {
          console.error('Error approving leave request:', error);
        }
      }
    });
  };
 
  const handleReject = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to reject this leave request?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:5001/api/leave-request-reject/${id}`);
          fetchLeaveRequests();
          Swal.fire(
            'Rejected!',
            'The leave request has been rejected.',
            'success'
          );
        } catch (error) {
          console.error('Error rejecting leave request:', error);
        }
      }
    });
  };
 
  const getStatusChip = (status) => {
    let color;
    let backgroundColor;
    let label;
    switch (status.toLowerCase()) {
      case 'approved':
        color = '#4caf50';
        backgroundColor = '#e8f5e9';
        label = 'Approved';
        break;
      case 'pending':
        color = '#ff9800';
        backgroundColor = '#fff3e0';
        label = 'Pending';
        break;
      case 'rejected':
        color = '#f44336';
        backgroundColor = '#ffebee';
        label = 'Rejected';
        break;
      default:
        color = '#000000';
        backgroundColor = '#f5f5f5';
        label = status;
    }
    return (
      <Chip
        label={label}
        style={{
          color: color,
          backgroundColor: backgroundColor,
          borderRadius: '5px',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          padding: '5px 10px'
        }}
      />
    );
  };
 
  return (
    <div style={{ display: 'flex' }}>
      <HRSideBar />
      <div className="App" style={{width:'100%'}}>
        <header className="App-header-leaves">
          <h2 style={{ fontSize: '30px' }}>Leaves</h2>
        </header>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary" onClick={fetchLeaveRequests}>
            Search
          </Button>
        </Box>
        <div className="data-grids">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.Username}</td>
                  <td>{leave.EmployeeName}</td>
                  <td>{leave.LeaveType}</td>
                  <td>{leave.StartDate}</td>
                  <td>{leave.EndDate}</td>
                  <td>{calculateDaysDifference(leave.StartDate, leave.EndDate)}</td>
                  <td>{leave.Reason}</td>
                  <td>{getStatusChip(leave.Status)}</td>
                  <td>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApprove(leave.id)}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleReject(leave.id)}
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
 
export default HRLeave;
 
 