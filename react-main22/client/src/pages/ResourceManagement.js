import React, { useState } from 'react';
import './ResourceManagement.css';
import EmployeeResource from './EmployeeResource';
import EquipmentResouce from './EquipmentResouce';

const ResourceManagement = () => {
  const [currentPage, setCurrentPage] = useState('first');

  const handleButtonClick = (page) => {
    setCurrentPage(page);
  };

  

  return (
    <div>
      <div className="button-container">
        {/* <button className='firstPageButton' onClick={() => handleButtonClick('first')}>First Page</button>
        <button className='secondPageButton' onClick={() => handleButtonClick('second')}>Second Page</button> */}
        <button 
          onClick={() => handleButtonClick('first')} 
          className={currentPage === 'first' ? 'active' : ''}
        >
          Employee
        </button>
        <button 
          onClick={() => handleButtonClick('second')} 
          className={currentPage === 'second' ? 'active' : ''}
        >
          Equipment
        </button>
      </div>
      <div className="page-container">
        {currentPage === 'first' && <EmployeeResource />}
        {currentPage === 'second' && <EquipmentResouce />}
      </div>
    </div>
  );
};

export default ResourceManagement;
