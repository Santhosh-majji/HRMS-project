
import React, { useState, useEffect } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Box,
} from '@mui/material';

function Offer() {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [offerLetterContent, setOfferLetterContent] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [salary, setSalary] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 4;
 
  useEffect(() => {
    fetch('http://localhost:5001/OfferLetterApplicants')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      })
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);
 
  const generateOfferLetterContent = (employees) => {
    return employees.map((employee) => `
      Offer Letter
 
      Candidate ID: ${employee.applicantId}
      Candidate Name: ${employee.applicantName}
      Candidate Email: ${employee.emailId}
      Candidate Phone Number: ${employee.phoneNumber}
      Job Position: ${employee.jobPosition}
     
      Onboarding Date: ${startDate}
      Salary: ${salary}
 
      Dear ${employee.applicantName},
 
      We are pleased to offer you the full-time position of ${employee.jobPosition} with a start date of ${startDate}. It is in our opinion that your abilities and experience will be the perfect fit for our company.
 
      Your starting salary for this position will be ${salary}.
 
      We look forward to having you on our team!
 
      Sincerely,
      HR Admin
    `).join('\n\n');
  };
 
  const sendOfferLetters = async () => {
    if (!startDate || !salary) {
      alert('Please fill in all fields.');
      return;
    }
 
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee to generate the offer letters.');
      return;
    }
 
    try {
      const generatePDFResponse = await fetch('http://localhost:5001/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selectedEmployees, startDate, salary })
      });
 
      if (!generatePDFResponse.ok) {
        throw new Error('Failed to generate PDFs.');
      }
 
      const generatePDFData = await generatePDFResponse.json();
      console.log('PDFs generated successfully:', generatePDFData);
 
      const sendLettersResponse = await fetch('http://localhost:5001/insert-into-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selectedEmployees, startDate, salary, fileNames: generatePDFData.fileNames })
      });
 
      if (!sendLettersResponse.ok) {
        throw new Error('Failed to send offer letters.');
      }
 
      console.log('Offer letters sent successfully.');
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        setOfferLetterContent('');
        setSelectedEmployees([]);
        setStartDate('');
        setSalary('');
      }, 2000);
    } catch (error) {
      console.error('Error sending offer letters:', error);
      alert('Failed to send offer letters. Please try again.');
    }
  };
 
  const handleEmployeeSelection = (employee) => {
    setSelectedEmployees((prevSelectedEmployees) => {
      const isSelected = prevSelectedEmployees.some((emp) => emp.applicantId === employee.applicantId);
 
      if (isSelected) {
        return prevSelectedEmployees.filter((emp) => emp.applicantId !== employee.applicantId);
      } else {
        return [...prevSelectedEmployees, employee];
      }
    });
  };
 
  const handleSelectAll = () => {
    setSelectedEmployees((prevSelectedEmployees) => {
      const allSelected = prevSelectedEmployees.length === employees.length;
 
      if (allSelected) {
        return [];
      } else {
        return employees;
      }
    });
  };
 
  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };
 
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };
 
  const displayEmployees = employees.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
 
  return (
    <div style={{ margin: '0 auto', maxWidth: 1200, padding: '0 20px' }}>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4">Offer Letter</Typography>
        <Button variant="contained" onClick={() => setOfferLetterContent(generateOfferLetterContent(selectedEmployees))}>
          Generate Offer Letter
        </Button>
      </Box>
 
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selectedEmployees.length === employees.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Applicant ID</TableCell>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Job Position</TableCell>
              <TableCell>Email ID</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayEmployees.map((employee) => (
              <TableRow key={employee.applicantId}>
                <TableCell>
                  <Checkbox
                    checked={selectedEmployees.some((emp) => emp.applicantId === employee.applicantId)}
                    onChange={() => handleEmployeeSelection(employee)}
                  />
                </TableCell>
                <TableCell>{employee.applicantId}</TableCell>
                <TableCell>{employee.applicantName}</TableCell>
                <TableCell>{employee.jobPosition}</TableCell>
                <TableCell>{employee.emailId}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                <TableCell>{employee.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
 
      <Box display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrevPage}
          disabled={page === 0}
        >
          Prev
        </Button>
        <Typography variant="body1" mx={2}>
          {page + 1} / {Math.ceil(employees.length / rowsPerPage)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextPage}
          disabled={page >= Math.ceil(employees.length / rowsPerPage) - 1}
        >
          Next
        </Button>
      </Box>
 
      {offerLetterContent && (
        <div>
          <Typography variant="h4" gutterBottom>Offer Letter Sample</Typography>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {offerLetterContent}
          </pre>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <TextField
              label="Onboarding Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder="dd-mm-yyyy"
              sx={{ flexGrow: 1, flexBasis: '25%', mr: 2 }}
            />
            <TextField
              label="Salary"
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              sx={{ flexGrow: 1, flexBasis: '25%', mr: 2 }}
            />
            <Button
              variant="contained"
              onClick={sendOfferLetters}
              startIcon={<FaEnvelope />}
              sx={{ flexGrow: 1, flexBasis: '25%' }}
            >
              Send Offer Letter
            </Button>
          </Box>
        </div>
      )}
 
      {showSuccessAlert && (
        <Typography className="success-alert" color="success" mt={2}>
          Offer letters sent successfully!
        </Typography>
      )}
    </div>
  );
}
 
export default Offer;
 
 