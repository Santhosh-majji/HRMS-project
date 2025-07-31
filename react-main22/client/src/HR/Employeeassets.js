
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Typography, MenuItem, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
 
function Employeeassets() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState({
    AssetID: '',
    AssetName: '',
    Category: '',
    AssetType: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState({
    EmployeeID: '',
    EmployeeName: ''
  });
  const [assignedOn, setAssignedOn] = useState(''); // State for Assigned On date
  const [currentCondition, setCurrentCondition] = useState(''); // State for Current Condition
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar
 
  useEffect(() => {
    axios.get('http://localhost:5001/employeeassetdropdown')
      .then(response => {
        setAssets(response.data);
      })
      .catch(error => {
        console.error('Error fetching asset data:', error);
      });
 
    axios.get('http://localhost:5001/employeeassetemployeeid')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      });
  }, []);
 
  const handleAssetChange = (event) => {
    const assetID = event.target.value;
    const asset = assets.find(a => a.AssetID === assetID);
    if (asset) {
      setSelectedAsset(asset);
    }
  };
 
  const handleEmployeeChange = (event) => {
    const employeeID = event.target.value;
    const employee = employees.find(e => e.EmployeeID === employeeID);
    if (employee) {
      setSelectedEmployee(employee);
    }
  };
 
  const handleConditionChange = (event) => {
    setCurrentCondition(event.target.value);
  };
 
  const handleSubmit = () => {
    const data = {
      AssetID: selectedAsset.AssetID,
      AssetName: selectedAsset.AssetName,
      AssetCategory: selectedAsset.Category,
      AssetType: selectedAsset.AssetType,
      Username: selectedEmployee.EmployeeID, // Assuming Username is the EmployeeID
      EmployeeName: selectedEmployee.EmployeeName,
      AssignedOn: assignedOn,
      CurrentCondition: currentCondition
    };
 
    axios.post('http://localhost:5001/addEmployeeAssets', data)
      .then(response => {
        console.log('Data inserted successfully:', response.data);
        setOpenSnackbar(true); // Show success notification
        // Reset form fields
        setSelectedAsset({
          AssetID: '',
          AssetName: '',
          Category: '',
          AssetType: ''
        });
        setSelectedEmployee({
          EmployeeID: '',
          EmployeeName: ''
        });
        setAssignedOn('');
        setCurrentCondition('');
      })
      .catch(error => {
        console.error('Error inserting data:', error);
      });
  };
 
  const handleSnackbarClose = () => {
    setOpenSnackbar(false); // Close the snackbar
  };
 
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Employee Assets
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Asset ID"
            variant="outlined"
            value={selectedAsset.AssetID}
            onChange={handleAssetChange}
          >
            {assets.map((asset) => (
              <MenuItem key={asset.AssetID} value={asset.AssetID}>
                {asset.AssetID}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Asset Name"
            variant="outlined"
            value={selectedAsset.AssetName}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Asset Category"
            variant="outlined"
            value={selectedAsset.Category}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Asset Type"
            variant="outlined"
            value={selectedAsset.AssetType}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Employee ID"
            variant="outlined"
            value={selectedEmployee.EmployeeID}
            onChange={handleEmployeeChange}
          >
            {employees.map((employee) => (
              <MenuItem key={employee.EmployeeID} value={employee.EmployeeID}>
                {employee.EmployeeID}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Employee Name"
            variant="outlined"
            value={selectedEmployee.EmployeeName}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Assigned on"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={assignedOn}
            onChange={(e) => setAssignedOn(e.target.value)} // Update date state
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Current Condition"
            variant="outlined"
            value={currentCondition}
            onChange={handleConditionChange}
          >
            <MenuItem value="Excellent">Excellent</MenuItem>
            <MenuItem value="Good">Good</MenuItem>
            <MenuItem value="Fair">Fair</MenuItem>
            <MenuItem value="Poor">Poor</MenuItem>
            <MenuItem value="Needs Repair">Needs Repair</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} textAlign="left">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add
          </Button>
        </Grid>
      </Grid>
 
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Data inserted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
 
export default Employeeassets;
 
 