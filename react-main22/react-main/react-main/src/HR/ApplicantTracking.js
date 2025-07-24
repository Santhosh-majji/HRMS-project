
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApplicantTracking.css';
// import HRInterviewprocess from './HRInterviewprocess';

 
const ApplicantTracking = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [applicantId, setApplicantId] = useState("");
    const [roundStatuses, setRoundStatuses] = useState([]);
    const [selectedRoundDetails, setSelectedRoundDetails] = useState(null);
    const [selectedRoundNumber, setSelectedRoundNumber] = useState(null);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Extracting the date part only (YYYY-MM-DD)
        return date.toISOString().split('T')[0];
    };
 
    const handleRadioChange = (e) => {
        const { value } = e.target;
        setSelectedProject(prevState => ({ ...prevState, Interviews_Completed: value }));
    };
   
   
    useEffect(() => {
        fetchData();
    }, []);
 
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/Applicanttracking');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
 
    const openEditPopup = (project) => {
        setSelectedProject(project);
        document.querySelector('.popup_applicant_edit_2').classList.add('show');
        document.body.style.overflow = 'hidden'; // Disable scroll on the background
    };
   
    const closeEditPopup = () => {
        setSelectedProject(null);
        document.querySelector('.popup_applicant_edit_2').classList.remove('show');
        document.body.style.overflow = 'auto'; // Re-enable scroll on the background
    };
   
 
    const handleSave = async () => {
        try {
            await axios.put('http://localhost:5001/updateApplicant', selectedProject);
            fetchData();
            closeEditPopup();
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };
 
    const handleViewRoundDetails = async (applicantID, roundNumber) => {
        try {
            const response = await axios.get(`http://localhost:5001/roundDetails/${applicantID}/${roundNumber}`);
            setSelectedRoundDetails(response.data);
            setSelectedRoundNumber(roundNumber);
            document.querySelector('.popup_round_details_app').style.display = 'block'; // Show the popup
        } catch (error) {
            console.error('Error fetching round details:', error);
        }
    };
   
   
    const closeRoundDetailsPopup = () => {
        setSelectedRoundDetails(null);
        document.querySelector('.popup_round_details_app').style.display = 'none'; // Hide the popup
    };
   
   
 
    const handleView = (applicantID) => {
        const applicant = projects.find(project => project.Applicant_ID === applicantID);
        if (applicant) {
            setSelectedApplicant(applicant);
            const statuses = [applicant.R1_Status, applicant.R2_Status, applicant.R3_Status, applicant.R4_Status, applicant.R5_Status];
            setRoundStatuses(statuses);
        }
    };
 
    return (
        <div className='applicantTrack'>
            {/* <HRInterviewprocess /> */}
 
            <div className="appid-container">
                <label className="appid" htmlFor="applicantId">Applicant ID:</label>
                <input
                    type="text"
                    id="applicantId"
                    className="appidtext"
                    value={applicantId}
                    onChange={(e) => setApplicantId(e.target.value)}
                />
                <button className="viewbutton" onClick={() => handleView(applicantId)}>View</button>
            </div>
 
            <div className="row applicantDatagrid">
                <table className="dataGridTable_tracking">
                    <thead className='DatagridHeader_tracking'>
                        <tr>
                            <th scope="col">Applicant ID</th>
                            <th scope="col">Applicant Name</th>
                            <th scope="col">Round 1</th>
                            <th scope="col">Round 2</th>
                            <th scope="col">Round 3</th>
                            <th scope="col">Round 4</th>
                            <th scope="col">Round 5</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, index) => (
                            <tr key={index}>
                                <td>{project.Applicant_ID}</td>
                                <td>{project.Applicant_Name}</td>
                                <td>{project.R1_Status ? project.R1_Status : 'not conducted'}</td>
                                <td>{project.R2_Status ? project.R2_Status : 'not conducted'}</td>
                                <td>{project.R3_Status ? project.R3_Status : 'not conducted'}</td>
                                <td>{project.R4_Status ? project.R4_Status : 'not conducted'}</td>
                                <td>{project.R5_Status ? project.R5_Status : 'not conducted'}</td>
                                <td className='actionIcons'>
                                    <i className="fa fa-pencil-square-o" aria-hidden="true" onClick={() => openEditPopup(project)}></i>
                                    <i className="fa fa-eye" aria-hidden="true" onClick={() => handleView(project.Applicant_ID)}></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
 
            <div className="round-status-buttons">
                {roundStatuses.map((status, index) => (
                    <button
                    key={index}
                    className={status === 'Completed' ? 'app-completed' : 'app-notcompleted'}
                    onClick={() => handleViewRoundDetails(selectedApplicant.Applicant_ID, index + 1)}
                >
                    Round {index + 1}
                </button>
                ))}
            </div>
 
            {/* Popup for editing applicant details */}
            <div className='popup_applicant_edit_2'>
                {selectedProject && (
                    <div className="editPopup2">
                        <div className="popup-inner">
                            <button className="close-btn-app" onClick={closeEditPopup}>X</button>
                            <h3>{selectedProject.Applicant_Name}</h3>
                            <h5>Round 1</h5>
                            <div className='status_update'>
                                <label>Status:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R1_Status}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R1_Status: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R1_Interview_Name}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R1_Interview_Name: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>ID:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R1_Interview_ID}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R1_Interview_ID: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Rating:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R1_Rating}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R1_Rating: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Date:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R1_Interview_Date}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R1_Interview_Date: e.target.value }))}
                                />
                            </div>
                            <h5>Round 2</h5>
                            <div className='status_update'>
                                <label>Status:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R2_Status}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R2_Status: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R2_Interview_Name}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R2_Interview_Name: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>ID:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R2_Interview_ID}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R2_Interview_ID: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Rating:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R2_Rating}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R2_Rating: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Date:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R2_Interview_Date}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R2_Interview_Date: e.target.value }))}
                                />
                            </div>
                            <h5>Round 3</h5>
                            <div className='status_update'>
                                <label>Status:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R3_Status}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R3_Status: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R3_Interview_Name}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R3_Interview_Name: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>ID:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R3_Interview_ID}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R3_Interview_ID: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Rating:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R1_Interview_ID}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R1_Interview_ID: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Date:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R3_Interview_Date}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R3_Interview_Date: e.target.value }))}
                                />
                            </div>
                            <h5>Round 4</h5>
                            <div className='status_update'>
                                <label>Status:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R4_Status}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R4_Status: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R4_Interview_Name}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R4_Interview_Name: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>ID:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R4_Interview_ID}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R4_Interview_ID: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Rating:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R4_Rating}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R4_Rating: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Date:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R4_Interview_Date}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R4_Interview_Date: e.target.value }))}
                                />
                            </div>
                            <h5>Round 5</h5>
                            <div className='status_update'>
                                <label>Status:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R5_Status}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R5_Status: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R5_Interview_Name}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R5_Interview_Name: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>ID:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R5_Interview_ID}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R5_Interview_ID: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Rating:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R5_Rating}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R5_Rating: e.target.value }))}
                                />
                            </div>
                            <div className='status_update'>
                                <label>Date:</label>
                                <input
                                    type="text"
                                    value={selectedProject.R5_Interview_Date}
                                    onChange={(e) => setSelectedProject(prevState => ({ ...prevState, R5_Interview_Date: e.target.value }))}
                                />
                            </div>
                            <div className='status_update_2'>
    <label>Interview Process Completed:</label>
    <div className='Applicant_label-div'>
        <label className='Applicant_label'>
            <input
                className='input_applicant'
                type="radio"
                value="Yes"
                checked={selectedProject.Interviews_Completed === "Yes"}
                onChange={handleRadioChange}
            />
            Yes
        </label>
        <label className='Applicant_label'>
            <input
              className='input_applicant'
                type="radio"
                value="No"
                checked={selectedProject.Interviews_Completed === "No"}
                onChange={handleRadioChange}
            />
            No
        </label>
    </div>
