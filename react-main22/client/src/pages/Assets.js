
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
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
  Drawer,
  TextField,
  Modal,
  Snackbar,
  Alert,
  Pagination
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import Organizational from './Organizational';
import CloseIcon from '@mui/icons-material/Close';
 
const Assets = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shifts, setShifts] = useState([]);
  const [asset, setAsset] = useState([]);
  const [itemsPerPage] = useState(3);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [newAsset, setNewAsset] = useState({
    AssetID: '',
    AssetName: '',
    Category: '',
    Description: ''
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDeleteProject, setConfirmDeleteProject] = useState(null);
  const formRef = useRef(null);
 
  useEffect(() => {
    fetch('http://localhost:5001/organisationassets')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);
 
 
  const rowsPerPage = 3;
 
 
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
 
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
 
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
 
  const handleOpenEditModal = (project) => {
    setSelectedProject(project);
    setEditModalOpen(true);
  };
 
  const handleCloseEditModal = () => {
    setSelectedProject(null);
    setEditModalOpen(false);
  };
 
  const handleOpenViewModal = (applicant) => {
    setSelectedApplicant(applicant);
    setViewModalOpen(true);
  };
 
  const handleCloseViewModal = () => {
    setSelectedApplicant(null);
    setViewModalOpen(false);
  };
 
  const handleOpenDeleteModal = (project) => {
    setConfirmDeleteProject(project);
    setDeleteModalOpen(true);
  };
 
  const handleCloseDeleteModal = () => {
    setConfirmDeleteProject(null);
    setDeleteModalOpen(false);
  };
 
  const handleSave = () => {
    fetch(`http://localhost:5001/organisationassets/${selectedProject.AssetID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedProject)
    })
    .then(response => response.json())
    .then(data => {
      const updatedProjects = projects.map(project => {
        if (project.AssetID === selectedProject.AssetID) {
          return selectedProject;
        }
        return project;
      });
      setProjects(updatedProjects);
      setSelectedProject(null);
      setEditModalOpen(false);
      setSnackbarMessage('Asset updated successfully!');
      setSnackbarOpen(true);
    })
    .catch(error => console.error('Error updating asset:', error));
  };
 
  const handleDelete = () => {
    fetch(`http://localhost:5001/organisationassets/${confirmDeleteProject.AssetID}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      const filteredProjects = projects.filter(p => p.AssetID !== confirmDeleteProject.AssetID);
      setProjects(filteredProjects);
      setConfirmDeleteProject(null);
      setDeleteModalOpen(false);
      setSnackbarMessage('Asset deleted successfully!');
      setSnackbarOpen(true);
    })
    .catch(error => console.error('Error deleting asset:', error));
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
 
  const handleAddAsset = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/organisationassetsadd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newAsset)
    })
    .then(response => response.json())
    .then(data => {
      setProjects(prevProjects => [...prevProjects, newAsset]);
      setNewAsset({
        AssetID: '',
        AssetName: '',
        Category: '',
        Description: ''
      });
      setDrawerOpen(false);
      setSnackbarMessage('Asset added successfully!');
      setSnackbarOpen(true);
    })
    .catch(error => console.error('Error adding asset:', error));
  };
 
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const displayedShifts = asset.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  return (
    <div>
       <Organizational />
   
    <Container>
     
      <Box className="custom-dropdowns-container" display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4" gutterBottom>
          Assets
        </Typography>
        <Box display="flex">
          <TextField variant="outlined" placeholder="Search..." />
          <Button variant="contained">Search</Button>
        </Box>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={() => setDrawerOpen(true)}>+ Add Asset</Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset ID</TableCell>
              <TableCell>Asset Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((project, index) => (
              <TableRow key={index}>
                <TableCell>{project.AssetID}</TableCell>
                <TableCell>{project.AssetName}</TableCell>
                <TableCell>{project.Category}</TableCell>
                <TableCell>{project.Description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenEditModal(project)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleOpenDeleteModal(project)}>
                    <Delete />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleOpenViewModal(project)}>
                    <Visibility />
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
      Page {currentPage} of {Math.ceil(asset.length / rowsPerPage)}
    </Typography>
    <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(asset.length / rowsPerPage)}>
      Next
    </Button>
  </Box>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 350, p: 2 }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ mb: 2 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>Add New Asset</Typography>
          <form onSubmit={handleAddAsset} ref={formRef}>
            <TextField label="Asset ID" name="AssetID" value={newAsset.AssetID} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Asset Name" name="AssetName" value={newAsset.AssetName} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Category" name="Category" value={newAsset.Category} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Description" name="Description" value={newAsset.Description} onChange={handleInputChange} fullWidth margin="normal" />
            <Box mt={2}>
              <Button variant="contained" color="primary" type="submit" fullWidth>Add</Button>
            </Box>
          </form>
        </Box>
      </Drawer>
      <Modal open={editModalOpen} onClose={handleCloseEditModal}>
        <Box sx={{ width: 400, p: 4, margin: 'auto', mt: '10%', backgroundColor: 'white', borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <IconButton onClick={handleCloseEditModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" gutterBottom>Edit Asset Details</Typography>
          <Box display="flex" justifyContent="space-between">
            <TextField
              label="Asset ID"
              value={selectedProject?.AssetID}
              disabled
              margin="normal"
              sx={{ width: '48%' }}
            />
            <TextField
              label="Asset Name"
              value={selectedProject?.AssetName}
              onChange={(e) => setSelectedProject({ ...selectedProject, AssetName: e.target.value })}
              margin="normal"
              sx={{ width: '48%' }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <TextField
              label="Category"
              value={selectedProject?.Category}
              onChange={(e) => setSelectedProject({ ...selectedProject, Category: e.target.value })}
              margin="normal"
              sx={{ width: '48%' }}
            />
            <TextField
              label="Description"
              value={selectedProject?.Description}
              onChange={(e) => setSelectedProject({ ...selectedProject, Description: e.target.value })}
              margin="normal"
              sx={{ width: '48%' }}
            />
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={viewModalOpen} onClose={handleCloseViewModal}>
        <Box sx={{ width: 400, p: 4, margin: 'auto', mt: '10%', backgroundColor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Asset Details</Typography>
          <Typography variant="body1">Asset ID: {selectedApplicant?.AssetID}</Typography>
          <Typography variant="body1">Asset Name: {selectedApplicant?.AssetName}</Typography>
          <Typography variant="body1">Category: {selectedApplicant?.Category}</Typography>
          <Typography variant="body1">Description: {selectedApplicant?.Description}</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleCloseViewModal}>Close</Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <Box sx={{ width: 400, p: 4, margin: 'auto', mt: '10%', backgroundColor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Confirm Delete</Typography>
          <Typography variant="body1">Are you sure you want to delete this asset?</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleDelete}>Delete</Button>
            <Button variant="contained" color="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
    </div>
  );
};
 
export default Assets;
 