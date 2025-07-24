
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";
import "./HrOnetoOneMeeting.css";
import { Link } from "react-router-dom";
import HRPerformance from './HRPerformance';
 
const useStyles = makeStyles({
  card: {
    marginBottom: "10px",
  },
});
 
const OnetoOneMeeting = () => {
  const classes = useStyles();
 
  const [name, setname] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [duration, setDuration] = useState("30");
  const [datetime, setDatetime] = useState("");
  const [message, setMessage] = useState("");
 
  useEffect(() => {
    fetchMeetings();
  }, []);
 
  useEffect(() => {
    const interval = setInterval(fetchMeetings, 30000); // Update every minute
    return () => clearInterval(interval); // Clean up the interval on unmount
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
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Call to the /OnetoOnemeeting endpoint
      const responseOnetoOne = await axios.post("http://localhost:5001/OnetoOnemeeting", {
        endDate: datetime,
        duration,
        name,
        employeeId: document.getElementById("employeeId").value // Grabbing the value of Employee_ID
      });
 
      // Check the response from the OnetoOnemeeting endpoint
      if (responseOnetoOne.data.success) {
        // If successful, display success message and refresh meetings list
        setMessage("Meeting booked successfully");
        fetchMeetings(); // Refresh meetings list after booking
        setname("");
        setDatetime("");
        setDuration("");
        setMessage("");
      } else {
        // If not successful, display error message from the OnetoOnemeeting endpoint
        setMessage(responseOnetoOne.data.message || "Error booking meeting");
      }
 
      // Call to the /meetings endpoint to maintain existing functionality
      const responseMeetings = await axios.post("http://localhost:5001/meetings", {
        endDate: datetime,
        duration,
        name
      });
 
      // Handle the response from the /meetings endpoint if needed
 
    } catch (error) {
      console.error("Error:", error.message);
      setMessage("Error booking meeting");
    }
  };
 
 
  const popupClass = message.includes("successfully") ? "success" : "error";
 
  return (
    <div className="onetooneui">
       <HRPerformance />
      <div className={`popup ${popupClass} text-center bg-white mb-3`}>
        {message}
      </div>
 
      <div className="d-flex flex-row  ">
        <form className="unique-form-meeting" onSubmit={handleSubmit}>
          <div className="unique-flex-column-meeting">
            <label>Meeting Name</label>
          </div>
          <div className="unique-inputForm">
            <input
              type="text"
              className="unique-input"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="Enter Meeting Name"
            />
          </div>
          <div className="unique-flex-column-meeting">
            <label>Employee ID</label>
            </div>
            <div className="unique-inputForm">
            <input
              type="text"
              className="unique-input"
              id="employeeId" // Added id for grabbing the value later
    placeholder="Enter Employee ID"
              />
 
              </div>
          <div className="unique-flex-column-meeting">
            <label>Duration</label>
          </div>
          <div className="unique-duration-options">
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                name="duration"
                value="30"
                checked={duration === "30"}
                onChange={() => setDuration("30")}
              />
              30 minutes
            </label>
            <label>
              <input
                type="radio"
                name="duration"
                value="60"
                checked={duration === "60"}
                onChange={() => setDuration("60")}
              />
              60 minutes
            </label>
          </div>
 
          <div className="unique-flex-column-meeting">
            <label>Date & Time</label>
          </div>
          <div className="unique-inputForm">
            <input
              type="datetime-local"
              className="unique-input"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>
 
          <button type="submit" className="unique-button-submit-meeting">
            Book
          </button>
        </form>
 
        <div className="unique-form-meeting-time" style={{ marginLeft: "20px" }}>
          <Link to="/host2">
            <button className="btn btn-dark">Host Links</button>
          </Link>
 
          <h3 className="text-center">User Meeting List - {meetings.length}</h3>
          {/* Render meetings list */}
          <div className="onetoone-meeting-cards-container">
            {meetings && meetings.length > 0 ? (
              meetings.map((meeting) => (
                <Card key={meeting.meetingId} className={classes.card}>
                  <CardContent>
                    <Typography variant="h6">Meeting Details</Typography>
                    <Typography variant="body1">
                      <strong>Meeting ID:</strong> {meeting.meetingId}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Room Name:</strong> {meeting.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Start time:</strong>{" "}
                      {new Date(meeting.startDate).toLocaleString()}
                    </Typography>
                    {/* Render the room link as a clickable text */}
                    <Typography variant="body1">
                      <strong>Room URL:</strong>{" "}
                      {new Date(meeting.startDate) <= new Date() && new Date(meeting.endDate) > new Date() ? (
                        <a href={meeting.roomUrl} target="_blank" rel="noopener noreferrer">
                          Join Meeting
                        </a>
                      ) : new Date(meeting.endDate) <= new Date() ? (
                        <b style={{ color: "red" }}>Meeting Ended</b>
                      ) : (
                        <button className="btn btn-primary " style={{ cursor: "not-allowed" }}>
                          Join Meeting
                        </button>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1">No meetings found</Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnetoOneMeeting;
 