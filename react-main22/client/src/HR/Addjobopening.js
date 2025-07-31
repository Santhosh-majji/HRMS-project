
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
function Addjobopening() {
  const [formData, setFormData] = useState({
    jobPosition: '',
    department: '',
    departmentId: '',
    numberOfOpenings: '',
    lastDate: '',
    salary: '',
    description: '',
  });
 
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
 
  useEffect(() => {
    // Fetch departments when component mounts
    axios.get('http://localhost:5001/departmentsforjobopening')
      .then(response => setDepartments(response.data))
      .catch(error => console.error('Error fetching departments:', error));
  }, []);
 
  const handleDepartmentChange = (e) => {
    const selectedDepartment = departments.find(dept => dept.DepartmentName === e.target.value);
    setFormData({
      ...formData,
      department: e.target.value,
      departmentId: selectedDepartment.DepartmentID
    });
 
    // Fetch positions based on selected department
    axios.get(`http://localhost:5001/positionsforjobopening/${selectedDepartment.DepartmentID}`)
      .then(response => setPositions(response.data))
      .catch(error => console.error('Error fetching positions:', error));
  };
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
 
  const handleJobOpeningSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5001/addjobopening', formData)
      .then(response => {
        console.log(response.data);
        toast.success('Job opening added successfully!');
        setFormData({
          jobPosition: '',
          department: '',
          departmentId: '',
          numberOfOpenings: '',
          lastDate: '',
          salary: '',
          description: '',
        });
        setPositions([]); // Clear positions when form is reset
      })
      .catch(error => {
        console.error('Error adding job opening:', error);
        toast.error('Failed to add job opening!');
      });
  };
 
  return (
    <Container>
      <Box component="form" onSubmit={handleJobOpeningSubmit} sx={{ '& .MuiTextField-root': { m: 1 } }}>
        <Typography variant="h6">Add Job Opening</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleDepartmentChange}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.DepartmentID} value={dept.DepartmentName}>
                  {dept.DepartmentName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
 
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Department ID"
              name="departmentId"
              value={formData.departmentId}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
 
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Job Position"
              name="jobPosition"
              value={formData.jobPosition}
              onChange={handleChange}
            >
              {positions.map((pos, index) => (
                <MenuItem key={index} value={pos.PositionName}>
                  {pos.PositionName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
 
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Number Of Openings"
              name="numberOfOpenings"
              value={formData.numberOfOpenings}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Last Date To Apply"
              type="date"
              name="lastDate"
              value={formData.lastDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Salary Range (e.g., 50000-70000)"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="50000-70000"
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={4} display="flex" alignItems="center">
            <Button variant="contained" color="primary" type="submit">
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </Container>
  );
}
 
export default Addjobopening;
 
 