
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  MenuItem
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
// import './AddApplicant.css';
 
function AddApplicant() {
  const [formData, setFormData] = useState({
    jobId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    emailId: '',
    appliedDate: '',
    role: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    address: ''
  });
 
  const [resume, setResume] = useState(null);
  const [jobIds, setJobIds] = useState([]);
 
  useEffect(() => {
    // Fetch job IDs from the backend
    axios.get('http://localhost:5001/jobidaddemployee')
      .then(response => {
        setJobIds(response.data);
      })
      .catch(error => {
        console.error('Error fetching job IDs:', error);
      });
  }, []);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
 
    if (name === 'resume') {
      const file = e.target.files[0];
      setResume(file);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
 
  const handleRemoveResume = () => {
    setResume(null); // Remove the resume
  };
 
  const handleApplicantSubmit = (e) => {
    e.preventDefault();
 
    // Prepare form data for submission
    const submissionData = new FormData();
    submissionData.append('Job_ID', formData.jobId);
    submissionData.append('First_Name', formData.firstName);
    submissionData.append('Middle_Name', formData.middleName);
    submissionData.append('Last_Name', formData.lastName);
    submissionData.append('Phone_Number', formData.phoneNumber);
    submissionData.append('Gender', formData.gender);
    submissionData.append('Date_of_Birth', formData.dateOfBirth);
    submissionData.append('Marital_Status', formData.maritalStatus);
    submissionData.append('Address', formData.address);
    submissionData.append('Email_ID', formData.emailId);
    submissionData.append('AppliedDate', formData.appliedDate);
    submissionData.append('Role', formData.role);
 
    // Append resume if available
    if (resume) {
      submissionData.append('resume', resume);
    }
 
    axios.post('http://localhost:5001/addapplicant', submissionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        toast.success('Applicant added successfully!');
        // Reset form fields and resume
        setFormData({
          jobId: '',
          firstName: '',
          middleName: '',
          lastName: '',
          phoneNumber: '',
          emailId: '',
          appliedDate: '',
          role: '',
          gender: '',
          dateOfBirth: '',
          maritalStatus: '',
          address: ''
        });
        setResume(null);
      })
      .catch(error => {
        console.error('Error during submission:', error);
        toast.error('Failed to add applicant!');
      });
  };
 
  return (
    <Container>
      <Box component="form" onSubmit={handleApplicantSubmit} sx={{ '& .MuiTextField-root': { m: 1 } }}>
        <Typography variant="h6">Add Applicant</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Job ID"
              name="jobId"
              value={formData.jobId}
              onChange={handleChange}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 200,  // Adjust as needed
                    },
                  },
                },
              }}
            >
              {jobIds.map(job => (
                <MenuItem key={job.Job_ID} value={job.Job_ID}>
                  {job.Job_ID}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email ID"
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Applied Date"
              type="date"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="superadmin">Super Admin</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="hr">Hr</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date Of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Marital Status"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              <MenuItem value="single">Unmarried</MenuItem>
              <MenuItem value="married">Married</MenuItem>
              <MenuItem value="divorced">Divorced</MenuItem>
              <MenuItem value="widowed">Widowed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Upload Resume Here"
              value={resume ? resume.name : ''}
           
              InputProps={{
                readOnly: true,
                endAdornment: resume && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleRemoveResume}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onClick={() => document.getElementById('resume-upload').click()}
              sx={{ cursor: 'pointer' }}
            />
            <input
              type="file"
              id="resume-upload"
              name="resume"
              hidden
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={4} display="flex" alignItems="center">
            <Button variant="contained" color="primary" type="submit">Add</Button>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </Container>
  );
}
 
export default AddApplicant;
 
 