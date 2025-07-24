import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../components/Sidebar/SideBar';

const AdminAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/all-attendance');
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Error fetching attendance data');
    }
  };

  const handleEditOpen = (record) => {
    setCurrentRecord(record);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentRecord(null);
  };

  const handleDeleteOpen = (record) => {
    setCurrentRecord(record);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setCurrentRecord(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditSubmit = async () => {
    try {
      const { id, date, Check_In, Check_Out, Working_hours } = currentRecord;
      await axios.put(`http://localhost:5001/update-attendance/${id}`, { date, check_in: Check_In, check_out: Check_Out, working_hours: Working_hours });
      toast.success('Record updated successfully');
      fetchAttendanceData();
      handleEditClose();
    } catch (error) {
      console.error('Error updating attendance record:', error);
      toast.error('Error updating attendance record');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5001/delete-attendance/${currentRecord.id}`);
      toast.success('Record deleted successfully');
      fetchAttendanceData();
      handleDeleteClose();
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      toast.error('Error deleting attendance record');
    }
  };

  return (
    <div>
      <SideBar />
    
    
    <Container>
      <ToastContainer />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Attendance</Typography>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search />,
          }}
          sx={{ width: 300 }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Check In</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Check Out</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Working Hours</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData
              .filter((record) =>
                record.Username.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((record) => (
                <TableRow key={record.id}>
                  <TableCell style={{fontWeight:'bold'}}>{ record.Username}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>

                  <TableCell>{record.Check_In}</TableCell>
                  <TableCell>{record.Check_Out}</TableCell>
                  <TableCell>{record.Working_hours}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEditOpen(record)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={() => handleDeleteOpen(record)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              value={currentRecord?.Username || ''}
              disabled
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={currentRecord?.date || ''}
              onChange={(e) => setCurrentRecord({ ...currentRecord, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Check In"
              type="time"
              fullWidth
              variant="outlined"
              value={currentRecord?.Check_In || ''}
              onChange={(e) => setCurrentRecord({ ...currentRecord, Check_In: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Check Out"
              type="time"
              fullWidth
              variant="outlined"
              value={currentRecord?.Check_Out || ''}
              onChange={(e) => setCurrentRecord({ ...currentRecord, Check_Out: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Working Hours"
              type="number"
              fullWidth
              variant="outlined"
              value={currentRecord?.Working_hours || ''}
              onChange={(e) => setCurrentRecord({ ...currentRecord, Working_hours: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
        <DialogTitle>Are you sure you want to delete this record?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </div>
  );
};

export default AdminAttendance;
