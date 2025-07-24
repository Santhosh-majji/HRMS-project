
import React, { useState, useEffect } from "react";
import axios from "axios";
 
import {
  Box,
  Button,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Link } from "react-router-dom";
import { Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

export const Home = () => {
  const [name, setName] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [duration, setDuration] = useState("30");
  const [datetime, setDatetime] = useState("");
  const [applicantId, setApplicantId] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [jobId, setJobId] = useState("");
  const [roundName, setRoundName] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [interviewerNames, setInterviewerNames] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [applicants, setApplicants] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [viewMeeting, setViewMeeting] = useState(null); 
 
  const rowsPerPage = 2;
 
  useEffect(() => {
    fetchMeetings();
    fetchInterviewDetails();
    fetchApplicants();
    fetchInterviewerNames();
    const interval = setInterval(fetchMeetings, 30000);
    return () => clearInterval(interval);
  }, []);
 
  const fetchMeetings = async () => {
    try {
      const response = await fetch("http://localhost:5001/host");
      const responseData = await response.json();
      if (responseData.success) {
        const meetingsData = responseData.data;
        setMeetings(meetingsData);
      } else {
        console.error("Error fetching host data:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };
 
 
  const fetchInterviewDetails = async () => {
    try {
      const response = await fetch("http://localhost:5001/interview-details");
      const responseData = await response.json();
      if (responseData.success) {
        const interviewData = responseData.data;
        setInterviewDetails(interviewData);
      } else {
        console.error("Error fetching interview details:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };
  const fetchApplicants = async () => {
    try {
      const response = await axios.get("http://localhost:5001/applicantsinterview");
      if (response.data.success) {
        setApplicants(response.data.data);
      } else {
        console.error("Error fetching applicants data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching applicants data:", error);
    }
  };
 
  const fetchInterviewerNames = async () => {
    try {
      const response = await axios.get("http://localhost:5001/interviewernames");
      if (response.data.success) {
        setInterviewerNames(response.data.data);
      } else {
        console.error("Error fetching interviewer names:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching interviewer names:", error);
    }
  };
 
  const handleApplicantChange = async (event) => {
    const selectedApplicantId = event.target.value;
    setApplicantId(selectedApplicantId);
 
    try {
      const response = await axios.get(`http://localhost:5001/applicantsinterview/${selectedApplicantId}`);
      if (response.data.success) {
        const applicant = response.data.data;
        setApplicantName(`${applicant.First_Name} ${applicant.Last_Name}`);
      }
    } catch (error) {
      console.error("Error fetching applicant details:", error);
    }
 
    try {
      const response = await axios.get(`http://localhost:5001/jobidinterview/${selectedApplicantId}`);
      if (response.data.success) {
        const job = response.data.data;
        setJobId(job.Job_ID);
        fetchRounds(job.Job_ID);
      }
    } catch (error) {
      console.error("Error fetching job ID:", error);
    }
  };
 
  const fetchRounds = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:5001/roundsinterview/${jobId}`);
      if (response.data.success) {
        const roundsData = response.data.data;
        const roundsArray = [];
        for (let i = 1; i <= 5; i++) {
          const round = roundsData[`Round_${i}`];
          if (round) roundsArray.push(round);
        }
        setRounds(roundsArray);
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/meetingsinterview", {
        endDate: datetime,
        duration,
        name,
        applicantId,
        applicantName,
        jobId,
        roundName,
        interviewerName,
      });
 
      if (response.data.success) {
        setMessage("Meeting booked successfully");
        fetchMeetings();
        setName("");
        setDatetime("");
        setDuration("30");
        setApplicantId("");
        setApplicantName("");
        setJobId("");
        setRoundName("");
        setInterviewerName("");
      } else {
        setMessage(response.data.message || "Error booking meeting");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setMessage("Error booking meeting");
    }
  };
 
  const popupClass = message.includes("successfully") ? "success" : "error";
 
  const handleNextPage = () => {
    if (page < Math.ceil(meetings.length / rowsPerPage)) {
      setPage(page + 1);
    }
  };
 
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
 
  const handleViewMeeting = (meeting) => {
   
    const interviewDetail = interviewDetails.find(detail => detail.meetingId === meeting.meetingId);
 
   
    if (interviewDetail) {
      setViewMeeting({ ...meeting, ...interviewDetail });
    } else {
      
      setViewMeeting(meeting);
    }
  };
 
 
  const handleCloseView = () => {
    setViewMeeting(null);
  };
 
  return (
    <Container maxWidth="lg">
     
      {/* <Box className={`popup ${popupClass}`} mb={3} textAlign="center" bgcolor="white" p={2}>
        {message}
      </Box> */}
 
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Meeting Name"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    label="Duration"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="30">30 minutes</MenuItem>
                    <MenuItem value="60">60 minutes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Date & Time"
                  type="datetime-local"
                  variant="outlined"
                  fullWidth
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Applicant ID</InputLabel>
                  <Select
                    value={applicantId}
                    onChange={handleApplicantChange}
                    label="Applicant ID"
                  >
                    {applicants.map(applicant => (
                      <MenuItem key={applicant.Applicant_ID} value={applicant.Applicant_ID}>
                        {applicant.Applicant_ID}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Applicant Name"
                  variant="outlined"
                  fullWidth
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Job ID"
                  variant="outlined"
                  fullWidth
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Round Name</InputLabel>
                  <Select
                    value={roundName}
                    onChange={(e) => setRoundName(e.target.value)}
                    label="Round Name"
                  >
                    {rounds.map((round, index) => (
                      <MenuItem key={index} value={round}>
                        {round}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Interviewer Name</InputLabel>
                  <Select
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    label="Interviewer Name"
                  >
                    {interviewerNames.map((interviewer, index) => (
                      <MenuItem key={index} value={interviewer.name}>
                        {interviewer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    style={{ width: "200px" }}
                  >
                    Book
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Grid>
 
        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start" alignItems="center">
          <Typography variant="h5" textAlign="left" flexGrow={1}>
            scheduled {meetings.length === 1 ? "Interview" : "Interviews"} :  {meetings.length}
          </Typography>
        </Grid>
 
        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" alignItems="center">
          <Link to="/host" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="secondary" style={{ width: "200px", marginRight: '85px' }}>
              Host Links
            </Button>
          </Link>
        </Grid>
 
        <Grid item xs={12}>
          <Box mt={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Meeting ID</TableCell>
                  <TableCell>Room Name</TableCell>
                  <TableCell>Applicant ID</TableCell>
                  <TableCell>Applicant Name</TableCell>
                  <TableCell>Job ID</TableCell>
                  <TableCell>Round Name</TableCell>
                  <TableCell>Interviewer Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Room URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interviewDetails.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((meeting) => (
                  <TableRow key={meeting.meetingId}>
                    <TableCell>{meeting.meetingId}</TableCell>
                    <TableCell>{meeting.roomName}</TableCell>
                    <TableCell>{meeting.Applicant_ID}</TableCell>
                    <TableCell>{meeting.Applicant_Name}</TableCell>
                    <TableCell>{meeting.Job_ID}</TableCell>
                    <TableCell>{meeting.Round_Name}</TableCell>
                    <TableCell>{meeting.Interviewer_Name}</TableCell>
                    <TableCell>{new Date(meeting.startDate).toLocaleString()}</TableCell>
                    <TableCell>
  {(() => {
    const now = new Date();
    const startDate = new Date(meeting.startDate);
    const endDate = new Date(meeting.endDate);
 
    if (now >= startDate && now <= endDate) {
      return (
        <Button
          href={meeting.roomUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
        >
          Click me
        </Button>
      );
    } else if (now > endDate) {
      return <Typography color="error">Meeting Ended</Typography>;
    } else {
      return (
        <Button variant="contained" disabled startIcon={<EditIcon />}>
          Click me
        </Button>
      );
    }
  })()}
</TableCell>
 
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={handlePrevPage} disabled={page === 1}>
                Prev
              </Button>
              <Button onClick={handleNextPage} disabled={page >= Math.ceil(meetings.length / rowsPerPage)}>
                Next
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
 
     
    </Container>
  );
};
 
export default Home;
 
 