
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Drawer,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  MenuItem,
  Box,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SideBar from '../components/Sidebar/SideBar';
const Interview = () => {
  const [mappings, setMappings] = useState([]);
  const [jobIds, setJobIds] = useState([]);
  const [jobDetails, setJobDetails] = useState({ department: '', position: '' });
 
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({
    jobId: '',
    departmentId: '',
    positionId: '',
    interviewTypeId: '',
    rounds: '',
    roundNames: ['', '', '', '', ''],
  });
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
 
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
 
  useEffect(() => {
    const fetchJobIds = async () => {
      try {
        const response = await axios.get('http://localhost:5001/jobidinterviewmapping');
        setJobIds(response.data);
      } catch (error) {
        console.error('Error fetching job IDs', error);
      }
    };
 
    const fetchMappings = async () => {
      try {
        const response = await axios.get('http://localhost:5001/interviewmappings');
        setMappings(response.data);
      } catch (error) {
        console.error('Error fetching interview mappings', error);
      }
    };
 
    fetchJobIds();
    fetchMappings();
  }, []);
 
  const fetchJobDetails = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:5001/jobidinterviewmapping/${jobId}`);
      setFormData(prevFormData => ({
        ...prevFormData,
        departmentId: response.data.Department,
        positionId: response.data.Job_Position
      }));
    } catch (error) {
      console.error('Error fetching job details', error);
    }
  };
 
 
  const handleClickOpenDrawer = () => {
    setDrawerOpen(true);
  };
 
  const handleClickOpenDialog = async (item) => {
    await fetchJobDetails(item.Job_ID);
    setFormData({
      jobId: item.Job_ID,
      departmentId: item.Department,
      positionId: item.Job_Position,
      interviewTypeId: item.Interview_Type === 'Online Interview' ? '1' : '2',
      rounds: item.Num_Of_Rounds,
      roundNames: [
        item.Round_1 || '',
        item.Round_2 || '',
        item.Round_3 || '',
        item.Round_4 || '',
        item.Round_5 || '',
      ],
    });
    setEditData(item);
    setDialogOpen(true);
  };
 
 
  const handleClose = () => {
    setDrawerOpen(false);
    setDialogOpen(false);
    setDeleteDialogOpen(false);
    setFormData({
      jobId: '',
      departmentId: '',
      positionId: '',
      interviewTypeId: '',
      rounds: '',
      roundNames: ['', '', '', '', ''],
    });
    setEditData(null);
    setDeleteId(null);
  };
 
  const handleSave = async () => {
    const updatedFormData = {
      ...formData,
      rounds: formData.rounds,
      departmentId: jobDetails.department,
      positionId: jobDetails.position,
    };
 
    try {
      await axios.post('http://localhost:5001/interviewmappingvalues', updatedFormData);
      if (editData) {
        setMappings(mappings.map((item) => (item.id === editData.id ? updatedFormData : item)));
        setDialogOpen(false);
      } else {
        setMappings([...mappings, { id: mappings.length + 1, ...updatedFormData }]);
        setDrawerOpen(false);
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving interview mapping', error);
    }
 
    handleClose();
  };
 
 
 
  const handleUpdate = async () => {
    const updatedFormData = {
      ...formData,
      rounds: formData.rounds
    };
 
    try {
      if (editData) {
        await axios.put(`http://localhost:5001/interviewmappings/${editData.Job_ID}`, updatedFormData);
        setMappings(mappings.map((item) => (item.Job_ID === editData.Job_ID ? updatedFormData : item)));
        setDialogOpen(false);
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving interview mapping', error);
    }
 
    handleClose();
  };
 
 
  const handleClickOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };
 
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/interviewmappings/${deleteId}`);
      setMappings(mappings.filter((item) => item.Job_ID !== deleteId));
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting interview mapping', error);
    }
    handleClose();
  };
 
 
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
 
    if (name === 'jobId') {
      try {
        const response = await axios.get(`http://localhost:5001/jobidinterviewmapping/${value}`);
        setJobDetails({
          department: response.data.Department,
          position: response.data.Job_Position,
        });
        setFormData({
          ...formData,
          departmentId: response.data.Department,
          positionId: response.data.Job_Position,
          [name]: value,
        });
      } catch (error) {
        console.error('Error fetching job details', error);
      }
    }
  };
 
  const handleRoundsChange = (e) => {
    const rounds = e.target.value;
    const roundNames = Array(parseInt(rounds, 10)).fill('');
    setFormData({ ...formData, rounds, roundNames });
  };
 
  const handleRoundNameChange = (index, value) => {
    const newRoundNames = [...formData.roundNames];
    newRoundNames[index] = value;
    setFormData({ ...formData, roundNames: newRoundNames });
  };
 
  // Pagination logic
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
 
  const handleNextPage = () => {
    if (currentPage < Math.ceil(mappings.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
 
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return mappings.slice(startIndex, endIndex);
  };
 
  return (


    <div style={{ display: 'flex',width:'100%' }}>
    <div>
      <SideBar />
    </div>
    <Container style={{marginRight:'200px'}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Interview Management</Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <Paper style={{ padding: 20, display: 'flex', justifyContent: 'space-between' }}>
            <div></div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleClickOpenDrawer}
            >
              Add Interview Mapping
            </Button>
          </Paper>
          <TableContainer component={Paper} style={{ marginTop: 20,width:'100' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job ID</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Interview Type</TableCell>
                  <TableCell>Number Of Rounds</TableCell>
                  <TableCell>Interview Stage Labels</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getPaginatedData().map((item) => (
                  <TableRow key={item.Job_ID}>
                    <TableCell>{item.Job_ID}</TableCell>
                    <TableCell>{item.Job_Position}</TableCell>
                    <TableCell>{item.Department}</TableCell>
                    <TableCell>{item.Interview_Type}</TableCell>
                    <TableCell>{item.Num_Of_Rounds}</TableCell>
                    <TableCell>{[item.Round_1, item.Round_2, item.Round_3, item.Round_4, item.Round_5].filter(Boolean).join(', ')}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleClickOpenDialog(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleClickOpenDeleteDialog(item.Job_ID)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Typography>
              Page {currentPage} of {Math.ceil(mappings.length / rowsPerPage)}
            </Typography>
            <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(mappings.length / rowsPerPage)}>
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Drawer anchor="right" open={drawerOpen} onClose={handleClose}>
        <div style={{ width: 400, padding: 20 }}>
          <Typography variant="h6">Add Interview Mapping</Typography>
          <TextField
            select
            label="Job ID"
            name="jobId"
            value={formData.jobId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              },
            }}
          >
            {jobIds.map((job) => (
              <MenuItem key={job.Job_ID} value={job.Job_ID}>
                {job.Job_ID}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Department"
            name="department"
            value={jobDetails.department}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Position"
            name="position"
            value={jobDetails.position}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            select
            label="Interview Type"
            name="interviewTypeId"
            value={formData.interviewTypeId}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="1">Online Interview</MenuItem>
            <MenuItem value="2">Offline Interview</MenuItem>
          </TextField>
          <TextField
            select
            label="Number Of Rounds"
            name="rounds"
            value={formData.rounds}
            onChange={handleRoundsChange}
            fullWidth
            margin="normal"
          >
            {[1, 2, 3, 4, 5].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {formData.rounds &&
            Array.from({ length: parseInt(formData.rounds, 10) }).map((_, index) => (
              <TextField
                key={index}
                label={`Round ${index + 1} Name`}
                name={`round${index + 1}`}
                value={formData.roundNames[index]}
                onChange={(e) => handleRoundNameChange(index, e.target.value)}
                fullWidth
                margin="normal"
              />
            ))}
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </div>
      </Drawer>
      <Dialog open={dialogOpen} onClose={handleClose}>
  <DialogTitle>Edit Interview Mapping</DialogTitle>
  <DialogContent>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="Job ID"
          value={formData.jobId}
          onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Department"
          value={formData.departmentId}
          onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Job Position"
          value={formData.positionId}
          onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Interview Type"
          select
          value={formData.interviewTypeId}
          onChange={(e) => setFormData({ ...formData, interviewTypeId: e.target.value })}
          fullWidth
          margin="normal"
        >
          <MenuItem value="1">Online Interview</MenuItem>
          <MenuItem value="2">Offline Interview</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Number of Rounds"
          type="number"
          value={formData.rounds}
          onChange={(e) => setFormData({ ...formData, rounds: e.target.value })}
          fullWidth
          margin="normal"
        />
      </Grid>
      {formData.roundNames
        .filter((name) => name !== '') // Filter out empty round names
        .map((name, index) => (
          <Grid item xs={6} key={index}>
            <TextField
              label={`Round ${index + 1}`}
              value={name}
              onChange={(e) => {
                const newRoundNames = [...formData.roundNames];
                newRoundNames[index] = e.target.value;
                setFormData({ ...formData, roundNames: newRoundNames });
              }}
              fullWidth
              margin="normal"
            />
          </Grid>
        ))}
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleUpdate} color="primary">
      Update
    </Button>
  </DialogActions>
</Dialog>
 
 
 
       
  {/* Dialog for deleting mapping */}
  <Dialog open={deleteDialogOpen} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this mapping?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleConfirmDelete}>
            Delete
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Action completed successfully"
      />
    </Container>
    </div>
  );
};
 
export default Interview;
 
 