import React, { useState } from 'react';
// import './AllProj.css'
// import { Link, useNavigate } from 'react-router-dom';

const ArchivedProj = () => {
  // const navigate = useNavigate();

  // const viewItem = (id, rowIndex) => {
  //   if (rowIndex === 0) {
  //     // Navigate to the AI testing page for the first row
  //     navigate(`/aitestingproject/${id}`);
  //   } else if (rowIndex === 1) {
  //     // Navigate to the debugging page for the second row
  //     navigate(`/debuggingproj/${id}`);
  //   }
  // };




  const [currentPage, setCurrentPage] = useState(2);
  const [itemsPerPage] = useState(3);


  const projects = [
    { name: 'AI Testing Project', client: 'Morgan Stanley', duration: 'May 01, 2023 ', archivedby: '',  archiveReason: '' },
    { name: 'Debugging Project', client: 'Sigma Seven', duration: 'May 01, 2023 ', archivedby: '',  archiveReason: '' },
    { name: 'Retention Metric Alignment', client: 'Netflix', duration: 'May 01, 2023 ', archivedby: ' ', archiveReason: ' ' },
    { name: 'Streamline Supply Chain', client: 'Heritage', duration: 'May 01, 2023 ', archivedby: '', archiveReason: ' ' },
    { name: 'Web Development', client: 'Paradox', duration: 'May 01, 2023 ', archivedby: '', archiveReason: ' ' },
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
    <div className="allText">
      
    <div className="d-flex justify-content-between">
        <h4>Archived Projects</h4>
        {/* <button className="btn btn-sm mb-1 btn-primary" type="button" id='createProj' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
        +Create Project
        </button> */}
    </div>
    
    <p>The following are the archived projects and their details.</p>
    </div>

    <div className="row ClientSearch d-flex justify-content-between">
        <div className="col-lg-3 col"> 
            <div className="dropdown clientDropdown">

                          <button className='btn btn-sm customBorder clientDropdownToggle dropdown-toggle border' 
                              type="button" 
                              id="clientDropdownMenuButton" 
                              data-bs-toggle="dropdown" 
                              aria-expanded="false"
                              // onClick={() => setIsClicked(true)} 
                              >
                              Client
                          </button>
                          <ul className=" dropdown-menu clientDropdownOptions" aria-labelledby="dropdownMenuButton">
                              <li>
                                  <div className="container-fluid">
                                      <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="" id="flexCheckCS"/>
                                          <label className="form-check-label" htmlFor="flexCheckCS">Pending</label>
                                      </div>
                                  </div>
                              </li>

                              <li>
                                  <div className="container-fluid">
                                      <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                          <label className="form-check-label" htmlFor="flexCheckDefault">Partially </label>
                                      </div>
                                  </div>
                              </li>
                              <li>
                                  <div className="container-fluid">
                                      <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                          <label className="form-check-label" htmlFor="flexCheckDefault">Partially Approved</label>
                                      </div>
                                  </div>
                              </li>
                              <li>
                                  <div className="container-fluid">
                                      <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                          <label className="form-check-label" htmlFor="flexCheckDefault">Partially Approved</label>
                                      </div>
                                  </div>
                              </li><li>
                                  <div className="container-fluid">
                                      <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                          <label className="form-check-label" htmlFor="flexCheckDefault">Partially Approved</label>
                                      </div>
                                  </div>
                              </li>
                          </ul>
            </div>
        </div>

          {/* <div className="col-lg-3 col">
            <div className="dropdown">
                <button className='btn btn-sm custom-border dropdown-toggle border' 
                    type="button" 
                    id="dropdownMenuButton" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    // onClick={() => setIsClicked(true)} 
                    >
                    Status
                </button>
                <ul className=" dropdown-menu totalDropdownFilters" aria-labelledby="dropdownMenuButton">

                    <li>
                        <div className="container-fluid">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckCS"/>
                                <label className="form-check-label" htmlFor="flexCheckCS">Pending</label>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="container-fluid">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                <label className="form-check-label" htmlFor="flexCheckDefault">Partially Approved</label>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
          </div> */}

        <div className="col-lg-3 col">
        {/* <div className="col-lg-10 col-md-10 col-sm-6 col-xs-6">  */}
            <form className=" input-group ActiveProjSearch">
                  {/* <input type="text" placeholder="Search.." name="search2"/> */}
                  {/* <button type="submit">Search</button> */}
                    <input type="search" class="form-control" placeholder="Search..." aria-label="Search" aria-describedby="basic-addon2"/>
            </form>
        </div>

    </div>

    <div className="row clientDataGrid table-responsive">
      <table className="table table-hover">
      <thead className='clientTableHeader'>
        <tr>
          <th scope="col">SELECT</th>
          <th scope="col">PROJECT</th>
          <th scope="col">CLIENT</th>
          <th scope="col">DURATION</th>
          <th scope="col">ARCHIVED BY</th>
          <th scope='col'>ARCHIVE REASON</th>
          <th scope="col">ACTIONS</th>
          
        </tr>
      </thead>
      <tbody>
        {currentItems.map((project, index) => (
          <tr key={index}>
            <th scope="row">
              <input type="checkbox" />
            </th>
            <td>{project.name}</td>
            <td>{project.client}</td>
            <td>{project.duration}</td>
            <td>{project.archivedby}</td>
            <td>{project.archiveReason}</td>
            <td className='actionIcons'>
              <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
              <i className="fa fa-trash" aria-hidden="true"></i>
            
              <i className="fa fa-eye" />
            {/* </button>                 */}
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
  )
}

export default ArchivedProj
