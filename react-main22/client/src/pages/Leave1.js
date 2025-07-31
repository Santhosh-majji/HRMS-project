import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Select, MenuItem, TextField, Dialog,
  DialogActions, DialogContent, DialogTitle, InputLabel, FormControl, Tooltip,
  InputAdornment, Button
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, FilterList as FilterListIcon, Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import SideBar from '../components/Sidebar/SideBar';
import './Leave1.css';

function AdminLeaves() {
  const [leavesData, setLeavesData] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/leave-request')
      .then(response => {
        setLeavesData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave data:', error);
        toast.error('Error fetching leave data.');
      });
  }, []);

  useEffect(() => {
    setCurrentPage(0);
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

    setFilteredData(filtered);
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
            toast.success('Leave deleted successfully.');
          })
          .catch(error => {
            console.error('Error deleting leave:', error);
            toast.error('Failed to delete the leave.');
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
        toast.success('Leave updated successfully.');
      })
      .catch(error => {
        console.error('Error updating leave:', error);
        toast.error('Failed to update the leave.');
      });
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleView = (leave) => {
    setSelectedLeave({ ...leave });
    setViewMode(true);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return { backgroundColor: '#4caf50', color: 'white', borderRadius: '8px', padding: '4px 8px' };
      case 'Rejected':
        return { backgroundColor: '#f44336', color: 'white', borderRadius: '8px', padding: '4px 8px' };
      case 'Pending':
        return { backgroundColor: '#ff9800', color: 'white', borderRadius: '8px', padding: '4px 8px' };
      default:
        return {};
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <SideBar />
      <Container style={{ flex: 1, marginLeft: '45px', padding: 0 }}>
      <Box mt={4} mb={2}  style={{ width: '100%', borderRadius: '10px' }}>
  <Typography variant="h4" component="h1" align="left" gutterBottom>
    Leaves Module
  </Typography>
</Box>


        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <FormControl style={{ minWidth: 200 }}>
            {/* <InputLabel>Status</InputLabel> */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              startAdornment={<FilterListIcon />}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Paper} style={{ width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', fontSize: '18px',width:'150px' }}>Employee ID</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '18px',width:'200px'  }}>Employee Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '18px',width:'150px'  }}>Leave Type</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '18px',width:'150px'  }}>Start Date</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '18px',width:'150px'  }}>End Date</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '18px' ,width:'150px' }}>Reason</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '18px',width:'150px'  }}>Status</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '18px',width:'200px'  }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell style={{fontWeight:'bold',fontSize:'16px'}}>{leave.Username}</TableCell>
                  <TableCell style={{fontWeight:'bold',fontSize:'16px'}}>{leave.EmployeeName}</TableCell>
                  <TableCell style={{fontWeight:'bold',fontSize:'16px'}}>{leave.LeaveType}</TableCell>
                  <TableCell style={{ fontWeight: 'bold',fontSize:'16px' }}>{new Date(leave.StartDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</TableCell>

                  <TableCell style={{ fontWeight: 'bold',fontSize:'16px' }}>{new Date(leave.EndDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</TableCell>

                  <TableCell style={{fontWeight:'bold',fontSize:'16px'}}>{leave.Reason}</TableCell>
                  <TableCell>
                    <span style={getStatusStyle(leave.Status)}>{leave.Status}</span>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEdit(leave)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={() => handleDelete(leave.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View">
                      <IconButton color="default" onClick={() => handleView(leave)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            previousClassName={'previous'}
            nextClassName={'next'}
          />
        </Box>

        <Dialog open={editMode} onClose={() => setEditMode(false)}>
          <DialogTitle>Edit Leave</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Employee ID"
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
              InputLabelProps={{ shrink: true }}
              value={selectedLeave?.StartDate || ''}
              onChange={(e) => setSelectedLeave({ ...selectedLeave, StartDate: e.target.value })}
            />
            <TextField
              margin="dense"
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
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
            <FormControl fullWidth margin="dense">
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
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
            <Button onClick={() => setEditMode(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={viewMode} onClose={() => setViewMode(false)}>
          <DialogTitle>View Leave</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Employee ID"
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
              readOnly
            />
            <TextField
              margin="dense"
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={selectedLeave?.StartDate || ''}
              readOnly
            />
            <TextField
              margin="dense"
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={selectedLeave?.EndDate || ''}
              readOnly
            />
            <TextField
              margin="dense"
              label="Reason"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={selectedLeave?.Reason || ''}
              readOnly
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedLeave?.Status || ''}
                readOnly
              >
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewMode(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default AdminLeaves;

