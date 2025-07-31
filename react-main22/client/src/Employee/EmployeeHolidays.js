import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineEye } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import EmployeeSideBar from '../components/Sidebar/EmployeeSidebar';
import './EmployeeHolidays.css';

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewingHoliday, setViewingHoliday] = useState(null);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get('http://localhost:5001/holidays');
      const formattedHolidays = response.data.map(holiday => ({
        ...holiday,
        Date: holiday.Date.split('T')[0]
      }));
      setHolidays(formattedHolidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast.error('Error fetching holidays');
    }
  };

  const handleView = (index) => {
    setViewingHoliday(holidays[index]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setViewingHoliday(null);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <EmployeeSideBar />
      </div>
      <div className="holidays-container" style={{ width: '100%' }}>
        <div className="heading">
          <h1 style={{ alignItems: 'flex-start' }}>Holidays List of This Year</h1>
        </div>
        <ToastContainer />
        <div className="holidays-list">
          <div className="data-grids" style={{ width: '100%' }}>
            <table>
              <thead style={{ backgroundColor: '#333' }}>
                <tr>
                  <th>Holiday Name</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday, index) => (
                  <tr key={index}>
                    <td>{holiday.Name}</td>
                    <td>{holiday.Date}</td>
                    <td>{holiday.Description}</td>
                    <td>
                      <button className="action-button" onClick={() => handleView(index)}>
                        <AiOutlineEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Material-UI Dialog for viewing holiday details */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle style={{ backgroundColor: '#1976d2', color: '#fff' }}>
            Holiday Details
          </DialogTitle>
          <DialogContent dividers>
            {viewingHoliday && (
              <>
                <Typography variant="h6" gutterBottom><strong>Name:</strong> {viewingHoliday.Name}</Typography>
                <Typography variant="body1" gutterBottom><strong>Date:</strong> {viewingHoliday.Date}</Typography>
                <Typography variant="body2" gutterBottom><strong>Description:</strong> {viewingHoliday.Description}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained" color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Holidays;
