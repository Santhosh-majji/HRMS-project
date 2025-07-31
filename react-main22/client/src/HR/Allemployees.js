
import React, { useState, useEffect } from 'react';
import axios from 'axios';
 
import { IconButton, Dialog, DialogActions, DialogTitle, Box, Typography, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Modal, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
 
function Allemployees() {
  const [loading, setLoading] = useState(false);
  const [applicantId, setApplicantId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [formData, setFormData] = useState({
    First_Name: '',
    Middle_Name: '',
    Last_Name: '',
    Phone_Number: '',
    Email_ID: '',
    Gender: '',
    Job_Position: '',
    Department: '',
    Role: '',
    Date_of_Birth: null,
    Marital_Status: '',
    Address: '',
    Shift: '',
  });
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [password, setPassword] = useState('');
  const [view, setView] = useState('employeeList'); // State to track current view
  const [employeeList, setEmployeeList] = useState([]); // State to store employee list
  const [filteredEmployeeList, setFilteredEmployeeList] = useState([]); // State to store filtered employee list
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
 
  useEffect(() => {
    console.log('Fetching employee list'); // Debugging line
    if (view === 'employeeList') {
      fetchEmployeeList();
    }
  }, [view]);
 
  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get('http://localhost:5001/employeesfulllist');
      console.log('Employee data:', response.data); // Debugging line
      setEmployeeList(response.data);
      setFilteredEmployeeList(response.data); // Initialize filtered list
    } catch (error) {
      console.error('Error fetching employee list:', error);
    }
  };
 
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setOpenEditModal(true);
  };
 
  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5001/employees/${selectedEmployee.EmployeeID}`, {
        EmployeeName: selectedEmployee.EmployeeName,
        First_Name: selectedEmployee.First_Name,
        Middle_Name: selectedEmployee.Middle_Name,
         Last_Name: selectedEmployee.Last_Name,
        Phone_Number: selectedEmployee.Phone_Number,
        Email_ID: selectedEmployee.Email_ID,
        Gender: selectedEmployee.Gender,
        Date_of_Birth: selectedEmployee.Date_of_Birth,
        Marital_Status: selectedEmployee.Marital_Status,
        Address: selectedEmployee.Address,
        Department: selectedEmployee.Department,
        Job_Position: selectedEmployee.Job_Position,
        Shift_ID: selectedEmployee.Shift,
        Joining_Date: selectedEmployee.Joining_Date,
        Role: selectedEmployee.Role
      });
      setOpenEditModal(false);
      fetchEmployeeList();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };
 
 
  const handleDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee); // Set the employee to delete
    setOpenDeleteConfirmation(true); // Open the delete confirmation dialog
  };
 
  const handleConfirmDelete = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:5001/employees/${employeeToDelete.EmployeeID}`);
      fetchEmployeeList(); // This function fetches the updated employee list after deletion
      setOpenDeleteConfirmation(false); // Close the confirmation dialog after deletion
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };
 
  const renderDeleteConfirmation = () => (
    <Dialog
      open={openDeleteConfirmation}
      onClose={() => setOpenDeleteConfirmation(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">Are you sure you want to delete this employee?</Typography>
      </Box>
      <DialogActions>
        <Button onClick={() => setOpenDeleteConfirmation(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
 
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3; // Adjusted to display 3 items per page
 
  // Function to handle moving to the next page
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredEmployeeList.length / rowsPerPage)));
  };
 
  // Function to handle moving to the previous page
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
 
  // Calculate the employees to display on the current page
  const displayedEmployees = filteredEmployeeList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
 
  // Search functionality
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filteredList = employeeList.filter(employee =>
      employee.EmployeeID.toString().toLowerCase().includes(searchValue) ||
      employee.First_Name.toLowerCase().includes(searchValue) ||
      employee.Department.toLowerCase().includes(searchValue) ||
      employee.Job_Position.toLowerCase().includes(searchValue) ||
      employee.Gender.toLowerCase().includes(searchValue) ||
      employee.Role.toLowerCase().includes(searchValue)
    );
    setFilteredEmployeeList(filteredList);
    setCurrentPage(1); // Reset to first page after search
  };
 
  const renderEditEmployeeModal = () => (
    <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
      <Box sx={{
        width: 600,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 2,
        bgcolor: 'background.paper'
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Edit Employee</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="First Name"
              value={selectedEmployee?.First_Name || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, First_Name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Middle Name"
              value={selectedEmployee?.Middle_Name || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Middle_Name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Last Name"
              value={selectedEmployee?.Last_Name || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Last_Name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Employee Name"
              value={selectedEmployee?.EmployeeName || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, EmployeeName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone Number"
              value={selectedEmployee?.Phone_Number || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Phone_Number: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email ID"
              value={selectedEmployee?.Email_ID || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Email_ID: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Gender"
              value={selectedEmployee?.Gender || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Gender: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Job Position"
              value={selectedEmployee?.Job_Position || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Job_Position: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Department"
              value={selectedEmployee?.Department || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Department: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Role"
              value={selectedEmployee?.Role || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Role: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date of Birth"
              value={selectedEmployee?.Date_of_Birth || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Date_of_Birth: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Marital Status"
              value={selectedEmployee?.Marital_Status || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Marital_Status: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Address"
              value={selectedEmployee?.Address || ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Shift</InputLabel>
              <Select
                value={selectedEmployee?.Shift || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Shift: e.target.value })}
              >
                {shiftOptions.map((shift) => (
                  <MenuItem key={shift.Shift_ID} value={shift.Shift_ID}>
                    {shift.Shift_Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setOpenEditModal(false)} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveEdit}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
 
  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Total Employees : {employeeList.length}</Typography>
        <TextField
          variant="outlined"
          placeholder="Search"
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Employee ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Middle Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email ID</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Job Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Marital Status</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Shift ID</TableCell>
              <TableCell>Joining Date</TableCell>
             
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedEmployees.map((employee) => (
              <TableRow key={employee.EmployeeID}>
                <TableCell>{employee.EmployeeID}</TableCell>
                <TableCell>{employee.First_Name}</TableCell>
                <TableCell>{employee.Middle_Name}</TableCell>
                <TableCell>{employee.Last_Name}</TableCell>
                <TableCell>{employee.Phone_Number}</TableCell>
                <TableCell>{employee.Email_ID}</TableCell>
                <TableCell>{employee.Gender}</TableCell>
                <TableCell>{employee.Job_Position}</TableCell>
                <TableCell>{employee.Department}</TableCell>
                <TableCell>{employee.Role}</TableCell>
                <TableCell>{employee.Date_of_Birth}</TableCell>
                <TableCell>{employee.Marital_Status}</TableCell>
                <TableCell>{employee.Address}</TableCell>
                <TableCell>{employee.Shift_ID}</TableCell>
                <TableCell>{employee.Joining_Date}</TableCell>
             
                <TableCell>
                  <IconButton onClick={() => handleEditEmployee(employee)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteEmployee(employee)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Typography component="span" sx={{ mx: 2 }}>
            Page {currentPage} of {Math.ceil(employeeList.length / rowsPerPage)}
          </Typography>
          <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(employeeList.length / rowsPerPage)}>
            Next
          </Button>
        </Box>
      {renderEditEmployeeModal()}
      {renderDeleteConfirmation()}
    </Container>  );
}
 
export default Allemployees;
 
 