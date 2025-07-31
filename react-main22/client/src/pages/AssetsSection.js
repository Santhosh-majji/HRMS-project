
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
 
const personalDetails = [
  { title: 'Asset ID', key: 'AssetID' },
  { title: 'Asset Type', key: 'AssetType' },
  { title: 'Asset Name', key: 'AssetName' },
  { title: 'Category', key: 'AssetCategory' },
  { title: 'Assigned On', key: 'AssignedOn' },
  { title: 'Condition', key: 'CurrentCondition' },
];
 
const AssetSection = () => {
  const [sectionData, setSectionData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [condition, setCondition] = useState('');
  const rowsPerPage = 2;
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/assetsectiondata', {
          headers: {
            Authorization: `Bearer ${document.cookie.split('=')[1]}`,
          },
        });
        if (response.data.success) {
          setSectionData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
 
    fetchData();
  }, []);
 
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(sectionData.length / rowsPerPage)));
  };
 
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
 
  const handleEdit = (row) => {
    setSelectedRow(row);
    setCondition(row.CurrentCondition);
    setModalOpen(true);
  };
 
  const handleUpdate = async () => {
    try {
      const response = await axios.put('http://localhost:5001/updateassetcondition', {
        AssetID: selectedRow.AssetID,
        CurrentCondition: condition,
      }, {
        headers: {
          Authorization: `Bearer ${document.cookie.split('=')[1]}`,
        },
      });
      if (response.data.success) {
        setSectionData((prevData) => prevData.map((item) =>
          item.AssetID === selectedRow.AssetID ? { ...item, CurrentCondition: condition } : item
        ));
        setModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating condition', error);
    }
  };
 
  const displayedAssets = sectionData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
 
  return (
    <Box p={2}>
      <Typography variant="h6" mb={2}>
        My Assets
      </Typography>
      <Container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {personalDetails.map((section, index) => (
                  <TableCell key={index}>{section.title}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedAssets.length > 0 ? (
                displayedAssets.map((row, index) => (
                  <TableRow key={index}>
                    {personalDetails.map((section, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {row[section.key] || 'No Info Yet.'}
                      </TableCell>
                    ))}
                    <TableCell>
                      <IconButton onClick={() => handleEdit(row)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={personalDetails.length + 1}>No Data Available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="emp-asset-pagination" display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Typography mx={2}>
            Page {currentPage} of {Math.ceil(sectionData.length / rowsPerPage)}
          </Typography>
          <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(sectionData.length / rowsPerPage)}>
            Next
          </Button>
        </Box>
      </Container>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 1,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" mb={2}>
            Edit Asset Condition
          </Typography>
          <Grid container spacing={2}>
            {personalDetails.map((detail) => (
              detail.key !== 'CurrentCondition' ? (
                <Grid item xs={6} key={detail.key}>
                  <TextField
                    label={detail.title}
                    value={selectedRow ? selectedRow[detail.key] : ''}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                      disabled: true,
                    }}
                  />
                </Grid>
              ) : (
                <Grid item xs={6} key={detail.key}>
                  <TextField
                    select
                    label={detail.title}
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    fullWidth
                    margin="normal"
                  >
                    {['Excellent', 'Good', 'Fair', 'Poor' , 'Bad'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )
            ))}
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
 
export default AssetSection;
 
 