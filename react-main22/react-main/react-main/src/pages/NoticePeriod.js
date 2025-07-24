// src/NoticePeriod.js

import React, { useState } from 'react';
import {
  Drawer,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Organizational from './Organizational';
const departments = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'HR', value: 'hr' },
  { label: 'Sales', value: 'sales' },
];

const positions = {
  engineering: [
    { label: 'Junior Developer', value: 'junior_developer' },
    { label: 'Senior Developer', value: 'senior_developer' },
    { label: 'Manager', value: 'manager' },
  ],
  hr: [
    { label: 'HR Assistant', value: 'hr_assistant' },
    { label: 'HR Manager', value: 'hr_manager' },
  ],
  sales: [
    { label: 'Sales Associate', value: 'sales_associate' },
    { label: 'Sales Manager', value: 'sales_manager' },
  ],
};

const employmentTypes = [
  { label: 'Full-Time', value: 'full_time' },
  { label: 'Part-Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
];

const NoticePeriod = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [tenure, setTenure] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [data, setData] = useState([]);

  const handleCalculate = () => {
    let calculatedNoticePeriod = `${tenure * 2} days`; // Example calculation based on tenure
    setNoticePeriod(calculatedNoticePeriod);

    if (editMode) {
      const updatedData = data.map((item) =>
        item.id === currentId
          ? { id: currentId, department, position, employmentType, tenure, noticePeriod: calculatedNoticePeriod }
          : item
      );
      setData(updatedData);
      setEditMode(false);
    } else {
      const newData = {
        id: data.length + 1,
        department,
        position,
        employmentType,
        tenure,
        noticePeriod: calculatedNoticePeriod,
      };
      setData([...data, newData]);
    }

    // Reset form fields
    setDepartment('');
    setPosition('');
    setEmploymentType('');
    setTenure('');
    setNoticePeriod('');
    setDrawerOpen(false);
  };

  const handleEdit = (id) => {
    const item = data.find((d) => d.id === id);
    setDepartment(item.department);
    setPosition(item.position);
    setEmploymentType(item.employmentType);
    setTenure(item.tenure);
    setNoticePeriod(item.noticePeriod);
    setCurrentId(id);
    setEditMode(true);
    setDrawerOpen(true);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

  return (
    <div className='positionPage'>
      <div>
        <Organizational />
      </div>
    <Container>
      <Typography variant="h4" gutterBottom>
        Notice Period Management
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDrawerOpen(true)}>
        Add Notice Period
      </Button>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Container style={{ width: 300, padding: '20px' }}>
          <Typography variant="h5" gutterBottom>
            {editMode ? 'Edit Notice Period' : 'Add Notice Period'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Department"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPosition('');
                }}
                fullWidth
              >
                {departments.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                fullWidth
                disabled={!department}
              >
                {department &&
                  positions[department].map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Employment Type"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                fullWidth
              >
                {employmentTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tenure (years)"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                type="number"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleCalculate}>
                {editMode ? 'Update' : 'Save'} Notice Period
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Drawer>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Employment Type</TableCell>
              <TableCell>Tenure (years)</TableCell>
              <TableCell>Notice Period</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.employmentType}</TableCell>
                <TableCell>{row.tenure}</TableCell>
                <TableCell>{row.noticePeriod}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(row.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </div>
  );
};

export default NoticePeriod;
