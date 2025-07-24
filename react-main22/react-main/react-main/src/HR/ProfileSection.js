
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
  Modal,
  TextField,
  LinearProgress
} from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
 
const personalDetails = [
  { title: 'First Name', key: 'First_Name' },
  { title: 'Last Name', key: 'Last_Name' },
  { title: 'Gender', key: 'Gender' },
  { title: 'Date of Birth', key: 'Date_Of_Birth' },
  { title: 'Marital Status', key: 'Marital_Status' },
  { title: 'Blood Group', key: 'Bloodgroup' },
];
 
const contactDetails = [
  { title: 'Work Email', key: 'Email_ID' },
  { title: 'Personal Email', key: 'Personalemail' },
  { title: 'Phone Number', key: 'Phone_Number' },
  { title: 'Address', key: 'Address' },
];
 
const ProfileSection = () => {
  const [open, setOpen] = useState(false);
  const [currentSections, setCurrentSections] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [sectionData, setSectionData] = useState({});
  const [progress, setProgress] = useState(0);
  const [editType, setEditType] = useState('');
 
  useEffect(() => {
    // Fetch data from backend on component mount
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/profilesectiondata', {
          headers: {
            Authorization: `Bearer ${document.cookie.split('=')[1]}`,
          },
        });
        if (response.data.success) {
          setSectionData(response.data.data);
          calculateProgress(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
 
    fetchData();
  }, []);
 
  const calculateProgress = (data) => {
    const totalLabels = personalDetails.length + contactDetails.length;
    const filledLabels = Object.keys(data).filter(key => data[key]).length;
    setProgress((filledLabels / totalLabels) * 100);
  };
 
  const handleOpen = (sections, type) => {
    setCurrentSections(sections);
    setEditType(type);
    setInputValues(sections.reduce((values, section) => ({
      ...values,
      [section.key]: sectionData[section.key] || ''
    }), {}));
    setOpen(true);
  };
 
  const handleClose = () => {
    setOpen(false);
    setCurrentSections([]);
    setInputValues({});
  };
 
  const handleUpdate = async () => {
    try {
      const updates = currentSections.map(section => ({
        section: section.key,
        value: inputValues[section.key],
      }));
 
      await Promise.all(updates.map(update =>
        axios.put('http://localhost:5001/profilesectiondata', update, {
          headers: {
            Authorization: `Bearer ${document.cookie.split('=')[1]}`,
          },
        })
      ));
 
      setSectionData(prevData => ({
        ...prevData,
        ...inputValues
      }));
      calculateProgress({
        ...sectionData,
        ...inputValues
      });
      handleClose();
    } catch (error) {
      console.error('Error updating data', error);
    }
  };
 
  const handleInputChange = (key, value) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [key]: value
    }));
  };
 
  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Profile Completion ({Math.round(progress)}%)
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={7}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Personal Details</Typography>
            <IconButton color="primary" onClick={() => handleOpen(personalDetails, 'personal')}>
              <EditIcon />
            </IconButton>
          </Box>
          <Box p={2} sx={{ backgroundColor: '#f0f0f0', height: 180 }}>
            <Grid container spacing={2}>
              {personalDetails.map((section, index) => (
                <Grid item xs={6} key={index}>
                  <Typography variant="body1" display="inline" fontWeight="bold">
                    {section.title}:
                  </Typography>
                  <Typography variant="body2" display="inline" ml={1}>
                    {sectionData[section.key] || 'No Info Yet.'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Contact Details</Typography>
            <IconButton color="primary" onClick={() => handleOpen(contactDetails, 'contact')}>
              <EditIcon />
            </IconButton>
          </Box>
          <Box p={2} sx={{ backgroundColor: '#f0f0f0', height: 180 }}>
            <Grid container spacing={2}>
              {contactDetails.map((section, index) => (
                <Grid item xs={12} key={index}>
                  <Typography variant="body1" display="inline" fontWeight="bold">
                    {section.title}:
                  </Typography>
                  <Typography variant="body2" display="inline" ml={1}>
                    {sectionData[section.key] || 'No Info Yet.'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
 
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box
          p={4}
          bgcolor="background.paper"
          borderRadius={1}
          boxShadow={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            outline: 0,
            maxHeight: '80vh',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" id="edit-modal-title">
              {editType === 'personal' ? 'Edit Personal Details' : 'Edit Contact Details'}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            {currentSections.map((section, index) => (
              <Grid item xs={6} key={index}>
                <TextField
                  fullWidth
                  value={inputValues[section.key]}
                  onChange={(e) => handleInputChange(section.key, e.target.value)}
                  variant="outlined"
                  label={section.title}
                />
              </Grid>
            ))}
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mr: 1 }}>
              Update
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
 
export default ProfileSection;
 
 