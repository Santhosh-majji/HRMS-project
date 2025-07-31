
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Modal,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
 
// import './Shift.css';
import Organizational from './Organizational';
 
// Helper function to calculate duration
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
 
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const diff = Math.abs(end - start) / 1000;
 
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
 
  return `${hours} hours ${minutes} minutes`;
};
 
const Shift = () => {
  const [shifts, setShifts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [form, setForm] = useState({
    id: '',
    shiftDate: '',
    startTime: '',
    endTime: '',
    shiftType: '',
    breakTimes: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
 
  useEffect(() => {
    // Fetch data from the backend when the component mounts
    axios.get('http://localhost:5001/shiftsdata')
      .then(response => {
        setShifts(response.data);
      })
      .catch(error => {
        console.error('Error fetching shifts data:', error);
      });
  }, []);
 
  const handleAdd = () => {
    axios.post('http://localhost:5001/shifts', {
      Shift_ID: form.id,
      ShiftDate: form.shiftDate,
      StartTime: form.startTime,
      EndTime: form.endTime,
      ShiftType: form.shiftType,
      BreakTime: form.breakTimes,
    })
    .then(response => {
      setShifts([...shifts, {
        Shift_ID: form.id,
        ShiftDate: form.shiftDate,
        StartTime: form.startTime,
        EndTime: form.endTime,
        ShiftType: form.shiftType,
        BreakTime: form.breakTimes,
        ShiftDuration: calculateDuration(form.startTime, form.endTime),
      }]);
      setForm({
        id: '',
        shiftDate: '',
        startTime: '',
        endTime: '',
        shiftType: '',
        breakTimes: '',
      });
      setDrawerOpen(false);
    })
    .catch(error => {
      console.error('Error adding shift:', error);
    });
  };
 
  const handleDelete = (id) => {
    setSelectedShift(id);
    setDeleteModalOpen(true);
  };
 
  const confirmDelete = () => {
    axios.delete(`http://localhost:5001/shifts/${selectedShift}`)
      .then(response => {
        setShifts(shifts.filter((shift) => shift.Shift_ID !== selectedShift));
        setDeleteModalOpen(false);
      })
      .catch(error => {
        console.error('Error deleting shift:', error);
      });
  };
 
  const handleEditOpen = (shift) => {
    setSelectedShift(shift);
    setForm({
      id: shift.Shift_ID,
      shiftDate: shift.ShiftDate,
      startTime: shift.StartTime,
      endTime: shift.EndTime,
      shiftType: shift.ShiftType,
      breakTimes: shift.BreakTime,
    });
    setEditModalOpen(true);
  };
 
  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedShift(null);
  };
 
  const handleUpdate = () => {
    axios.put(`http://localhost:5001/shifts/${form.id}`, {
      ShiftDate: form.shiftDate,
      StartTime: form.startTime,
      EndTime: form.endTime,
      ShiftType: form.shiftType,
      BreakTime: form.breakTimes,
    })
    .then(response => {
      const updatedShifts = shifts.map((shift) =>
        shift.Shift_ID === form.id ? {
          ...shift,
          ShiftDate: form.shiftDate,
          StartTime: form.startTime,
          EndTime: form.endTime,
          ShiftType: form.shiftType,
          BreakTime: form.breakTimes,
          ShiftDuration: calculateDuration(form.startTime, form.endTime),
        } : shift
      );
      setShifts(updatedShifts);
      handleEditClose();
    })
    .catch(error => {
      console.error('Error updating shift:', error);
    });
  };
 
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(shifts.length / rowsPerPage)));
  };
 
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
 
  const displayedShifts = shifts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
 
  return (
    <div>
      <div>
        <Organizational />
      </div>
      <Container maxWidth="lg">
  <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between' }}>
    <Typography variant="h4" gutterBottom>
      Shifts
    </Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={() => setDrawerOpen(true)}
    >
      Add Shift
    </Button>
  </Box>
  <TableContainer component={Paper} style={{position:'absolute'}}>
    <Table>
      <TableHead>
        <TableRow style={{fontWeight:'bold',fontSize:'20px'}}>
          <TableCell className="table-header">Shift ID</TableCell>
          <TableCell className="table-header">Shift Date</TableCell>
          <TableCell className="table-header">Start Time</TableCell>
          <TableCell className="table-header">End Time</TableCell>
          <TableCell className="table-header">Shift Duration</TableCell>
          <TableCell className="table-header">Shift Type</TableCell>
          <TableCell className="table-header">Break Duration</TableCell>
          <TableCell className="table-header">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {displayedShifts.map((shift) => (
          <TableRow key={shift.Shift_ID} style={{fontWeight:'bold'}}>
            <TableCell className="table-cell">{shift.Shift_ID}</TableCell>
            <TableCell className="table-cell">{new Date(shift.ShiftDate).toLocaleDateString()}</TableCell>

            <TableCell className="table-cell">{shift.StartTime}</TableCell>
            <TableCell className="table-cell">{shift.EndTime}</TableCell>
            <TableCell className="table-cell">
              {calculateDuration(shift.StartTime, shift.EndTime)}
            </TableCell>
            <TableCell className="table-cell">{shift.ShiftType}</TableCell>
            <TableCell className="table-cell">{shift.BreakTime}</TableCell>
            <TableCell className="table-cell">
              <IconButton color="primary" onClick={() => handleEditOpen(shift)}>
                <EditIcon />
              </IconButton>
              <IconButton color="secondary" onClick={() => handleDelete(shift.Shift_ID)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
    <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1}>
      Previous
    </Button>
    <Typography>
      Page {currentPage} of {Math.ceil(shifts.length / rowsPerPage)}
    </Typography>
    <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(shifts.length / rowsPerPage)}>
      Next
    </Button>
  </Box>
</Container>
 
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 350, p: 2 }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ mb: 2 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Add New Shift
          </Typography>
          <TextField
            label="Shift ID"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Shift Date"
            type="date"
            value={form.shiftDate}
            onChange={(e) => setForm({ ...form, shiftDate: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Start Time"
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Time"
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Shift Type</InputLabel>
            <Select
              value={form.shiftType}
              onChange={(e) => setForm({ ...form, shiftType: e.target.value })}
            >
              <MenuItem value="Morning">Morning</MenuItem>
              <MenuItem value="Afternoon">Afternoon</MenuItem>
              <MenuItem value="Night">Night</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Break Duration"
            value={form.breakTimes}
            onChange={(e) => setForm({ ...form, breakTimes: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Add Shift
            </Button>
          </Box>
        </Box>
      </Drawer>
      <Modal open={editModalOpen} onClose={handleEditClose}>
        <Box sx={{ width: 400, p: 4, bgcolor: 'background.paper', margin: 'auto', mt: '10%', borderRadius: 1, maxHeight: '80vh', overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Edit Shift</Typography>
            <IconButton onClick={handleEditClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Shift ID"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Shift Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.shiftDate}
                  onChange={(e) => setForm({ ...form, shiftDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Start Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="End Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Shift Type</InputLabel>
                  <Select
                    value={form.shiftType}
                    onChange={(e) => setForm({ ...form, shiftType: e.target.value })}
                  >
                    <MenuItem value="Day">Day</MenuItem>
                    <MenuItem value="Night">Afternoon</MenuItem>
                    <MenuItem value="Night">Night</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Break Duration"
                  value={form.breakTimes}
                  onChange={(e) => setForm({ ...form, breakTimes: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      <Modal
  open={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  aria-labelledby="delete-modal-title"
  aria-describedby="delete-modal-description"
>
  <Box className="deleteshift"
   
  >
    <Typography id="delete-modal-title" variant="h6" component="h2">
      Confirm Delete
    </Typography>
    <Typography id="delete-modal-description" sx={{ mt: 2 }}>
      Are you sure you want to delete this shift?
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={confirmDelete}
        sx={{ mr: 2 }}
      >
        Delete
      </Button>
      <Button variant="contained" onClick={() => setDeleteModalOpen(false)}>
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>
    </div>
  );
};
 
 
 
export default Shift;
 