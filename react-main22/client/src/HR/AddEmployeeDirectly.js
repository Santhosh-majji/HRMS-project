
import React from 'react';
import { Grid, TextField, Button, MenuItem, Box } from '@mui/material';
 
const AddEmployeeDirectly = () => {
  return (
    <Box
      sx={{
        padding: '8px', // Small padding around the UI
        margin: '16px 8px 0 8px', // Small gap on top, right, and left sides
      }}
    >
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="First Name"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Middle Name"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Last Name"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Phone Number"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Email Address"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              required
              label="Gender"
              fullWidth
              variant="outlined"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Marital Status"
              fullWidth
              variant="outlined"
            >
              <MenuItem value="Unmarried">Unmarried</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Address"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Shift Name"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Shift ID"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Date Of Joining "
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Job Position"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Department"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
          <TextField
              select
              label="Role"
              fullWidth
              variant="outlined"
            >
              <MenuItem value="Superadmin">Super Admin</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Hr">HR</MenuItem>
              <MenuItem value="Employree">Employree</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="primary" style={{ width: 'auto' }}>
              Add Employee
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
 
export default AddEmployeeDirectly;
 
 