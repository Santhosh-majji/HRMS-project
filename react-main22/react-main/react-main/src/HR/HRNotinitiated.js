import React, { useState } from 'react';
import './HRNotinitiated.css';
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';

const Notinitiated = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items per page

  // Sample employee data
  const employeeData = [
    { id: '#001', name: 'Santhosh', joinDate: '2023-01-15', location: 'Hyderabad', department: 'HR', phoneNumber: '123-456-7890' },
    { id: '#002', name: 'John', joinDate: '2023-01-16', location: 'Bangalore', department: 'Frontend', phoneNumber: '987-654-3210' },
    { id: '#003', name: 'Jane', joinDate: '2023-01-17', location: 'Chennai', department: 'Backend', phoneNumber: '456-789-0123' },
    { id: '#004', name: 'Alice', joinDate: '2023-01-18', location: 'Mumbai', department: 'HR', phoneNumber: '789-012-3456' },
    { id: '#005', name: 'Bob', joinDate: '2023-01-19', location: 'Delhi', department: 'Finance', phoneNumber: '012-345-6789' },
    { id: '#006', name: 'Charlie', joinDate: '2023-01-20', location: 'Kolkata', department: 'Marketing', phoneNumber: '234-567-8901' },
    // Add more data items as needed
  ];

  // Calculate total pages
  const totalPages = Math.ceil(employeeData.length / itemsPerPage);

  // Pagination methods
  const onPageChange = (pageNumber) => {
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  // Filter data based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employeeData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{width:"100%"}}>
      {/* Heading and Paragraph */}
      <div className="heading-section">
        <h2>Onboarding Not Initiated</h2>
      </div>
     
      {/* Location and Department with Dropdowns */}
      <div className="custom-dropdowns-container">
        <div className="custom-location-dropdown">
          <label>Location:</label>
          <select>
            <option value="location1">Hyderabad</option>
            <option value="location2">Vizag</option>
            <option value="location3">Chennai</option>
          </select>
        </div>
        <div className="custom-department-dropdown">
          <label>Department:</label>
          <select>
            <option value="dept1">HR</option>
            <option value="dept2">Frontend</option>
            <option value="dept3">Backend</option>
          </select>
        </div>
        <div className="custom-search-box">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
      </div>
 
      {/* Data Grid */}
      <h2>Employee Informations</h2>
      <div className="data-grids" style={{width:'100%'}}>
        <table>
          <thead>
            <tr>
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
            {currentItems.map((employee, index) => (
              <tr key={index}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.joinDate}</td>
                <td>{employee.location}</td>
                <td>{employee.department}</td>
                <td>{employee.phoneNumber}</td>
                <td>
                  <RiEdit2Line className="edit-icon" />
                  <RiDeleteBin6Line className="delete-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <div className="pagination">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Notinitiated;
