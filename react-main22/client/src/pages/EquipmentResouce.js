
import React, { useState, useEffect } from 'react';
import './FirstPage.css';
import axios from 'axios';
 
const EmployeeResource = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    Equipment_ID: '',
    EquipmentName: '',
    Project_ID: '',
    StartDate: '',
    EndDate: '',
  });
 
  useEffect(() => {
    fetchItems();
  }, []);
 
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5001/items');
      const formattedItems = response.data.map(item => ({
        ...item,
        StartDate: new Date(item.StartDate).toLocaleDateString(),
        EndDate: new Date(item.EndDate).toLocaleDateString()
      }));
      setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
 
  const addNewItem = async () => {
    try {
      await axios.post('http://localhost:5001/items', newItem);
      fetchItems(); // Refetch items after adding a new one
      setNewItem({
        Equipment_ID: '',
        EquipmentName: '',
        Project_ID: '',
        StartDate: '',
        EndDate: '',
      }); // Reset form fields
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };
 
  return (
    <div className='totalEmployeePage' style={{width:'100%'}}>
      {/* Add Equipment Button */}
      <div className="row employeesPageDropdowns">
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm mb-1 btn-primary" type="button" id='createProj' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
            + Add Equipment
          </button>
        </div>
      </div>
 
      {/* Right Offcanvas Form */}
      <div className="offcanvas offcanvas-end " tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: "89%", maxWidth: "450px" }}>
        <div className="offcanvas-header">
          <h6 className="offcanvas-title" id="offcanvasRightLabel">Add Equipment</h6>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={(e) => { e.preventDefault(); addNewItem(); }}>
            {/* Form fields */}
 
            <div className="mb-3">
              <label htmlFor="equipmentName" className="form-label">Technologies Name</label>
              <input type="text" className="form-control" id="equipmentName" name="EquipmentName" value={newItem.EquipmentName} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="project" className="form-label">Project ID</label>
              <input type='text' className='form-control' id='project' name="Project_ID" value={newItem.Project_ID} onChange={handleInputChange} />
            </div>
            <div className="row datesOffcanvas">
              <div className="col">
                <div className="mb-2">
                  <label htmlFor="startDate" className="form-label">Start Date</label>
                  <input type="date" className="form-control" id="startDate" name="StartDate" value={newItem.StartDate} onChange={handleInputChange} />
                </div>
              </div>
              <div className="col">
                <div className="mb-2">
                  <label htmlFor="endDate" className="form-label">End Date</label>
                  <input type='date' className='form-control' id='endDate' name="EndDate" value={newItem.EndDate} onChange={handleInputChange} />
                </div>
              </div>
            </div>
            {/* Add and Cancel Buttons */}
            <div className="d-flex">
              <button type="button" className="btn btn-sm btn-primary me-2" onClick={addNewItem}>Add</button>
              <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="offcanvas">Cancel</button>
            </div>
          </form>
        </div>
      </div>
 
      {/* Resource page with data grid */}
      <div className='resourcePage'>
        <div className="row resourceTable table-responsive mb-2">
          <table className="table table-hover">
            <thead className='resourceTableHeader'>
              <tr>
                <th scope="col">SELECT</th>
                <th scope="col">Technologies NAME</th>
                <th scope="col">PROJECT ID</th>
                <th scope="col">START DATE</th>
                <th scope="col">END DATE</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td><input type="checkbox" /></td>
                  <td>{item.EquipmentName}</td>
                  <td>{item.Project_ID}</td>
                  <td>{item.StartDate}</td>
                  <td>{item.EndDate}</td>
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
 