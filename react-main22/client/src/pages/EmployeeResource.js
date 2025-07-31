
import React, { useState, useEffect } from 'react';
import './FirstPage.css';
import axios from 'axios';
 
 
const EmployeeResource = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    Employee_ID: '',
    Employee_Name: '',
    Project_ID: '',
    Client_ID: '',
    Client_Name: '',
    ProjectName: '',
    Duration: '',
    Start_Date: '',
    End_Date: '',
    ProjectManager: ''
  });
 
  useEffect(() => {
    fetchEmployees();
  }, []);
 
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5001/employees');
      const formattedEmployees = response.data.map(employee => ({
        ...employee,
        Start_Date: new Date(employee.Start_Date).toLocaleDateString(),
        End_Date: new Date(employee.End_Date).toLocaleDateString()
      }));
      setEmployees(formattedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
 
  const addEmployee = async () => {
    try {
      await axios.post('http://localhost:5001/employees', newEmployee);
      fetchEmployees(); // Refetch employees after adding a new one
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };
 
  return (
    <div className='totalEmployeePage' style={{width:'100%'}}>
      <div className="row d-flex justify-content-end">
        <button className="btn me-2 btn-sm mb-2 btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style={{width:'200px'}}>
          +Add Employee
        </button>
      </div>
 
      <div className="offcanvas offcanvas-end " tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: "89%", maxWidth: "450px" }}>
        <div className="offcanvas-header">
          <h6 className="offcanvas-title" id="offcanvasRightLabel">Add Employee</h6>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
 
        <div className="offcanvas-body offcanvas-body-scroll">
          <form>
            <div className="mb-2">
              <label htmlFor="Employee_ID" className="form-label">Employee ID</label>
              <input type='text' className='form-control' id='Employee_ID' name='Employee_ID' value={newEmployee.Employee_ID} onChange={handleInputChange}/>
            </div>
            <div className="mb-2">
              <label htmlFor="Employee_Name" className="form-label">Employee Name</label>
              <input type='text' className='form-control' id='Employee_Name' name='Employee_Name' value={newEmployee.Employee_Name} onChange={handleInputChange}/>
            </div>
            <div className="mb-2">
              <label htmlFor="Project_ID" className="form-label">Project ID</label>
              <input type='text' className='form-control' id='Project_ID' name='Project_ID' value={newEmployee.Project_ID} onChange={handleInputChange}/>
            </div>
            <div className="mb-2">
              <label htmlFor="ProjectName" className="form-label">Project Name</label>
              <input type='text' className='form-control' id='ProjectName' name='ProjectName' value={newEmployee.ProjectName} onChange={handleInputChange}/>
            </div>
            <div className="mb-2">
              <label htmlFor="Client_ID" className="form-label">Client ID</label>
              <input type='text' className='form-control' id='Client_ID' name='Client_ID' value={newEmployee.Client_ID} onChange={handleInputChange}/>
            </div>
            <div className="mb-2">
              <label htmlFor="Client_Name" className="form-label">Client Name</label>
              <input type='text' className='form-control' id='Client_Name' name='Client_Name' value={newEmployee.Client_Name} onChange={handleInputChange}/>
            </div>
            <div className="mb-2">
              <label htmlFor="Start_Date" className="form-label">Start Date</label>
              <input type='date' className='form-control' id='Start_Date' name='Start_Date' value={newEmployee.Start_Date} onChange={handleInputChange}/>
            </div>
            <div className="mb-2">
              <label htmlFor="End_Date" className="form-label">End Date</label>
              <input type='date' className='form-control' id='End_Date' name='End_Date' value={newEmployee.End_Date} onChange={handleInputChange}/>
            </div>
            <div className="mb-2">
              <label htmlFor="Duration" className="form-label">Duration</label>
              <input type='text' className='form-control' id='Duration' name='Duration' value={newEmployee.Duration} onChange={handleInputChange}/>
            </div>
            <div className="mb-2">
              <label htmlFor="ProjectManager" className="form-label">Project Manager</label>
              <input type='text' className='form-control' id='ProjectManager' name='ProjectManager' value={newEmployee.ProjectManager} onChange={handleInputChange}/>
            </div>
            <div className="d-flex">
              <button type="button" className="btn btn-sm btn-primary me-2" onClick={addEmployee}>Add</button>
              <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="offcanvas">Cancel</button>
            </div>
          </form>
        </div>
      </div>
 
      <div className="resourcePage">
        <div className="row resourceTable table-responsive mb-2">
          <table className="table table-hover">
            <thead className='resourceTableHeader'>
              <tr>
                <th scope="col">EMPLOYEE ID</th>
                <th scope="col">EMPLOYEE NAME</th>
                <th scope="col">ProjectID</th>
                <th scope="col">PROJECT NAME</th>
                <th scope="col">ClientName</th>
                <th scope="col">START DATE</th>
                <th scope="col">END DATE</th>
                <th scope="col">DURATION</th>
                <th scope="col">PROJECT MANAGER</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.Employee_ID}</td>
                  <td>{employee.Employee_Name}</td>
                  <td>{employee.Project_ID}</td>
                  <td>{employee.ProjectName}</td>
                  <td>{employee.Client_Name}</td>
                  <td>{employee.Start_Date}</td>
                  <td>{employee.End_Date}</td>
                  <td>{employee.Duration}</td>
                  <td>{employee.ProjectManager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
 
export default EmployeeResource;
 