import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Organizational from './Organizational';
import './OrganizationDetails.css';
import defaultLogo from './Images/yat.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrganizationDetailsForm = () => {
  const [orgDetails, setOrgDetails] = useState({
    OrganizationName: '',
    Address: '',
    Description: '',
    Contact: '',
    RegistrationNumber: '',
    EstablishedDate: '',
    Founder: '',
    IndustryType: ''
  });

  const [orgLogo, setOrgLogo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchOrganizationDetails();
  }, []);

  const fetchOrganizationDetails = () => {
    axios.get('http://localhost:5001/api/organization')
      .then(response => {
        const data = response.data;
        data.EstablishedDate = data.EstablishedDate.split('T')[0]; // Ensure the date is formatted correctly
        setOrgDetails(data);
      })
      .catch(error => {
        console.error('Error fetching organization details:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrgDetails({ ...orgDetails, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setOrgLogo(file);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    console.log('Delete organization details');
  };

  const handleSubmit = () => {
    axios.post('http://localhost:5001/api/organization', orgDetails)
      .then(response => {
        console.log(response.data);
        setIsEditing(false);
        fetchOrganizationDetails();
        toast.success('Organization details saved successfully!');
      })
      .catch(error => {
        console.error('Error saving organization details:', error);
        toast.error('Failed to save organization details.');
      });
  };

  return (
    <div>
      <Organizational />
      <ToastContainer />
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar
                alt="Organization Logo"
                src={orgLogo ? URL.createObjectURL(orgLogo) : orgDetails.Logo || defaultLogo}
                sx={{ width: 150, height: 150 }}
              />
            </Grid>
            <Grid item>
              <input
                accept="image/*"
                id="logo-upload"
                type="file"
                onChange={handleLogoChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="logo-upload">
                <Button variant="outlined" component="span">
                  Upload Logo
                </Button>
              </label>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                Yatayati Info Solutions Pvt Ltd
              </Typography>
              <Typography variant="subtitle1" style={{fontSize:'20px'}}>
                Software Company
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Tooltip title="Edit">
              <IconButton aria-label="edit" onClick={handleEdit} sx={{ mr: 2, color: 'blue' }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
           
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Organization Name"
                name="OrganizationName"
                value={orgDetails.OrganizationName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="Address"
                value={orgDetails.Address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact"
                name="Contact"
                value={orgDetails.Contact}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration Number"
                name="RegistrationNumber"
                value={orgDetails.RegistrationNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Established Date"
                name="EstablishedDate"
                type="date"
                value={orgDetails.EstablishedDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={!isEditing}
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Founder"
                name="Founder"
                value={orgDetails.Founder}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Industry Type"
                name="IndustryType"
                value={orgDetails.IndustryType}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="Description"
                value={orgDetails.Description}
                onChange={handleInputChange}
                multiline
                rows={4}
                disabled={!isEditing}
                className="custom-textfield"
              />
            </Grid>
          </Grid>
          {isEditing && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default OrganizationDetailsForm;
