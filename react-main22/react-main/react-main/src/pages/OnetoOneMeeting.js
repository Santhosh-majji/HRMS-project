// OnetoOneMeeting.js
import React, { useState } from 'react';
import { RiDeleteBin6Line, RiCalendarEventLine } from 'react-icons/ri';
import { AiFillClockCircle, AiOutlineUser } from 'react-icons/ai';
import './OnetoOneMeeting.css'; // You can define your styles here
import Performance from './Performance';


function OnetoOneMeeting() {
  const [meetings, setMeetings] = useState([
    { id: 1, date: "2024-02-15", employee: "John Doe", time: "10:00 AM", agenda: "Performance review" },
    { id: 2, date: "2024-02-16", employee: "Jane Smith", time: "11:00 AM", agenda: "Goal setting" },
    { id: 3, date: "2024-02-17", employee: "Alice Johnson", time: "2:00 PM", agenda: "Project update" },
    { id: 4, date: "2024-02-18", employee: "Bob Brown", time: "3:30 PM", agenda: "Training session" }
  ]);

  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleDeleteMeeting = (meetingId) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== meetingId));
    setSelectedMeeting(null);
  };

  const handleScheduleMeeting = (formData) => {
    const newMeeting = { id: meetings.length + 1, ...formData };
    setMeetings([...meetings, newMeeting]);
  };


  return (
    <div className="app-container">
       <Performance />
      <div className="content-container">
        <div className="schedule-meeting-container">
          <ScheduleMeetingForm onScheduleMeeting={handleScheduleMeeting} />
        </div>
        <div className="extra-elements-container">
          <h2>Agenda</h2>
          <div className="extra-element">
          <div>
          <input type="checkbox" id="performanceReview" name="performanceReview" />
          </div>
          <div>
          <label htmlFor="performanceReview">Team meeting also referred to as a staff meeting, these are opportunities for your team to discuss various business aspects</label>
          </div>
          </div>
          <br></br>
          <div className="extra-element">
          <div>
          <input type="checkbox" id="goalSetting" name="goalSetting" />
          </div>
          <div>
          <label htmlFor="goalSetting">Board meeting a formal meeting among your organization’s board of directors. </label>
          </div>
          </div><br></br>
          <div className="extra-element">
          <div>
          <input type="checkbox" id="projectUpdate" name="projectUpdate" />
          </div>
          <div>
          <label htmlFor="projectUpdate">Executive session held by board members regularly before their routine board meetings</label>
          </div>
          </div><br></br>
         
         
          {/* Add more extra elements as needed */}
        </div>
        <div className="meeting-details-container">
          <MeetingDetails meeting={selectedMeeting} onDeleteMeeting={handleDeleteMeeting} />
        </div>
        <div className="data-grid-container">
          <DataGrid meetings={meetings} onMeetingClick={handleMeetingClick} />
        </div>
      </div>
    </div>
  );
}



function ScheduleMeetingForm({ onScheduleMeeting }) {
  const [formData, setFormData] = useState({ date: '', time: '', employee: '', agenda: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onScheduleMeeting(formData);
    setFormData({ date: '', time: '', employee: '', agenda: '' });
  };

  return (
    <div className="schedule-meeting-form">
      <h1>Schedule a Meeting</h1>
      <form onSubmit={handleSubmit}>
        {/* Rearrange the attributes in the desired order */}
        <label>Employee:</label>
        <input type="text" name="employee" value={formData.employee} onChange={handleChange} required />

        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Time:</label>
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />

        <label>Agenda:</label>
        <input type="text" name="agenda" value={formData.agenda} onChange={handleChange} required />

        <button type="submit"><RiCalendarEventLine /> Schedule Meeting</button>
      </form>
    </div>
  );
}

function MeetingDetails({ meeting, onDeleteMeeting }) {
  return (
    <div className="meeting-details">
      <h2>Meeting Details</h2>
      {meeting ? (
        <div>
          <p><strong>Date:</strong> {meeting.date}</p>
          <p><strong>Employee:</strong> {meeting.employee}</p>
          <p><strong>Time:</strong> {meeting.time}</p>
          <p><strong>Agenda:</strong> {meeting.agenda}</p>
          <button onClick={() => onDeleteMeeting(meeting.id)}><RiDeleteBin6Line /> Delete Meeting</button>
        </div>
      ) : (
        <p>Select a meeting to view details</p>
      )}
    </div>
  );
}

function DataGrid({ meetings, onMeetingClick }) {
    return (
      <div className="data-grid">
        <h2>Meeting List</h2>
        <table>
          <thead>
            <tr>
              <th><AiOutlineUser /> Employee</th>
              <th>Date</th>
              <th>Time</th>
              <th>Agenda</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting.id} onClick={() => onMeetingClick(meeting)}>
                <td>{meeting.employee}</td>
                <td>{meeting.date}</td>
                <td>{meeting.time}</td>
                <td>{meeting.agenda}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  

export default OnetoOneMeeting;
