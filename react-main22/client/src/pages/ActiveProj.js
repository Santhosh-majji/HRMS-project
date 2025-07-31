import React, { useState } from 'react';
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';
import './ActiveProj.css'

const ActiveProj = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const [itemsPerPage] = useState(3);

  const projects = [
    { projectId: '123', projectName: 'AI Testing Project', clientId: 'MS001', clientName: 'Morgan Stanley', managerId: 'M01', startDate: 'May 01, 2023', endDate: 'May 31, 2023', projectManager: 'Kane Williamson' },
    { projectId: '124', projectName: 'Debugging Project', clientId: 'SS001', clientName: 'Sigma Seven', managerId: 'M02', startDate: 'May 01, 2023', endDate: 'May 31, 2023', projectManager: 'David' },
    { projectId: '125', projectName: 'Retention Metric Alignment', clientId: 'NF001', clientName: 'Netflix', managerId: 'M03', startDate: 'May 01, 2023', endDate: 'May 31, 2023', projectManager: 'Jhony Walker' },
    { projectId: '126', projectName: 'Streamline Supply Chain', clientId: 'HR001', clientName: 'Heritage', managerId: 'M04', startDate: 'Apr 01, 2023', endDate: 'Aug 19, 2025', projectManager: 'Sandy Edge' },
    { projectId: '127', projectName: 'Web Development', clientId: 'PD001', clientName: 'Paradox', managerId: 'M05', startDate: 'Apr 01, 2023', endDate: 'Nov 20, 2024', projectManager: 'Salasiah Hasan' },
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

  return (
    <div className='container-fluid'>
      <div className="activeText">
        <div className="d-flex justify-content-between">
          <h4>Active Projects</h4>
          <button className="btn btn-sm mb-1 btn-primary" type="button" id='createProj' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
            +Create Project
          </button>
        </div>
        <p>The following are the list of projects which are in progress.</p>
      </div>

      <div className="row ClientSearch d-flex justify-content-between">
        <div className="col-lg-3 col"> 
          <div className="dropdown clientDropdown">
            <button className='btn btn-sm customBorder clientDropdownToggle dropdown-toggle border' 
                    type="button" 
                    id="clientDropdownMenuButton" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false">
              Client
            </button>
            <ul className="dropdown-menu clientDropdownOptions" aria-labelledby="dropdownMenuButton">
              <li>
                <div className="container-fluid">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckCS"/>
                    <label className="form-check-label" htmlFor="flexCheckCS">Morgan Stanley</label>
                  </div>
                </div>
              </li>
              {/* Add more client options */}
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col">
          <form className="input-group ActiveProjSearch">
            <input type="search" className="form-control" placeholder="Search..." aria-label="Search" aria-describedby="basic-addon2"/>
          </form>
        </div>
      </div>

      <div className="row clientDataGrid table-responsive">
        <table className="table table-hover">
          <thead className='clientTableHeader'>
            <tr>
              <th scope="col">SELECT</th>
              <th scope="col">PROJECT Name</th>
              <th scope="col">CLIENT ID</th>
              <th scope="col">CLIENT NAME</th>
              <th scope="col">PROJECT ID</th>
              <th scope="col">MANAGER ID</th>
              <th scope="col">START DATE</th>
              <th scope="col">END DATE</th>
              <th scope="col">PROJECT MANAGER</th>
              <th scope="col">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((project, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{project.projectName}</td>
                <td>{project.clientId}</td>
                <td>{project.clientName}</td>
                <td>{project.projectId}</td>
                <td>{project.managerId}</td>
                <td>{project.startDate}</td>
                <td>{project.endDate}</td>
                <td>{project.projectManager}</td>
                <td className='actionIcons'>
                  <RiEdit2Line className="edit-icon" />
                  <RiDeleteBin6Line className="delete-icon" />
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
      
      <div className="offcanvas offcanvas-end " tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: "89%", maxWidth: "450px" }}>
        <div className="offcanvas-header">
          <h6 className="offcanvas-title" id="offcanvasRightLabel">Create Project</h6>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <form>
            <div className="mb-2">
              <label htmlFor="projName" className="form-label">Project Name</label>
              <input type='text' className='form-control' id='projName'/>
              <div className='description text-info'>+Add Description</div>
            </div>
            <div className="row clientProjCodeOffcanvas">
              <div className="col">
                <div className="mb-3">
                  <label htmlFor="clientName" className="form-label">Client</label>
                  <select className="form-select" id="componentType" aria-label="Select Component Type">
                    {/* <option value="" disabled selected>Rate units</option> */}
                    <option value="AltFuture">AltFuture</option>
                    <option value="option2">option2</option>
                    <option value="option3">option3</option>
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label htmlFor="Project Code" className="form-label">Project Code</label>
                  <input type="text" className="form-control" id="employeeName" />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="projManager" className="form-label">Project Manager</label>
              <input type="search" className="form-control" id="projManager" placeholder='Search' />
            </div>
            <div className="row datesOffcanvas">
              <div className="col">
                <div className="mb-2">
                  <label htmlFor="startDate" className="form-label">Start Date</label>
                  <input type="date" className="form-control" id="startDate" />
                </div>
              </div>
              <div className="col">
                <div className="mb-2">
                  <label htmlFor="endDate" className="form-label">End Date:</label>
                  <input type='date' className='form-control' id='endDate'/>
                </div>
              </div>
            </div>
            <div className="mb-2">
              <label htmlFor="status" className="form-label">Status</label>
              <select className="form-select" id="status" aria-label="Select Component Type">
                {/* <option value="" disabled selected>Rate units</option> */}
                <option value="Not Yet Started">Not Yet Started</option>
                <option value="Option2">Option2</option>
                <option value="Option3">Option3</option>
              </select>
            </div>
            <div className="d-flex">
              <button type="button" className="btn btn-sm btn-secondary me-2" data-bs-dismiss="offcanvas">Cancel</button>
              <button type="submit" className="btn btn-sm btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ActiveProj
