import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton } from '@mui/material';
import { MdEdit, MdDelete } from 'react-icons/md'; // Import Material-UI icons
import './Datagrid.css'; // Import CSS file for custom styles
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';


const DataGrid = ({ data, onDelete, onEdit }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedRows(data.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    setSelectedRows(prevSelectedRows => {
      if (isChecked) {
        return [...prevSelectedRows, id];
      } else {
        return prevSelectedRows.filter(rowId => rowId !== id);
      }
    });
  };

  const handleEdit = (row) => {
    onEdit(row);
  };

  const handleDelete = (id) => {
    onDelete(id);
  };

  return (
    <>
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow className="table-head">
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell className="table-cell-header" style={{fontSize:'18px',fontWeight:'bold'}}>Employee ID</TableCell>
                <TableCell className="table-cell-header"  style={{fontSize:'18px',fontWeight:'bold'}}>Employee Name</TableCell>
                <TableCell className="table-cell-header"  style={{fontSize:'18px',fontWeight:'bold'}}>Date</TableCell>
                <TableCell className="table-cell-header"  style={{fontSize:'18px',fontWeight:'bold'}}>Location</TableCell>
                <TableCell className="table-cell-header"  style={{fontSize:'18px',fontWeight:'bold'}}>Department</TableCell>
                <TableCell className="table-cell-header"  style={{fontSize:'18px',fontWeight:'bold'}}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => handleCheckboxChange(e, row.id)}
                    />
                  </TableCell>
                  <TableCell className="table-cell" style={{color:'#28a745',fontSize:'18px',fontWeight:'bolder'}}>{row.id}</TableCell>
                  <TableCell className="table-cell" style={{fontSize:'18px',fontWeight:'light'}}>{row.name}</TableCell>
                  <TableCell className="table-cell" style={{color:'#ffc107',fontSize:'18px',fontWeight:'light'}}>{row.date}</TableCell>
                  <TableCell className="table-cell" style={{fontSize:'18px',fontWeight:'light'}}>{row.location}</TableCell>
                  <TableCell className="table-cell" style={{fontSize:'18px',fontWeight:'light'}}>{row.department}</TableCell>
                  <TableCell className="table-cell">
                  <RiEdit2Line className="edit-icon" />
                  <RiDeleteBin6Line className="delete-icon" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default DataGrid;
