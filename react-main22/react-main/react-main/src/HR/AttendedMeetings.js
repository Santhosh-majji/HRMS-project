
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box } from '@mui/material';
 
const AttendedMeetings = () => {
  const [attendedMeetings, setAttendedMeetings] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
 
  useEffect(() => {
    fetch('http://localhost:5001/attendedmeetings')
      .then(response => response.json())
      .then(data => setAttendedMeetings(data.data))
      .catch(error => console.error('Error fetching attended meetings:', error));
  }, []);
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 
  return (
    <div>
       
      <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} mb={2}>
        <Typography variant="h4" ml={10}>Attended Meetings</Typography>
        <Link to='/host' style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">Back</Button>
        </Link>
      </Box>
      <TableContainer component={Paper} sx={{ maxWidth: '80%', margin: 'auto' }}>
        <Table aria-label="attended meetings table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? attendedMeetings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : attendedMeetings
            ).map(meeting => (
              <TableRow key={meeting.meetingId}>
                <TableCell>{meeting.name}</TableCell>
                <TableCell>{meeting.startDate}</TableCell>
                <TableCell>{meeting.endDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={2}>
        <Typography variant="caption">
          {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, attendedMeetings.length)} of ${attendedMeetings.length}`}
        </Typography>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={attendedMeetings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          nextIconButtonProps={{ 'aria-label': 'next page' }}
          backIconButtonProps={{ 'aria-label': 'previous page' }}
        />
      </Box>
    </div>
    </div>
  );
};
 
export default AttendedMeetings;
 
 