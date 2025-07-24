import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../components/Sidebar/SideBar';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  Grid,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Bloodtype as BloodtypeIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  AccountCircle as ProfileIcon,
  WorkOutline as JobIcon,
  Receipt as AssetsIcon,
  CameraAltOutlined as CameraIcon,
} from '@mui/icons-material';
import AboutSection from './AboutSection';
import ProfileSection from './ProfileSection';
import JobSection from './JobSection';
import AssetsSection from './AssetsSection';
 
const HRProfile = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('About');
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
 
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = document.cookie.split('=')[1];
        const response = await axios.get('http://localhost:5001/employeeprofile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setEmployeeDetails(response.data.employee);
        }
      } catch (error) {
        console.error('Error fetching employee details', error);
      }
    };
 
    fetchEmployeeDetails();
  }, []);
 
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
 
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_pic', file);
 
      try {
        const token = document.cookie.split('=')[1];
        const response = await axios.post('http://localhost:5001/uploadprofilepic', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          // Assuming profilePicPath is the filename returned
          setImage(`http://localhost:5001/profilepicture/${response.data.profilePicPath}`);
        }
      } catch (error) {
        console.error('Error uploading image', error);
      }
    }
  };
 
 
  const handleConfirmDelete = async () => {
    try {
      const token = document.cookie.split('=')[1];
      const response = await axios.post('http://localhost:5001/deleteprofilepic', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setImage(null); // Clear the uploaded image
        setDeleteConfirmationOpen(false); // Close the confirmation dialog
      }
    } catch (error) {
      console.error('Error deleting image', error);
    }
  };
 
 
  const handleCameraClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
 
  const handleDeleteImage = () => {
    setDeleteConfirmationOpen(true);
    setAnchorEl(null); // Close the menu
  };
 
 
 
  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false); // Close the confirmation dialog
  };
 
  const handleMouseEnter = () => {
    setShowCamera(true);
  };
 
  const handleMouseLeave = () => {
    setShowCamera(false);
  };
 
  const getNavItemStyles = (section) => ({
    cursor: 'pointer',
    backgroundColor: currentSection === section ? 'white' : 'inherit',
    color: currentSection === section ? 'primary.main' : 'inherit',
    borderRadius: '8px',
    padding: '8px 16px',
    '&:hover': {
      backgroundColor: currentSection === section ? 'white' : 'action.hover',
    },
  });
 
  const employeeInfo = [
    { icon: <PersonIcon />, text: employeeDetails.EmployeeID || 'No Info Yet' },
    { icon: <PhoneIcon />, text: employeeDetails.Phone_Number || 'No Info Yet' },
    { icon: <EmailIcon />, text: employeeDetails.Email_ID || 'No Info Yet' },
    { icon: <WorkIcon />, text: employeeDetails.Job_Position || 'No Info Yet' },
    { icon: <BusinessIcon />, text: employeeDetails.Department || 'No Info Yet' },
    { icon: <LocationIcon />, text: employeeDetails.Address || 'No Info Yet' },
    { icon: <BloodtypeIcon />, text: employeeDetails.Bloodgroup || 'No Info Yet' },
  ];
 
  return (
    <Box display="flex">
      <SideBar />
      <Box
        sx={{
          flexGrow: 1,
          transition: 'margin-left 0.3s',
        }}
      >
        {/* HR Profile Content */}
        <Box p={2}>
          <Grid
            container
            alignItems="center"
            spacing={2}
            sx={{ width: '100%', position: 'relative' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Grid item sx={{ position: 'relative', width: 200, height: 200 }}>
              <label
                htmlFor="image-upload-input"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: '#f0f0f0', // Placeholder background color
                  position: 'relative',
                }}
              >
                {image ? (
                 <img
                 src={image || 'http://localhost:5001/profilepicture/default.png'} // Fallback to default if no image
                 alt="Profile"
                 style={{
                   width: '100%',
                   height: '100%',
                   objectFit: 'cover',
                   borderRadius: '50%',
                 }}
               />
               
                ) : (
                  <PersonIcon
                    sx={{
                      width: '100%',
                      height: '100%',
                      color: '#666', // Placeholder icon color
                    }}
                  />
                )}
                {!image && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                   
                  </Box>
                )}
               <input
  id="image-upload-input"
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  style={{ display: 'none' }}
/>
 
                {showCamera && image && (
                  <IconButton
                    onClick={handleCameraClick}
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '50%',
                    }}
                  >
                    <CameraIcon />
                  </IconButton>
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  sx={{
                    position: 'absolute',
                    bottom: -28,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderRadius: 8,
                  }}
                >
                  <MenuItem onClick={handleDeleteImage}>Delete Picture</MenuItem>
                  <MenuItem onClick={() => document.getElementById('image-upload-input').click()}>Change Picture</MenuItem>
 
                </Menu>
              </label>
            </Grid>
            <Grid item xs={8}>
              <Box>
                <Typography variant="h5" align="center" sx={{ mt: -1 }}>
                  {employeeDetails.EmployeeName || 'No Info Yet'}
                </Typography>
                <Box mt={3}>
                  <Grid container spacing={2}>
                    {employeeInfo.map((info, index) => (
                      <Grid item xs={4} key={index}>
                        <Box display="flex" alignItems="center">
                          {info.icon}
                          <Typography variant="body2" sx={{ fontSize: '1rem', marginLeft: 1 }}>
                            {info.text}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                    <Grid item xs={4}>
                      <Box display="flex" alignItems="center">
                        <BadgeIcon sx={{ marginRight: 1 }} />
                        <Button onClick={toggleDrawer(true)} sx={{ fontSize: '1rem' }}>
                          ID Card
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* Drawer for ID Card */}
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box p={2} sx={{ width: 370 }} role="presentation">
              <IconButton onClick={toggleDrawer(false)} sx={{ float: 'right' }}>
                <CloseIcon />
              </IconButton>
              <Box display="flex" justifyContent="center" mb={2}>
                {image ? (
                  <Box
                    component="img"
                    src={image}
                    alt="Image"
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <PersonIcon
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </Box>
              <Typography variant="h6" align="center">
                {employeeDetails.EmployeeName || 'No Info Yet'}
              </Typography>
              <Box mt={3}>
                <Grid container spacing={2}>
                  {employeeInfo.map((info, index) => (
                    <Grid item xs={12} key={index}>
                      <Box display="flex" alignItems="center">
                        {info.icon}
                        <Typography variant="body2" sx={{ marginLeft: 1 }}>
                          {info.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Drawer>
          {/* HR Profile Sections */}
          <Box>
            <AppBar position="static" color="primary">
              <Toolbar>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      onClick={() => setCurrentSection('About')}
                      sx={getNavItemStyles('About')}
                      startIcon={<InfoIcon />}
                    >
                      About
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      onClick={() => setCurrentSection('Profile')}
                      sx={getNavItemStyles('Profile')}
                      startIcon={<ProfileIcon />}
                    >
                      Profile
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      onClick={() => setCurrentSection('Job')}
                      sx={getNavItemStyles('Job')}
                      startIcon={<JobIcon />}
                    >
                      Job
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      onClick={() => setCurrentSection('Assets')}
                      sx={getNavItemStyles('Assets')}
                      startIcon={<AssetsIcon />}
                    >
                      Assets
                    </Button>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
            <Box>
              {currentSection === 'About' && <AboutSection />}
              {currentSection === 'Profile' && <ProfileSection />}
              {currentSection === 'Job' && <JobSection />}
              {currentSection === 'Assets' && <AssetsSection />}
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>{"Delete Picture"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this picture?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
 
export default HRProfile;
 