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
  InputAdornment,
  IconButton,
  Pagination,
  Box,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const ClientManagement = () => {
  const [showClientModal, setShowClientModal] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editClientIndex, setEditClientIndex] = useState(null);
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteClientIndex, setDeleteClientIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    axios.get('http://localhost:5001/api/clients')
      .then(response => setClients(response.data))
      .catch(error => console.error('Error fetching clients:', error));
  };

  const handleShowClientModal = (isEdit = false, index = null) => {
    setIsEditingClient(isEdit);
    setEditClientIndex(index);
    if (isEdit && index !== null) {
      const client = clients[index];
      setClientId(client.Client_ID);
      setClientName(client.ClientName);
      setClientEmail(client.Email);
      setClientPhone(client.PhoneNumber);
      setAddress(client.Address);
      setDescription(client.Description);
    } else {
      setClientId('');
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setAddress('');
      setDescription('');
    }
    setShowClientModal(true);
  };

  const handleCloseClientModal = () => setShowClientModal(false);

  const handleSubmitClient = (event) => {
    event.preventDefault();
    const newClient = { clientName, clientEmail, clientPhone, address, description };

    if (isEditingClient) {
      axios.put(`http://localhost:5001/api/clients/${clientId}`, newClient)
        .then(() => {
          fetchClients();
        })
        .catch(error => console.error('Error updating client:', error));
    } else {
      axios.post('http://localhost:5001/api/clients', newClient)
        .then(() => {
          fetchClients();
        })
        .catch(error => console.error('Error adding client:', error));
    }
    handleCloseClientModal();
  };

  const handleDeleteClient = (clientId) => {
    setShowDeleteDialog(true);
    setDeleteClientIndex(clientId);
  };

  const confirmDeleteClient = () => {
    axios.delete(`http://localhost:5001/api/clients/${deleteClientIndex}`)
      .then(() => {
        fetchClients();
      })
      .catch(error => console.error('Error deleting client:', error));
    setShowDeleteDialog(false);
  };

  const filteredClients = clients.filter(client => {
    const clientName = client.ClientName ? client.ClientName.toLowerCase() : '';
    const clientEmail = client.Email ? client.Email.toLowerCase() : '';
    const clientPhone = client.PhoneNumber ? client.PhoneNumber : '';
    const address = client.Address ? client.Address.toLowerCase() : '';
    const description = client.Description ? client.Description.toLowerCase() : '';

    return clientName.includes(searchTerm.toLowerCase()) ||
      clientEmail.includes(searchTerm.toLowerCase()) ||
      clientPhone.includes(searchTerm) ||
      address.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase());
  });

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Box flex={1}>
          <h1>Clients</h1>
        </Box>
        <Box flex={2} display="flex" justifyContent="center" width={'200px'}>
          <TextField
            variant="outlined"
            placeholder="Search clients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
            // fullWidth
          />
        </Box>
        <Box flex={1} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleShowClientModal(false)}
          >
            Add Client
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table style={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Client ID</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Client Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Phone Number</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Address</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentClients.length > 0 ? (
              currentClients.map((client, index) => (
                <TableRow key={client.Client_ID}>
                  <TableCell>{client.Client_ID}</TableCell>
                  <TableCell>{client.ClientName}</TableCell>
                  <TableCell>{client.Email}</TableCell>
                  <TableCell>{client.PhoneNumber}</TableCell>
                  <TableCell>{client.Address}</TableCell>
                  <TableCell>{client.Description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleShowClientModal(true, index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClient(client.Client_ID)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">No clients found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredClients.length / clientsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />

      <Dialog open={showClientModal} onClose={handleCloseClientModal}>
        <DialogTitle>{isEditingClient ? 'Edit Client' : 'Add Client'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client Email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client Phone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClientModal} color="primary">Cancel</Button>
          <Button onClick={handleSubmitClient} color="primary">{isEditingClient ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>Are you sure you want to delete this client?</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDeleteClient} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClientManagement;
