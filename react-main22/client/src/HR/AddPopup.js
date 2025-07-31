// AddPopup.js
import React, { useState } from 'react';
import { IoMdSave, IoMdClose } from 'react-icons/io';

const AddPopup = ({ isVisible, onClose, onAddAttendance }) => {
  const [date, setDate] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('');

  const handleAddClick = () => {
    // Add validation if needed
    const newAttendance = {
      date,
      employeeName,
      location,
      department,
    };

    // Call the parent component function to add the new attendance
    onAddAttendance(newAttendance);

    // Reset the form
    setDate('');
    setEmployeeName('');
    setLocation('');
    setDepartment('');
  };

  return (
    isVisible && (
      <div className='popup-container' style={{width:'500px'}}>
        <div className='popup-content'>
          <div className='input-group'>
            <label>Date:</label>
            <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className='input-group'>
            <label>Employee Name:</label>
            <input
              type='text'
              placeholder='Enter Employee Name'
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </div>

          <div className='input-group'>
            <label>Location:</label>
            <input
              type='text'
              placeholder='Enter Location'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className='input-group'>
            <label>Department:</label>
            <input
              type='text'
              placeholder='Enter Department'
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className='button-group'>
            <button className='save-button-attendance' onClick={handleAddClick}>
              <IoMdSave /> Save
            </button>
            <button className='cancel-button' onClick={onClose}>
              <IoMdClose /> Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddPopup;
