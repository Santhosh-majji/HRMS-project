import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography
} from '@mui/material';
import { IoMdSave, IoMdClose } from 'react-icons/io';
import { styled } from '@mui/system';

const StyledDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    borderRadius: '15px',
    padding: '20px',
  }
});

const StyledDialogTitle = styled(DialogTitle)({
  background: '#2f3542',
  color: '#fff',
  borderTopLeftRadius: '15px',
  borderTopRightRadius: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const StyledDialogContent = styled(DialogContent)({
  background: '#f1f2f6',
  padding: '20px',
});

const SaveButton = styled(Button)({
  margin: '10px',
  padding: '10px 20px',
  background: '#2f3542',
  color: '#fff',
  '&:hover': {
    background: '#57606f',
  }
});

const CancelButton = styled(Button)({
  margin: '10px',
  padding: '10px 20px',
  background: '#dc3545',
  color: '#fff',
  '&:hover': {
    background: '#c82333',
  }
});

const AddPopup = ({ isVisible, onClose, onAddAttendance }) => {
  const [date, setDate] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleAddClick = () => {
    const newAttendance = {
      date,
      employeeName,
      location,
      checkIn,
      checkOut,
    };

    // Call the parent component function to add the new attendance
    onAddAttendance(newAttendance);

    // Reset the form
    setDate('');
    setEmployeeName('');
    setLocation('');
    setCheckIn('');
    setCheckOut('');

    // Close the dialog
    onClose();
  };

  return (
    <StyledDialog open={isVisible} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        <Typography variant="h6">Edit Details</Typography>
        <IconButton aria-label="close" onClick={onClose} style={{ color: '#fff' }}>
          <IoMdClose />
        </IconButton>
      </StyledDialogTitle>
      <StyledDialogContent dividers>
        <TextField
          fullWidth
          margin="normal"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Check In"
          type="time"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Check Out"
          type="time"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </StyledDialogContent>
      <DialogActions style={{ background: '#f1f2f6', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
        <SaveButton onClick={handleAddClick} startIcon={<IoMdSave />}>
          Save
        </SaveButton>
        <CancelButton onClick={onClose} startIcon={<IoMdClose />}>
          Cancel
        </CancelButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddPopup;
