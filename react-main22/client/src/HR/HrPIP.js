
import React, { useState, useEffect } from 'react';
import './HrPIP.css';
import Pagination from '@mui/material/Pagination';
import HRPerformance from './HRPerformance';
import { MdFileDownload, MdMoreVert } from 'react-icons/md';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
 
const PIP = ({ totalPages, onPageChange }) => {
  const [showInProcessContent, setShowInProcessContent] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
 
  const [currentPage, setCurrentPage] = useState(1);
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);
  const [defaultNameVisible, setDefaultNameVisible] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);
  const [pipState, setPipState] = useState(null); // New state for PIP sub-buttons
  const [allEmployeesData, setAllEmployeesData] = useState([]);
  const [progress, setProgress] = useState(50);
  const [reportingManager, setReportingManager] = useState('');
  const [initiatedBy, setInitiatedBy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pipCompleted, setPipCompleted] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
 
  const itemsPerPage = 10; // Number of items per page
  const [gridData, setGridData] = useState([]); // Data to display in the table
  const [searchTerm, setSearchTerm] = useState('');
const [filteredGridData, setFilteredGridData] = useState([]);
const [appraisalData, setAppraisalData] = useState([]);
 
  const handleAppraisalClick = async () => {
    try {
      const response = await fetch('http://localhost:5001/AppraisalData');
      const data = await response.json();
      setAppraisalData(data);
    } catch (error) {
      console.error('Error fetching appraisal data:', error);
    }
  };
  useEffect(() => {
    // Fetch Appraisal data when component mounts
    handleAppraisalClick();
  }, []);
 
  const handleDeleteRow = async (employeeID) => {
    try {
      // Send a delete request to backend to delete the row with the given employeeID
      const response = await fetch(`http://localhost:5001/deleteAppraisal/${employeeID}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        // If deletion is successful, update the appraisalData state to reflect the changes
        const updatedData = appraisalData.filter(employee => employee.Username !== employeeID);
        setAppraisalData(updatedData);
      }
    } catch (error) {
      console.error('Error deleting row from appraisal:', error);
    }
  };
 
  useEffect(() => {
    handleAllEmployeesClick();
   
    fetchAllEmployeesData();
  }, []);
 
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = gridData.filter((employee) => {
      // Convert employee.Employee_ID to string before calling toLowerCase()
      const employeeID = employee.Username.toString().toLowerCase();
      return employeeID.includes(searchTerm);
    });
    setFilteredGridData(filteredData);
  };
 
 
  const handleClearSearch = () => {
    setFilteredGridData(gridData); // Reset filtered data to original gridData
    setSearchTerm(''); // Clear the search term
  };
 
 
 
  const fetchAllEmployeesData = async () => {
    try {
      const response = await fetch('http://localhost:5001/AllEmployeesPIP');
      const data = await response.json();
      setAllEmployeesData(data);
      setGridData(data); // Set gridData to the fetched data
    } catch (error) {
      console.error('Error fetching all employees data:', error);
    }
  };
 
  const handleProgressChange = (event) => {
    const newProgress = event.target.value;
    setProgress(newProgress);
  };
 
 
 
 
 
 
 
 
  const departmentNames = ['Department1', 'Department2', 'Department3'];
  const locationNames = ['Location1', 'Location2', 'Location3'];
 
  const handleInProcessClick = () => {
    setShowInProcessContent(true);
    setSelectedButton('pip');
    setPipState('inProcess');
  };
 
 
   // Handle Completed button click
   const handleCompletedClick = async () => {
    setShowInProcessContent(false);
    setSelectedButton('pip');
    setPipState('completed');
    try {
      const response = await fetch('http://localhost:5001/CompletedEmployeesPIPData');
      const data = await response.json();
      setGridData(data);
    } catch (error) {
      console.error('Error fetching completed PIP data:', error);
    }
  };
 
  const handleAllEmployeesClick = () => {
    setShowInProcessContent(false);
    setSelectedButton('allEmployees');
  };
 
  const handleAddToPIP = async (employee) => {
    try {
      const response = await fetch('http://localhost:5001/addToPIP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });
      const data = await response.json();
      if (data.success) {
        alert('Employee added to PIP');
      }
    } catch (error) {
      console.error('Error adding to PIP:', error);
    }
  };
 
  const handleAddToAppraisals = async (employee) => {
    try {
      const response = await fetch('http://localhost:5001/addToAppraisals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });
      const data = await response.json();
      if (data.success) {
        alert('Employee added to Appraisals');
      }
    } catch (error) {
      console.error('Error adding to Appraisals:', error);
    }
  };
 
  useEffect(() => {
   
    fetchAllEmployeesPIPData();
   
  }, []);
 
  const fetchAllEmployeesPIPData = async () => {
    try {
      const response = await fetch('http://localhost:5001/AllEmployeesPIPData');
      const data = await response.json();
      setGridData(data);
    } catch (error) {
      console.error('Error fetching all employees PIP data:', error);
    }
  };
 
 
 
 
  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5001/updatePIPData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportingManager,
          initiatedBy,
          startDate,
          endDate,
          pipCompleted,
          employeeId: selectedEmployeeId, // Assuming you have a state variable for selected employee ID
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Data updated successfully');
        // Optionally, you can update the gridData state to reflect the changes immediately
        // fetchAllEmployeesPIPData(); // Uncomment this line if you want to refresh the data after update
      }
    } catch (error) {
      console.error('Error updating PIP data:', error);
    }
  };
 
 
 
 
 
  const handleToggleOffcanvas = () => {
    setIsOffcanvasVisible(!isOffcanvasVisible);
  };
 
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
 
  const handleDecision = (decision) => {
    // Handle the decision (e.g., update state or send a request to the server)
    console.log(`Decision made: ${decision}`);
  };
 
  return (
    <div>
      <div>
        <HRPerformance />
      </div>
      <div>
        <button
          type="button"
          className={`btn btn-${selectedButton === 'allEmployees' ? 'primary' : 'secondary'} btn-sm`}
          onClick={handleAllEmployeesClick}
        >
          All Employees
        </button>
        <button
  type="button"
  className={`btn btn-${selectedButton === 'pip' ? 'primary' : 'secondary'} btn-sm`}
  onClick={() => {
    handleInProcessClick(); // Call handleInProcessClick to set default state
    setSelectedButton('pip');
  }}
>
  PIP
</button>
 
        <button
          type="button"
          className={`btn btn-${selectedButton === 'appraisal' ? 'primary' : 'secondary'} btn-sm`}
          onClick={() => setSelectedButton('appraisal')}
        >
          Appraisal
        </button>
      </div>
 
      {selectedButton === 'pip' && (
        <div>
          <button
            type="button"
            className={`btn btn-${pipState === 'inProcess' ? 'primary' : 'secondary'} btn-sm`}
            onClick={handleInProcessClick}
          >
            In Process
          </button>
          <button
            type="button"
            className={`btn btn-${pipState === 'completed' ? 'primary' : 'secondary'} btn-sm`}
            onClick={handleCompletedClick}
          >
            Completed
          </button>
 
         
 
 
          {pipState === 'completed' && (
  <div>
    <h3>Completed Employees</h3>
    <table>
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>Employee Name</th>
          <th>Department</th>
          <th>Reporting Manager</th>
          <th>PIP Initiated By</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>PIP Duration</th>
        </tr>
      </thead>
      <tbody>
        {gridData.map((employee) => (
          <tr key={employee.Username}>
            <td>{employee.Username}</td>
            <td>{employee.EmployeeName}</td>
            <td>{employee.Department}</td>
            <td>{employee.ReportingManager}</td>
            <td>{employee.InitiatedBy}</td>
            <td>{employee.Start_Date}</td>
            <td>{employee.End_Date}</td>
            <td>{employee.PIP_Duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
 
 
 
          {showInProcessContent && (
            <div className='Hom'>
              {pipState === 'inProcess' && (
                <div className="first-row">
                 
                 
                  <div className="search-box-pip">
                    <h2>
                      Employees in PIP
                    </h2>
                    <input
        type="text"
        placeholder="Search by employee id"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
                    <button onClick={handleSearch}>Search</button>
                    <button onClick={handleClearSearch}>Clear</button>
                  </div>
                </div>
              )}
 
              {/* Table content */}
              <table>
        <thead>
          <tr >
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Reporting Manager</th>
            <th>PIP Initiated By</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>PIP Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {gridData.map((employee) => (
  <tr key={employee.Username}>
    <td>{employee.Username}</td>
    <td>{employee.EmployeeName}</td>
    <td>{employee.Department}</td>
    <td>{employee.ReportingManager}</td>
    <td>{employee.InitiatedBy}</td>
    <td>{employee.Start_Date}</td>
    <td>{employee.End_Date}</td>
    <td>{employee.PIP_Duration}</td>
    <td>
      <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" onClick={() => setSelectedEmployeeId(employee.Employee_ID)}>
        Take Decision
      </button>
    </td>
  </tr>
))}
</tbody>
 
      </table>
 
              {/* Pagination */}
              <div className="fourth-row">
                <div className="pagination-info">
                  {`Page ${currentPage} of ${totalPages}`}
                </div>
                <Pagination count={totalPages} page={currentPage} onChange={(e, page) => handlePageChange(page)} />
              </div>
 
              {/* Offcanvas */}
              <div className={`offcanvas offcanvas-end ${isOffcanvasVisible ? 'show' : ''}`} tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
  <div className="offcanvas-header">
    <h5 id="offcanvasRightLabel">Performance Improvement Plan</h5>
    <button type="button" className="btn-close text-reset custom-close-button" data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleToggleOffcanvas}></button>
  </div>
  <div className="offcanvas-body">
    <div>
      <label htmlFor="reportingManager">Reporting Manager:</label>
      <input type="text" id="reportingManager" value={reportingManager} onChange={(e) => setReportingManager(e.target.value)} />
    </div>
    <div>
      <label htmlFor="pipInitiatedBy">PIP Initiated By:</label>
      <input type="text" id="pipInitiatedBy" value={initiatedBy} onChange={(e) => setInitiatedBy(e.target.value)} />
    </div>
    <div>
      <label htmlFor="startDate">Start Date:</label>
      <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
    </div>
    <div>
      <label htmlFor="endDate">End Date:</label>
      <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
    </div>
    <div>
      <label htmlFor="pipcompleted">PIP Completed:</label>
      <div className='radiopip'>
        <label className='labelpip' htmlFor="yes">Yes</label>
        <input className='inputpip' type="radio" id="yes" name="pipCompleted" value="yes" checked={pipCompleted === 'yes'} onChange={() => setPipCompleted('yes')} />
      </div>
      <div className='radiopip'>
        <label className='labelpip' htmlFor="no">No</label>
        <input className='inputpip' type="radio" id="no" name="pipCompleted" value="no" checked={pipCompleted === 'no'} onChange={() => setPipCompleted('no')} />
      </div>
    </div>
 
    <div style={{ marginTop: '20px' }}>
      <button className="btn btn-primary" onClick={handleSave}>Save</button>
    </div>
  </div>
</div>
 
            </div>
          )}
        </div>
 
 
      )
     
      }
 
 
 
      {selectedButton === 'allEmployees' && (
        <div>
          <h3>All Employees</h3>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f0f0f0', color: 'white' }}>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Job Position</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allEmployeesData.map((employee) => (
                  <TableRow key={employee.EmployeeID}>
                    <TableCell>{employee.EmployeeID}</TableCell>
                    <TableCell>{employee.Applicant_Name}</TableCell>
                    <TableCell>{employee.Job_Position}</TableCell>
                    <TableCell>{employee.Department}</TableCell>
                    <TableCell>
                    <Button
  variant="contained"
  color="primary"
  onClick={() => {
    if (window.confirm("Do you want to add to PIP?")) {
      handleAddToPIP(employee);
    }
  }}
>
  PIP
</Button>
<Button
  variant="contained"
  color="secondary"
  onClick={() => {
    if (window.confirm("Do you want to add to Appraisal?")) {
      handleAddToAppraisals(employee);
    }
  }}
  style={{ marginLeft: '10px' }}
>
  Appraisal
</Button>
 
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
 
        </div>
      )}
 
{selectedButton === 'appraisal' && (
        <div>
          <h3>Appraisal</h3>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f0f0f0', color: 'white' }}>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Job Position</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appraisalData.map((employee) => (
                  <TableRow key={employee.Username}>
                    <TableCell>{employee.Username}</TableCell>
                    <TableCell>{employee.Employee_Name}</TableCell>
                    <TableCell>{employee.Job_Position}</TableCell>
                    <TableCell>{employee.Department}</TableCell>
                    <TableCell>
                    <Button
  variant="contained"
  color="secondary"
  onClick={() => {
    if (window.confirm("Do you want to delete?")) {
      handleDeleteRow(employee.Username);
    }
  }}
>
  Delete
</Button>
 
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
 
    </div>
  );
};
 
export default PIP;
 