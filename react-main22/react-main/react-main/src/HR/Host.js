
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Calendar, momentLocalizer } from 'react-big-calendar';
 
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions, AppBar, Toolbar, Container, Grid, Paper, IconButton, Snackbar, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
 
const localizer = momentLocalizer(moment);
 
const useStyles = makeStyles({
  calendarContainer: {
    margin: "20px",
    padding: "10px",
    position: "relative",
  },
  event: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    padding: '5px',
    width: '100%',
    marginBottom: '15px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    margin: '10px',
  },
});
 
const Host = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const [dialogData, setDialogData] = useState(null);
  const [copiedHostLink, setCopiedHostLink] = useState(false);
  const [copiedUserLink, setCopiedUserLink] = useState(false);
  const [message, setMessage] = useState("");
  const [deletingMeeting, setDeletingMeeting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
 
  useEffect(() => {
    fetchTableData();
  }, []);
 
  const fetchTableData = async () => {
    try {
      const response = await fetch("http://localhost:5001/host");
      const responseData = await response.json();
      if (responseData.success) {
        const formattedEvents = responseData.data.map((item) => ({
          title: item.name,
          start: new Date(item.startDate),
          end: new Date(item.endDate),
          backgroundColor: item.color,
          textColor: "#ffffff",
          extendedProps: item,
        }));
        setEvents(formattedEvents);
      } else {
        console.error("Error fetching host data:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };
 
  const handleEventClick = (event) => {
    setDialogData(event);
  };
 
  const handleCloseDialog = () => {
    setDialogData(null);
  };
 
  const handleJoinMeeting = (link) => {
    window.open(link, "_blank");
  };
 
  const handleCopyLink = (link, setCopiedState) => {
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 1000);
      })
      .catch((error) => {
        console.error("Error copying link:", error);
      });
  };
 
  const handleDelete = async (meetingId) => {
    setDeletingMeeting(true);
    try {
      const response = await fetch(
        `http://localhost:5001/deletmeeting/${meetingId}`,
        {
          method: "DELETE",
        }
      );
 
      if (response.ok) {
        setMessage("Meeting deleted successfully.");
        fetchTableData();
        setDialogData(null);
        setDeletingMeeting(false);
        setSnackbarOpen(true);
      } else {
        setMessage(`Failed to delete meeting. Status: ${response.status}`);
        setDeletingMeeting(false);
      }
    } catch (error) {
      setMessage("Error deleting meeting:", error);
      setDeletingMeeting(false);
    }
  };
 
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
 
  const popupClass = message.includes("successfully") ? "success" : "error";
 
  return (
    <div>
     
 
    <Container>
      <AppBar  position="static" color="transparent" elevation={0}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">Host Meetings</Typography>
          <Box>
            <Link to="/InterviewScheduling" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="secondary" className={classes.button}>Back</Button>
            </Link>
            <Link to="/attendedmeeting" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" className={classes.button}>Attended Meetings</Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <div className={classes.calendarContainer}>
        <div className={`popup ${popupClass} text-center bg-white mb-3`}>
          {message}
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.backgroundColor,
              color: event.textColor,
            },
          })}
          onSelectEvent={handleEventClick}
        />
 
        <Dialog open={!!dialogData} onClose={handleCloseDialog}>
          <DialogTitle>{dialogData && dialogData.title}</DialogTitle>
          <DialogContent>
            <Typography>Meeting ID: {dialogData && dialogData.extendedProps.meetingId}</Typography>
            <Typography>Start Date: {dialogData && new Date(dialogData.extendedProps.startDate).toLocaleString()}</Typography>
            <Typography>End Date: {dialogData && new Date(dialogData.extendedProps.endDate).toLocaleString()}</Typography>
            <Box my={2}>
              <Button variant="outlined" onClick={() => handleJoinMeeting(dialogData.extendedProps.hostRoomUrl)}>Join Host Meeting</Button>
            </Box>
            <Box my={2}>
              <Button variant="outlined" onClick={() => handleJoinMeeting(dialogData.extendedProps.roomUrl)}>Join User Meeting</Button>
            </Box>
            <Box my={2}>
              <Button
                variant="outlined"
                onClick={() => handleCopyLink(dialogData.extendedProps.hostRoomUrl, setCopiedHostLink)}
                disabled={copiedHostLink}
              >
                {copiedHostLink ? "Copied" : "Copy Host Meeting Link"}
              </Button>
            </Box>
            <Box my={2}>
              <Button
                variant="outlined"
                onClick={() => handleCopyLink(dialogData.extendedProps.roomUrl, setCopiedUserLink)}
                disabled={copiedUserLink}
              >
                {copiedUserLink ? "Copied" : "Copy User Meeting Link"}
              </Button>
            </Box>
            <Box my={2}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(dialogData.extendedProps.meetingId)}
                disabled={deletingMeeting}
              >
                {deletingMeeting ? "Deleting Meeting..." : "Delete Meeting"}
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
 
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={message}
        />
      </div>
    </Container>
    </div>
  );
};
 
export default Host;
 
 