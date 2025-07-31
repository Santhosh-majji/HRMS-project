import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles for ReactQuill
import './ContinuousFeedback.css'; // Adjust the path based on your project structure
import Performance from './Performance'; // Adjust the path based on your project structure
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdEye } from 'react-icons/io';
import { FaBold, FaItalic } from 'react-icons/fa';

function OffcanvasExample({ showOffcanvas, onClose, headerTitle }) {
  console.log('Received headerTitle:', headerTitle);
  const [attachments, setAttachments] = useState([]);
  const [praiseText, setPraiseText] = useState('');

  // Handle changes in the Quill editor
  const handlePraiseTextChange = (value) => {
    setPraiseText(value);
  };

  const handleFileChange = (e) => {
    // Ensure the total number of attachments does not exceed 5
    if (attachments.length < 5) {
      const newAttachments = [...attachments, e.target.files[0]];
      setAttachments(newAttachments);
    }
  };

  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  return (
    <div className={`offcanvas offcanvas-end ${showOffcanvas ? 'show' : ''}`} tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: "89%", maxWidth: "450px" }}>
      <div className="offcanvas-header">
        <h6 className="offcanvas-title" id="offcanvasRightLabel">{headerTitle}</h6>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onClick={onClose}></button>
      </div>

      <div className="offcanvas-body">
        <form>
          <div className="mb-3">
            <label htmlFor="projName" className="form-label">To whom would you like to give this praise</label>
            <input type='text' className='form-control' id='projName' placeholder='Search Employee' />
            <div className='eye'>
              <div>
                <IoMdEye className="icon" />
              </div>
              <div>
                <p className="paragraph">Praise will be visible to everyone in the organization.</p>
              </div>
            </div>
            <label htmlFor="praiseText" className="form-label">Enter your Praise</label>
            <ReactQuill
              id="praiseText"
              value={praiseText}
              onChange={handlePraiseTextChange}
              placeholder="Write your praise here..."
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              formats={[
                'header',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet',
                'link', 'image',
              ]}
            />
          </div>
          <div className="row">
            <div className="col">
              <div className="mb-3">
                <select className="form-select" id="componentType" aria-label="Select Component Type">
                  <option value="Select a Badge">Select a Badge</option>
                  <option value="option2">option2</option>
                  <option value="option3">option3</option>
                </select>
              </div>
            </div>
          </div>
          <div className="label">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="checkDepartment" />
              <label className="form-check-label" htmlFor="checkDepartment">Select Department</label>
            </div>
            <div className='chek'>
              <select className="form-select mt-2" id="department" aria-label="Select Department">
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
                {/* Add more departments as needed */}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="attachment" className="form-label">Attachment (Max 5 files)</label>
            <input type="file" className="form-control" id="attachment" onChange={handleFileChange} />
            {attachments.length > 0 && (
              <div className="mt-2">
                {attachments.map((file, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center">
                    <span>{file.name}</span>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveAttachment(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="d-flex">
            <button type="button" className="btn btn-sm btn-secondary mr-2" data-bs-dismiss="offcanvas" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-sm btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DirectReportsContent({ onClose }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [quickActions, setQuickActions] = useState([
    { id: 1, name: 'Give Praise', icon: '👍' },
    { id: 2, name: 'Give Personal Feedback', icon: '💡' },
    { id: 3, name: 'Write Internal Note', icon: '📝' },
    { id: 4, name: 'Request Feedback for Others', icon: '⚠️' },
  ]);
  const iconColor = '#a6d5f4';

  const [searchTerm, setSearchTerm] = useState('');
  const [teamNames, setTeamNames] = useState(['Abhishek Kumar', 'Govind Rao', 'Manohar V', 'Naman Singh']);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [highlightedTeam, setHighlightedTeam] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [offcanvasHeaderTitle, setOffcanvasHeaderTitle] = useState('');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleQuickAction = (action) => {
    console.log('Performing quick action:', action);

    // Check if the action is one of the specified actions
    const isOffcanvasAction =
      action.name === 'Give Praise' ||
      action.name === 'Give Personal Feedback' ||
      action.name === 'Write Internal Note' ||
      action.name === 'Request Feedback for Others';

    if (isOffcanvasAction) {
      // If it is, show the off-canvas and set the header title
      setShowOffcanvas(true);
      setOffcanvasHeaderTitle(action.name);
    }

    // Add logic to handle other quick actions
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setShowFeedback(true);
  };

  const handleHighlight = (team) => {
    setHighlightedTeam(team);
  };

  return (
    <div className="feedback-container">
      <div className="flex-container">
        <div className='ma1'>
          <div className='mp'>
            <div className='dya'>
              <div className='vp'>
                <div className="mm">
                  <div className="vv">
                    <div className='all'>
                      <h6 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>All Feedbacks</h6>
                      <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Feedback for your Direct Reports</p>
                    </div>
                  </div>
                </div>

                <div className="ss">
                  <div className="pp">
                    <div className='rr'>
                      <h6 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>All Feedbacks</h6>
                      <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Showing 1 items</p>
                    </div>
                    <div className='aa'>
                      <select
                        value={selectedOption}
                        onChange={(e) => handleOptionChange(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div className='date'>
                      <input type="date" id="endPIPDate" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="feedback">
              <div className="block">
                <div className='head'>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>My Team</h4>
                </div>
                <div className='ff'>
                  <div className='search1'>
                    <input
                      type="text"
                      placeholder="Search Team"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <ul>
                    {teamNames.map((team) => (
                      <li
                        key={team}
                        onClick={() => handleTeamClick(team)}
                        onMouseOver={() => handleHighlight(team)}
                        onMouseOut={() => handleHighlight(null)}
                        className={highlightedTeam === team ? 'highlighted' : ''}
                      >
                        {team}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedTeam && showFeedback ? (
                <div className="attribute-block">
                  <h2>{selectedTeam} Feedback</h2>
                  <p>Given by sandya</p>
                  <div className="rating-section">
                    <p>Rate your experience:</p>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setRating(star)}
                          className={star <= rating ? 'filled' : ''}
                        >
                          &#9733;
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="comment-section">
                    <label htmlFor="comment">Comment:</label>
                    <textarea
                      id="comment"
                      rows="4"
                      cols="50"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Enter your feedback here"
                    ></textarea>
                  </div>

                  <button className='sub'
                    onClick={() => console.log('Submit feedback', { rating, comment })}
                  >
                    Submit Feedback
                  </button>
                </div>
              ) : (

                <div className="attribute-block">
                  <h2>No Team Selected</h2>
                  <p>Select a team to view feedback information.</p>
                </div>
              )}
            </div>
          </div>

          <div className="ll">



            <h2>Quick Actions</h2>

            {/* Integrate OffcanvasExample component here */}

            <OffcanvasExample

              showOffcanvas={showOffcanvas}

              onClose={() => setShowOffcanvas(false)}

              headerTitle={offcanvasHeaderTitle}

            />

            {quickActions.map((action) => (

              <div

                key={action.id}

                className="quick-action"

                onClick={() => handleQuickAction(action)}

              >

                <span style={{ color: iconColor }}>{action.icon}</span>

                <span className='colo' >{action.name}</span>

              </div>

            ))}

          </div>


        </div>
      </div>
    </div>
  );
}

function ContinuousFeedback() {
  const [defaultNameVisible, setDefaultNameVisible] = useState(true);
  const [showDirectReportsContent, setShowDirectReportsContent] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  const handleDirectReportsClick = () => {
    setDefaultNameVisible(false);
    setShowDirectReportsContent(true);
    setSelectedButton('directReports');
  };

  const handleCloseDirectReports = () => {
    setDefaultNameVisible(true);
    setShowDirectReportsContent(false);
    setSelectedButton('indirectReports');
  };

  return (
    <div>
      <div>
        <Performance />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className={`btn btn-${selectedButton === 'directReports' ? 'primary' : 'secondary'} btn-sm`}
          onClick={handleDirectReportsClick}
        >
          Direct Reports
        </button>
        <button
          type="button"
          className={`btn btn-${selectedButton === 'indirectReports' ? 'primary' : 'secondary'} btn-sm`}
          onClick={handleCloseDirectReports}
        >
          Indirect Reports
        </button>
      </div>
      <div className="ContentContainer">
        {/* Render default name based on visibility */}
        {defaultNameVisible && <p>Indirect Report</p>}
        {/* Render Direct Reports content based on visibility */}
        {showDirectReportsContent && (
          <DirectReportsContent onClose={handleCloseDirectReports} />
        )}
      </div>
    </div>
  );
}

export default ContinuousFeedback;
