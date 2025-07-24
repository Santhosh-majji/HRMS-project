
import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import SideBar from '../components/Sidebar/SideBar';
 
const Notinitiated = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [offerData, setOfferData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    action: '',
    applicantId: null,
  });
 
  useEffect(() => {
    axios.get('http://localhost:5001/offerLettersnotinitiated')
      .then(response => {
        setOfferData(response.data);
        setFilteredData(response.data);
        setLoading(false);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching offer data:', error);
        setLoading(false);
        setError('Error fetching data. Please try again.');
      });
  }, []);
 
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
 
  const onPageChange = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
 
  const handleConfirmationOpen = (action, id) => {
    setConfirmationDialog({ open: true, action, applicantId: id });
  };
 
  const handleConfirmationClose = () => {
    setConfirmationDialog({ open: false, action: '', applicantId: null });
  };
 
  const handleConfirmAction = () => {
    const { action, applicantId } = confirmationDialog;
    let endpoint = '';
 
    if (action === 'initiate') {
      endpoint = 'initiateOnboardingnow';
    } else if (action === 'skip') {
      endpoint = 'skipOnboardingnow';
    } else if (action === 'cancel') {
      endpoint = 'cancelOnboardingnow';
    }
 
    axios.post(`http://localhost:5001/${endpoint}`, { id: applicantId })
      .then(response => {
        const updatedData = offerData.filter(offer => offer.Applicant_ID !== applicantId);
        setOfferData(updatedData);
        setFilteredData(updatedData);
        toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} onboarding successfully`);
        handleConfirmationClose();
      })
      .catch(error => {
        console.error(`Error ${action} onboarding:`, error);
      });
  };
 
  const handleDropdownToggle = (event, id) => {
    setAnchorEl(event.currentTarget);
    setActiveDropdownId(id);
  };
 
  const handleDropdownClose = () => {
    setAnchorEl(null);
    setActiveDropdownId(null);
  };
 
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };
 
  const handleSearch = () => {
    const filteredData = offerData.filter(offer => {
      const applicantIdLower = String(offer.Applicant_ID).toLowerCase();
      return applicantIdLower.includes(searchText.toLowerCase()) ||
             offer.Applicant_Name.toLowerCase().includes(searchText.toLowerCase()) ||
             offer.Job_Position.toLowerCase().includes(searchText.toLowerCase()) ||
             offer.Onboarding_Date.toLowerCase().includes(searchText.toLowerCase());
    });
    setFilteredData(filteredData);
  };
 
  return (
    <div>
      {/* <SideBar/> */}
   
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Onboarding Not Initiated</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          />
          <IconButton onClick={handleSearch} color="primary">
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
 
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant ID</TableCell>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Onboarding Date</TableCell>
              <TableCell>Job Position</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8}>Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8}>Error: {error}</TableCell>
              </TableRow>
            ) : (
              currentItems.map(offer => (
                <TableRow key={offer.Applicant_ID}>
                  <TableCell>{offer.Applicant_ID}</TableCell>
                  <TableCell>{offer.Applicant_Name}</TableCell>
                  <TableCell>{new Date(offer.Onboarding_Date).toLocaleDateString()}</TableCell>
                  <TableCell>{offer.Job_Position}</TableCell>
                  <TableCell>{offer.Phone_Number}</TableCell>
                  <TableCell>{offer.Email_ID}</TableCell>
                  <TableCell>
                  <Box sx={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: 'black',
                      color: 'white',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                    Not initiated
                    </Box>
                    </TableCell>
                    
                  <TableCell>
                    
                    <Box sx={{ position: 'relative' }}>
                      <IconButton onClick={(event) => handleDropdownToggle(event, offer.Applicant_ID)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && activeDropdownId === offer.Applicant_ID}
                        onClose={handleDropdownClose}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                      >
                        <MenuItem onClick={() => handleConfirmationOpen('initiate', offer.Applicant_ID)}>Initiate</MenuItem>
                        <MenuItem onClick={() => handleConfirmationOpen('skip', offer.Applicant_ID)}>Skip</MenuItem>
                        <MenuItem onClick={() => handleConfirmationOpen('cancel', offer.Applicant_ID)}>Cancel</MenuItem>
                      </Menu>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
 
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
        <Typography sx={{ mx: 2 }}>{currentPage} of {totalPages}</Typography>
        <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
      </Box>
 
      <Dialog
        open={confirmationDialog.open}
        onClose={handleConfirmationClose}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {`Confirm ${confirmationDialog.action.charAt(0).toUpperCase() + confirmationDialog.action.slice(1)} Onboarding`}
          <IconButton onClick={handleConfirmationClose} color="primary">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirmationDialog.action} onboarding?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmAction} color="primary">{`${confirmationDialog.action.charAt(0).toUpperCase() + confirmationDialog.action.slice(1)} Onboarding`}</Button>
        </DialogActions>
      </Dialog>
 
      <ToastContainer />
    </Box>
    </div>
  );
};
 
export default Notinitiated;
 
 