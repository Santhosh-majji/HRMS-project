import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Modal,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmployeeSideBar from '../components/Sidebar/EmployeeSidebar';
import './EmployeeLeave.css';

const EmployeeLeave = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestDetails, setRequestDetails] = useState({
        Username: localStorage.getItem('username') || '',
        EmployeeName: '',
        Status: 'Pending',
        LeaveType: '',
        StartDate: '',
        EndDate: '',
        Reason: ''
    });
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedLeaveType, setSelectedLeaveType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLeave, setSelectedLeave] = useState(null);

    const username = localStorage.getItem('username'); // Get logged-in username

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const fetchLeaveRequests = () => {
        axios.get(`http://localhost:5001/api/leave-request/${username}`)
            .then(response => {
                setLeaveRequests(response.data);
            })
            .catch(error => {
                console.error('Error fetching leave requests:', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const sendLeaveRequestEmail = () => {
        const { EmployeeName, Reason } = requestDetails;

        const emailContent = `Hi Mam,

        I hope this email finds you well. I am writing to inform you that ${EmployeeName} . Therefore, ${EmployeeName} would like to request leave to address ${Reason}.

        Thanks & Regards,
        ${EmployeeName}.`;

        axios.post('http://localhost:5001/api/send-email', {
            EmployeeName: EmployeeName,
            Reason: Reason
        })
        .then(response => {
            console.log('Email sent successfully:', response.data);
        })
        .catch(error => {
            console.error('Error sending email:', error);
        });
    };

    const handleRequestSend = () => {
        const requestData = {
            ...requestDetails,
            Username: username,
            Status: 'Pending'
        };

        axios.post('http://localhost:5001/api/leave-request', requestData)
            .then(response => {
                console.log('Leave request saved in the backend:', response.data);
                fetchLeaveRequests(); // Fetch updated leave requests after adding a new one
                setRequestDetails({
                    Username: username, // Ensure the username is retained in the state
                    EmployeeName: '',
                    LeaveType: '',
                    StartDate: '',
                    EndDate: '',
                    Reason: ''
                });
                setShowRequestModal(false);

                // Call function to send email
                sendLeaveRequestEmail();

                Swal.fire('Success', 'Leave request sent successfully', 'success');
            })
            .catch(error => {
                console.error('Error saving leave request in the backend:', error);
                Swal.fire('Error', 'Failed to send leave request', 'error');
            });
    };

    const handleRequestClick = () => {
        setShowRequestModal(true);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleLeaveTypeChange = (e) => {
        setSelectedLeaveType(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filterLeaveRequests = () => {
        let filteredRequests = leaveRequests;

        if (selectedStatus !== 'All') {
            filteredRequests = filteredRequests.filter(request => request.Status === selectedStatus);
        }

        if (selectedLeaveType !== 'All') {
            filteredRequests = filteredRequests.filter(request => request.LeaveType === selectedLeaveType);
        }

        if (searchTerm) {
            filteredRequests = filteredRequests.filter(request =>
                String(request.Username).toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.EmployeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.Status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.LeaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.Reason.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filteredRequests;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'orange';
            case 'Approved':
                return 'green';
            case 'Rejected':
                return 'red';
            default:
                return 'black'; 
        }
    };

    const handleViewClick = (leave) => {
        setSelectedLeave(leave);
    };

    const closeModal = () => {
        setSelectedLeave(null);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div>
                <EmployeeSideBar />
            </div>
            <Container maxWidth="lg" style={{width:'100%',marginLeft:'30px'}}>
                <div className="heading2">
                    <h1> Leave Management</h1>
                </div>
                <div className="leave-filters">
                    <FormControl variant="outlined" margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" margin="normal">
                        <InputLabel>Leave Type</InputLabel>
                        <Select
                            label="Leave Type"
                            value={selectedLeaveType}
                            onChange={handleLeaveTypeChange}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Annual Leave">sick</MenuItem>
                            <MenuItem value="Sick Leave">casual</MenuItem>
                            <MenuItem value="Maternity Leave">Maternity Leave</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        label="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRequestClick}
                    >
                        Apply Leave
                    </Button>
                </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow style={{fontWeight:'bold',fontSize:'26px'}}>
                                <TableCell style={{fontSize:'16px'}}>Employee ID</TableCell>
                                <TableCell style={{fontSize:'16px'}}>Employee Name</TableCell>
                                <TableCell style={{fontSize:'16px'}}>Status</TableCell>
                                <TableCell style={{fontSize:'16px'}}>Leave Type</TableCell>
                                <TableCell style={{fontSize:'16px'}}>Start Date</TableCell>
                                <TableCell style={{fontSize:'16px'}}>End Date</TableCell>
                                <TableCell style={{fontSize:'16px'}}>Reason</TableCell>
                                <TableCell style={{fontSize:'16px'}}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterLeaveRequests().map((leave, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{fontWeight:'bold'}}>{leave.Username}</TableCell>
                                    <TableCell>{leave.EmployeeName}</TableCell>
                                    <TableCell style={{ color: getStatusColor(leave.Status),fontWeight:'bold' }}>{leave.Status}</TableCell>
                                    <TableCell>{leave.LeaveType}</TableCell>
                                    <TableCell>{new Date(leave.StartDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(leave.EndDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{leave.Reason}</TableCell>
                                    <TableCell>
                                    <Tooltip title="View">
    <IconButton color="default" onClick={() => handleViewClick(leave)}>
        <VisibilityIcon style={{ color: '#333' }} />
    </IconButton>
</Tooltip>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal
                    open={showRequestModal}
                    onClose={() => setShowRequestModal(false)}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <h2>Leave Request</h2>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Employee ID"
                            name="Username"
                            value={requestDetails.Username}
                            onChange={handleInputChange}
                            disabled
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Employee Name"
                            name="EmployeeName"
                            value={requestDetails.EmployeeName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Leave Type"
                            name="LeaveType"
                            value={requestDetails.LeaveType}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Start Date"
                            name="StartDate"
                            type="date"
                            value={requestDetails.StartDate}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="End Date"
                            name="EndDate"
                            type="date"
                            value={requestDetails.EndDate}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Reason"
                            name="Reason"
                            value={requestDetails.Reason}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                        />
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRequestSend}
                            >
                                Send
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setShowRequestModal(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                {selectedLeave && (
                    <Modal
                        open={Boolean(selectedLeave)}
                        onClose={closeModal}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                            }}
                        >
                            <h2>Leave Details</h2>
                            <p><strong>Employee ID:</strong> {selectedLeave.Username}</p>
                            <p><strong>Employee Name:</strong> {selectedLeave.EmployeeName}</p>
                            <p><strong>Status:</strong> {selectedLeave.Status}</p>
                            <p><strong>Leave Type:</strong> {selectedLeave.LeaveType}</p>
                            <p><strong>Start Date:</strong> {new Date(selectedLeave.StartDate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(selectedLeave.EndDate).toLocaleDateString()}</p>
                            <p><strong>Reason:</strong> {selectedLeave.Reason}</p>
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Button variant="contained" onClick={closeModal}>Close</Button>
                            </Box>
                        </Box>
                    </Modal>
                )}
            </Container>
        </div>
    );
};

export default EmployeeLeave;
