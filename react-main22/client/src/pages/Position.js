
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
  IconButton,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  FormLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from '@mui/material';
import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Organizational from './Organizational';
 
const PositionModule = () => {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]); // State to hold department data
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ PositionID: '', PositionName: '', DepartmentID: '', RoleDescription: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
 
  useEffect(() => {
    fetchPositions();
    fetchDepartments();
  }, []);
 
  // Fetch positions data from the server
  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/positions');
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };
 
  // Fetch department data from the server
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/departments');
      console.log('Fetched Departments:', response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
 
  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:5001/api/positions', form);
      fetchPositions();
      setForm({ PositionID: '', PositionName: '', DepartmentID: '', RoleDescription: '' });
      setDrawerOpen(false);
      toast.success('Position created successfully');
    } catch (error) {
      console.error('Error adding position:', error);
      toast.error('Error creating position');
    }
  };
 
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/positions/${positionToDelete.PositionID}`);
      fetchPositions();
      setDeleteDialogOpen(false);
      toast.success('Position deleted successfully');
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error('Error deleting position');
    }
  };
 
  const handleEditOpen = (position) => {
    setCurrentPosition(position);
    setEditDialogOpen(true);
  };
 
  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:5001/api/positions/${currentPosition.PositionID}`, currentPosition);
      fetchPositions();
      setEditDialogOpen(false);
      toast.success('Position updated successfully');
    } catch (error) {
      console.error('Error updating position:', error);
      toast.error('Error updating position');
    }
  };
 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
 
  const filteredPositions = positions.filter((position) =>
    position.PositionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.DepartmentID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.RoleDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
    <div>
      <Organizational />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" gutterBottom>
            Positions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AiOutlinePlus />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Position
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: '300px', marginRight: '1rem' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchPositions()}
          >
            Search
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ width: '100%' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell className="table-header" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Position ID</TableCell>
                <TableCell className="table-header" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Position Name</TableCell>
                <TableCell className="table-header" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Department ID</TableCell>
                <TableCell className="table-header" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Role Description</TableCell>
                <TableCell className="table-header" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPositions.map((position) => (
                <TableRow key={position.PositionID}>
                  <TableCell className="table-cell" sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'green' }}>{position.PositionID}</TableCell>
                  <TableCell className="table-cell" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{position.PositionName}</TableCell>
                  <TableCell className="table-cell" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{position.DepartmentID}</TableCell>
                  <TableCell className="table-cell" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{position.RoleDescription}</TableCell>
                  <TableCell className="table-cell">
                    <IconButton color="primary" onClick={() => handleEditOpen(position)}>
                      <AiFillEdit />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => {
                      setPositionToDelete(position);
                      setDeleteDialogOpen(true);
                    }}>
                      <AiFillDelete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 300, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Position
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Position ID</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={form.PositionID}
                onChange={(e) => setForm({ ...form, PositionID: e.target.value })}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Position Name</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={form.PositionName}
                onChange={(e) => setForm({ ...form, PositionName: e.target.value })}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Department ID</FormLabel>
              <Select
                fullWidth
                variant="outlined"
                value={form.DepartmentID}
                onChange={(e) => setForm({ ...form, DepartmentID: e.target.value })}
              >
                {departments.map((department) => (
                  <MenuItem key={department.DepartmentID} value={department.DepartmentID}>
                    {department.DepartmentName} - {department.DepartmentID}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Role Description</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={form.RoleDescription}
                onChange={(e) => setForm({ ...form, RoleDescription: e.target.value })}
              />
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAdd}
            >
              Add
            </Button>
          </Box>
        </Drawer>
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Position</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Position ID</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={currentPosition?.PositionID || ''}
                disabled
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Position Name</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={currentPosition?.PositionName || ''}
                onChange={(e) => setCurrentPosition({ ...currentPosition, PositionName: e.target.value })}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Department ID</FormLabel>
              <Select
                fullWidth
                variant="outlined"
                value={currentPosition?.DepartmentID || ''}
                onChange={(e) => setCurrentPosition({ ...currentPosition, DepartmentID: e.target.value })}
              >
                {departments.map((department) => (
                  <MenuItem key={department.DepartmentID} value={department.DepartmentID}>
                    {department.DepartmentName} - {department.DepartmentID}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Role Description</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={currentPosition?.RoleDescription || ''}
                onChange={(e) => setCurrentPosition({ ...currentPosition, RoleDescription: e.target.value })}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the position "{positionToDelete?.PositionName}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <ToastContainer />
    </div>
  );
};
 
export default PositionModule;
 