</div>
 
                            <button onClick={handleSave}>Save</button>
                        </div>
                    </div>
                )}
            </div>
 
           
            <div className='popup_round_details_app'>
    {selectedRoundDetails && (
        <div className="roundDetailsPopup">
            <div className="popup-inner">
                <button className="close-btn-round-app" onClick={closeRoundDetailsPopup}>X</button>
                <h3>{selectedRoundDetails.Applicant_Name}</h3>
                <div>
                    <label>Interview Name:</label>
                    <span>{selectedRoundDetails[`R${selectedRoundNumber}_Interview_Name`]}</span>
                </div>
                <div>
                    <label>Interview ID:</label>
                    <span>{selectedRoundDetails[`R${selectedRoundNumber}_Interview_ID`]}</span>
                </div>
                <div>
                    <label>Status:</label>
                    <span>{selectedRoundDetails[`R${selectedRoundNumber}_Status`]}</span>
                </div>
                <div className="star-rating">
    <label>Rating:</label>
    {selectedRoundDetails[`R${selectedRoundNumber}_Rating`] !== null &&
    selectedRoundDetails[`R${selectedRoundNumber}_Rating`] !== undefined ? (
        <>
            {[...Array(selectedRoundDetails[`R${selectedRoundNumber}_Rating`])].map((_, index) => (
                <i key={index} className="fa fa-star checked"></i>
            ))}
            {[...Array(5 - selectedRoundDetails[`R${selectedRoundNumber}_Rating`])].map((_, index) => (
                <i key={index} className="fa fa-star"></i>
            ))}
        </>
    ) : (
        <>
            {[...Array(5)].map((_, index) => (
                <i key={index} className="fa fa-star"></i>
            ))}
        </>
    )}
</div>
 
 
 
                {selectedRoundDetails && (
   <div>
   <label>Interview Date:</label>
   <span>{selectedRoundDetails[`R${selectedRoundNumber}_Interview_Date`] ? formatDate(selectedRoundDetails[`R${selectedRoundNumber}_Interview_Date`]) : ' '}</span>
</div>
)}
            </div>
        </div>
    )}
</div>
 
 
        </div>
    );
};
 
export default ApplicantTracking;
 
 