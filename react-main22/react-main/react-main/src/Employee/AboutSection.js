
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
  Modal,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
 
const sections = [
  { title: 'About Me', key: 'About' },
  { title: 'My Interests', key: 'Interests' },
  { title: 'My Hobbies', key: 'Hobbies' },
  { title: 'What I love in my job', key: 'JobLove' },
  { title: 'Team Insights', key: 'TeamInsights' },
  { title: 'Positive Notes', key: 'PositiveNotes' },
];
 
const AboutSection = () => {
  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [sectionData, setSectionData] = useState({});
 
  useEffect(() => {
    // Fetch data from backend on component mount
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/aboutsectiondata', {
          headers: {
            Authorization: `Bearer ${document.cookie.split('=')[1]}`,
          },
        });
        if (response.data.success) {
          setSectionData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
 
    fetchData();
  }, []);
 
  const handleOpen = (section) => {
    setCurrentSection(section);
    setInputValue(sectionData[section.key] || ''); // Load the existing data if available
    setOpen(true);
  };
 
  const handleClose = () => {
    setOpen(false);
    setCurrentSection(null);
    setInputValue('');
  };
 
  const handleUpdate = async () => {
    // Update the section data with the new input value
    try {
      await axios.put('http://localhost:5001/aboutsectiondata', {
        section: currentSection.key,
        value: inputValue,
      }, {
        headers: {
          Authorization: `Bearer ${document.cookie.split('=')[1]}`,
        },
      });
      setSectionData((prevData) => ({
        ...prevData,
        [currentSection.key]: inputValue,
      }));
      handleClose();
    } catch (error) {
      console.error('Error updating data', error);
    }
  };
 
  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {sections.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box
              display="flex"
              flexDirection="column"
              p={2}
              sx={{
                backgroundColor: '#f0f0f0',
                borderRadius: 1,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">{section.title}</Typography>
                <IconButton color="primary" onClick={() => handleOpen(section)}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Box
                sx={{
                  height: '100px',
                  overflowY: 'auto',
                  p: 1,
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                }}
              >
                <Typography variant="body2" sx={{ height: '100%' }}>
                  {sectionData[section.key] || 'No Info Yet.'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
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
            width: 400,
            outline: 0,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" id="edit-modal-title">{currentSection?.title}</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={10}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            variant="outlined"
            placeholder={`Enter ${currentSection?.title.toLowerCase()} here...`}
            sx={{ overflow: 'auto' }}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
 
export default AboutSection;
 
 