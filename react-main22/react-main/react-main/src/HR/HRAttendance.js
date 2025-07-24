import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SaveAlt as SaveAltIcon,
} from '@mui/icons-material';
import { animateScroll as scroll } from 'react-scroll';
import HRSideBar from '../components/Sidebar/HRSideBar';

const calculateWorkingHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '';
  const start = new Date(`1970-01-01T${checkIn}`);
  const end = new Date(`1970-01-01T${checkOut}`);
  const diff = Math.abs(end - start) / 1000;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return `${hours} hours ${minutes} minutes`;
};

const Attendances = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editRowData, setEditRowData] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/attendanceData');
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };
    fetchAttendanceData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5001/attendanceData', {
        params: {
          search: searchTerm,
        },
      });
      setAttendanceData(response.data);
      setCurrentPage(1); // Reset to the first page after search
    } catch (error) {
      console.error('Error searching attendance data:', error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = attendanceData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(attendanceData.length / rowsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  const handleEditOpen = (row) => {
    setEditRowData(row);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditRowData(null);
  };

  const handleEditChange = (e) => {
    setEditRowData({
      ...editRowData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5001/attendanceData/${editRowData.id}`, editRowData);
      setAttendanceData((prevData) =>
        prevData.map((row) => (row.id === editRowData.id ? editRowData : row))
      );
      handleEditClose();
    } catch (error) {
      console.error('Error updating attendance data:', error);
    }
  };

  const handleDeleteOpen = (id) => {
    setRowToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5001/attendanceData/${rowToDelete}`);
      setAttendanceData((prevData) => prevData.filter((row) => row.id !== rowToDelete));
      handleDeleteClose();
    } catch (error) {
      console.error('Error deleting attendance data:', error);
    }
  };

  const handleExport = () => {
    const filteredData = attendanceData.filter((row) => {
      const rowDate = new Date(row.date);
      return (
        rowDate.getFullYear() === new Date(selectedMonth).getFullYear() &&
        rowDate.getMonth() === new Date(selectedMonth).getMonth()
      );
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, `Attendance_${selectedMonth}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div>
        <HRSideBar />
      </div>
      <div style={{ width: '100%' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div">
              Attendance
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ ml: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mr: 3 }}
              />
            </Box>
            <Button variant="contained" color="primary" onClick={handleSearch} sx={{ ml: 2 }}>
              Search
            </Button>
          </Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Select Month"
              sx={{ mr: 3 }}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveAltIcon />}
              onClick={handleExport}
              disabled={!selectedMonth}
            >
              Export Monthly Attendance
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead className="attendance-table">
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '18px', width: 'auto' }}>Employee ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Employee Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Check-in</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Check-out</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Working Hours</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Status</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.employeeid}</TableCell>
                    <TableCell>{row.employeename}</TableCell>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.checkin}</TableCell>
                    <TableCell>{row.checkout}</TableCell>
                    <TableCell>{calculateWorkingHours(row.checkin, row.checkout)}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditOpen(row)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteOpen(row.id)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              sx={{ mr: 2 }}
            >
              Prev
            </Button>
            <Typography variant="body1" component="span">
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              sx={{ ml: 2 }}
            >
              Next
            </Button>
            <IconButton
              color="primary"
              onClick={scrollToTop}
              sx={{ ml: 2 }}
            >
              <ArrowUpwardIcon />
            </IconButton>
          </Box>
        </Container>
        <Dialog open={editDialogOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Attendance</DialogTitle>
          <DialogContent>
            <TextField
              name="employeeid"
              label="Employee ID"
              value={editRowData?.employeeid || ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="employeename"
              label="Employee Name"
              value={editRowData?.employeename || ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="date"
              label="Date"
              type="date"
              value={editRowData?.date || ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="checkin"
              label="Check-in"
              value={editRowData?.checkin || ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="checkout"
              label="Check-out"
              value={editRowData?.checkout || ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="status"
              label="Status"
              value={editRowData?.status || ''}
              onChange={handleEditChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Present">Present</MenuItem>
              <MenuItem value="Absent">Absent</MenuItem>
              <MenuItem value="Half Day">Half Day</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
          <DialogTitle>Delete Attendance</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this attendance record?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Attendances;
