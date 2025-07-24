import React, { useState } from 'react';
import './Objectives.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers, faBuilding } from "@fortawesome/free-solid-svg-icons";
import EmployeePerformance from './EmployeePerformance';
 
 
const Objectives = () => {
  const [showCreateObjective, setShowCreateObjective] = useState(false);
  const [showCreateDepObjective, setShowCreateDepObjective] = useState(false);
  const [showCreateComObjective, setShowCreateComObjective] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [descriptionBoxes, setDescriptionBoxes] = useState([]);
 
  const handleButtonClick = (buttonName) => {
    if (buttonName === 'myobj') {
      setShowCreateObjective(true);
      setShowCreateDepObjective(false);
      setShowCreateComObjective(false);
    } else if (buttonName === 'depobj') {
      setShowCreateObjective(false);
      setShowCreateDepObjective(true);
      setShowCreateComObjective(false);
    } else if (buttonName === 'comobj') {
      setShowCreateObjective(false);
      setShowCreateDepObjective(false);
      setShowCreateComObjective(true);
    }
  };
 
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };
 
  const handleTypeButtonClick = (type) => {
    setSelectedType(type);
  };
 
  const handlePopupOpen = (data) => {
    setPopupData(data);
  };
 
  const handlePopupClose = () => {
    setPopupData(null);
  };
 
  const handleAddDescription = () => {
    setDescriptionBoxes(prevBoxes => [
      <input className="improve" type="text" id={`description-${prevBoxes.length}`} placeholder="Add sub-goal" key={prevBoxes.length} />,
      ...prevBoxes
    ]);
  };
 
  const handleSave = () => {
    // Handle saving logic here
    // For example, you can save the data to the backend or perform other operations
    // Once saved, you may want to close the popup
    handlePopupClose();
  };
 
  return (
    <div>
      <EmployeePerformance/>
      <div className="objectives-container">
        <h2>Objectives</h2>
        <p>Objectives help you define what you want to achieve.</p>
        <div className="buttons-container">
          <button className='myobj' onClick={() => handleButtonClick('myobj')}>
            <FontAwesomeIcon className='icons' icon={faUser} /> My objectives
          </button>
          <button className='depobj' onClick={() => handleButtonClick('depobj')} >
            <FontAwesomeIcon className='icons' icon={faUsers} /> Department objectives
          </button>
          <button className='comobj' onClick={() => handleButtonClick('comobj')} >
            <FontAwesomeIcon className='icons' icon={faBuilding} /> Company objectives
          </button>
        </div>
 
        {showCreateObjective &&
          <div>
            <div className="create-objective">
              <h3>Create Objective</h3>
              <label htmlFor="visibility">Visible to</label>
              <select className="combo" id="visibility" defaultValue="everyone">
                <option value="everyone">Everyone</option>
                <option value="managers">Only Managers</option>
              </select>
            </div>
            <div className='goal'>
              <label htmlFor="objective">What do you want to achieve?</label>
              <input className="improve" type="text" id="objective" placeholder="E.g. improve customer satisfaction" />
              <button className='adddesc' onClick={toggleDescription}>+ Add Description{(showDescription ? "(optional)" : "(optional)")}</button>
              {showDescription && <input className="improve" type="text" id="description" placeholder="Enter description" />}
              <label>Objective type</label>
              <div className='indcombuttons'>
                <button className={`individual ${selectedType === 'individual' ? 'active' : ''}`} onClick={() => handleTypeButtonClick('individual')}>
                  <FontAwesomeIcon className='icons' icon={faUser} /> Individual
                </button>
                <button className={`company ${selectedType === 'company' ? 'active' : ''}`} onClick={() => handleTypeButtonClick('company')}>
                  <FontAwesomeIcon className='icons' icon={faBuilding} /> Company
                </button>
              </div>
              <div className='date-picker-container'>
                <label>Start Date</label>
                <input className="date-picker" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <label>End Date</label>
                <input className="date-picker" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className='subgoaldiv'>
                {descriptionBoxes.map((descriptionBox, index) => (
                  <React.Fragment key={index}>{descriptionBox}</React.Fragment>
                ))}
                <button className='subgoal' onClick={handleAddDescription}>
                  +Add Sub-goal
                </button>
              </div>
              <div>
                <button className='publishbutton'>
                  Publish
                </button>
              </div>
            </div>
 
            {/* Data Grid Table */}
            <div className="data-grid-container">
              <table className="data-grid-table">
                <thead>
                  <tr>
                    <th>Obj-ID</th>
                    <th>Objective Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Goal Progress</th> {/* New column */}
                  </tr>
                </thead>
                <tbody>
                  {/* You can dynamically render rows here based on your data */}
                  <tr onClick={() => handlePopupOpen({ id: 1, objectiveType: 'Individual', startDate: '2024-03-05', endDate: '2024-03-10' })}>
                    <td>1</td>
                    <td>Individual</td>
                    <td>2024-03-05</td>
                    <td>2024-03-10</td>
                    <td>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: '50%' }}></div> {/* Progress bar */}
                      </div>
                    </td>
                  </tr>
                  <tr onClick={() => handlePopupOpen({ id: 1, objectiveType: 'Individual', startDate: '2024-03-05', endDate: '2024-03-10' })}>
                    <td>1</td>
                    <td>Individual</td>
                    <td>2024-03-05</td>
                    <td>2024-03-10</td>
                    <td>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: '50%' }}></div> {/* Progress bar */}
                      </div>
                    </td>
                  </tr>
 
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
          </div>
        }
 
        {/* Popup */}
        {popupData &&
          <div className="popup">
            <div className="popup-content">
              <button className="close-button" onClick={handlePopupClose}>Close</button>
              <h3>Objective</h3>
              <p><strong>Obj-ID:</strong> {popupData.id}</p>
              <p><strong>Objective Type:</strong> {popupData.objectiveType}</p>
              <p><strong>Description:</strong></p>
              {descriptionBoxes.map((descriptionBox, index) => (
                <div key={index} className="sub-goal-item">
                  <input type="checkbox" id={`sub-goal-${index}`} />
                  <label htmlFor={`sub-goal-${index}`}>{descriptionBox}</label>
                </div>
              ))}
              <button className="save-button" onClick={handleSave}>Save</button>
            </div>
          </div>
        }
 
        {/* Department and Company Objective sections */}
        {(showCreateDepObjective || showCreateComObjective) &&
          <div>
            <div className="create-objective">
              <h3>Create Objective</h3>
              <label htmlFor="visibility">Visible to</label>
              <select className="combo" id="visibility" defaultValue="everyone">
                <option value="everyone">Everyone</option>
                <option value="managers">Only Managers</option>
              </select>
            </div>
            <div className='goal'>
              <label htmlFor="objective">What do you want to achieve?</label>
              <input className="improve" type="text" id="objective" placeholder="E.g. improve customer satisfaction" />
              <button className='adddesc' onClick={toggleDescription}>+ Add Description{(showDescription ? "(optional)" : "(optional)")}</button>
              {showDescription && <input className="improve" type="text" id="description" placeholder="Enter description" />}
              <label>Objective type</label>
              <div className='date-picker-container'>
                <label>Start Date</label>
                <input className="date-picker" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <label>End Date</label>
                <input className="date-picker" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className='subgoaldiv'>
                {descriptionBoxes.map((descriptionBox, index) => (
                  <React.Fragment key={index}>{descriptionBox}</React.Fragment>
                ))}
                <button className='subgoal' onClick={handleAddDescription}>
                  +Add Sub-goal
                </button>
              </div>
              <div>
                <button className='publishbutton'>
                  Publish
                </button>
              </div>
            </div>
 
            {/* Data Grid Table */}
            <div className="data-grid-container">
              <table className="data-grid-table">
                <thead>
                  <tr>
                    <th>Obj-ID</th>
                    <th>Objective Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Goal Progress</th> {/* New column */}
                  </tr>
                </thead>
                <tbody>
                  {/* You can dynamically render rows here based on your data */}
                  <tr onClick={() => handlePopupOpen({ id: 1, objectiveType: 'Individual', startDate: '2024-03-05', endDate: '2024-03-10' })}>
                    <td>1</td>
                    <td>Individual</td>
                    <td>2024-03-05</td>
                    <td>2024-03-10</td>
                    <td>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: '50%' }}></div> {/* Progress bar */}
                      </div>
                    </td>
                  </tr>
                  <tr onClick={() => handlePopupOpen({ id: 1, objectiveType: 'Individual', startDate: '2024-03-05', endDate: '2024-03-10' })}>
                    <td>1</td>
                    <td>Individual</td>
                    <td>2024-03-05</td>
                    <td>2024-03-10</td>
                    <td>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: '50%' }}></div> {/* Progress bar */}
                      </div>
                    </td>
                  </tr>
 
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>
  );
};
 
export default Objectives;
 