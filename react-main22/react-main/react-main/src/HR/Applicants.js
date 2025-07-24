
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Container,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  Radio,
  RadioGroup,
  Grid,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
 
import LinearProgress from '@mui/material/LinearProgress';
import { withStyles } from '@mui/styles';
 
import { Search, Edit, Visibility, Close as CloseIcon, Star } from '@mui/icons-material';
import axios from 'axios';
// import './Applicants.css';
 
const Applicants = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [noMatch, setNoMatch] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [interviewMapping, setInterviewMapping] = useState({});
  const [ratings, setRatings] = useState({});
  const [viewDialogOpen, setViewDialogOpen] = useState(false); // State for view dialog
  const [jobDetailsDialogOpen, setJobDetailsDialogOpen] = useState(false);
const [jobDetails, setJobDetails] = useState({});
 
 
  useEffect(() => {
    axios.get('http://localhost:5001/jobpositiondata')
      .then(response => {
        setJobPositions(response.data);
        setFilteredPositions(response.data); // Initially show all positions
      })
      .catch(error => {
        console.error('Error fetching job positions:', error);
      });
  }, []);
 
  const ThickerLinearProgress = withStyles({
    root: {
      height: 20, // Adjust the height here for thickness
      borderRadius: 10, // Optional: adds rounded corners to the bar
    },
    bar: {
      borderRadius: 10, // Optional: adds rounded corners to the bar
    },
  })(LinearProgress);
 
  const handleSearch = () => {
    const filtered = jobPositions.filter(job =>
      job.Job_Position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.Job_ID.toString().includes(searchQuery)
    );
    setFilteredPositions(filtered);
    setNoMatch(filtered.length === 0);
  };
 
  const handleViewJobDetails = (jobId) => {
    axios.get(`http://localhost:5001/jobdetailspopup/${jobId}`)
      .then(response => {
        setJobDetails(response.data);
        setJobDetailsDialogOpen(true);
      })
      .catch(error => {
        console.error('Error fetching job details:', error);
      });
  };
 
 
  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    axios.get(`http://localhost:5001/applicantsbasedonjobposition/${job.Job_ID}`)
      .then(response => {
        setApplicants(response.data);
      })
      .catch(error => {
        console.error('Error fetching applicants:', error);
      });
  };
 
  const handleBack = () => {
    setSelectedJob(null);
    setApplicants([]);
  };
 
  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };
 
  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(applicants.length / rowsPerPage) - 1));
  };
 
  const handleEditClick = (applicant) => {
    setSelectedApplicant(applicant);
    setDrawerOpen(true);
  };
 
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedApplicant(null);
  };
 
  const [qualified, setQualified] = useState('No'); // Add state for radio buttons
 
  const handleQualifiedChange = (event) => {
    setQualified(event.target.value);
  };
 
  const handleUpdate = () => {
    if (!selectedApplicant) return;
 
    const { Applicant_ID, First_Name, Last_Name } = selectedApplicant;
    const { Job_ID } = selectedJob;
    const { Num_Of_Rounds, ...rounds } = interviewMapping;
 
    const roundRatings = {};
    Object.keys(ratings).forEach(round => {
      roundRatings[`${round}_rating`] = ratings[round];
    });
 
    const data = {
      Applicant_ID,
      Applicant_Name: `${First_Name} ${Last_Name}`,
      Job_ID,
      ...rounds,
      ...roundRatings,
      Qualified: qualified
    };
 
    axios.post('http://localhost:5001/insertOrUpdateApplicantTracking', data)
      .then(response => {
        console.log('Applicant tracking updated successfully:', response.data);
        // Optionally, you can handle success feedback or further actions
        setDrawerOpen(false);
        setSelectedApplicant(null);
      })
      .catch(error => {
        console.error('Error updating applicant tracking:', error);
        // Handle error feedback if necessary
      });
  };
 
 
  const fetchInterviewMapping = (jobId) => {
    axios.get(`http://localhost:5001/interviewmappingapplicanttracking/${jobId}`)
      .then(response => {
        const { Num_Of_Rounds, ...mapping } = response.data;
        const initialRatings = {};
        Object.keys(mapping).forEach(round => {
          if (round.startsWith('Round_')) {
            initialRatings[round] = mapping[round];
          }
        });
        setInterviewMapping(response.data);
        setRatings(initialRatings);
      })
      .catch(error => {
        console.error('Error fetching interview mapping:', error);
      });
  };
 
  const handleViewDialogOpen = (applicant) => {
    setSelectedApplicant(applicant);
    setViewDialogOpen(true);
  };
 
  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedApplicant(null);
  };
 
  const renderRatingStars = (round) => {
    const roundRating = ratings[round] || 0;
    return (
      <Box>
        {[...Array(5)].map((_, index) => (
          <IconButton
            key={index}
            onClick={() => handleRatingChange(round, index + 1)}
            color={index < roundRating ? 'primary' : 'default'}
          >
            <Star />
          </IconButton>
        ))}
      </Box>
    );
  };
 
  const handleRatingChange = (round, rating) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [round]: rating,
    }));
  };
 
 
  useEffect(() => {
    if (selectedJob) {
      fetchInterviewMapping(selectedJob.Job_ID);
    }
  }, [selectedJob]);
 
 
  return (
    <div>
      {selectedJob ? (
        <Container>
         
          <Box display="flex" alignItems="center" justifyContent="space-between" my={2}>
            <Typography variant="h4">{selectedJob.Job_Position}</Typography>
            <Button variant="contained" color="primary" onClick={handleBack}>Back</Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant ID</TableCell>
                  <TableCell>Applicant Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email ID</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((applicant) => (
                  <TableRow key={applicant.Applicant_ID}>
                    <TableCell>{applicant.Applicant_ID}</TableCell>
                    <TableCell>{`${applicant.First_Name} ${applicant.Middle_Name ? applicant.Middle_Name + ' ' : ''}${applicant.Last_Name}`}</TableCell>
                    <TableCell>{applicant.Phone_Number}</TableCell>
                    <TableCell>{applicant.Email_ID}</TableCell>
                    <TableCell>{applicant.Gender}</TableCell>
                    <TableCell>{applicant.AppliedDate}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditClick(applicant)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="primary" onClick={() => handleViewDialogOpen(applicant)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" alignItems="center" my={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevPage}
              disabled={page === 0}
            >
              Prev
            </Button>
            <Typography variant="body1" mx={2}>
              {page + 1} / {Math.ceil(applicants.length / rowsPerPage)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPage}
              disabled={page >= Math.ceil(applicants.length / rowsPerPage) - 1}
            >
              Next
            </Button>
          </Box>
 
          <Dialog open={viewDialogOpen} onClose={handleViewDialogClose}>
  <DialogTitle>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h5">Applicant Details</Typography>
      <IconButton onClick={handleViewDialogClose}>
        <CloseIcon />
      </IconButton>
    </Box>
  </DialogTitle>
  <DialogContent dividers>
    <Typography variant="h6">Applicant ID: {selectedApplicant?.Applicant_ID}</Typography>
    <Typography variant="h6">Applicant Name: {`${selectedApplicant?.First_Name} ${selectedApplicant?.Middle_Name ? selectedApplicant.Middle_Name + ' ' : ''}${selectedApplicant?.Last_Name}`}</Typography>
    <Box mt={2}>
      <Typography variant="subtitle1">Progress</Typography>
      <ThickerLinearProgress variant="determinate" value={50} />
      <Typography variant="subtitle1">Number of Rounds Completed: 2</Typography>
    </Box>
  </DialogContent>
</Dialog>;
          <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
            <Box width={400} p={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Edit Applicant Details</Typography>
                <IconButton onClick={handleDrawerClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {selectedApplicant && (
                <form>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Applicant Name"
                    value={`${selectedApplicant.First_Name} ${selectedApplicant.Middle_Name ? selectedApplicant.Middle_Name + ' ' : ''}${selectedApplicant.Last_Name}`}
                    disabled
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Job ID"
                    value={selectedJob.Job_ID}
                    disabled
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Number of Rounds"
                    value={interviewMapping.Num_Of_Rounds}
                    disabled
                  />
                  {Object.keys(interviewMapping).map((round) => (
                    round.startsWith('Round_') && interviewMapping[round] && (
                      <Box key={round} mb={2}>
                        <Typography>{round.replace('_', ' ')}: {interviewMapping[round]}</Typography>
                        {renderRatingStars(round)}
                      </Box>
                    )
                  ))}
                   <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Qualified all the rounds</FormLabel>
                    <RadioGroup
                      aria-label="qualified"
                      name="qualified"
                      value={qualified}
                      onChange={handleQualifiedChange}
                    >
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleUpdate}>
                      Update
                    </Button>
                  </Box>
                </form>
              )}
            </Box>
          </Drawer>
        </Container>
      ) : (
        <Container>
         
          <Box display="flex" alignItems="center" justifyContent="space-between" my={2}>
            <Typography variant="h4">Applicant Tracking</Typography>
            <Box display="flex" alignItems="center">
              <TextField
                variant="outlined"
                label="Search By Job Position"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IconButton color="primary" onClick={handleSearch}>
                <Search />
              </IconButton>
            </Box>
          </Box>
 
          {noMatch && (
            <Typography variant="h6" color="error">No match found</Typography>
          )}
 
          {filteredPositions.map((job, index) => (
            <Paper variant="outlined" key={index} style={{ marginBottom: '16px' }}>
              <Box p={2}>
                <Typography variant="h5">Job Position : {job.Job_Position} (Job ID - {job.Job_ID})</Typography>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                  <Box textAlign="center" flex={1} p={1}>
                    <Typography variant="subtitle1">Number of Applicants</Typography>
                    <Typography>{job.Num_of_Applicants}</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem style={{ backgroundColor: 'black', width: '2px' }} />
                  <Box textAlign="center" flex={1} p={1}>
                    <Typography variant="subtitle1">Number of Openings</Typography>
                    <Typography>{job.Num_of_openings}</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem style={{ backgroundColor: 'black', width: '2px' }} />
                  <Box textAlign="center" flex={1} p={1}>
                    <Typography variant="subtitle1">Last Date to Apply</Typography>
                    <Typography>{job.Last_date}</Typography>
                  </Box>
                 
                  <Divider orientation="vertical" flexItem style={{ backgroundColor: 'black', width: '2px' }} />
          <Box textAlign="center" flex={1} p={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleViewJobDetails(job.Job_ID)}
            >
              View Job Details
            </Button>
          </Box>
                  <Divider orientation="vertical" flexItem style={{ backgroundColor: 'black', width: '2px' }} />
                  <Box textAlign="center" flex={1} p={1}>
                    <Button variant="contained" color="primary" onClick={() => handleViewApplicants(job)}>View Applicants</Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        <Dialog
      open={jobDetailsDialogOpen}
      onClose={() => setJobDetailsDialogOpen(false)}
      maxWidth="xs" // Reduced width
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" style={{ fontWeight: 'bold' }}>
            Job Details
          </Typography>
          <IconButton onClick={() => setJobDetailsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Job Position:</strong> {jobDetails.Job_Position}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Department:</strong> {jobDetails.Department}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Salary:</strong> {jobDetails.Salary}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Description:</strong> {jobDetails.Description}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
        </Container>
      )}
    </div>
  );
};
 
export default Applicants;
 
 