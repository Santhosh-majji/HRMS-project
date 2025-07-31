import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Pagination,
  Typography
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ProjectManagement = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectIndex, setEditProjectIndex] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteProjectIndex, setDeleteProjectIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);

  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, []);

  const fetchClients = () => {
    axios.get('http://localhost:5001/api/clients')
      .then(response => setClients(response.data))
      .catch(error => console.error('Error fetching clients:', error));
  };

  const fetchProjects = () => {
    axios.get('http://localhost:5001/api/projects')
      .then(response => {
        const formattedProjects = response.data.map(project => ({
          ...project,
          startDate: formatDate(project.startDate),
          endDate: formatDate(project.endDate),
          status: determineStatus(project.startDate, project.endDate)
        }));
        setProjects(formattedProjects);
      })
      .catch(error => console.error('Error fetching projects:', error));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const determineStatus = (start, end) => {
    const currentDate = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (currentDate < startDate) {
      return 'Planned';
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return 'In Progress';
    } else if (currentDate > endDate) {
      return 'Completed';
    }
    return '';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned':
        return 'blue';
      case 'In Progress':
        return 'orange';
      case 'Completed':
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleShowProjectModal = (isEdit = false, index = null) => {
    setIsEditingProject(isEdit);
    setEditProjectIndex(index);
    if (isEdit && index !== null) {
      const project = projects[index];
      setProjectName(project.projectName);
      setProjectDescription(project.projectDescription);
      setProjectManager(project.projectManager);
      setStartDate(project.startDate);
      setEndDate(project.endDate);
      setStatus(project.status);
      setPriority(project.priority);
      setSelectedClient(project.clientId);
    } else {
      setProjectName('');
      setProjectDescription('');
      setProjectManager('');
      setStartDate('');
      setEndDate('');
      setStatus('');
      setPriority('');
      setSelectedClient('');
    }
    setShowProjectModal(true);
  };

  const handleCloseProjectModal = () => setShowProjectModal(false);

  const handleSubmitProject = (event) => {
    event.preventDefault();
    const newProject = {
      projectName,
      projectDescription,
      projectManager,
      startDate,
      endDate,
      status,
      priority,
      clientId: selectedClient
    };

    if (isEditingProject) {
      const projectId = projects[editProjectIndex].id;
      axios.put(`http://localhost:5001/api/projects/${projectId}`, newProject)
        .then(() => {
          fetchProjects();
        })
        .catch(error => console.error('Error updating project:', error));
    } else {
      axios.post('http://localhost:5001/api/projects', newProject)
        .then(() => {
          fetchProjects();
        })
        .catch(error => console.error('Error adding project:', error));
    }
    handleCloseProjectModal();
  };

  const handleDeleteProject = (projectId) => {
    setShowDeleteDialog(true);
    setDeleteProjectIndex(projectId);
  };

  const confirmDeleteProject = () => {
    axios.delete(`http://localhost:5001/api/projects/${deleteProjectIndex}`)
      .then(() => {
        fetchProjects();
      })
      .catch(error => console.error('Error deleting project:', error));
    setShowDeleteDialog(false);
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Project Management</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleShowProjectModal(false)}
        style={{ marginBottom: '20px' }}
      >
        Add Project
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Project Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Manager</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>End Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Priority</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Client</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProjects.map((project, index) => (
              <TableRow key={project.id}>
                <TableCell>{project.projectName}</TableCell>
                <TableCell>{project.projectDescription}</TableCell>
                <TableCell>{project.projectManager}</TableCell>
                <TableCell>{project.startDate}</TableCell>
                <TableCell>{project.endDate}</TableCell>
                <TableCell style={{ color: getStatusColor(project.status) }}>{project.status}</TableCell>
                <TableCell>{project.priority}</TableCell>
                <TableCell>{clients.find(client => client.Client_ID === project.clientId)?.ClientName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleShowProjectModal(true, index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProject(project.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(projects.length / projectsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />

      <Dialog open={showProjectModal} onClose={handleCloseProjectModal}>
        <DialogTitle>{isEditingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Project Manager"
            value={projectManager}
            onChange={(e) => setProjectManager(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            select
            fullWidth
            margin="normal"
          >
            <MenuItem value="Planned">Planned</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
          <TextField
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            select
            fullWidth
            margin="normal"
          >
            {clients.map((client) => (
              <MenuItem key={client.Client_ID} value={client.Client_ID}>
                {client.ClientName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProjectModal} color="secondary">Cancel</Button>
          <Button onClick={handleSubmitProject} color="primary">{isEditingProject ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this project?</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={confirmDeleteProject} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectManagement;
