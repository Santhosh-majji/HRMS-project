
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
 
function Applicanttoemployee() {
  const [loading, setLoading] = useState(false);
  const [applicantId, setApplicantId] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantOptions, setApplicantOptions] = useState([]);
 
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
    Date_of_Birth: '',
    Marital_Status: '',
    Address: '',
    Shift: '',
  });
  const [isReadOnly, setIsReadOnly] = useState(false);
 
 
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
 
  useEffect(() => {
    const fetchShiftOptions = async () => {
      try {
        const response = await axios.get('http://localhost:5001/employeeshift');
        setShiftOptions(response.data);
      } catch (error) {
        console.error('Error fetching shift options:', error);
      }
    };
   
 
  const fetchApplicantOptions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/onboardinghrmsapplicantid');
      setApplicantOptions(response.data);
    } catch (error) {
      console.error('Error fetching applicant options:', error);
    }
  };
 
  fetchShiftOptions();
  fetchApplicantOptions();
}, []);
 
 
  const handleApplicantChange = (event) => {
    const selectedId = event.target.value;
    setApplicantId(selectedId);
    const selectedApplicant = applicantOptions.find((applicant) => applicant.Applicant_ID === selectedId);
    setApplicantName(selectedApplicant ? selectedApplicant.Applicant_Name : '');
  };
 
 
  const handleCreateEmployee = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
 
      const response = await axios.get(`http://localhost:5001/applicantDetails/${applicantId}`);
      const applicantDetails = response.data;
 
      setFormData(applicantDetails);
      setIsReadOnly(true);
 
      const userQuery = await axios.get('http://localhost:5001/userCount');
      const userCount = userQuery.data.count + 1;
      const paddedUserCount = String(userCount).padStart(4, '0');
      const employeeId = `YTYT${paddedUserCount}`;
 
      const employeeName = `${applicantDetails.First_Name} ${applicantDetails.Middle_Name ? applicantDetails.Middle_Name + ' ' : ''}${applicantDetails.Last_Name}`;
 
      const createResponse = await axios.post('http://localhost:5001/createEmployee', {
        ...applicantDetails,
        EmployeeName: employeeName,
        Joining_Date: selectedDate,
        EmployeeID: employeeId,
        Shift: formData.Shift,
      });
 
      setEmployeeId(employeeId);
      const password = createResponse.data.password;
 
      await axios.post('http://localhost:5001/sendWelcomeEmail', {
        Email_ID: applicantDetails.Email_ID,
        EmployeeID: employeeId,
        Password: password,
        shiftDetails: createResponse.data.shiftDetails,
      });
 
      setLoading(false);
    } catch (error) {
      console.error('Error creating employee:', error);
      setLoading(false);
    }
  };
 
 
  const renderAddEmployeeForm = () => (
    <Container sx={{ mt: 2, flexGrow: 1 }}>
      <form onSubmit={handleCreateEmployee}>
      <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Applicant ID</InputLabel>
              <Select
                label="Applicant ID"
                value={applicantId}
                onChange={handleApplicantChange}
                required
              >
                {applicantOptions.map((option) => (
                  <MenuItem key={option.Applicant_ID} value={option.Applicant_ID}>
                    {option.Applicant_ID}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Applicant Name"
              value={applicantName}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
      <TextField
        fullWidth
        label="Date of Joining"
        type="date"
        name="joiningDate"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{ shrink: true }}
      />
    </Grid>
         
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Shift</InputLabel>
              <Select
                label="Shift"
                value={formData.Shift}
                onChange={(e) => setFormData({ ...formData, Shift: e.target.value })}
                inputProps={{
                  readOnly: isReadOnly,
                }}
              >
                {shiftOptions.map((option) => (
                  <MenuItem key={option.Shift_ID} value={option.Shift_ID}>
                    {option.Shift_ID}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Create Employee'}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            {employeeId && (
              <Typography variant="h6">
                Employee ID: {employeeId}
              </Typography>
            )}
          </Grid>
        </Grid>
       
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.First_Name}
              onChange={(e) => setFormData({ ...formData, First_Name: e.target.value })}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Middle Name"
              value={formData.Middle_Name}
              onChange={(e) => setFormData({ ...formData, Middle_Name: e.target.value })}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.Last_Name}
              onChange={(e) => setFormData({ ...formData, Last_Name: e.target.value })}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.Phone_Number}
              onChange={(e) => setFormData({ ...formData, Phone_Number: e.target.value })}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Email ID"
              value={formData.Email_ID}
              onChange={(e) => setFormData({ ...formData, Email_ID: e.target.value })}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Gender"
              value={formData.Gender}
              onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              fullWidth
              label="Date of Birth"
              value={formData.Date_of_Birth}
              onChange={(e) => setFormData({ ...formData, Date_of_Birth: e.target.value })}
              InputProps={{
                readOnly: isReadOnly,
              }}
              InputLabelProps={{
                shrink: !!formData.Date_of_Birth,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              fullWidth
              label="Marital Status"
              value={formData.Marital_Status}
              onChange={(e) => setFormData({ ...formData, Marital_Status: e.target.value })}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              fullWidth
              label="Address"
              value={formData.Address}
              onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
          </Grid>
        </Grid>
      </form>
    </Container>
  );
 
  return <>{renderAddEmployeeForm()}</>;
}
 
export default Applicanttoemployee;
 
 