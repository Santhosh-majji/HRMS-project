// ConfirmationDialog.js
import React from 'react';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-dialog-background">
      <div className="confirmation-dialog">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this holiday?</p>
        <div className="confirmation-dialog-buttons">
          <button className="confirm-button" onClick={onConfirm}>Yes</button>
          <button className="cancel-button" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
