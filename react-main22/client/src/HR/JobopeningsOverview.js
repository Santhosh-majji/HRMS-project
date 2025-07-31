import React, { useEffect, useRef, useState } from 'react';
import './JobopeningsOverview.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chart from "chart.js/auto";
import { faUserPlus, faTasks, faCalendarAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

import {
  Box,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
} from '@mui/material';

function JobopeningsOverview() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [totalOpenings, setTotalOpenings] = useState(0);
  const [scheduledInterviews, setScheduledInterviews] = useState(0);
  const [releasedOffers, setReleasedOffers] = useState(0);
  const [applicantsInProgress, setApplicantsInProgress] = useState([]);
  const [acceptedPercentage, setAcceptedPercentage] = useState(0);
  const [rejectedPercentage, setRejectedPercentage] = useState(0);

  const pieChartRef = useRef(null);

  useEffect(() => {
    fetchOpeningsOverview();
    fetchPieChartData();
  }, []);

  const fetchOpeningsOverview = async () => {
    try {
      const response = await fetch('http://localhost:5001/OpeningsOverview');
      const data = await response.json();
      setTotalApplicants(data.totalApplicants);
      setTotalOpenings(data.totalOpenings);
      setScheduledInterviews(data.scheduledInterviews);
      setReleasedOffers(data.releasedOffers);
      setApplicantsInProgress(data.applicantsInProgress || []); // Ensure the data is always an array
    } catch (error) {
      console.error('Error fetching openings overview:', error);
    }
  };

  const fetchPieChartData = async () => {
    try {
      const response = await fetch('http://localhost:5001/pieChartData');
      const data = await response.json();
      setAcceptedPercentage(data.acceptedPercentage);
      setRejectedPercentage(data.rejectedPercentage);
      updatePieChart(data.acceptedPercentage, data.rejectedPercentage);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  const updatePieChart = (acceptedPercentage, rejectedPercentage) => {
    const pieCtx = pieChartRef.current.getContext("2d");
    const pieChartData = {
      labels: ["Accepted", "Rejected"],
      datasets: [{
        data: [acceptedPercentage, rejectedPercentage],
        backgroundColor: ["#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#FF476B", "#FFC845"],
      }],
    };

    const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
    };

    if (pieChartRef.current && pieChartRef.current.chart) {
      pieChartRef.current.chart.destroy();
    }

    pieChartRef.current = new Chart(pieCtx, {
      type: "doughnut",
      data: pieChartData,
      options: pieChartOptions,
    });
  };

  const headers = [
    "Applicant ID",
    "Applicant Name",
    "Job Position",
    "Gender",
    "Email ID",
    "Phone Number",
    "Applied Date"
  ];

  return (
    <Container>

      <Box sx={{ my: 4 }}>
        <Grid container spacing={2} alignItems="stretch">
          {[
            { title: "Total Openings", value: totalOpenings, icon: faUserPlus },
            { title: "Total Applicants", value: totalApplicants, icon: faTasks },
            { title: "Scheduled Interviews", value: scheduledInterviews, icon: faCalendarAlt },
            { title: "Offer Letters Released", value: releasedOffers, icon: faCheckCircle },
          ].map((card, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {card.title} <FontAwesomeIcon icon={card.icon} />
                </Typography>
                <Typography variant="h4" component="div">
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <canvas ref={pieChartRef} className="chart"></canvas>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5">Applicants Currently Undergoing Interview Process</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {applicantsInProgress.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((applicant, index) => (
                <TableRow key={index}>
                  <TableCell>{applicant.Applicant_ID}</TableCell>
                  <TableCell>{applicant.Applicant_Name}</TableCell>
                  <TableCell>{applicant.Job_Position}</TableCell>
                  <TableCell>{applicant.Gender}</TableCell>
                  <TableCell>{applicant.Email_ID}</TableCell>
                  <TableCell>{applicant.Phone_Number}</TableCell>
                  <TableCell>{applicant.AppliedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          >
            Prev
          </Button>
          <Typography sx={{ mx: 2 }}>{currentPage} / {Math.ceil(applicantsInProgress.length / itemsPerPage)}</Typography>
          <Button
            variant="contained"
            onClick={() => setCurrentPage(currentPage < Math.ceil(applicantsInProgress.length / itemsPerPage) ? currentPage + 1 : Math.ceil(applicantsInProgress.length / itemsPerPage))}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default JobopeningsOverview;
