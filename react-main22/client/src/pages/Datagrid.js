import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton } from '@mui/material';
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import EditModal from '../pages/EditModal';
import './Datagrid.css'; // Import CSS file for custom styles

const DataGrid = ({ data, onDelete, onEdit }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedRows(data.map(row => row.Username));
    } else {
      setSelectedRows([]);
    }
  };

  const handleCheckboxChange = (event, username) => {
    const isChecked = event.target.checked;
    setSelectedRows(prevSelectedRows => {
      if (isChecked) {
        return [...prevSelectedRows, username];
      } else {
        return prevSelectedRows.filter(rowUsername => rowUsername !== username);
      }
    });
  };

  const handleDelete = (username) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(username);
      }
    });
  };

  const handleEditClick = (row) => {
    setCurrentRow(row);
    setEditModalOpen(true);
  };

  const handleEditSave = (updatedRow) => {
    onEdit(updatedRow);
    setEditModalOpen(false);
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  color="primary"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell className="table-cell-header" style={{ fontSize: '18px', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell className="table-cell-header" style={{ fontSize: '18px', fontWeight: 'bold' }}>Check In</TableCell>
              <TableCell className="table-cell-header" style={{ fontSize: '18px', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell className="table-cell-header" style={{ fontSize: '18px', fontWeight: 'bold' }}>Username</TableCell>
              <TableCell className="table-cell-header" style={{ fontSize: '18px', fontWeight: 'bold' }}>Check Out</TableCell>
              <TableCell className="table-cell-header" style={{ fontSize: '18px', fontWeight: 'bold' }}>Working Hours</TableCell>
              <TableCell className="table-cell-header" style={{ fontSize: '18px', fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.Username}>
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={selectedRows.includes(row.Username)}
                    onChange={(e) => handleCheckboxChange(e, row.Username)}
                  />
                </TableCell>
                <TableCell className="table-cell" style={{ color: '#28a745', fontSize: '18px', fontWeight: 'bolder' }}>{new Date(row.date).toLocaleDateString()}</TableCell>
                <TableCell className="table-cell" style={{ color: '#ffc107', fontSize: '18px', fontWeight: 'light' }}>{row.Check_In}</TableCell>
                <TableCell className="table-cell" style={{ fontSize: '18px', fontWeight: 'light' }}>{row.Status}</TableCell>
                <TableCell className="table-cell" style={{ fontSize: '18px', fontWeight: 'light' }}>{row.Username}</TableCell>
                <TableCell className="table-cell" style={{ fontSize: '18px', fontWeight: 'light' }}>{row.Check_Out}</TableCell>
                <TableCell className="table-cell" style={{ fontSize: '18px', fontWeight: 'light' }}>{row.Working_hours}</TableCell>
                <TableCell className="table-cell">
                  <IconButton onClick={() => handleEditClick(row)}>
                    <RiEdit2Line className="edit-icon" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row.Username)}>
                    <RiDeleteBin6Line className="delete-icon" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {currentRow && (
        <EditModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          row={currentRow}
          handleSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default DataGrid;
