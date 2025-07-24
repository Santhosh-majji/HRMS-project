// Notinitiated.js
import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { FaEdit, FaTrash, FaSync } from 'react-icons/fa';
import './Notinitiated.css';

const Notinitiated = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    // Check if the current row count exceeds the limit for a single page
    if (rowCount >= 4) {
      // Move to the next page
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      onPageChange(nextPage);
      // Reset the row count
      setRowCount(0);
    }
  }, [rowCount, currentPage, onPageChange]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      onPageChange(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      onPageChange(prevPage);
    }
  };

  const handleRowAdded = () => {
    // Increment the row count
    setRowCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      {/* Heading and Paragraph */}
      <div className="heading-section">
        <h2>Skipped</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin maximus justo sed neque faucibus, ut pharetra velit scelerisque. Fusce suscipit metus non suscipit tristique.
        </p>
      </div>
     
      {/* Location and Department with Dropdowns */}
      <div className="dropdowns-container">
        <div className="location-dropdown">
          <label>Location:</label>
          <select>
            <option value="location1">Hyderabad</option>
            <option value="location2">Vizag</option>
            <option value="location3">Chennai</option>
          </select>
        </div>
        <div className="department-dropdown">
          <label>Department:</label>
          <select>
            <option value="dept1">HR</option>
            <option value="dept2">Frontend</option>
            <option value="dept3">Backend</option>
          </select>
        </div>
        <div className="search-box">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
      </div>
 
      {/* Data Grid */}
      <h1>Employee Informations</h1>
      <div className="data-grid">
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Joining Date</th>
              <th>Location</th>
              <th>Department</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample row */}
            <tr>
              <td><input type="checkbox" /></td>
              <td>#001</td>
              <td>Santhosh</td>
              <td>2023-01-15</td>
              <td>Hyderabad</td>
              <td>HR</td>
              <td>123-456-7890</td>
              <td>
                <button className="edit"><FaEdit /></button>
                <button className="delete"><FaTrash /></button>
                <button className="update"><FaSync /></button>
              </td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>#001</td>
              <td>Santhosh</td>
              <td>2023-01-15</td>
              <td>Hyderabad</td>
              <td>HR</td>
              <td>123-456-7890</td>
              <td>
                <button className="edit"><FaEdit /></button>
                <button className="delete"><FaTrash /></button>
                <button className="update"><FaSync /></button>
              </td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>#001</td>
              <td>Santhosh</td>
              <td>2023-01-15</td>
              <td>Hyderabad</td>
              <td>HR</td>
              <td>123-456-7890</td>
              <td>
                <button className="edit"><FaEdit /></button>
                <button className="delete"><FaTrash /></button>
                <button className="update"><FaSync /></button>
              </td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>#001</td>
              <td>Santhosh</td>
              <td>2023-01-15</td>
              <td>Hyderabad</td>
              <td>HR</td>
              <td>123-456-7890</td>
              <td>
                <button className="edit" style={{margin:'5px'}}><FaEdit /></button>
                <button className="delete"><FaTrash /></button>
                <button className="update"><FaSync /></button>
              </td>
            </tr>
            {/* Add more rows here as needed */}
          </tbody>
        </table>
      </div>
      <div>
        <button disabled={currentPage === 1} onClick={handlePrevPage}>Previous</button>
        <span>{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default Notinitiated;
