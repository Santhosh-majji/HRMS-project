
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRPerformance from './HRPerformance';
import {
  Box,
  Button,
  Typography,
  Container,
  TextField,
  IconButton,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
 
function DirectReportsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teamNames, setTeamNames] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [highlightedTeam, setHighlightedTeam] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [givenBy, setGivenBy] = useState('');
  const [comment, setComment] = useState('');
  const [communicationRating, setCommunicationRating] = useState(0);
  const [teamworkRating, setTeamworkRating] = useState(0);
  const [meetingDeadlinesRating, setMeetingDeadlinesRating] = useState(0);
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [leadershipRating, setLeadershipRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [quickAction, setQuickAction] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
 
  const quickActions = [
    { id: 1, name: 'Proficient', icon: '🌟' },
    { id: 2, name: 'Adequate', icon: '✔️' },
    { id: 3, name: 'Potential for Improvement', icon: '🔧' },
  ];
 
  const iconColor = '#a6d5f4';
 
  useEffect(() => {
    fetchTeamNames();
  }, []);
 
  const fetchTeamNames = () => {
    axios.get('http://localhost:5001/feedbackemployeenames')
      .then(response => {
        setTeamNames(response.data);
      })
      .catch(error => {
        console.error('Error fetching team names:', error);
      });
  };
 
  const handleRatingChange = (setter, rating) => {
    setter(rating);
  };
 
  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setShowFeedback(true);
  };
 
  const handleHighlight = (team) => {
    setHighlightedTeam(team);
  };
 
  const handleQuickActionChange = (event) => {
    setQuickAction(event.target.value);
  };
 
  const handleSubmitFeedback = () => {
    const feedbackData = {
      EmployeeName: selectedTeam.EmployeeName,
      Username: selectedTeam.EmployeeID,
      Communication: communicationRating,
      Teamwork: teamworkRating,
      Meetingdeadlines: meetingDeadlinesRating,
      Punctuality: punctualityRating,
      Leadership: leadershipRating,
      Overallrating: overallRating,
      Givenby: givenBy,
      Quickaction: quickAction,
      Comment: comment
    };
 
    axios.post('http://localhost:5001/continuousfeedback', feedbackData)
      .then(response => {
        console.log('Feedback submitted successfully:', response.data);
        setSnackbarMessage('Feedback submitted successfully');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        // Clear the form
        setCommunicationRating(0);
        setTeamworkRating(0);
        setMeetingDeadlinesRating(0);
        setPunctualityRating(0);
        setLeadershipRating(0);
        setOverallRating(0);
        setGivenBy('');
        setQuickAction('');
        setComment('');
        setSelectedTeam(null);
        setShowFeedback(false);
      })
      .catch(error => {
        console.error('Error submitting feedback:', error);
        setSnackbarMessage('Failed to submit feedback');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };
 
  const filteredTeamNames = teamNames.filter(team =>
    team.EmployeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.EmployeeID.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
 
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box mb={4} style={{ maxHeight: 'calc(110vh - 0px)', overflowY: 'auto' }}>
            <Typography variant="h5" gutterBottom>My Team</Typography>
            <TextField
              fullWidth
              label="Search Team"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              margin="normal"
            />
            <Paper>
              <Box p={2}>
                <Grid container spacing={2}>
                  {filteredTeamNames.length > 0 ? (
                    filteredTeamNames.map((team) => (
                      <Grid item xs={12} key={team.EmployeeID}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleTeamClick(team)}
                          onMouseOver={() => handleHighlight(team.EmployeeName)}
                          onMouseOut={() => handleHighlight(null)}
                          style={{
                            backgroundColor: highlightedTeam === team.EmployeeName ? '#f0f0f0' : 'transparent',
                          }}
                        >
                          {team.EmployeeName}
                        </Button>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">No match found</Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedTeam && showFeedback ? (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedTeam.EmployeeName}'s Feedback</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Box mt={1}>
                    <Typography variant="h6">Rate the employee</Typography>
                    <Box my={1}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
                          <Typography>Communication:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IconButton key={star} onClick={() => handleRatingChange(setCommunicationRating, star)}>
                                {star <= communicationRating ? <Star color="primary" /> : <StarBorder />}
                              </IconButton>
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box my={1}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
                          <Typography>Team Work:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IconButton key={star} onClick={() => handleRatingChange(setTeamworkRating, star)}>
                                {star <= teamworkRating ? <Star color="primary" /> : <StarBorder />}
                              </IconButton>
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box my={1}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
                          <Typography>Meeting Deadlines:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IconButton key={star} onClick={() => handleRatingChange(setMeetingDeadlinesRating, star)}>
                                {star <= meetingDeadlinesRating ? <Star color="primary" /> : <StarBorder />}
                              </IconButton>
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box my={1}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
                          <Typography>Punctuality:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IconButton key={star} onClick={() => handleRatingChange(setPunctualityRating, star)}>
                                {star <= punctualityRating ? <Star color="primary" /> : <StarBorder />}
                              </IconButton>
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box my={1}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
                          <Typography>Leadership:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IconButton key={star} onClick={() => handleRatingChange(setLeadershipRating, star)}>
                                {star <= leadershipRating ? <Star color="primary" /> : <StarBorder />}
                              </IconButton>
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box my={1}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
                          <Typography>Overall Rating:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IconButton key={star} onClick={() => handleRatingChange(setOverallRating, star)}>
                                {star <= overallRating ? <Star color="primary" /> : <StarBorder />}
                              </IconButton>
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Given by"
                        value={givenBy}
                        onChange={(e) => setGivenBy(e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box my={2}>
                        <Typography variant="subtitle1">Quick Actions</Typography>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Select one</FormLabel>
                          <RadioGroup
                            value={quickAction}
                            onChange={handleQuickActionChange}
                          >
                            {quickActions.map((action) => (
                              <FormControlLabel
                                key={action.id}
                                value={action.name}
                                control={<Radio />}
                                label={
                                  <Box display="flex" alignItems="center">
                                    <span style={{ color: iconColor, marginRight: '8px' }}>{action.icon}</span>
                                    {action.name}
                                  </Box>
                                }
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Comment"
                    multiline
                    rows={6}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitFeedback}
                  >
                    Submit Feedback
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box mt={4}>
              <Typography variant="h6" color="textSecondary">Please select an employee to give feedback</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
 
function ContinuousFeedback() {
  return (
    <Box>
      <Box mb={4}>
        <HRPerformance />
      </Box>
      <Container>
        <DirectReportsContent />
      </Container>
    </Box>
  );
}
 
export default ContinuousFeedback;
 
 