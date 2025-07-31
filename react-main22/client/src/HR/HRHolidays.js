import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import './HRHolidays.css';
import HRSideBar from '../components/Sidebar/HRSideBar';

const Holidays = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayDescription, setHolidayDescription] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get('http://localhost:5001/holidays');
      const formattedHolidays = response.data.map(holiday => ({
        ...holiday,
        Date: holiday.Date.split('T')[0]
      }));
      setHolidays(formattedHolidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast.error('Error fetching holidays');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setShowPopup(true);
    const holiday = holidays[index];
    setHolidayName(holiday.Name);
    setHolidayDate(holiday.Date);
    setHolidayDescription(holiday.Description);
  };

  const handleAddHoliday = () => {
    setEditingIndex(null);
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
    setEditingIndex(null);
    resetForm();
  };

  const resetForm = () => {
    setHolidayName('');
    setHolidayDate('');
    setHolidayDescription('');
  };

  const handleSubmit = async () => {
    try {
      if (editingIndex !== null) {
        await handleUpdate();
      } else {
        await handleAdd();
      }
    } catch (error) {
      console.error('Error performing operation:', error);
      toast.error('Error performing operation');
    }
  };

  const handleAdd = async () => {
    try {
      const newHoliday = {
        Name: holidayName,
        Date: holidayDate,
        Description: holidayDescription
      };
      const response = await axios.post('http://localhost:5001/holidays', newHoliday);
      if (response.data && response.data.id) {
        newHoliday.id = response.data.id;
        setHolidays([...holidays, newHoliday]);
        toast.success('Holiday added successfully');
        setShowPopup(false);
        resetForm();
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error adding holiday:', error);
      toast.error('Error adding holiday');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5001/holidays/${holidays[editingIndex].id}`, {
        Name: holidayName,
        Date: holidayDate,
        Description: holidayDescription
      });
      const updatedHoliday = {
        id: holidays[editingIndex].id,
        Name: holidayName,
        Date: holidayDate,
        Description: holidayDescription
      };
      const updatedHolidays = [...holidays];
      updatedHolidays[editingIndex] = updatedHoliday;
      setHolidays(updatedHolidays);
      toast.success('Holiday updated successfully');
      setShowPopup(false);
      resetForm();
    } catch (error) {
      console.error('Error updating holiday:', error);
      toast.error('Error updating holiday');
    }
  };

  const handleDelete = async (index) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5001/holidays/${holidays[index].id}`);
          const updatedHolidays = holidays.filter((_, i) => i !== index);
          setHolidays(updatedHolidays);
          swalWithBootstrapButtons.fire("Deleted!", "Your holiday has been deleted.", "success");
          toast.success('Holiday deleted successfully');
        } catch (error) {
          console.error('Error deleting holiday:', error);
          toast.error('Error deleting holiday');
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire("Cancelled", "Your holiday is safe :)", "error");
      }
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <HRSideBar />
      </div>
      <div className="holidays-container" style={{ width: '100%' }}>
        <div className="heading">
          <div className="heading-left">
            <h1 style={{ alignItems: 'flex-start' }}>Holidays List of This Year</h1>
          </div>
          <div className="heading-right">
            <button className="styled-button" onClick={handleAddHoliday}>
              <AiOutlinePlus /> Add Holiday
            </button>
          </div>
        </div>
        {showPopup && (
          <div className="popup-backgrounds">
            <div className="popups">
              <h2>{editingIndex !== null ? 'Edit Holiday' : 'Add Holiday'}</h2>
              <div className="popup-contents">
                <label htmlFor="holidayName">Name:</label>
                <input
                  type="text"
                  id="holidayName"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                />
                <label htmlFor="holidayDate">Date:</label>
                <input
                  type="date"
                  id="holidayDate"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                />
                <label htmlFor="holidayDescription">Description:</label>
                <textarea
                  id="holidayDescription"
                  value={holidayDescription}
                  onChange={(e) => setHolidayDescription(e.target.value)}
                />
                <div className="popup-buttons">
                  <button className="submit-button" onClick={handleSubmit}>
                    <MdCheckCircle /> {editingIndex !== null ? 'Update' : 'Submit'}
                  </button>
                  <button className="cancell-buttons" onClick={handleCancel}>
                    <MdCancel /> Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
        <div className="holidays-list">
          <div className="data-grids" style={{ width: '100%' }}>
            <table>
              <thead style={{ backgroundColor: '#333' }}>
                <tr>
                  <th>Holiday Name</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday, index) => (
                  <tr key={index}>
                    <td>{holiday.Name}</td>
                    <td>{holiday.Date}</td>
                    <td>{holiday.Description}</td>
                    <td>
                      <button className="action-button" onClick={() => handleEdit(index)}>
                        <AiOutlineEdit />
                      </button>
                      <button className="action-button" onClick={() => handleDelete(index)}>
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holidays;
