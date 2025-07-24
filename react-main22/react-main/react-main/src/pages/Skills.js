import React, { useState, useEffect } from 'react';
import './Leave.css'; 
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri'; 

function App() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [leavesData, setLeavesData] = useState([
    { id: 1, empId: 1, empName: 'John Doe', leaveType: 'Sick Leave', startDate: '2024-04-01', endDate: '2024-04-03', days: 3, reason: 'Fever', status: 'Approved' },
    { id: 2, empId: 2, empName: 'Jane Smith', leaveType: 'Vacation', startDate: '2024-04-05', endDate: '2024-04-10', days: 6, reason: 'Traveling', status: 'Pending' },
    
    { id: 3, empId: 3, empName: 'Alice Johnson', leaveType: 'Maternity Leave', startDate: '2024-04-12', endDate: '2024-04-20', days: 9, reason: 'Maternity', status: 'Pending' },
    { id: 4, empId: 4, empName: 'Bob Brown', leaveType: 'Personal Leave', startDate: '2024-04-15', endDate: '2024-04-18', days: 4, reason: 'Personal reasons', status: 'Approved' },
    { id: 5, empId: 5, empName: 'Bob Brown', leaveType: 'Personal Leave', startDate: '2024-04-15', endDate: '2024-04-18', days: 4, reason: 'Personal reasons', status: 'Approved' },// Add more data as needed
  ]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items per page

  
  const totalPages = Math.ceil(leavesData.length / itemsPerPage);

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leavesData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    // Reset current page when data changes
    setCurrentPage(1);
  }, [leavesData]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setEditMode(true);
  };

  const handleDelete = (leave) => {
    const updatedLeavesData = leavesData.filter(item => item.id !== leave.id);
    setLeavesData(updatedLeavesData);
  };

  const handleUpdate = () => {
    // Find the index of the selected leave in the leavesData array
    const index = leavesData.findIndex(item => item.id === selectedLeave.id);
    // Create a copy of the leavesData array
    const updatedLeavesData = [...leavesData];
    // Update the selected leave with new data
    updatedLeavesData[index] = selectedLeave;
    // Update the state with the new data
    setLeavesData(updatedLeavesData);
    // Close the edit mode
    setEditMode(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Leaves Module</h1>
      </header>
      <div className="custom-dropdowns-container">
        <div className="custom-location-dropdown">
          <label>Leave Type:</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="">All</option>
            <option value="sick">Sick</option>
            <option value="vacation">Vacation</option>
            <option value="maternity">Maternity</option>
            <option value="personal">Personal</option>
          </select>
        </div>
        <div className="custom-department-dropdown">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="custom-Date">
          <label>Start Date:</label>
          <input type="Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="custom-Date">
          <label>End Date:</label>
          <input type="Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="custom-search-box">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
      </div>

      <div className="data-grid">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((leave) => (
              <tr key={leave.id}>
                <td><input type="checkbox" checked={selectAll} /></td>
                <td>{leave.empId}</td>
                <td>{leave.empName}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
                <td>
                  <RiEdit2Line className="edit-icon" onClick={() => handleEdit(leave)} />
                  <RiDeleteBin6Line className="delete-icon" onClick={() => handleDelete(leave)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      {editMode && selectedLeave && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit Leaves</h2>
            <div>
              <label>Employee ID:</label>
              <input type="text" value={selectedLeave.empId} readOnly />
              <label>Employee Name:</label>
              <input type="text" value={selectedLeave.empName} readOnly />
              <label>Leave Type:</label>
              <input type="text" value={selectedLeave.leaveType} onChange={(e) => setSelectedLeave({ ...selectedLeave, leaveType: e.target.value })} />
              <label>Start Date:</label>
              <input type="date" value={selectedLeave.startDate} onChange={(e) => setSelectedLeave({ ...selectedLeave, startDate: e.target.value })} />
              <label>End Date:</label>
              <input type="date" value={selectedLeave.endDate} onChange={(e) => setSelectedLeave({ ...selectedLeave, endDate: e.target.value })} />
              <label>Days:</label>
              <input type="number" value={selectedLeave.days} onChange={(e) => setSelectedLeave({ ...selectedLeave, days: e.target.value })} />
              <label>Reason:</label>
              <input type="text" value={selectedLeave.reason} onChange={(e) => setSelectedLeave({ ...selectedLeave, reason: e.target.value })} />
              <label>Status:</label>
              <input type="text" value={selectedLeave.status} onChange={(e) => setSelectedLeave({ ...selectedLeave, status: e.target.value })} />
              <div className="buttons">
                <button className="update-btn" onClick={handleUpdate}>Update</button>
                <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
