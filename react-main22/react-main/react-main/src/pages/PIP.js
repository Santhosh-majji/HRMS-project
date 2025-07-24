// PIP.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdFileDownload, MdMoreVert } from 'react-icons/md'; // Importing appropriate icons from react-icons library
import './PIP.css';
import Performance from './Performance';
import { useNavigate } from 'react-router-dom';

import Pagination from '@mui/material/Pagination';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const PIP = ({ totalPages, onPageChange }) => {
  const [showInProcessContent, setShowInProcessContent] = useState(true); // Set to true initially
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);
  const [defaultNameVisible, setDefaultNameVisible] = useState(true);
  const [showDirectReportsContent, setShowDirectReportsContent] = useState(false);
  const [selectedButton, setSelectedButton] = useState('inProcess'); // Set to 'inProcess' initially
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
        <Performance />
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
        <div className='Hom'  >
        <div class="custom-dropdowns-containers">
  <div class="custom-location-dropdowns">
    <label>Location:</label>
    <select>
      <option value="location1">Hyderabad</option>
      <option value="location2">Vizag</option>
      <option value="location3">Chennai</option>
    </select>
  </div>
  <div class="custom-department-dropdowns">
    <label>Department:</label>
    <select>
      <option value="dept1">HR</option>
      <option value="dept2">Frontend</option>
      <option value="dept3">Backend</option>
    </select>
  </div>
  <div class="custom-search-boxs">
    <input type="date"  />
    
  </div>
  <div class="custom-search-boxs">
    <input type="text" placeholder="Search..." />
    <button>Search</button>
  </div>
  
</div>


          <div className="second-rowss">
            <div className="record-count">
              {`${itemsPerPage * currentPage} of ${gridData.length} records`}
            </div>
            <div className="download-icon" >
              <MdFileDownload /> {/* Using MdFileDownload icon */}
            </div>
            <div className="select-options-icon">
              <MdMoreVert /> {/* Using MdMoreVert icon */}
            </div>
          </div>

          <div className="third-row">
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow style={{ backgroundColor: '#f0f0f0', color: 'white' }}>
                    <TableCell style={{fontWeight:'bolder',fontSize:'17px',color:'black'}} >Employee ID</TableCell>
                    
                    <TableCell style={{fontWeight:'bolder',fontSize:'17px',color:'black'}}>Employee Name</TableCell>
                    <TableCell style={{fontWeight:'bolder',fontSize:'17px',color:'black'}}>Department</TableCell>
                    <TableCell style={{fontWeight:'bolder',fontSize:'17px',color:'black'}}>Subdepartment</TableCell>
                    <TableCell style={{fontWeight:'bolder',fontSize:'17px',color:'black'}}>Reporting Manager</TableCell>
                    <TableCell style={{fontWeight:'bolder',fontSize:'17px',color:'black'}}>PIP Initiated By</TableCell>
                    <TableCell style={{fontWeight:'bolder',fontSize:'17px',color:'black'}}>Location</TableCell>
                    <TableCell style={{fontWeight:'bolder',fontSize:'17px',color:'black'}}>PIP Duration</TableCell>
                    <TableCell style={{fontWeight:'bolder',fontSize:'17px',color:'black'}}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gridData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell style={{fontWeight:'bolder',color:'Orange'}} >{row.id}</TableCell>
                      <TableCell style={{fontWeight:'bolder',color:'black'}}>{row.name}</TableCell>
                      <TableCell style={{fontWeight:'bolder',color:'black'}}>{row.department}</TableCell>
                      <TableCell style={{fontWeight:'bolder',color:'black'}}>{row.subdepartment}</TableCell>
                      <TableCell style={{fontWeight:'bolder',color:'black'}}>{row.reportingManager}</TableCell>
                      <TableCell style={{fontWeight:'bolder',color:'black'}}>{row.pipInitiatedBy}</TableCell>
                      <TableCell style={{fontWeight:'bolder',color:'black'}}>{row.location}</TableCell>
                      <TableCell style={{fontWeight:'bolder',fontSize:'17px',color:'green'}}>{row.pipDuration}</TableCell>
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

          <div className="fourth-row">
            <div className="pagination-info">
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
              <div className="bubble-container">
                <div className="bubble" onClick={() => handleDecision('EndPIP')}>
                  <div>
                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                  </div>
                  <div className='s'>
                    <label htmlFor="endPIPCheckbox"> End PIP and retain employee</label>
                  </div>
                </div>
                <div className="bubbles" onClick={() => handleDecision('EndPIP')}>
                  <div className='sa'>
                    <div>
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                    </div>
                    <div>
                      <label htmlFor="endPIPCheckbox"> Extend PIP till</label>
                    </div>
                    <div className='ip'>
                      <input type="date" id="endPIPDate" />
                    </div>
                  </div>
                </div>
                <div className="bubbl" onClick={() => handleDecision('EndPIP')}>
                  <div>
                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                  </div>
                  <div className='as'>
                    <label htmlFor="endPIPCheckbox"> Notify HR to initiate exit for employee</label>
                    <div className='note'>
                      <textarea id="noteBox" placeholder="Add a note..." rows="3" cols="30"></textarea>
                    </div>
                  </div>
                </div>
                <div className='su'>
                  <button onClick={() => handleDecision('EndPIP')}>Submit</button>
                </div>
              </div>
              <div className='act'>
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
              <div className='task'>
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

export default PIP;
