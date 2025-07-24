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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Department.css';
import Organizational from './Organizational';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ DepartmentID: '', DepartmentName: '', Description: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:5001/api/departments', {
        DepartmentID: form.DepartmentID,
        DepartmentName: form.DepartmentName,
        Description: form.Description,
      });
      fetchDepartments(); // Fetch departments again after adding
      setForm({ DepartmentID: '', DepartmentName: '', Description: '' });
      setDrawerOpen(false);
      toast.success('Department created successfully');
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error('Error creating department');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/departments/${departmentToDelete.DepartmentID}`);
      fetchDepartments(); // Fetch departments again after deletion
      setDeleteDialogOpen(false);
      toast.success('Department deleted successfully');
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Error deleting department');
    }
  };

  const handleEditOpen = (department) => {
    setCurrentDepartment(department);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:5001/api/departments/${currentDepartment.DepartmentID}`, currentDepartment);
      fetchDepartments(); // Fetch departments again after update
      setEditDialogOpen(false);
      toast.success(' updated successfully');
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error('Error updating department');
    }
  };

  return (
    <div>
      <Organizational />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" gutterBottom>
            Departments
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Department
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell className="table-header" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Department ID</TableCell>
                <TableCell className="table-header" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Department Name</TableCell>
                <TableCell className="table-header" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell className="table-header" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.DepartmentID}>
                  <TableCell className="table-cell" sx={{ fontSize: '1rem', fontWeight: 'bold',color:'green' }}>{department.DepartmentID}</TableCell>
                  <TableCell className="table-cell" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{department.DepartmentName}</TableCell>
                  <TableCell className="table-cell" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{department.Description}</TableCell>
                  <TableCell className="table-cell">
                    <IconButton color="primary" onClick={() => handleEditOpen(department)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => {
                      setDepartmentToDelete(department);
                      setDeleteDialogOpen(true);
                    }}>
                      <DeleteIcon />
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
              Add Department
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Department ID</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={form.DepartmentID}
                onChange={(e) => setForm({ ...form, DepartmentID: e.target.value })}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Department Name</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={form.DepartmentName}
                onChange={(e) => setForm({ ...form, DepartmentName: e.target.value })}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Description</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={form.Description}
                onChange={(e) => setForm({ ...form, Description: e.target.value })}
              />
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAdd}
              sx={{ mt: 2 }}
            >
              Add
            </Button>
          </Box>
        </Drawer>
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Department ID</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={currentDepartment?.DepartmentID || ''}
                onChange={(e) =>
                  setCurrentDepartment({ ...currentDepartment, DepartmentID: e.target.value })
                }
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Department Name</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={currentDepartment?.DepartmentName || ''}
                onChange={(e) =>
                  setCurrentDepartment({ ...currentDepartment, DepartmentName: e.target.value })
                }
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Description</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={currentDepartment?.Description || ''}
                onChange={(e) =>
                  setCurrentDepartment({ ...currentDepartment, Description: e.target.value })
                }
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditSave} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete?"}</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </Container>
    </div>
  );
};

export default Department;

