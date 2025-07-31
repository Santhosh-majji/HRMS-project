import React, { useState, useEffect } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import HRSideBar from '../components/Sidebar/HRSideBar';

const AddEmployee = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [assignedDate, setAssignedDate] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editAssignmentId, setEditAssignmentId] = useState(null);
    const [deleteAssignmentId, setDeleteAssignmentId] = useState(null);

    useEffect(() => {
        fetchClients();
        fetchProjects();
        fetchEmployees();
        fetchAssignments();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/employee_details');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/assignments');
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleShowModal = () => {
        setIsEditing(false);
        setSelectedClientId('');
        setSelectedProjectId('');
        setSelectedEmployeeId('');
        setStartDate('');
        setEndDate('');
        setAssignedDate('');  // Reset assignedDate when opening the modal
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSave = async () => {
        const data = {
            clientId: selectedClientId,
            projectName: selectedProjectName,
            employeeId: selectedEmployeeId,
            startDate,
            endDate,
            assignedDate  // Include assignedDate in the data
        };

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5001/api/assignments/${editAssignmentId}`, data);
            } else {
                await axios.post('http://localhost:5001/api/assignments', data);
            }
            fetchAssignments();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleEdit = (assignment) => {
        setIsEditing(true);
        setEditAssignmentId(assignment.assignmentId);
        setSelectedClientId(assignment.clientId);
        setSelectedProjectId(assignment.projectName);
        setSelectedEmployeeId(assignment.employeeId);
        setStartDate(assignment.startDate);
        setEndDate(assignment.endDate);
        setAssignedDate(assignment.assignedDate);  // Set assignedDate when editing
        setShowModal(true);
    };

    const handleDelete = (assignmentId) => {
        setDeleteAssignmentId(assignmentId);
        setShowDeleteDialog(true);
    };

    const confirmDeleteAssignment = async () => {
        try {
            await axios.delete(`http://localhost:5001/api/assignments/${deleteAssignmentId}`);
            fetchAssignments();
            setShowDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const getClientName = (id) => clients.find(client => client.id === id)?.clientName || 'Unknown Client';
    const getProjectName = (id) => projects.find(project => project.id === id)?.projectName || 'Unknown Project';
    const getEmployeeName = (id) => employees.find(employee => employee.EmployeeID === id)?.EmployeeID || 'Unknown Employee';

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div style={{ display: 'flex' }}>
            <HRSideBar />
            <div style={{width:'100%'}}>
                <h2 style={{fontWeight:'bold'}} >Projects Assign</h2>
                <div style={{ display: 'flex', alignItems: 'center'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleShowModal}
                        style={{ marginLeft: 'auto' }}
                    >
                        Add Employee
                    </Button>
                </div>

                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Client</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Project</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Employee</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Start Date</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>End Date</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Assigned Date</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assignments.map((assignment) => (
                                <TableRow key={assignment.assignmentId}>
                                    <TableCell>{getClientName(assignment.clientId)}</TableCell>
                                    <TableCell>{getProjectName(assignment.projectName)}</TableCell>
                                    <TableCell>{getEmployeeName(assignment.EmployeeID)}</TableCell>
                                    <TableCell>{formatDate(assignment.startDate)}</TableCell>
                                    <TableCell>{formatDate(assignment.endDate)}</TableCell>
                                    <TableCell>{formatDate(assignment.assignedDate)}</TableCell>  {/* Display assignedDate */}
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEdit(assignment)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(assignment.assignmentId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={showModal} onClose={handleCloseModal}>
                    <DialogTitle>{isEditing ? 'Edit Employee Assignment' : 'Add Employee to Project'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            select
                            margin="dense"
                            label="Client"
                            fullWidth
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            style={{ marginTop: '1rem' }}
                        >
                            {clients.map((client) => (
                                <MenuItem key={client.Client_ID} value={client.Client_ID}>
                                    {client.ClientName}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            margin="dense"
                            label="Project"
                            fullWidth
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            style={{ marginTop: '1rem' }}
                        >
                            {projects.map((project) => (
                                <MenuItem key={project.id} value={project.projectName}>
                                    {project.projectName}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            margin="dense"
                            label="Employee"
                            fullWidth
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            style={{ marginTop: '1rem' }}
                        >
                            {employees.map((employee) => (
                                <MenuItem key={employee.EmployeeID} value={employee.EmployeeID}>
                                    {employee.EmployeeID}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            label="Start Date"
                            type="date"
                            fullWidth
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{ marginTop: '1rem' }}
                        />
                        <TextField
                            margin="dense"
                            label="End Date"
                            type="date"
                            fullWidth
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{ marginTop: '1rem' }}
                        />
                        <TextField
                            margin="dense"
                            label="Assigned Date"
                            type="date"
                            fullWidth
                            value={assignedDate}
                            onChange={(e) => setAssignedDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{ marginTop: '1rem' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            {isEditing ? 'Update' : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <p>Are you sure you want to delete this assignment?</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowDeleteDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={confirmDeleteAssignment} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default AddEmployee;
