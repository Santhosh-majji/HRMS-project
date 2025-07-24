import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    IconButton,
    Tooltip,
    Modal,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment
} from '@mui/material';
import { MdEdit, MdDelete, MdAddCircle, MdSearch } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Organizational from './Organizational';
import Grid from '@mui/material/Grid';

const WeekOffForm = () => {
    const [weekOffs, setWeekOffs] = useState([]);
    const [filteredWeekOffs, setFilteredWeekOffs] = useState([]);
    const [currentWeekOff, setCurrentWeekOff] = useState({ days: [], description: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const storedWeekOffs = JSON.parse(localStorage.getItem('weekOffs'));
        if (storedWeekOffs) {
            setWeekOffs(storedWeekOffs);
            setFilteredWeekOffs(storedWeekOffs);
        } else {
            fetchWeekOffs();
        }
    }, []);

    const fetchWeekOffs = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/Weekoffs');
            setWeekOffs(response.data);
            setFilteredWeekOffs(response.data);
            localStorage.setItem('weekOffs', JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching week offs:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentWeekOff({ ...currentWeekOff, [name]: value });
    };

    const handleDaysChange = (event) => {
        const { value } = event.target;
        setCurrentWeekOff({ ...currentWeekOff, days: value });
    };

    const handleAddWeekOff = () => {
        setIsModalOpen(true);
        setIsEditing(false);
        setCurrentWeekOff({ days: [], description: '' });
    };

    const handleEditWeekOff = (index) => {
        setIsEditing(true);
        setCurrentEditIndex(index);
        setCurrentWeekOff(filteredWeekOffs[index]);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!currentWeekOff.days.length || !currentWeekOff.description) {
            toast.error('Please fill in all fields.');
            return;
        }

        const updatedWeekOffs = [...weekOffs];
        if (isEditing) {
            try {
                await axios.put(`http://localhost:5001/api/Weekoffs/${filteredWeekOffs[currentEditIndex].id}`, currentWeekOff);
                updatedWeekOffs[currentEditIndex] = currentWeekOff;
                toast.success('Week off updated successfully!');
            } catch (error) {
                console.error('Error updating week off:', error);
                toast.error('Error updating week off.');
            }
        } else {
            try {
                const response = await axios.post('http://localhost:5001/api/Weekoffs', currentWeekOff);
                updatedWeekOffs.push(response.data);
                toast.success('Week off added successfully!');
            } catch (error) {
                console.error('Error adding week off:', error);
                toast.error('Error adding week off.');
            }
        }

        setWeekOffs(updatedWeekOffs);
        setFilteredWeekOffs(updatedWeekOffs);
        localStorage.setItem('weekOffs', JSON.stringify(updatedWeekOffs));
        setIsModalOpen(false);
        setCurrentWeekOff({ days: [], description: '' });
    };

    const handleDeleteWeekOff = async () => {
        try {
            await axios.delete(`http://localhost:5001/api/Weekoffs/${filteredWeekOffs[deleteIndex].id}`);
            const updatedWeekOffs = filteredWeekOffs.filter((_, i) => i !== deleteIndex);
            setWeekOffs(updatedWeekOffs);
            setFilteredWeekOffs(updatedWeekOffs);
            localStorage.setItem('weekOffs', JSON.stringify(updatedWeekOffs));
            toast.success('Week off deleted successfully!');
        } catch (error) {
            console.error('Error deleting week off:', error);
            toast.error('Error deleting week off.');
        }

        setIsDeleteDialogOpen(false);
    };

    const handleDeleteDialogOpen = (index) => {
        setDeleteIndex(index);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setIsDeleteDialogOpen(false);
        setDeleteIndex(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentWeekOff({ days: [], description: '' });
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredWeekOffs(weekOffs.filter(weekOff =>
            weekOff.days.join(', ').toLowerCase().includes(query) ||
            weekOff.description.toLowerCase().includes(query)
        ));
    };

    return (
        <div>
            <Organizational />
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Manage Week Offs
                    </Typography>
                    <Grid container justifyContent="space-between">
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MdSearch />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<MdAddCircle style={{ fontSize: 24 }} />}
                                onClick={handleAddWeekOff}
                                style={{ textTransform: 'none' }}
                            >
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }}>Days</TableCell>
                                <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }}>Description</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredWeekOffs.map((weekOff, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }}>{weekOff.days.join(', ')}</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }}>{weekOff.description}</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                        <Tooltip title="Edit">
                                            <IconButton aria-label="edit" onClick={() => handleEditWeekOff(index)} style={{ color: 'blue' }}>
                                                <MdEdit style={{ fontSize: 24 }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton aria-label="delete" onClick={() => handleDeleteDialogOpen(index)} style={{ color: 'red' }}>
                                                <MdDelete style={{ fontSize: 24 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Modal
                    open={isModalOpen}
                    onClose={handleCancel}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={{ ...modalStyle, width: 400 }}>
                        <Typography id="modal-title" variant="h6" component="h2">
                            {isEditing ? 'Edit Week Off' : 'Add Week Off'}
                        </Typography>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="days-label">Days</InputLabel>
                            <Select
                                labelId="days-label"
                                id="days"
                                multiple
                                value={currentWeekOff.days}
                                onChange={handleDaysChange}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                    <MenuItem key={day} value={day}>
                                        {day}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={currentWeekOff.description}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                            sx={{ mt: 2 }}
                        />
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                <Dialog
                    open={isDeleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                >
                    <DialogTitle>{"Delete Week Off"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this week off?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteWeekOff} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                <ToastContainer />
            </Container>
        </div>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default WeekOffForm;

