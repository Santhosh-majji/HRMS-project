
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tab } from '@mui/base/Tab';
import { TabsList } from '@mui/base/TabsList';
import { TabPanel } from '@mui/base/TabPanel';
import { Tabs } from '@mui/base/Tabs';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
 
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
 
const DateInput = () => {
  const [selectedDate, setSelectedDate] = useState(null);
 
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
 
  return (
    <div>
      <h6>Select a Date:</h6>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
      />
      {selectedDate && (
        <p>Selected Date: {selectedDate.toISOString().slice(0, 10)}</p>
      )}
    </div>
  );
};
 
const card1 = (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        <div>
          Unplanned Leave
        </div>
        <div>
          <DateInput />
        </div>
      </Typography>
      <hr />
      <Typography variant="h10" component="div">
        No Employees has taken un-planned leave in the selected duration
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
      </Typography>
      <Typography variant="body2">
        <br />
      </Typography>
    </CardContent>
    <CardActions>
    </CardActions>
  </React.Fragment>
);
 
const card2 = (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        No leave taken 30 feb 2024-5 mar 2024
      </Typography>
      <div>
        <DateInput />
      </div>
      <hr />
      <Typography variant="h5" component="div">
 
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        adjective
      </Typography>
      <Typography variant="body2">
        well meaning and kindly.
        <br />
        {'"a benevolent smile"'}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small"></Button>
    </CardActions>
  </React.Fragment>
);
 
const card3 = (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Most leave taken
      </Typography>
      <div>
        <DateInput />
      </div>
      <hr />
      <Typography variant="h10" component="div">
        No empolyees have taken leave in the selected in duration
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
      </Typography>
      <Typography variant="body2">
        <br />
      </Typography>
    </CardContent>
    <CardActions>
    </CardActions>
  </React.Fragment>
);
 
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2000, 1698, 8800, 3608, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];
 
function createData(name, calories, fat, carbs, protein, aa, bb) {
  return { name, calories, fat, carbs, protein, aa, bb };
}
 
const rows = [
  createData('AAAA', 159, 6.0, 24, 4.0, 40, 20),
  createData('BBBB', 237, 9.0, 37, 4.3,20,30 ),
  createData('CCCC', 262, 16.0, 24, 6.0,40,40),
  createData('DDDD', 305, 3.7, 67, 4.3,3.5,4),
  createData('EEEE', 356, 16.0, 49, 3.9,30,3.1),
  createData('FFFF', 356, 16.0, 49, 3.9,20,20),
];
 
export const Leave1 = () => {
  return (
    <div className="tabs-container">
      <Tabs defaultValue={1}>
        <TabsList className="tabs-list">
          <Tab value={1} className="tab" style={{spacebetween: '20px', border:'none',marginRight:'50px', fontSize:'20px', }}>
            Summary
          </Tab>
          <Tab value={2} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
            Leave
          </Tab>
          <Tab value={3} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
            Attendance
          </Tab>
          <Tab value={4} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
            Travel
          </Tab>
          <Tab value={5} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
            Timesheet
          </Tab>
          <Tab value={6} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
            Profile
          </Tab>
          <Tab value={7} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
            Performance
          </Tab>
          <Tab value={8} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
            Hiring
          </Tab>
        </TabsList>
        <TabPanel value={1} className="tab-panel">
         
        </TabPanel><br />
        <TabPanel value={2} className="tab-panel">
          <TabsList className="tabs-list">
            <Tab value={1} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px', }}>
              Leaveover View
            </Tab>
            <Tab value={2} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
              Leave Approvals
            </Tab>
            <Tab value={3} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
              Penalized Leave
            </Tab>
            <Tab value={4} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
              Past Leave
            </Tab>
            <Tab value={5} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
              Requests
            </Tab>
            <Tab value={6} className="tab" style={{border:'none', marginRight:'50px', fontSize:'20px'}}>
              Reports
            </Tab>
          </TabsList>
         
        </TabPanel>
        <TabPanel value={3} className="tab-panel">
         
        </TabPanel>
        <TabPanel value={4} className="tab-panel">
         
        </TabPanel>
        <TabPanel value={5} className="tab-panel">
         
        </TabPanel>
        <TabPanel value={6} className="tab-panel">
         
        </TabPanel>
        <TabPanel value={7} className="tab-panel">
         
        </TabPanel>
        <TabPanel value={8} className="tab-panel">
         
        </TabPanel>
      </Tabs>
      {/* <DateInput /> */}
      <div className='three'>
        <h6 style={{ marginTop:'20px' }}>Leave Consumption Trend</h6>
        <table className="styled-table">
          <thead><br />
            <tr>
              <th></th>
              <th>TOTAL SICK LEAVE</th>
              <th >TOTAL PAID LEAVE</th>
              <th >TOTAL UNPAID LEAVE</th>
              <th>TOTAL CASUAL LEAVE</th>
            </tr>
          </thead>
        </table>
        <LineChart
          width={1000}
          height={400}
          series={[
            { data: pData, label: 'sick' },
            { data: uData, label: 'paid' },
          ]}
          xAxis={[{ scaleType: 'point', data: xLabels }]}
        />
      </div>
      <div className='box1'>
        <Grid container spacing={2}>
          {[card1, card2, card3].map((cardContent, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Box sx={{ minWidth: 275 }} className='box'>
                <Card variant="outlined">{cardContent}</Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Employee Details</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Location</TableCell>
                <TableCell align="right">Sick Leave</TableCell>
                <TableCell align="right">Paid Leave</TableCell>
                <TableCell align="right">Unpaid Leave</TableCell>
                <TableCell align="right">Casual Leave</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                  <TableCell align="right">{row.aa}</TableCell>
                  <TableCell align="right">{row.bb}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
 