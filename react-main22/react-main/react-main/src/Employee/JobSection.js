
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
} from '@mui/material';
import axios from 'axios';
 
const personalDetails = [
  { title: 'Job Title', key: 'Job_Position' },
  { title: 'Department', key: 'Department' },
  { title: 'Date of Joining', key: 'Joining_Date' },
  { title: 'Shift ID', key: 'Shift_ID' },
  { title: 'Shift Start Time', key: 'StartTime' },
  { title: 'Shift End Time', key: 'EndTime' },
];
 
const contactDetails = [
  { title: 'Organization Name', key: 'OrganizationName' },
  { title: 'Description', key: 'Description' },
  { title: 'Contact Number', key: 'Contact' },
  { title: 'Address', key: 'Address' },
];
 
const JobSection = () => {
  const [open, setOpen] = useState(false);
  const [sectionData, setSectionData] = useState({});
  const [progress, setProgress] = useState(0);
  const [editType, setEditType] = useState('');
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/jobsectiondata', {
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
 
  return (
    <Box p={2}>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Job Details</Typography>
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
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Organization Details</Typography>
          </Box>
          <Box p={2} sx={{ backgroundColor: '#f0f0f0', height: 180, overflowY: 'auto' }}>
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
    </Box>
  );
};
 
export default JobSection;
 
 