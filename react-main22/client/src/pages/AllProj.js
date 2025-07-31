import React, { useState } from 'react';
import './AllProj.css'
import { Link, useNavigate } from 'react-router-dom';

const AllProj = () => {
  const navigate = useNavigate();

  const viewItem = (id, rowIndex) => {
    if (rowIndex === 0) {
      navigate(`/aitestingproject/${id}`);
    } else if (rowIndex === 1) {
      navigate(`/debuggingproj/${id}`);
    }
  };



  

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const projects = [
    { 
      projectId: 1,
      projectName: 'AI Testing Project',
      projectManager: 'Kane Williamson',
      clientId: 1,
      clientName: 'Morgan Stanley',
      status: 'In Progress',
      startDate: '2023-05-01',
      endDate: '2023-05-31'
    },
    { 
      projectId: 2,
      projectName: 'Debugging Project',
      projectManager: 'David',
      clientId: 2,
      clientName: 'Sigma Seven',
      status: 'In Progress',
      startDate: '2023-05-01',
      endDate: '2023-05-31'
    },
    // Add more projects as needed
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };
  return (
    <div className='container-fluid'>
      <div className="allText">
        <div className="d-flex justify-content-between">
          <h4>All Projects</h4>
        </div>
        <p>The following are the list of projects and their details.</p>
      </div>

      <div className="row ClientSearch d-flex justify-content-between">
        {/* Your filters and search bar JSX */}
      </div>

      <div className="row clientDataGrid table-responsive">   
        <table className="table table-hover">
          <thead className='clientTableHeader'>
            <tr>
              <th scope="col">SELECT</th>
              <th scope="col">Project ID</th>
              <th scope="col">Project Name</th>
              <th scope="col">Project Manager</th>
              <th scope="col">Client ID</th>
              <th scope="col">Client Name</th>
              <th scope="col">Status</th>
              <th scope="col">Duration (Days)</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((project, index) => (
              <tr key={index}>
                <th scope="row">
                  <input type="checkbox" />
                </th>
                <td>{project.projectId}</td>
                <td>{project.projectName}</td>
                <td>{project.projectManager}</td>
                <td>{project.clientId}</td>
                <td>{project.clientName}</td>
                <td>{project.status}</td>
                <td>{calculateDuration(project.startDate, project.endDate)}</td>
                <td className='actionIcons'>
                  <button className="btn btn-link p-0" onClick={() => viewItem(project.projectId, index)}>
                    Active
                  </button>
                  <button className="btn btn-link p-0">
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="pageNavigations">
        <button
          className="btn btn-sm border previous"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          &laquo; Previous
        </button>
        <button
          className="btn btn-sm border btn-secondary next"
          onClick={handleNextPage}
          disabled={currentItems.length < itemsPerPage}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
}

export default AllProj;
