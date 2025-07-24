import React, { useEffect, useRef, useState } from 'react';
import './Jobopenings.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chart from "chart.js/auto";
import { faUsers, faUserTimes, faClock } from "@fortawesome/free-solid-svg-icons";
import HRInterviewprocess from './HRInterviewprocess';

function Jobopenings() {
  const [positionOption, setPositionOption] = useState('Position');
  const [assignedOption, setAssignedOption] = useState('Assigned');
  const [openingsOption, setOpeningsOption] = useState('Openings');
  const [candidatesOption, setCandidatesOption] = useState('Candidates');
  const [statusOption, setStatusOption] = useState('Status');
  const [tableData, setTableData] = useState([]);

  const handlePositionChange = (e) => {
    setPositionOption(e.target.value);
  };

  const handleAssignedChange = (e) => {
    setAssignedOption(e.target.value);
  };

  const handleOpeningsChange = (e) => {
    setOpeningsOption(e.target.value);
  };

  const handleCandidatesChange = (e) => {
    setCandidatesOption(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusOption(e.target.value);
  };

  const handleExport = () => {
    const newRow = {
      position: positionOption,
      assigned: assignedOption,
      openings: openingsOption,
      candidates: candidatesOption,
      status: statusOption
    };
    setTableData([...tableData, newRow]);
  };

  const cardsData = [
    { title: "Openings", value: 250, color: "white", icon: faUsers },
    { title: "In Progress", value: 30, color: "white", icon: faClock },
    { title: "Scheduled", value: 15, color: "white", icon: faClock },
    { title: "Offer Released", value: 15, color: "white", icon: faClock },
  ];

  const pieChartRef = useRef(null);

  useEffect(() => {
    const pieCtx = pieChartRef.current.getContext("2d");
    const pieChartData = {
      labels: ["Accepted", "Rejected"],
      datasets: [{
        data: [70, 30],
        backgroundColor: [ "#FF6384", "#FFCE56"],
        hoverBackgroundColor: [ "#FF476B", "#FFC845"],
      }],
    };

    const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
    };

    // Destroy previous chart instance if it exists
    if (pieChartRef.current.chart) {
      pieChartRef.current.chart.destroy();
    }

    // Create new chart instance
    pieChartRef.current.chart = new Chart(pieCtx, {
      type: "doughnut",
      data: pieChartData,
      options: pieChartOptions,
    });

    // Cleanup function
    return () => {
      // Ensure chart instance exists before attempting to destroy
      if (pieChartRef.current.chart) {
        pieChartRef.current.chart.destroy();
      }
    };
  }, []);

  return (
    <div>
      <HRInterviewprocess/>
      <div className="jobopenings-container">
        {cardsData.map((card, index) => (
          <div key={index} className="card" style={{ backgroundColor: card.color }}>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
            <FontAwesomeIcon icon={card.icon} className="icon" />
          </div>
        ))}
        <div className='chart-container'>
          <canvas ref={pieChartRef} className="chart"></canvas>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <select value={positionOption} onChange={handlePositionChange}>
                  <option value="Position">Position</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Lead DevOps">Lead DevOps</option>
                  <option value="Inside Sales">Inside Sales</option>
                  <option value="Product Manager">Product Manager</option>
                </select>
              </th>
              <th>
                <select value={assignedOption} onChange={handleAssignedChange}>
                  <option value="Assigned">Assigned</option>
                  <option value="Nirobi">Nirobi</option>
                  <option value="Tokyo">Tokyo</option>
                  <option value="Berlin">Berlin</option>
                  <option value="Rio">Rio</option>
                </select>
              </th>
              <th>
                <select value={openingsOption} onChange={handleOpeningsChange}>
                  <option value="Openings">Openings</option>
                  <option value="3">3</option>
                  <option value="30">30</option>
                  <option value="15">15</option>

                  <option value="25">25</option>
                </select>
              </th>
              <th>
                <select value={candidatesOption} onChange={handleCandidatesChange}>
                  <option value="Candidates">Candidates</option>
                  <option value="30">30</option>
                  <option value="42">42</option>
                  <option value="28">28</option>
                  <option value="52">52</option>
                </select>
              </th>
              <th>
                <select value={statusOption} onChange={handleStatusChange}>
                  <option value="Status">Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Hired">Hired</option>
                </select>
              </th>
              <th>
                <button className='exportb' onClick={handleExport}>Export Spreadsheet</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((rowData, index) => (
              <tr key={index}>
                <td>{rowData.position}</td>
                <td>{rowData.assigned}</td>
                <td>{rowData.openings}</td>
                <td>{rowData.candidates}</td>
                <td>{rowData.status}</td>
                <td><button className='viewb'>View Candidate</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Jobopenings;
