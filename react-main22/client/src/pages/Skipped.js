import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const Skipped = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [skippedData, setSkippedData] = useState([]);
  const [originalData, setOriginalData] = useState([]); // Store original data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [showNoResultsPopup, setShowNoResultsPopup] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5001/skippedData')
      .then(response => {
        setSkippedData(response.data);
        setOriginalData(response.data); // Save original data
        setLoading(false);
        setError(null); // Reset error state
      })
      .catch(error => {
        console.error('Error fetching Skipped data:', error);
        setLoading(false);
        setError('Error fetching data. Please try again.'); // Set error state
      });
  }, []);

  const totalPages = Math.ceil(skippedData.length / itemsPerPage);

  const onPageChange = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = skippedData.slice(indexOfFirstItem, indexOfLastItem);

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = () => {
    const filteredData = originalData.filter(employee => {
      const searchTextLower = searchText.toLowerCase();
      return (
        String(employee.Applicant_ID).toLowerCase().includes(searchTextLower) ||
        employee.Applicant_Name.toLowerCase().includes(searchTextLower)
      );
    });
    setSkippedData(filteredData);
    setShowNoResultsPopup(filteredData.length === 0); // Show no results popup if filteredData is empty
  };

  const handleCancelSearch = () => {
    setSearchText(''); // Clear search text
    setShowNoResultsPopup(false); // Hide no results popup
    setSkippedData(originalData); // Restore original data
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Onboarding Skipped</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          />
          <IconButton onClick={handleSearch} color="primary">
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant ID</TableCell>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Onboarding Date</TableCell>
              <TableCell>Job Position</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email ID</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {error}
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map(employee => (
                <TableRow key={employee.Applicant_ID}>
                  <TableCell>{employee.Applicant_ID}</TableCell>
                  <TableCell>{employee.Applicant_Name}</TableCell>
                  <TableCell>{new Date(employee.Onboarding_Date).toLocaleDateString()}</TableCell>
                  <TableCell>{employee.Job_Position}</TableCell>
                  <TableCell>{employee.Phone_Number}</TableCell>
                  <TableCell>{employee.Email_ID}</TableCell>
                  <TableCell>
                    <Box sx={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: 'orange',
                      color: 'white',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {employee.Status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
        <Typography sx={{ mx: 2 }}>{currentPage} of {totalPages}</Typography>
        <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
      </Box>

      <Dialog open={showNoResultsPopup} onClose={handleCancelSearch}>
        <DialogContent>
          <Typography>No results found</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSearch}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Skipped;
