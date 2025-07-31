import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Snackbar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SideBar from '../components/Sidebar/SideBar';
import Swal from 'sweetalert2';
import './Leave1.css';

const AdminLeaves = () => {
  const [leavesData, setLeavesData] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/leave-request')
      .then(response => {
        setLeavesData(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave data:', error);
      });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leavesData, statusFilter, searchTerm]);

  const applyFilters = () => {
    let filtered = [...leavesData];

    if (statusFilter !== 'All') {
      filtered = filtered.filter(item => item.Status === statusFilter);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.Username.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.EmployeeName.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.LeaveType.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.Reason.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    setLeavesData(filtered);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5001/api/leave-request/${id}`)
          .then(() => {
            const updatedLeavesData = leavesData.filter(item => item.id !== id);
            setLeavesData(updatedLeavesData);
            Swal.fire('Deleted!', 'Your data has been deleted.', 'success');
          })
          .catch(error => {
            console.error('Error deleting leave:', error);
            Swal.fire('Error!', 'Failed to delete the data.', 'error');
          });
      }
    });
  };

  const handleEdit = (leave) => {
    setSelectedLeave({ ...leave });
    setEditMode(true);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5001/api/leave-request/${selectedLeave.id}`, selectedLeave)
      .then(response => {
        const updatedLeavesData = leavesData.map(leave => {
          if (leave.id === selectedLeave.id) {
            return selectedLeave;
          }
          return leave;
        });
        setLeavesData(updatedLeavesData);
        setEditMode(false);
        setSnackbarMessage('Leave updated successfully');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error updating leave:', error);
      });
  };

  const columns = [
    { field: 'Username', headerName: 'EmployeeID', width: 150 },
    { field: 'EmployeeName', headerName: 'Employee Name', width: 200 },
    { field: 'LeaveType', headerName: 'Leave Type', width: 150 },
    { field: 'StartDate', headerName: 'Start Date', width: 150, type: 'date' },
    { field: 'EndDate', headerName: 'End Date', width: 150, type: 'date' },
    { field: 'Reason', headerName: 'Reason', width: 250 },
    { field: 'Status', headerName: 'Status', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <SideBar />
      <Container>
        <h1>Leaves Module</h1>

        <Paper style={{ padding: 20, marginTop: 20 }}>
          <FormControl fullWidth style={{ marginBottom: 20 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            style={{ marginBottom: 20 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={leavesData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        </Paper>

        <Dialog open={editMode} onClose={() => setEditMode(false)}>
          <DialogTitle>Edit Leave</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="EmployeeID"
              type="text"
              fullWidth
              value={selectedLeave?.Username || ''}
              readOnly
            />
            <TextField
              margin="dense"
              label="Employee Name"
              type="text"
              fullWidth
              value={selectedLeave?.EmployeeName || ''}
              readOnly
            />
            <TextField
              margin="dense"
              label="Leave Type"
              type="text"
              fullWidth
              value={selectedLeave?.LeaveType || ''}
              onChange={(e) => setSelectedLeave({ ...selectedLeave, LeaveType: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Start Date"
              type="date"
              fullWidth
              value={selectedLeave?.StartDate || ''}
              onChange={(e) => setSelectedLeave({ ...selectedLeave, StartDate: e.target.value })}
            />
            <TextField
              margin="dense"
              label="End Date"
              type="date"
              fullWidth
              value={selectedLeave?.EndDate || ''}
              onChange={(e) => setSelectedLeave({ ...selectedLeave, EndDate: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Reason"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={selectedLeave?.Reason || ''}
              onChange={(e) => setSelectedLeave({ ...selectedLeave, Reason: e.target.value })}
            />
            <FormControl fullWidth style={{ marginTop: 20 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedLeave?.Status || ''}
                onChange={(e) => setSelectedLeave({ ...selectedLeave, Status: e.target.value })}
              >
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdate} color="primary" variant="contained">
              Update
            </Button>
            <Button onClick={() => setEditMode(false)} color="secondary" variant="contained">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </div>
  );
};

export default AdminLeaves;
