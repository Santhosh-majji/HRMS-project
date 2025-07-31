import React, { useState, useEffect, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Box, IconButton, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Pagination, AppBar, Toolbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import EmployeeSideBar from '../components/Sidebar/EmployeeSidebar';
import { Link, useLocation } from 'react-router-dom';
import './PreviousProjects.css';

const PreviousProjects = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [open, setOpen] = useState(false);
  const chartRef = useRef(null);
  const itemsPerPage = 7;
  const location = useLocation();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5001/employees');
      const formattedEmployees = response.data
        .filter(employee => new Date(employee.End_Date) < new Date())
        .map(employee => ({
          id: employee.id,
          project: employee.ProjectName,
          client: employee.Client_Name,
          status: "Completed",
          duration: `${new Date(employee.Start_Date).toLocaleDateString()} - ${new Date(employee.End_Date).toLocaleDateString()}`,
          manager: employee.ProjectManager,
          role: "Developer",
          myWork: []
        }));
      setEmployees(formattedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleProjects = filteredEmployees.slice(startIndex, endIndex);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <EmployeeSideBar />

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <AppBar position="static" sx={{ backgroundColor: '#333' }}>
          <Toolbar>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link
                to="/PreviousProjects"
                style={{
                  textDecoration: 'none',
                  color: location.pathname === '/PreviousProjects' ? '#ff4081' : '#fff',
                  padding: '8px 16px',
                  borderBottom: location.pathname === '/PreviousProjects' ? '2px solid #ff4081' : 'none'
                }}
              >
                Previous Projects
              </Link>
              <Link
                to="/OnGoingProjects"
                style={{
                  textDecoration: 'none',
                  color: location.pathname === '/OnGoingProjects' ? '#ff4081' : '#fff',
                  padding: '8px 16px',
                  borderBottom: location.pathname === '/OnGoingProjects' ? '2px solid #ff4081' : 'none'
                }}
              >
                On Going Projects
              </Link>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content area */}
        <Box sx={{ p: 2, overflowY: 'auto' }}>
          <h2>Previous Projects</h2>
          <p>The following are the list of completed projects and their details.</p>

          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <TextField
              label="Search Projects"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton onClick={() => setCurrentPage(1)}>
              <SearchIcon />
            </IconButton>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>PROJECT</TableCell>
                  <TableCell>CLIENT</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>DURATION</TableCell>
                  <TableCell>PROJECT MANAGER</TableCell>
                  <TableCell>MY ROLE</TableCell>
                  <TableCell>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleProjects.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell onClick={() => handleProjectClick(data)} style={{ cursor: 'pointer' }}>{data.project}</TableCell>
                    <TableCell>{data.client}</TableCell>
                    <TableCell>{data.status}</TableCell>
                    <TableCell>{data.duration}</TableCell>
                    <TableCell>{data.manager}</TableCell>
                    <TableCell>{data.role}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleProjectClick(data)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        </Box>
      </Box>

      {selectedProject && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Project Details</DialogTitle>
          <DialogContent>
            <div>
              <p><strong>Project:</strong> {selectedProject.project}</p>
              <p><strong>Client:</strong> {selectedProject.client}</p>
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>Duration:</strong> {selectedProject.duration}</p>
              <p><strong>Project Manager:</strong> {selectedProject.manager}</p>
              <p><strong>My Role:</strong> {selectedProject.role}</p>
              <h4>My Work</h4>
              <ul>
                {selectedProject.myWork.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default PreviousProjects;
