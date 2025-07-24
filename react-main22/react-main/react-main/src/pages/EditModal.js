import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const EditModal = ({ open, handleClose, row, handleSave }) => {
  const [formData, setFormData] = React.useState(row);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    handleSave(formData);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ width: 400, margin: '100px auto', padding: 4, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h6" component="h2">Edit Row</Typography>
        <TextField label="Date" name="date" value={formData.date} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Check In" name="Check_In" value={formData.Check_In} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Status" name="Status" value={formData.Status} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Username" name="Username" value={formData.Username} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Check Out" name="Check_Out" value={formData.Check_Out} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Working Hours" name="Working_hours" value={formData.Working_hours} onChange={handleChange} fullWidth margin="normal" />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button onClick={handleClose} sx={{ marginRight: 1 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
