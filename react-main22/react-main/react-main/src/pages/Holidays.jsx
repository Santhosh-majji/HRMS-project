import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { ExcelRenderer } from 'react-excel-renderer';
import 'react-toastify/dist/ReactToastify.css';
import './Holidays.css';
import SideBar from '../components/Sidebar/SideBar';
import { Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const Holidays = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayDescription, setHolidayDescription] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get('http://localhost:5001/holidays');
      const formattedHolidays = response.data.map(holiday => ({
        ...holiday,
        Date: holiday.Date.split('T')[0],
        Day: new Date(holiday.Date).toLocaleString('en-US', { weekday: 'long' })
      }));
      setHolidays(formattedHolidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast.error('Error fetching holidays');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setShowPopup(true);
    const holiday = holidays[index];
    setHolidayName(holiday.Name);
    setHolidayDate(holiday.Date);
    setHolidayDescription(holiday.Description);
  };

  const handleAddHoliday = () => {
    setEditingIndex(null);
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
    setEditingIndex(null);
    resetForm();
  };

  const resetForm = () => {
    setHolidayName('');
    setHolidayDate('');
    setHolidayDescription('');
  };

  const handleSubmit = async () => {
    try {
      if (editingIndex !== null) {
        await handleUpdate();
      } else {
        await handleAdd();
      }
    } catch (error) {
      console.error('Error performing operation:', error);
      toast.error('Error performing operation');
    }
  };

  const handleAdd = async () => {
    try {
      const newHoliday = {
        Name: holidayName,
        Date: holidayDate,
        Description: holidayDescription
      };
      const response = await axios.post('http://localhost:5001/holidays', newHoliday);
      if (response.data && response.data.id) {
        setHolidays([...holidays, { ...response.data, Day: new Date(response.data.Date).toLocaleString('en-US', { weekday: 'long' }) }]);
        toast.success('Holiday added successfully');
        setShowPopup(false);
        resetForm();
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error adding holiday:', error);
      toast.error('Error adding holiday');
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedHoliday = {
        id: holidays[editingIndex].id,
        Name: holidayName,
        Date: holidayDate,
        Description: holidayDescription
      };
      await axios.put(`http://localhost:5001/holidays/${holidays[editingIndex].id}`, updatedHoliday);
      const updatedHolidays = holidays.map((holiday, index) => index === editingIndex ? { ...updatedHoliday, Day: new Date(updatedHoliday.Date).toLocaleString('en-US', { weekday: 'long' }) } : holiday);
      setHolidays(updatedHolidays);
      toast.success('Holiday updated successfully');
      setShowPopup(false);
      resetForm();
    } catch (error) {
      console.error('Error updating holiday:', error);
      toast.error('Error updating holiday');
    }
  };

  const handleDelete = async (index) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5001/holidays/${holidays[index].id}`);
          const updatedHolidays = holidays.filter((_, i) => i !== index);
          setHolidays(updatedHolidays);
          swalWithBootstrapButtons.fire("Deleted!", "Your holiday has been deleted.", "success");
          toast.success('Holiday deleted successfully');
        } catch (error) {
          console.error('Error deleting holiday:', error);
          toast.error('Error deleting holiday');
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire("Cancelled", "Your holiday is safe :)", "error");
      }
    });
  };

  const handleFileUpload = (event) => {
    const fileObj = event.target.files[0];
    if (!fileObj) {
      return;
    }

    ExcelRenderer(fileObj, async (err, resp) => {
      if (err) {
        console.error('Error reading Excel file:', err);
        toast.error('Error reading Excel file');
      } else {
        const importedHolidays = resp.rows.slice(1).map(row => ({
          Name: row[0],
          Date: new Date(row[1]).toISOString().split('T')[0],
          Description: row[2],
          Day: new Date(row[1]).toLocaleString('en-US', { weekday: 'long' })
        }));

        try {
          await axios.post('http://localhost:5001/holidays/import', { holidays: importedHolidays });
          setHolidays([...holidays, ...importedHolidays]);
          toast.success('Holidays imported successfully');
        } catch (error) {
          console.error('Error importing holidays:', error);
          toast.error('Error importing holidays');
        }
      }
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <SideBar />
      </div>
      <div className="holidays-container" style={{ width: '100%' }}>
        <div className="heading">
          <h1 style={{ alignItems: 'flex-start' }}>Holidays List of This Year</h1>
        </div>
        <div className="buttons-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <Button variant="contained" component="label" startIcon={<AiOutlinePlus />}>
            Import Holidays
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          <Button className="add-holiday-buttons" variant="contained" startIcon={<AiOutlinePlus />} onClick={handleAddHoliday}>
            Add Holiday
          </Button>
        </div>
        <Dialog open={showPopup} onClose={handleCancel}>
          <DialogTitle>{editingIndex !== null ? 'Edit Holiday' : 'Add Holiday'}</DialogTitle>
          <DialogContent>
            <Box component="form" noValidate>
              <TextField
                margin="dense"
                id="holidayName"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
              />
              <TextField
                margin="dense"
                id="holidayDate"
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
              />
              <TextField
                margin="dense"
                id="holidayDescription"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={holidayDescription}
                onChange={(e) => setHolidayDescription(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmit} color="primary" variant="contained" startIcon={<MdCheckCircle />}>
              {editingIndex !== null ? 'Update' : 'Submit'}
            </Button>
            <Button onClick={handleCancel} color="secondary" variant="contained" startIcon={<MdCancel />}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
        <div className="holidays-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Day</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday, index) => (
                <tr key={index}>
                  <td>{holiday.Name}</td>
                  <td>{holiday.Date}</td>
                  <td>{holiday.Day}</td>
                  <td>{holiday.Description}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AiOutlineEdit
                        onClick={() => handleEdit(index)}
                        style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                      />
                      <AiOutlineDelete
                        onClick={() => handleDelete(index)}
                        style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Holidays;
