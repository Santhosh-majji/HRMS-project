import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdFileDownload, MdMoreVert } from 'react-icons/md'; // Importing appropriate icons from react-icons library
import './UpdatedPIP.css'; // Updated CSS file
import HRPerformance from './HRPerformance';
import { useNavigate } from 'react-router-dom';

import Pagination from '@mui/material/Pagination';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const UpdatedPIP = ({ totalPages, onPageChange }) => {
  const [showInProcessContent, setShowInProcessContent] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);
  const [defaultNameVisible, setDefaultNameVisible] = useState(true);
  const [showDirectReportsContent, setShowDirectReportsContent] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(50);

  const handleProgressChange = (event) => {
    const newProgress = event.target.value;
    setProgress(newProgress);
  };

  const departmentNames = ['Department1', 'Department2', 'Department3'];
  const locationNames = ['Location1', 'Location2', 'Location3'];

  const handleInProcessClick = () => {
    setShowInProcessContent(true);
    setSelectedButton('inProcess');
  };

  const handleCompletedClick = () => {
    setShowInProcessContent(false);
    setSelectedButton('completed');
  };

  const handleTakeDecision = (row) => {
    setIsOffcanvasVisible(true);
  };

  const itemsPerPage = 6;
  const gridData = [
    { id: 1, name: 'John Doe', date: '2022-02-22', location: 'Location1', department: 'Department1', subdepartment: 'SubDepartment1', reportingManager: 'Manager1', pipInitiatedBy: 'Initiator1', pipDuration: '2 months' },
    { id: 2, name: 'Jane Smith', date: '2022-02-23', location: 'Location2', department: 'Department2', subdepartment: 'SubDepartment2', reportingManager: 'Manager2', pipInitiatedBy: 'Initiator2', pipDuration: '3 months' },
    { id: 3, name: 'Bob Johnson', date: '2022-02-24', location: 'Location3', department: 'Department3', subdepartment: 'SubDepartment3', reportingManager: 'Manager3', pipInitiatedBy: 'Initiator3', pipDuration: '4 months' },
    { id: 4, name: 'Alice Brown', date: '2022-02-25', location: 'Location1', department: 'Department1', subdepartment: 'SubDepartment1', reportingManager: 'Manager1', pipInitiatedBy: 'Initiator1', pipDuration: '2 months' },
    { id: 5, name: 'Charlie Green', date: '2022-02-26', location: 'Location2', department: 'Department2', subdepartment: 'SubDepartment2', reportingManager: 'Manager2', pipInitiatedBy: 'Initiator2', pipDuration: '3 months' },
  ];

  const handlePageChange = (page) => {
    const newCurrentPage = Math.min(Math.max(1, page), totalPages);
    onPageChange(newCurrentPage);
    setCurrentPage(newCurrentPage);
  };

  const handleToggleOffcanvas = () => {
    setIsOffcanvasVisible(!isOffcanvasVisible);
  };

  const handleDecision = (decision) => {
    console.log(`Decision: ${decision}`);
  };

  return (
    <div>
      <div>
        <HRPerformance />
      </div>
      <button
        type="button"
        className={`btn btn-${selectedButton === 'inProcess' ? 'primary' : 'secondary'} btn-sm`}
        onClick={handleInProcessClick}
      >
        In Process
      </button>
      <button
        type="button"
        className={`btn btn-${selectedButton === 'completed' ? 'primary' : 'secondary'} btn-sm`}
        onClick={handleCompletedClick}
      >
        Completed
      </button>

      {showInProcessContent && (
        <div className='UpdatedHom'> {/* Updated class name */}
          <div className="UpdatedFirstRow"> {/* Updated class name */}
            <div className="UpdatedDepartmentDropdowns"> {/* Updated class name */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departmentNames.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="UpdatedLocationDropdowns"> {/* Updated class name */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locationNames.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div className='UpdatedStartDates'> {/* Updated class name */}
              <input type="date" id="endPIPDate" />
            </div>
            <div className="UpdatedSearchBoxs"> {/* Updated class name */}
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="UpdatedSecondRowss"> {/* Updated class name */}
            <div className="UpdatedRecordCount"> {/* Updated class name */}
              {`${itemsPerPage * currentPage} of ${gridData.length} records`}
            </div>
            <div className="UpdatedDownloadIcon" >
              <MdFileDownload /> {/* Using MdFileDownload icon */}
            </div>
            <div className="UpdatedSelectOptionsIcon">
              <MdMoreVert /> {/* Using MdMoreVert icon */}
            </div>
          </div>

          <div className="UpdatedThirdRow"> {/* Updated class name */}
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow style={{ backgroundColor: '#f0f0f0', color: 'white' }}>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Subdepartment</TableCell>
                    <TableCell>Reporting Manager</TableCell>
                    <TableCell>PIP Initiated By</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>PIP Duration</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gridData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.subdepartment}</TableCell>
                      <TableCell>{row.reportingManager}</TableCell>
                      <TableCell>{row.pipInitiatedBy}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.pipDuration}</TableCell>
                      <TableCell>
                        <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" onClick={handleToggleOffcanvas}>
                          Take Decision
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="UpdatedFourthRow"> {/* Updated class name */}
            <div className="UpdatedPaginationInfo"> {/* Updated class name */}
              {`Page ${currentPage} of ${totalPages}`}
            </div>
            <Pagination count={totalPages} page={currentPage} onChange={(e, page) => handlePageChange(page)} />
          </div>

          <div className={`offcanvas offcanvas-end ${isOffcanvasVisible ? 'show' : ''}`} tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div className="offcanvas-header">
              <h5 id="offcanvasRightLabel">Performance Improvement Plan</h5>
              <button type="button" className="btn-close text-reset custom-close-button" data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleToggleOffcanvas}></button>
            </div>
            <div className="offcanvas-body">
              <h3 style={{ marginBottom: '20px' }}>Decision</h3>
              <div className="UpdatedBubbleContainer"> {/* Updated class name */}
                <div className="UpdatedBubble" onClick={() => handleDecision('EndPIP')}>
                  <div>
                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                  </div>
                  <div className='UpdatedS'> {/* Updated class name */}
                    <label htmlFor="endPIPCheckbox"> End PIP and retain employee</label>
                  </div>
                </div>
                <div className="UpdatedBubbles" onClick={() => handleDecision('EndPIP')}>
                  <div className='UpdatedSa'> {/* Updated class name */}
                    <div>
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                    </div>
                    <div>
                      <label htmlFor="endPIPCheckbox"> Extend PIP till</label>
                    </div>
                    <div className='UpdatedIp'> {/* Updated class name */}
                      <input type="date" id="endPIPDate" />
                    </div>
                  </div>
                </div>
                <div className="UpdatedBubbl" onClick={() => handleDecision('EndPIP')}>
                  <div>
                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                  </div>
                  <div className='UpdatedAs'> {/* Updated class name */}
                    <label htmlFor="endPIPCheckbox"> Notify HR to initiate exit for employee</label>
                    <div className='UpdatedNote'> {/* Updated class name */}
                      <textarea id="noteBox" placeholder="Add a note..." rows="3" cols="30"></textarea>
                    </div>
                  </div>
                </div>
                <div className='UpdatedSu'> {/* Updated class name */}
                  <button onClick={() => handleDecision('EndPIP')}>Submit</button>
                </div>
              </div>
              <div className='UpdatedAct'> {/* Updated class name */}
                <h3>Activity</h3>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Write your comment here and press enter"
                  onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                      const comment = event.target.value;
                      // Handle the comment (e.g., call a function with the comment)
                      console.log(comment);
                      event.target.value = ''; // Clear the input after handling the comment
                    }
                  }}
                />
              </div>
              <div>
              </div>
              <div className='UpdatedTask'> {/* Updated class name */}
                <h3>PIP</h3>
                <progress value={progress} max="100"></progress>
                <input
                  type="range"
                  value={progress}
                  onChange={handleProgressChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatedPIP;
