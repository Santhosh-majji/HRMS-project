import DatePicker from 'react-datepicker';
import React, { useState } from 'react';

const DateInput = () => {
    const [selectedDate, setSelectedDate] = useState(null);
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    return (
      <div>
        <h6>Select a Date:</h6>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
        />
        {selectedDate && (
          <p>Selected Date: {selectedDate.toISOString().slice(0, 10)}</p>
        )}
      </div>
    );
  };
  export default DateInput;