
 
 
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require("moment");
require("moment-timezone");
 
// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST || "103.145.50.161",
  user: process.env.DB_USER || "development_Santhosh",
  password: process.env.DB_PASSWORD || "Santhosh@123",
  database: process.env.DB_NAME || "development_HRMS",
  connectTimeout: 20000,
});

const PDFDocument = require('pdfkit');
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmFwcGVhci5pbiIsImF1ZCI6Imh0dHBzOi8vYXBpLmFwcGVhci5pbi92MSIsImV4cCI6OTAwNzE5OTI1NDc0MDk5MSwiaWF0IjoxNzEyMDUxMzMxLCJvcmdhbml6YXRpb25JZCI6MjIyODY1LCJqdGkiOiI3OTNlNmU0MS1jMjEwLTQ4NTktYjJmZS1hNjRlYjg1NDU0NmUifQ.HuBwEO--xnhHbMDU-mBdoDQ58yEWhix7rOsbqEbngtA";

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'applicantresume/'); // Set the destination folder for resumes
  },
  filename: (req, file, cb) => {
    const uploadedTime = moment().format('YYYYMMDDHHmmss');
    const ext = path.extname(file.originalname);
    const fileName = `resume_${Date.now()}${ext}`;
    cb(null, fileName); // Set the file name with a timestamp
  }
});
 
const uploadResume = multer({ storage: resumeStorage });
 


// Storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'profilepicture/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
 









const upload = multer({ storage });

setInterval(checkExpiredMeetings, 60 * 60 * 1000);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const smtpClient = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'js5698723@gmail.com',
    pass: 'oqgd vhvw rnyz vrls',
  },
});
// Secret key for JWT
const secretKey = 'yatayatijnjsnfkjasnjf';
 
const formatTime = (date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };
 
  const calculateWorkingHours = (checkIn, checkOut) => {
    const [checkInHours, checkInMinutes] = checkIn.split(':').map(Number);
    const [checkOutHours, checkOutMinutes] = checkOut.split(':').map(Number);
 
    let hours = checkOutHours - checkInHours;
    let minutes = checkOutMinutes - checkInMinutes;
 
    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }
 
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
 
app.use(cookieParser());
app.use(cors());
app.use(express.json());
 
 
app.get('/api/job-stats', (req, res) => {
    const query = `
        SELECT
            j.Job_ID AS jobId,
            j.Job_Position AS jobPosition,
            COUNT(a.Applicant_ID) AS applicants,
            j.Num_of_openings AS jobOpenings
        FROM
        JobOpenings j
        LEFT JOIN
            Applicants a ON j.Job_ID = a.Job_ID
        GROUP BY
            j.Job_ID, j.Job_Position, j.Num_of_openings
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching job statistics:', error);
            res.status(500).send('Error fetching job statistics');
        } else {
            res.json(results);
        }
    });
});
 
 
 
 
 
 
 
 
 
app.get('/api/total-job-openings', (req, res) => {
    const query = 'SELECT SUM(Num_of_openings) AS totalOpenings FROM JobOpenings';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).send('Error fetching job openings');
        }
        res.json({ count: results[0].totalOpenings });
    });
});
 
 
app.get('/api/invited-interviews', (req, res) => {
    const query = 'SELECT COUNT(DISTINCT Applicant_ID) AS count FROM Interview_Schedule';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).send('Error fetching invited interviews');
        }
        res.json({ count: results[0].count });
    });
});
 
 
 
 
app.get('/api/hired-applications', (req, res) => {
    const query = 'SELECT COUNT(*) AS count FROM OfferLetter';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).send('Error fetching hired applications');
        }
        res.json({ count: results[0].count });
    });
});
 
 
 
 
 
app.get('/api/employee-stats', (req, res) => {
    const totalEmployeesQuery = `
        SELECT COUNT(*) AS totalEmployeesCount
        FROM employee_details
    `;
 
    const freshersQuery = `
        SELECT COUNT(*) AS freshersCount
        FROM employee_details
        WHERE Joining_Date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    `;
 
    const experiencedQuery = `
        SELECT COUNT(*) AS experiencedCount
        FROM employee_details
        WHERE Joining_Date < DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    `;
 
    db.query(totalEmployeesQuery, (err, totalEmployeesResult) => {
        if (err) {
            console.error('Error fetching total employees count:', err);
            return res.status(500).json({ error: 'Database error' });
        }
 
        db.query(freshersQuery, (err, freshersResult) => {
            if (err) {
                console.error('Error fetching freshers count:', err);
                return res.status(500).json({ error: 'Database error' });
            }
 
            db.query(experiencedQuery, (err, experiencedResult) => {
                if (err) {
                    console.error('Error fetching experienced count:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
 
                const totalEmployeesCount = totalEmployeesResult[0].totalEmployeesCount;
                const freshersCount = freshersResult[0].freshersCount;
                const experiencedCount = experiencedResult[0].experiencedCount;
 
                res.json({
                    totalEmployees: totalEmployeesCount,
                    freshers: freshersCount,
                    experienced: experiencedCount
                });
            });
        });
    });
});
 
 
 
 
 
// Get holidays
app.get('/api/holidays', (req, res) => {
  const query = "SELECT * FROM Holidays";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Add a new holiday
app.post('/api/holidays', (req, res) => {
  const { Name, Date, Description } = req.body;
  const query = "INSERT INTO Holidays (Name, Date, Description) VALUES (?, ?, ?)";
  db.query(query, [Name, Date, Description], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id: result.insertId, Name, Date, Description });
  });
});

// Update a holiday
app.put('/api/holidays/:id', (req, res) => {
  const { id } = req.params;
  const { Name, Date, Description } = req.body;
  const query = "UPDATE Holidays SET Name = ?, Date = ?, Description = ? WHERE id = ?";
  db.query(query, [Name, Date, Description, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// Delete a holiday
app.delete('/api/holidays/:id', (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Holidays WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});


 
 
//  Login route
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
   
//     const query = `SELECT * FROM rolebased WHERE username = ? AND password = ?`;
   
//     db.query(query, [username, password], (error, results) => {
//       if (error) throw error;
   
//       if (results.length > 0) {
//         const role = results[0].role;
//         const token = jwt.sign({ username, role }, secretKey, { expiresIn: '30min' });
       
//         const expirationDate = new Date();
//         expirationDate.setTime(expirationDate.getTime() + (30 * 60 * 1000));
       
//         res.cookie('token', token, {
//           httpOnly: true,
//           expires: expirationDate,
//         });
       
//         res.json({ success: true, role, token });
//       } else {
//         res.json({ success: false, message: 'Invalid credentials' });
//       }
//     });
// });
 
 
 
 
 
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
 
//     if (!username || !password) {
//       return res.status(400).json({ message: 'Please provide both username and password' });
//     }
 
//     const sql = `SELECT EmployeeID, First_Name, Role FROM employee_details WHERE EmployeeID = ? AND Password = ?`;
//     db.query(sql, [username, password], (err, results) => {
//       if (err) {
//         throw err;
//       }
 
//       if (results.length > 0) {
//         const { EmployeeID, First_Name, Role } = results[0];
//         // Fetch additional details of the employee using EmployeeID
//         const employeeDetailsSql = `SELECT * FROM employee_details WHERE EmployeeID = ?`;
//         db.query(employeeDetailsSql, [EmployeeID], (err, employeeDetails) => {
//           if (err) {
//             throw err;
//           }
 
//           res.status(200).json({
//             success: true,
//             employeeID: EmployeeID,
//             role: Role,
//             firstName: First_Name,
//             employeeDetails: employeeDetails[0], // Additional details of the employee
//             token: 'mockToken123' // You can generate a real token here if needed
//           });
//         });
//       } else {
//         res.status(401).json({ success: false, message: 'Invalid credentials' });
//       }
//     });
//   });
 
// app.post('/login', (req, res) => {
//   const { employeeID, password } = req.body;
 
//   if (!employeeID || !password) {
//     return res.status(400).json({ message: 'Please provide both EmployeeID and password' });
//   }
 
//   const sql = `SELECT Role FROM employee_details WHERE EmployeeID = ? AND Password = ?`;
//   db.query(sql, [employeeID, password], (err, results) => {
//     if (err) {
//       console.error('Error executing query', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
 
//     if (results.length > 0) {
//       const role = results[0].Role;
//       res.status(200).json({
//         success: true,
//         employeeID: employeeID,
//         role: role,
//         token: 'mockToken123' // Generate a real token here if needed
//       });
//     } else {
//       res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }
//   });
// });
//   // Fetch Leave Requests for a Specific Employee
// //  
 
 
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM employee_details WHERE EmployeeID = ?`;
 
  db.query(query, [username], (error, results) => {
      if (error) {
          res.status(500).json({ success: false, message: 'Database error' });
          console.log("error:", error);
      } else if (results.length > 0) {
          const user = results[0];
 
          if (user.Password === password) {
              const role = user.Role;
              const token = jwt.sign({ username, role }, jwtSecretKey, { expiresIn: '30m' });
              res.cookie('token', token, { httpOnly: true });
              const firstName = user.First_Name;  // Changed to First_Name
              res.json({ success: true, role, token, firstName });  // Changed to firstName
          } else {
              res.json({ success: false, message: 'Invalid credentials' });
          }
      } else {
          res.json({ success: false, message: 'Invalid credentials' });
      }
  });
});
 
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});
 
app.get("/api/login/:username", (req, res) => {
  const { username } = req.params;
  const query = 'SELECT * FROM employee_details WHERE EmployeeID = ?';
 
  db.query(query, [username], (error, results) => {
      if (error) {
          res.status(500).json({ success: false, message: 'Error fetching user data' });
      } else {
          res.json({ success: true, user: results[0] });
          console.log("result:", results);
      }
  });
});
 
 
 
const jwtSecretKey = 'yatayatismdnvlsvnvlefmv';
 
 
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
 
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
 
    jwt.verify(token.split(' ')[1], jwtSecretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
  }
 
app.get('/api/Hr', verifyToken, (req, res) => {
  const user = req.user;
  res.json({ success: true, message: `Hello, ${user.username}! You have access to this protected route.` });
});
 
// app.get('/SuperHome', verifyToken, (req, res) => {
//   const user = req.user;
//   res.json({ success: true, message: `Hello, ${user.username}! You have access to this protected route.` });
// });
 
app.get('/api/Admin', verifyToken, (req, res) => {
  const user = req.user;
  res.json({ success: true, message: `Hello, ${user.username}! You have access to this protected route.` });
});
 
app.get('/api/Employee', verifyToken, (req, res) => {
  const user = req.user;
  res.json({ success: true, message: `Hello, ${user.username}! You have access to this protected route.` });
});
 
 
// app.get("/loginuser/:username", (req, res) => {
//   const { username } = req.params;
//   const query = 'SELECT * FROM `leave-request` WHERE EmployeeID = ?';
//   db.query(query, [username], (error, results) => {
//     if (error) {
//       res.status(500).json({ success: false, message: 'Error fetching user data' });
//     } else {
//       res.json({ success: true, user: results });
//       // console.log("result:", results);
//     }
//   });
// });
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
// Modify the route to fetch leave requests based on employee ID
// app.get('/api/leave-request/:employeeId', (req, res) => {
//     const employeeId = req.params.employeeId;
//     // Modify your SQL query to fetch leave requests only for this employeeId
//     db.query('SELECT * FROM `leave-request` WHERE EmployeeID = ?', [employeeId], (error, results) => {
//         if (error) {
//             console.error('Error fetching leave requests:', error);
//             res.status(500).json({ success: false, error: 'Internal server error' });
//         } else {
//             res.status(200).json(results);
//         }
//     });
// });
 
 
 
 
 
// Route to fetch data from the database where status is 'notinitiated'
app.get('/api/employeeData', (req, res) => {
    const query = "SELECT * FROM OnboardingHrms WHERE Status = 'notinitiated'";
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});
 
// Route to initiate onboarding for selected row
app.post('/api/initiateOnboarding', (req, res) => {
    const { id } = req.body;
 
    // Check if id is undefined or null
    if (id === undefined || id === null) {
        return res.status(400).json({ message: 'Invalid request. ID is missing.' });
    }
 
    // Construct the SQL query with dynamic ID
    const query = `UPDATE OnboardingHrms SET Status = 'initiated' WHERE Username = ${id}`;
 
    // Execute the query
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error initiating onboarding:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Onboarding initiated successfully' });
    });
});
 
// Route to skip onboarding for selected row
app.post('/api/skipOnboarding', (req, res) => {
    const { id } = req.body;
 
    // Check if id is undefined or null
    if (id === undefined || id === null) {
        return res.status(400).json({ message: 'Invalid request. ID is missing.' });
    }
 
    // Construct the SQL query with dynamic ID
    const query = `UPDATE OnboardingHrms SET Status = 'skipped' WHERE Username = ${id}`;
 
    // Execute the query
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error skipping onboarding:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Onboarding skipped successfully' });
    });
});
 
// Route to cancel onboarding for selected row
app.post('/api/cancelOnboarding', (req, res) => {
    const { id } = req.body;
 
    // Check if id is undefined or null
    if (id === undefined || id === null) {
        return res.status(400).json({ message: 'Invalid request. ID is missing.' });
    }
 
    // Construct the SQL query with dynamic ID
    const query = `UPDATE OnboardingHrms SET Status = 'cancelled' WHERE Username = ${id}`;
 
    // Execute the query
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error cancelling onboarding:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Onboarding cancelled successfully' });
    });
});
 
// Route to fetch data from the database where status is 'skipped'
app.get('/skippedData', (req, res) => {
    const query = "SELECT * FROM OnboardingHrms WHERE Status = 'skipped'";
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching skipped data from database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});
 
// Route to fetch data from the database where status is 'cancelled'
app.get('/cancelledData', (req, res) => {
    const query = "SELECT * FROM OnboardingHrms WHERE Status = 'cancelled'";
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching cancelled data from database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});
 
// Route to search for cancelled data based on input
app.post('/searchCancelledData', (req, res) => {
    const { searchText } = req.body;
 
    // Construct the SQL query to search for cancelled data
    const query = `
    SELECT * FROM OnboardingHrms
    WHERE Status = 'cancelled'
    AND (Username LIKE '%${searchText}%'
         OR EmployeeName LIKE '%${searchText}%'
         OR Department LIKE '%${searchText}%'
         OR Location LIKE '%${searchText}%')
  `;
 
    // Execute the query
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error searching for cancelled data:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(results); // Send the filtered data as response
        }
    });
});
 
// Route to fetch data from the database where status is 'initiated'
app.get('/initiatedData', (req, res) => {
    const query = "SELECT * FROM OnboardingHrms WHERE Status = 'initiated'";
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching initiated data from database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});
 
// Route to search for initiated data based on input
app.post('/searchInitiatedData', (req, res) => {
    const { searchText } = req.body;
 
    // Construct the SQL query to search for initiated data
    const query = `
    SELECT * FROM OnboardingHrms
    WHERE Status = 'initiated'
    AND (Username LIKE '%${searchText}%'
         OR EmployeeName LIKE '%${searchText}%'
         OR Department LIKE '%${searchText}%'
         OR Location LIKE '%${searchText}%')
  `;
 
    // Execute the query
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error searching for initiated data:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(results); // Send the filtered data as response
        }
    });
});
 
// Route to search for employee data based on input
app.post('/searchEmployee', (req, res) => {
    const { searchText } = req.body;
 
    // Construct the SQL query to search for employee data
    const query = `SELECT * FROM OnboardingHrms WHERE Status = 'notinitiated' AND (Username LIKE '%${searchText}%' OR EmployeeName LIKE '%${searchText}%' OR Department LIKE '%${searchText}%' OR Location LIKE '%${searchText}%')`;
 
    // Execute the query
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error searching for employee data:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});
 
// Route to approve leave request
app.put('/api/leave-request-approve/:id', (req, res) => {
  const { id } = req.params;

  // Update the status to 'Approved' for the leave request with the provided id
  const query = `UPDATE \`leave-request\` SET Status = 'Approved' WHERE id = ?`;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error approving leave request:', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json({ message: 'Leave request approved successfully' });
    }
  });
});

app.put('/api/leave-request-reject/:id', (req, res) => {
  const { id } = req.params;

  // Update the status to 'Rejected' for the leave request with the provided id
  const query = `UPDATE \`leave-request\` SET Status = 'Rejected' WHERE id = ?`;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error rejecting leave request:', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json({ message: 'Leave request rejected successfully' });
    }
  });
});

 
// API Endpoint to Add a New Leave Request
app.post('/api/leave-request', (req, res) => {
    const { Username, EmployeeName, LeaveType, StartDate, EndDate, Reason } = req.body;
    const Status = 'Pending'; // Set default status to 'Pending'
    const sql = "INSERT INTO `leave-request` (Username, EmployeeName, Status, LeaveType, StartDate, EndDate, Reason) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [Username, EmployeeName, Status, LeaveType, StartDate, EndDate, Reason], (err, result) => {
        if (err) {
            console.error('Error saving leave request:', err);
            res.status(500).json({ success: false, message: 'Failed to save leave request.' });
        } else {
            console.log('Leave request saved in the database');
            res.status(200).json({ success: true, message: 'Leave request saved successfully.' });
        }
    });
});
 
// Route to fetch leave requests from the database
// Route to fetch leave requests for the logged-in user
app.get('/api/leave-request/:username', (req, res) => {
  const { username } = req.params;
  const sql = "SELECT Username, EmployeeName, Status, LeaveType, StartDate, EndDate, Reason FROM `leave-request` WHERE Username = ?";
  db.query(sql, [username], (err, result) => {
      if (err) {
          console.error('Error fetching leave requests:', err);
          res.status(500).json({ success: false, message: 'Failed to fetch leave requests.' });
      } else {
          console.log('Leave requests fetched from the database:', result);
          res.status(200).json(result);
      }
  });
});


app.get('/api/leave-request/:username', (req, res) => {
  const { username } = req.params;
  const query = 'SELECT * FROM leave-request  WHERE Username = ?';

  db.query(query, [username], (err, results) => {
      if (err) {
          console.error('Error fetching leave requests:', err);
          return res.status(500).send('Server error');
      }
      res.json(results);
  });
});




 
app.put('/leave-request-approve/:id', (req, res) => {
    const { id } = req.params;
   
    // Update the status to 'Rejected' for the leave request with the provided id
    const query = `UPDATE \`leave-request\` SET Status = 'Approved' WHERE EmployeeID = ${id}`;
   
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error approving leave request:', error);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.json({ message: 'Leave request approved successfully' });
      }
    });
  });
   
   
  // Route to reject leave request
  app.put('/leave-request-reject/:id', (req, res) => {
    const { id } = req.params;
   
    // Update the status to 'Rejected' for the leave request with the provided id
    const query = `UPDATE \`leave-request\` SET Status = 'Rejected' WHERE EmployeeID = ${id}`;
   
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error rejecting leave request:', error);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.json({ message: 'Leave request rejected successfully' });
      }
    });
  });
   
   
 
 
  app.post('/api/leave-request', (req, res) => {
    const { EmployeeID, EmployeeName, LeaveType, StartDate, EndDate, Reason } = req.body;
    const Status = 'Pending'; // Set default status to 'Pending'
    const sql = "INSERT INTO `leave-request` (EmployeeID, EmployeeName, Status, LeaveType, StartDate, EndDate, Reason) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [EmployeeID, EmployeeName, Status, LeaveType, StartDate, EndDate, Reason], (err, result) => {
        if (err) {
            console.error('Error saving leave request:', err);
            res.status(500).json({ success: false, message: 'Failed to save leave request.' });
        } else {
            console.log('Leave request saved in the database');
            res.status(200).json({ success: true, message: 'Leave request saved successfully.' });
        }
    });
});
 
app.get('/api/leave-request/:employeeID', (req, res) => {
    const { employeeID } = req.params;
    const sql = "SELECT * FROM `leave-request` WHERE EmployeeID = ?";
    db.query(sql, employeeID, (err, results) => {
        if (err) {
            console.error('Error fetching leave requests:', err);
            res.status(500).json({ success: false, message: 'Failed to fetch leave requests.' });
        } else {
            console.log('Leave requests fetched successfully');
            res.status(200).json({ success: true, leaveRequests: results });
        }
    });
});
 
 
 
 
 
  // Route to fetch data from the database where status is 'skipped'
  app.get('/skippedData', (req, res) => {
    const query = "SELECT * FROM OnboardingHrms WHERE Status = 'skipped'";
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching skipped data from database:', error);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
   
   
   
  // Route to search for skipped data based on input
  app.post('/searchSkippedData', (req, res) => {
    const { searchText } = req.body;
   
    // Construct the SQL query to search for skipped data
    const query = `
      SELECT * FROM OnboardingHrms
      WHERE Status = 'skipped'
      AND (Employee_ID LIKE '%${searchText}%'
           OR EmployeeName LIKE '%${searchText}%'
           OR Department LIKE '%${searchText}%'
           OR Location LIKE '%${searchText}%')
    `
   
    // Execute the query
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error searching for skipped data:', error);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.json(results); // Send the filtered data as response
      }
    });
  });
   
 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'js5698723@gmail.com', // Your Gmail email address
        pass: 'oqgd vhvw rnyz vrls' // Your Gmail password or App Password
    }
});
 
// Route to send email
app.post('/api/send-email', (req, res) => {
    const { EmployeeName, Reason } = req.body;
 
    // Define the email content
    const mailOptions = {
        from: 'js5698723@gmail.com', 
        to: 'recipient@example.com', 
        subject: 'Leave Request',  
        text: `Hi Mam,
 
I hope this email finds you well. I am writing to inform you that ${EmployeeName} would like to request leave. Therefore, ${EmployeeName} would like to request leave to address ${Reason}.
 
Thanks & Regards,
${EmployeeName}`
    };
 
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});
 
 
 
// app.get('/api/clients', (req, res) => {
//     db.query('SELECT * FROM ClientManagement', (err, results) => {
//       if (err) {
//         console.error('Error fetching clients:', err);
//         res.status(500).json({ message: 'Error fetching clients' });
//       } else {
//         res.status(200).json(results);
//       }
//     });
//   });
 
//   app.post('/api/clients', (req, res) => {
//     const {
//       clientName,
//       projectId,
//       managerId,
//       startDate,
//       endDate,
//       projectManager,
//       projectName,
//       phoneNumber,
//       address,
//       email
//     } = req.body;
 
//     const sql = `INSERT INTO ClientManagement (ClientName, Email, PhoneNumber, Address, Project_ID, Project_Name, Project_Manager, Manager_ID, Start_Date, End_Date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     const values = [clientName, email, phoneNumber, address, projectId, projectName, projectManager, managerId, startDate, endDate];
 
//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error('Error creating client:', err);
//         res.status(500).json({ success: false, message: 'Error creating client' });
//       } else {
//         console.log('Client created successfully');
//         const newClient = { ...req.body, clientId: result.insertId }; // Add the inserted ID to the response
//         res.status(201).json(newClient);
//       }
//     });
//   });
 
//   app.delete('/api/clients/:clientId', (req, res) => {
//     const clientId = req.params.clientId;
 
//     db.query('DELETE FROM ClientManagement WHERE Client_ID = ?', clientId, (err, result) => {
//       if (err) {
//         console.error('Error deleting client:', err);
//         res.status(500).json({ success: false, message: 'Error deleting client' });
//       } else {
//         console.log('Client deleted successfully');
//         res.status(200).json({ success: true, message: 'Client deleted successfully' });
//       }
//     });
//   });
 
 
 
  // app.post('/api/employees', (req, res) => {
  //   const employee = req.body;
  //   const sql = 'INSERT INTO ProjectManagement SET ?';
 
  //   connection.query(sql, employee, (err, result) => {
  //     if (err) {
  //       console.error('Error adding employee: ', err);
  //       res.status(500).json({ error: 'Error adding employee' });
  //     } else {
  //       console.log('Employee added successfully');
  //       res.status(201).json({ message: 'Employee added successfully' });
  //     }
  //   });
  // });
 
 
 
 
  app.post("/employees", (req, res) => {
    const { Username, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager } = req.body;
    const sql = "INSERT INTO ProjectManagement (Username, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [Username, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ message: "Employee added successfully" });
      }
    });
  });

app.get("/employees/:username", (req, res) => {
  const { username } = req.params;
  const sql = "SELECT * FROM ProjectManagement WHERE Username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    }
  });
});
 
 
 
 
 
 
 
 
 
app.get('/api/project-starts', (req, res) => {
  const query = `
    SELECT YEAR(startDate) as year, COUNT(*) as projectCount
    FROM projects
    GROUP BY YEAR(startDate)
    ORDER BY YEAR(startDate)
  `;
  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});
 
 
app.get('/api/total-applicants', (req, res) => {
    const query = 'SELECT COUNT(*) as count FROM Applicants';
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]);
        }
    });
});
 
 
app.get('/api/gender-composition', (req, res) => {
    const query = 'SELECT Gender, COUNT(*) as count FROM employee_details WHERE Gender IN ("Male", "Female") GROUP BY Gender';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});
 
 
app.get('/api/onboardings', (req, res) => {
    const query = `
        SELECT MONTH(Onboarding_Date) as month, COUNT(*) as count
        FROM OfferLetter
        WHERE YEAR(Onboarding_Date) = YEAR(CURDATE())
        GROUP BY MONTH(Onboarding_Date);
    `;
 
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
 
        const data = Array(12).fill(0);
        results.forEach(row => {
            data[row.month - 1] = row.count;
        });
 
        res.json(data);
    });
});
 
 
 
app.get('/api/job-positions', (req, res) => {
    const query = `
        SELECT Job_Position, COUNT(*) as count
        FROM OfferLetter
        GROUP BY Job_Position;
    `;
 
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
 
        const labels = [];
        const series = [];
 
        results.forEach(row => {
            labels.push(row.Job_Position);
            series.push(row.count);
        });
 
        res.json({ labels, series });
    });
});
 
 
 
 
app.get('/api/status-counts', (req, res) => {
    const query = `
        SELECT
            SUM(CASE WHEN Status = 'NotInitiated' THEN 1 ELSE 0 END) as NotInitiated,
            SUM(CASE WHEN Status = 'Initiated' THEN 1 ELSE 0 END) as Initiated,
            SUM(CASE WHEN Status = 'Skipped' THEN 1 ELSE 0 END) as Skipped,
            SUM(CASE WHEN Status = 'Cancelled' THEN 1 ELSE 0 END) as Cancelled
        FROM OnboardingHrms
    `;
 
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results[0]);
    });
});
 
 
 
app.get('/api/recently-offered-applicants', (req, res) => {
    const query = "SELECT Applicant_ID, Applicant_Name, Job_Position, Onboarding_Date FROM OfferLetter ORDER BY Onboarding_Date DESC LIMIT 10";
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.json(results);
        }
    });
});
app.post('/checkin', (req, res) => {
  const { username } = req.body;
  const date = new Date().toISOString().slice(0, 10);
  const checkIn = formatTime(new Date());
  const query = 'INSERT INTO Attendance (date, Check_In, Status, Username) VALUES (?, ?, ?, ?)';

  db.query(query, [date, checkIn, 'Present', username], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error on check-in');
    } else {
      res.send('Checked in successfully');
    }
  });
});

app.post('/checkout', (req, res) => {
  const { username } = req.body;
  const date = new Date().toISOString().slice(0, 10);
  const checkOut = formatTime(new Date());
  const querySelect = 'SELECT Check_In FROM Attendance WHERE date = ? AND Username = ?';
  const queryUpdate = `
    UPDATE Attendance
    SET Check_Out = ?,
        Working_hours = ?
    WHERE date = ? AND Username = ?`;

  db.query(querySelect, [date, username], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching check-in time');
    } else if (result.length === 0) {
      res.status(400).send('Check-in record not found for today');
    } else {
      const checkIn = result[0].Check_In;
      const workingHours = calculateWorkingHours(checkIn, checkOut);

      db.query(queryUpdate, [checkOut, workingHours, date, username], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error on check-out');
        } else {
          res.send('Checked out successfully');
        }
      });
    }
  });
});

app.get('/attendance', (req, res) => {
  const { username } = req.query;
  const query = 'SELECT * FROM Attendance WHERE Username = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching attendance data');
    } else {
      res.json(results);
    }
  });
});

// Endpoint to fetch all attendance records
app.get('/all-attendance', (req, res) => {
  const query = 'SELECT * FROM Attendance';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching attendance data');
    } else {
      res.json(results);
    }
  });
});

 
 
 
   
  // API Endpoint to Get All Assets
  app.get('/api/getAssets', (req, res) => {
    const query = 'SELECT AssetType, AssetName, AssetID, AssetCategory, DATE(AssignedOn) AS AssignedOn, CurrentCondition FROM Assets';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching assets from MySQL database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results);
    });
  });
   
  // API Endpoint to Get a Specific Asset
  app.get('/api/getAsset/:id', (req, res) => {
    const assetId = req.params.id;
    const query = 'SELECT AssetType, AssetName, AssetID, AssetCategory, DATE(AssignedOn) AS AssignedOn, CurrentCondition FROM Assets WHERE AssetID = ?';
    db.query(query, [assetId], (err, results) => {
      if (err) {
        console.error('Error fetching asset details from MySQL database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'Asset not found' });
        return;
      }
      res.json(results[0]); // Assuming only one asset matches the ID
    });
  });
   
  // API Endpoint to Add a New Asset
  app.post('/api/addAsset', (req, res) => {
    const { assetType, assetName, assetID, assetCategory, assignedOn, currentCondition } = req.body;
    const query = 'INSERT INTO Assets (AssetType, AssetName, AssetID, AssetCategory, AssignedOn, CurrentCondition) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [assetType, assetName, assetID, assetCategory, assignedOn, currentCondition], (err, result) => {
      if (err) {
        console.error('Error adding asset to MySQL database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Asset added successfully', assetId: result.insertId });
    });
  });
   
  // API Endpoint to fetch personal details
  app.get('/api/personalDetails', (req, res) => {
    const sql = 'SELECT FirstName, LastName, DOB, Address, Email, Gender, Phone, MartialStatus FROM PersonalDetails';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching personal details from MySQL database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.send(result);
    });
  });
   
  // API Endpoint to fetch contact details
  app.get('/api/contactDetails', (req, res) => {
    const sql = 'SELECT WorkEmail, PersonalEmail, Phone, Address FROM ContactDetails';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching contact details from MySQL database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.send(result);
    });
  });
  // API Endpoint to fetch job details
  app.get('/api/jobDetails', (req, res) => {
    const sql = 'SELECT EmployeeNumber, DateOfJoining, JobTitlePrimary, JobTitleSecondary, InProbation, NoticePeriod, WorkType, TimeType, Band, PayGrade FROM JobDetails';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching job details from MySQL database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.send(result);
    });
  });
   
  // API Endpoint to fetch organization details
  app.get('/api/organizationDetails', (req, res) => {
    const sql = 'SELECT BusinessUnit, Department, Location, CostCenter, LegalEntity, ReportsTo FROM OrganizationDetails';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching organization details from MySQL database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.send(result);
    });
  });
  app.post("/updateDetails", (req, res) => {
    const { EmployeeID, About, Interests, Skills, Hobbies } = req.body;
 
    const checkQuery = "SELECT * FROM emp_about WHERE EmployeeID = ?";
    db.query(checkQuery, [EmployeeID], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
 
        if (result.length > 0) {
            let updateQuery = "UPDATE emp_about SET ";
            const updateValues = [];
 
            if (About) {
                updateQuery += "About = ?, ";
                updateValues.push(About);
            }
            if (Interests) {
                updateQuery += "Interests = ?, ";
                updateValues.push(Interests);
            }
            if (Skills) {
                updateQuery += "Skills = ?, ";
                updateValues.push(Skills);
            }
            if (Hobbies) {
                updateQuery += "Hobbies = ?, ";
                updateValues.push(Hobbies);
            }
 
            updateQuery = updateQuery.slice(0, -2);
            updateQuery += " WHERE EmployeeID = ?";
            updateValues.push(EmployeeID);
 
            db.query(updateQuery, updateValues, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(200).send("Details updated successfully.");
            });
        } else {
            const insertQuery = "INSERT INTO emp_about (EmployeeID, About, Interests, Skills, Hobbies) VALUES (?, ?, ?, ?, ?)";
            db.query(insertQuery, [EmployeeID, About || '', Interests || '', Skills || '', Hobbies || ''], (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(200).send("Details inserted successfully.");
            });
        }
    });
});
 
app.get("/api/get/updateDetails", (req, res) => {
    const sqlSelect = "SELECT * FROM emp_about";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
});
 
 
  // Route to insert a new employee
  app.get('/api/employee', (req, res) => {
    const sql = 'SELECT name, location, email, contact, position, department, reporting_to, blood_group FROM employees';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching employees from MySQL database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.send(result);
    });
  });
 
 
 
 
  app.get('/countCheckIns', (req, res) => {
    const { username } = req.query;
    const query = 'SELECT COUNT(*) AS checkInCount FROM Attendance WHERE Username = ? AND Check_In IS NOT NULL';
 
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error counting check-ins');
      } else {
        res.json(results[0]);
      }
    });
  });
 
  // Endpoint to count check-outs
  app.get('/countCheckOuts', (req, res) => {
    const { username } = req.query;
    const query = 'SELECT COUNT(*) AS checkOutCount FROM Attendance WHERE Username = ? AND Check_Out IS NOT NULL';
 
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error counting check-outs');
      } else {
        res.json(results[0]);
      }
    });
  });
 
 
  app.get('/api/departments', (req, res) => {
    const sqlSelect = "SELECT * FROM Department";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.error("Error fetching departments:", err);
            res.status(500).json({ error: "Error fetching departments" });
        } else {
            res.status(200).json(result);
        }
    });
});
 
app.post('/api/departments', (req, res) => {
    const { DepartmentID, DepartmentName, Description } = req.body;
    const sqlInsert = "INSERT INTO Department (DepartmentID, DepartmentName, Description) VALUES (?, ?, ?)";
    db.query(sqlInsert, [DepartmentID, DepartmentName, Description], (err, result) => {
        if (err) {
            console.error("Error adding department:", err);
            res.status(500).json({ error: "Error adding department" });
        } else {
            res.status(200).json({ message: "Department added successfully" });
        }
    });
});
 
app.put('/api/departments/:id', (req, res) => {
    const { DepartmentID, DepartmentName, Description } = req.body;
    const sqlUpdate = "UPDATE Department SET DepartmentName = ?, Description = ? WHERE DepartmentID = ?";
    db.query(sqlUpdate, [DepartmentName, Description, DepartmentID], (err, result) => {
        if (err) {
            console.error("Error updating department:", err);
            res.status(500).json({ error: "Error updating department" });
        } else {
            res.status(200).json({ message: "Department updated successfully" });
        }
    });
});
 
app.delete('/api/departments/:id', (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM Department WHERE DepartmentID = ?";
    db.query(sqlDelete, id, (err, result) => {
        if (err) {
            console.error("Error deleting department:", err);
            res.status(500).json({ error: "Error deleting department" });
        } else {
            res.status(200).json({ message: "Department deleted successfully" });
        }
    });
});
 
 
 
 
 
app.get('/api/positions', (req, res) => {
  const sqlSelect = "SELECT * FROM Positions";
  db.query(sqlSelect, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send(err);
      } else {
          res.send(result);
      }
  });
});
 
// Add a new position
app.post('/api/positions', (req, res) => {
  const { PositionID, PositionName, DepartmentID, RoleDescription } = req.body;
  const sqlInsert = "INSERT INTO Positions (PositionID, PositionName, DepartmentID, RoleDescription) VALUES (?, ?, ?, ?)";
  db.query(sqlInsert, [PositionID, PositionName, DepartmentID, RoleDescription], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send(err);
      } else {
          res.send(result);
      }
  });
});
 
// Update a position
app.put('/api/positions/:id', (req, res) => {
  const { id } = req.params;
  const { PositionName, DepartmentID, RoleDescription } = req.body;
  const sqlUpdate = "UPDATE Positions SET PositionName = ?, DepartmentID = ?, RoleDescription = ? WHERE PositionID = ?";
  db.query(sqlUpdate, [PositionName, DepartmentID, RoleDescription, id], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send(err);
      } else {
          res.send(result);
      }
  });
});
 
// Delete a position
app.delete('/api/positions/:id', (req, res) => {
  const { id } = req.params;
  const sqlDelete = "DELETE FROM Positions WHERE PositionID = ?";
  db.query(sqlDelete, [id], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send(err);
      } else {
          res.send(result);
      }
  });
});
 
 
 
app.get('/api/leave-request', (req, res) => {
  db.query('SELECT * FROM `leave-request`', (err, result) => {
    if (err) {
      console.error('Error fetching leave requests:', err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
});
 
 
 
app.get('/api/leave-request', (req, res) => {
  const sqlSelect = "SELECT * FROM `leave-request`";
  db.query(sqlSelect, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(result);
  });
});

app.put('/api/leave-request/:id', (req, res) => {
  const { id } = req.params;
  const { LeaveType, StartDate, EndDate, Reason, Status } = req.body;
  const sqlUpdate = "UPDATE `leave-request` SET LeaveType = ?, StartDate = ?, EndDate = ?, Reason = ?, Status = ? WHERE id = ?";
  db.query(sqlUpdate, [LeaveType, StartDate, EndDate, Reason, Status, id], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(result);
  });
});

app.delete('/api/leave-request/:id', (req, res) => {
  const { id } = req.params;
  const sqlDelete = "DELETE FROM `leave-request` WHERE id = ?";
  db.query(sqlDelete, [id], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(result);
  });
});

 
 

app.post("/employees", (req, res) => {
    const { Username, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager } = req.body;
    const sql = "INSERT INTO ProjectManagement (Username, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [Username, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        } else {
            res.status(200).json({ message: "Employee added successfully" });
        }
    });
});
 
// Fetch all employees API endpoint
app.get("/employees", (req, res) => {
    const sql = "SELECT * FROM ProjectManagement";
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        } else {
            res.status(200).json(result);
        }
    });
});
 
 


// Update employee details API endpoint
app.put("/employees/:id", (req, res) => {
  const projectId = req.params.id;
  const { Username, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager } = req.body;
  const sql = "UPDATE ProjectManagement SET Username = ?, Employee_Name = ?, Project_ID = ?, Client_ID = ?, Client_Name = ?, ProjectName = ?, Duration = ?, Start_Date = ?, End_Date = ?, ProjectManager = ? WHERE Project_ID = ?";
  db.query(sql, [Username, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager, projectId], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ message: "Internal server error" });
      } else {
          if (result.affectedRows === 0) {
              res.status(404).json({ message: "Project not found" });
          } else {
              res.status(200).json({ message: "Project updated successfully" });
          }
      }
  });
});

// Delete employee API endpoint
app.delete("/employees/:id", (req, res) => {
  const projectId = req.params.id;
  const sql = "DELETE FROM ProjectManagement WHERE Project_ID = ?";
  db.query(sql, projectId, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ message: "Internal server error" });
      } else {
          if (result.affectedRows === 0) {
              res.status(404).json({ message: "Project not found" });
          } else {
              res.status(200).json({ message: "Project deleted successfully" });
          }
      }
  });
});


app.get('/api/departments', (req, res) => {
  const sqlSelect = "SELECT DepartmentID FROM Department";
  db.query(sqlSelect, (err, result) => {
      if (err) {
          console.error("Error fetching department IDs:", err);
          res.status(500).json({ error: "Error fetching department IDs" });
      } else {
          const departmentIds = result.map(department => department.DepartmentID);
          res.status(200).json(departmentIds);
      }
  });
});



app.get('/organisationassets', (req, res) => {
  const query = 'SELECT AssetID, AssetName, Category, Description FROM OrganisationAssets';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});
 
 
app.post('/organisationassetsadd', (req, res) => {
  const { AssetID, AssetName, Category, Description } = req.body;
  const query = 'INSERT INTO OrganisationAssets (AssetID, AssetName, Category, Description) VALUES (?, ?, ?, ?)';
 
  db.query(query, [AssetID, AssetName, Category, Description], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
      return;
    }
    res.status(201).send('Asset added successfully');
  });
});
 
 
// Update an asset
app.put('/organisationassets/:AssetID', (req, res) => {
  const { AssetID } = req.params;
  const { AssetName, Category, Description } = req.body;
  const query = 'UPDATE OrganisationAssets SET AssetName = ?, Category = ?, Description = ? WHERE AssetID = ?';
 
  db.query(query, [AssetName, Category, Description, AssetID], (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).send('Error updating data');
      return;
    }
    res.status(200).send('Asset updated successfully');
  });
});
 
// Delete an asset
app.delete('/organisationassets/:AssetID', (req, res) => {
  const { AssetID } = req.params;
  const query = 'DELETE FROM OrganisationAssets WHERE AssetID = ?';
 
  db.query(query, [AssetID], (err, results) => {
    if (err) {
      console.error('Error deleting data:', err);
      res.status(500).send('Error deleting data');
      return;
    }
    res.status(200).send('Asset deleted successfully');
  });
});
 
 
 

app.get('/shiftsdata', (req, res) => {
  const query = 'SELECT Shift_ID, ShiftDate, StartTime, EndTime, ShiftType, BreakTime FROM Shifts';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});
 
 
app.post('/shifts', (req, res) => {
  const { Shift_ID, ShiftDate, StartTime, EndTime, ShiftType, BreakTime } = req.body;
 
  let start = new Date(`${ShiftDate}T${StartTime}`);
  let end = new Date(`${ShiftDate}T${EndTime}`);
 
  // Adjust the end time if it is earlier than the start time (crosses midnight)
  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }
 
  const diff = Math.abs(end - start) / 1000;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const ShiftDuration = `${hours} hours ${minutes} minutes`;
 
  const query = 'INSERT INTO Shifts (Shift_ID, ShiftDate, StartTime, EndTime, ShiftType, BreakTime, ShiftDuration) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [Shift_ID, ShiftDate, StartTime, EndTime, ShiftType, BreakTime, ShiftDuration], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ message: 'Shift added successfully' });
  });
});
 
 
// server.js
app.put('/shifts/:id', (req, res) => {
  const { id } = req.params;
  const { ShiftDate, StartTime, EndTime, ShiftType, BreakTime } = req.body;
 
  let start = new Date(`${ShiftDate}T${StartTime}`);
  let end = new Date(`${ShiftDate}T${EndTime}`);
 
  // Adjust the end time if it is earlier than the start time (crosses midnight)
  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }
 
  const diff = Math.abs(end - start) / 1000;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const ShiftDuration = `${hours} hours ${minutes} minutes`;
 
  const query = 'UPDATE Shifts SET ShiftDate = ?, StartTime = ?, EndTime = ?, ShiftType = ?, BreakTime = ?, ShiftDuration = ? WHERE Shift_ID = ?';
  db.query(query, [ShiftDate, StartTime, EndTime, ShiftType, BreakTime, ShiftDuration, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({ message: 'Shift updated successfully' });
  });
});
 
 
// Endpoint to delete a shift by Shift_ID
app.delete('/shifts/:id', (req, res) => {
  const { id } = req.params;
 
  const query = 'DELETE FROM Shifts WHERE Shift_ID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({ message: 'Shift deleted successfully' });
  });
});
 
 
// app.get('/api/weekoffs', (req, res) => {
//   db.query('SELECT * FROM weekoff', (err, results) => {
//     if (err) {
//       console.error('Error fetching weekoffs:', err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }
//     res.json(results);
//   });
// });
 
// app.post('/api/weekoffs', (req, res) => {
//   const { weekoffname, description, selectedDays } = req.body;
//   const sql = 'INSERT INTO weekoff (weekoffname, description, selectedDays) VALUES (?, ?, ?)';
//   db.query(sql, [weekoffname, description, selectedDays.join(', ')], (err, result) => {
//     if (err) {
//       console.error('Error adding weekoff:', err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }
//     res.status(201).json({ id: result.insertId, weekoffname, description, selectedDays });
//   });
// });
 
// app.delete('/api/weekoffs/:id', (req, res) => {
//   const { id } = req.params;
//   db.query('DELETE FROM weekoff WHERE id = ?', [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting weekoff:', err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }
//     res.json({ message: 'Weekoff deleted successfully' });
//   });
// });
 
 

// Function to generate an 8-character random password
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
 
// Endpoint to fetch applicant details
app.get('/applicantDetails/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT First_Name, Middle_Name, Last_Name, Phone_Number, Email_ID, Gender, Job_Position, Department, Role, Date_of_Birth, Marital_Status, Address FROM Applicants WHERE Applicant_ID = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Applicant not found' });
      return;
    }
    res.json(results[0]);
  });
});
 
// Endpoint to get the user count for generating Employee ID
app.get('/userCount', (req, res) => {
  const query = 'SELECT COUNT(*) AS count FROM employee_details';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results[0]);
  });
});
 
// Endpoint to create a new employee
app.post('/createEmployee', (req, res) => {
  const {
    First_Name,
    Middle_Name,
    Last_Name,
    Phone_Number,
    Email_ID,
    Gender,
    Job_Position,
    Department,
    Role,
    EmployeeName,
    Joining_Date,
    EmployeeID,
    Shift,
    Date_of_Birth,
    Marital_Status,
    Address,
  } = req.body;
 
  // Generate an 8-character random password
  const Password = generateRandomPassword();
 
  const query = `
    INSERT INTO employee_details (First_Name, Middle_Name, Last_Name, Phone_Number, Email_ID, Gender, Job_Position, Department, Role, EmployeeName, Joining_Date, EmployeeID, Password, Shift_ID, Date_of_Birth, Marital_Status, Address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
 
  db.query(
    query,
    [First_Name, Middle_Name, Last_Name, Phone_Number, Email_ID, Gender, Job_Position, Department, Role, EmployeeName, Joining_Date, EmployeeID, Password, Shift, Date_of_Birth, Marital_Status, Address],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
 
      // Fetch shift details
      const shiftQuery = 'SELECT StartTime, EndTime, ShiftType FROM Shifts WHERE Shift_ID = ?';
    db.query(shiftQuery, [Shift], (shiftErr, shiftResults) => {
        if (shiftErr) {
          console.error('Error fetching shift details:', shiftErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
 
        if (shiftResults.length === 0) {
          res.status(404).json({ error: 'Shift not found' });
          return;
        }
 
        const { StartTime, EndTime, ShiftType } = shiftResults[0];
 
        res.json({ employeeId: EmployeeID, password: Password, shiftDetails: { StartTime, EndTime, ShiftType } }); // Send shift details in response
      });
    }
  );
});
 
 
app.post('/sendWelcomeEmail', async (req, res) => {
  const { Email_ID, EmployeeID, Password, shiftDetails } = req.body;
 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'js5698723@gmail.com',
      pass: 'oqgd vhvw rnyz vrls',
    },
  });
 
  const mailOptions = {
    from: 'js5698723@gmail.com',
    to: Email_ID,
    subject: 'Welcome to the Company',
    text: `Dear Employee,
 
    Welcome to the company! Here are your login credentials and shift details:
 
    Employee ID: ${EmployeeID}
    Password: ${Password}
    Shift Start Time: ${shiftDetails.StartTime}
    Shift End Time: ${shiftDetails.EndTime}
    Shift Type: ${shiftDetails.ShiftType}
 
    Please keep this information secure.
 
    Best regards,
    The Company`
  };
 
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});
 
// Endpoint to fetch shifts
app.get('/employeeshift', (req, res) => {
  const query = 'SELECT Shift_ID FROM Shifts';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});
 
 
app.get('/employeesfulllist', (req, res) => {
  const query = `
    SELECT
      EmployeeID, First_Name, Middle_Name, Last_Name, EmployeeName, Phone_Number, Email_ID, Gender, Date_of_Birth,
      Marital_Status, Address, Department, Job_Position, Shift_ID, Joining_Date, Role
    FROM employee_details
  `;
 
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employee details:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});
 
app.put('/employees/:employeeId', (req, res) => {
  const employeeId = req.params.employeeId;
  const {
    EmployeeName,
    First_Name,
    Middle_Name,
    Last_Name,
    Phone_Number,
    Email_ID,
    Gender,
    Date_of_Birth,
    Marital_Status,
    Address,
    Department,
    Job_Position,
    Shift_ID,
    Joining_Date,
    Role
  } = req.body;
 
  const query = `
    UPDATE employee_details
    SET
      EmployeeName = ?,
      First_Name = ?,
      Middle_Name = ?,
       Last_Name = ?,
      Phone_Number = ?,
      Email_ID = ?,
      Gender = ?,
      Date_of_Birth = ?,
      Marital_Status = ?,
      Address = ?,
      Department = ?,
      Job_Position = ?,
      Shift_ID = ?,
      Joining_Date = ?,
      Role = ?
    WHERE EmployeeID = ?
  `;
 
  const values = [
    EmployeeName,
    First_Name,
    Middle_Name,
   Last_Name,
    Phone_Number,
    Email_ID,
    Gender,
    Date_of_Birth,
    Marital_Status,
    Address,
    Department,
    Job_Position,
    Shift_ID,
    Joining_Date,
    Role,
    employeeId
  ];
 
  console.log('Updating employee:', values);
 
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating employee details:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});
 
 
app.delete('/employees/:employeeId', (req, res) => {
  const employeeId = req.params.employeeId;
 
  const query = `
    DELETE FROM employee_details
    WHERE EmployeeID = ?
  `;
 
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results); // Send the response back
  });
});
 



app.get('/api/leave-request/:username', (req, res) => {
  const { username } = req.params;
  const sql = 'SELECT * FROM `leave-request` WHERE Username = ?';
  db.query(sql, [username], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(results);
  });
});

// Route to create a new leave request
app.post('/api/leave-request', (req, res) => {
  const { Username, EmployeeName, Status, LeaveType, StartDate, EndDate, Reason } = req.body;
  const sql = 'INSERT INTO `leave-request` (Username, EmployeeName, Status, LeaveType, StartDate, EndDate, Reason) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [Username, EmployeeName, Status, LeaveType, StartDate, EndDate, Reason], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send({ success: true });
  });
});

// Route to get the count of total, approved, and rejected leave requests for a specific user
app.get('/api/leave-request-count/:username', (req, res) => {
  const { username } = req.params;
  const sql = `
      SELECT 
          COUNT(*) AS totalLeaves,
          SUM(CASE WHEN Status = 'Approved' THEN 1 ELSE 0 END) AS approvedLeaves,
          SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) AS rejectedLeaves
      FROM \`leave-request\`
      WHERE Username = ?;
  `;
  db.query(sql, [username], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(results[0]);
  });
});





app.get('/attendanceData', (req, res) => {
  const { date, search } = req.query;
  let query = `
    SELECT
      Attendance.Username AS employeeid,
      Attendance.Date AS date,
      Attendance.Check_In AS checkin,
      Attendance.Check_Out AS checkout,
      Attendance.Working_hours AS workinghours,
      Attendance.Status AS status,
      employee_details.EmployeeName AS employeename
    FROM Attendance
    LEFT JOIN employee_details ON Attendance.Username = employee_details.EmployeeID
  `;
 
  const conditions = [];
  if (date) {
    conditions.push(`Attendance.Date = '${date}'`);
  }
  if (search) {
    conditions.push(`Attendance.Username LIKE '%${search}%'`);
  }
 
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
 
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});
 


app.get('/employee_details', verifyToken, (req, res) => {
  const username = req.query.username;

  if (!username) {
      return res.status(400).json({ error: 'Username is required' });
  }

  const query = 'SELECT * FROM employee_details WHERE username = ?';
  db.query(query, [username], (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Employee not found' });
      }

      res.json(results[0]);
  });
});




app.get('/api/applicants', (req, res) => {
  const query = `
      SELECT 
          Applicant_ID, Applicant_Name, Email_ID, Job_Position, Onboarding_Date,
          CASE 
              WHEN Onboarding_Date >= CURDATE() THEN 'Pending'
              ELSE 'Onboarded'
          END AS Status
      FROM OfferLetter
  `;

  db.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching applicants:', error);
          return res.status(500).json({ error: 'Failed to fetch applicants' });
      }
      res.json(results);
  });
});




// Add this endpoint to fetch employee details

app.get('/api/employee-details', (req, res) => {

  const query = 'SELECT EmployeeID, EmployeeName, Email_ID, Joining_Date, Job_Position, Role FROM employee_details';
 
  db.query(query, (err, results) => {

    if (err) {

      console.error('Error fetching employee details:', err);

      res.status(500).send('Error fetching employee details');

    } else {

      res.json(results);

    }

  });

});




app.post('/add-attendance', (req, res) => {
  const { id, Username, date, Check_In, Check_Out, Status, Working_hours } = req.body;
  const query = `
      INSERT INTO Attendance (id, Username, date, Check_In, Check_Out, Status, Working_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      Username = VALUES(Username),
      date = VALUES(date),
      Check_In = VALUES(Check_In),
      Check_Out = VALUES(Check_Out),
      Status = VALUES(Status),
      Working_hours = VALUES(Working_hours)
  `;
  const values = [id, Username, date, Check_In, Check_Out, Status, Working_hours];
  db.query(query, values, (error, results) => {
      if (error) {
          return res.status(500).send(error);
      }
      res.status(200).json({ message: 'Attendance data added/updated successfully' });
  });
});


app.delete('/delete-attendance/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Attendance WHERE id = ?';
  db.query(query, [id], (error, results) => {
      if (error) {
          return res.status(500).send(error);
      }
      res.status(200).json({ message: 'Attendance data deleted successfully' });
  });
});



app.get('/api/employee-dashboard/:username', (req, res) => {
  const { username } = req.params;
  const query = 'SELECT * FROM `leave-request` WHERE Username = ?';

  db.query(query, [username], (error, leaveData) => {
    if (error) {
      console.error('Error fetching leave requests:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const totalLeaves = leaveData.length;
      const approvedLeaves = leaveData.filter(request => request.Status === 'Approved').length;
      const rejectedLeaves = leaveData.filter(request => request.Status === 'Rejected').length;
      const pendingLeaves = leaveData.filter(request => request.Status === 'Pending').length;

      res.json({
        totalLeaves,
        approvedLeaves,
        rejectedLeaves,
        pendingLeaves,
        leaveData
      });
    }
  });
});








// Endpoint to fetch sick and casual leaves for a specific username
app.get('/employee-leaves/:username', (req, res) => {
  const { username } = req.params;

  const query = `
    SELECT
      SUM(CASE WHEN LeaveType = 'sick' THEN 1 ELSE 0 END) AS sick_leaves,
      SUM(CASE WHEN LeaveType = 'casual' THEN 1 ELSE 0 END) AS casual_leaves
    FROM \`leave-request\`
    WHERE Username = ?
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching leaves:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch leaves' });
    } else {
      if (results.length > 0) {
        const { sick_leaves, casual_leaves } = results[0];
        res.json({ success: true, sick_leaves, casual_leaves });
      } else {
        res.status(404).json({ success: false, error: 'No data found' });
      }
    }
  });
});


app.get('/attendance', (req, res) => {
  const { username, searchQuery } = req.query;
  let query = `SELECT * FROM Attendance WHERE Username = ?`;

  if (searchQuery) {
    query += ` AND (Username LIKE ? OR Check_In LIKE ? OR Check_Out LIKE ? OR Working_hours LIKE ? OR Status LIKE ? OR DATE_FORMAT(date, '%Y-%m-%d') LIKE ?)`;
  }

  db.query(query, [username, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`], (err, result) => {
    if (err) {
      res.status(500).send('Error fetching attendance data');
    } else {
      res.json(result);
    }
  });
});




app.get('/attendance', (req, res) => {
  const username = req.query.username;
  const query = `
      SELECT 
          a.*, 
          IFNULL(l.Status, 'Present') AS LeaveStatus 
      FROM 
          Attendance a
      LEFT JOIN 
          leave-request l 
      ON 
          a.Username = l.Username 
          AND l.Status = 'Approved'
          AND a.date BETWEEN l.StartDate AND l.EndDate
      WHERE 
          a.Username = ?;
  `;

  db.query(query, [username], (err, result) => {
      if (err) {
          console.log(err);
          res.status(500).send(err);
      } else {
          res.send(result);
      }
  });
});

const attendanceRequests = [];

// Dummy HR email
const hrEmail = 'majjisanthosh2490@gmail.com';


app.post('/attendance-request', (req, res) => {
  const { username, date, reason } = req.body;
  const request = { username, date, reason, status: 'Pending' };
  attendanceRequests.push(request);

  // Send email to HR
  const mailOptions = {
    from: 'js5698723@gmail.com',
    to: hrEmail,
    subject: 'Attendance Request',
    text: `Employee ${username} has requested an attendance update for ${date}.\n\nReason: ${reason}\n\nStatus: ${request.status}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Request submitted successfully');
  });
});

// Endpoint to approve/reject requests
app.post('/attendance-request/update', (req, res) => {
  const { username, date, status } = req.body;
  const request = attendanceRequests.find(r => r.username === username && r.date === date);
  if (request) {
    request.status = status;
    res.status(200).send('Request status updated successfully');
  } else {
    res.status(404).send('Request not found');
  }
});



app.get('/attendance/monthly', (req, res) => {
  const username = req.query.username; // Assuming you pass username to filter data
  const query = `
      SELECT 
          YEAR(date) AS year,
          MONTH(date) AS month,
          SUM(CASE WHEN Status = 'Present' THEN 1 ELSE 0 END) AS presentCount,
          SUM(CASE WHEN Status = 'Absent' THEN 1 ELSE 0 END) AS absentCount,
          SUM(CASE WHEN Status = 'Leave' THEN 1 ELSE 0 END) AS leaveCount
      FROM Attendance
      WHERE Username = ?
      GROUP BY YEAR(date), MONTH(date)
      ORDER BY year DESC, month DESC;
  `;
  db.query(query, [username], (err, results) => {
      if (err) {
          console.error('Error fetching monthly attendance:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json(results);
  });
});





const getMonthlyAttendance = (username) => {
  return new Promise((resolve, reject) => {
      const query = `
          SELECT 
              MONTH(date) as month, 
              SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as presents,
              SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absents,
              SUM(CASE WHEN status = 'leave' THEN 1 ELSE 0 END) as leaves
          FROM Attendance
          WHERE Username = ?
          GROUP BY MONTH(date)
          ORDER BY month;
      `;

      db.query(query, [username], (error, results) => {
          if (error) {
              return reject(error);
          }

          // Initialize arrays to hold attendance data for 12 months
          const monthlyData = {
              presents: new Array(12).fill(0),
              absents: new Array(12).fill(0),
              leaves: new Array(12).fill(0)
          };

          // Populate the arrays with data from the query results
          results.forEach(row => {
              const monthIndex = row.month - 1;
              monthlyData.presents[monthIndex] = row.presents;
              monthlyData.absents[monthIndex] = row.absents;
              monthlyData.leaves[monthIndex] = row.leaves;
          });

          resolve(monthlyData);
      });
  });
};

// Define the API endpoint
app.get('/api/employee-attendance/:username', async (req, res) => {
  const { username } = req.params;
  try {
      const data = await getMonthlyAttendance(username);
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});




app.post('/insertAttendance', async (req, res) => {
  const { username, date, checkIn, checkOut, workingHours, status } = req.body;

  const sql = `INSERT INTO Attendance (Username, Date, Check_In, Check_Out, Working_hours, Status)
              VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    await db.query(sql, [username, date, checkIn, checkOut, workingHours, status]);
    res.status(200).json({ message: 'Attendance inserted successfully' });
  } catch (error) {
    console.error('Error inserting attendance:', error);
    res.status(500).json({ error: 'Failed to insert attendance' });
  }
});





app.get('/api/leave-request/:username', (req, res) => {
  const { username } = req.params;
  db.query('SELECT * FROM leave-request WHERE Username = ?', [username], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(result);
  });
});


app.post('/attendance-request', (req, res) => {
  const { username, date, reason } = req.body;
  db.query('INSERT INTO Attendance (Username, date, Reason) VALUES (?, ?, ?)', [username, date, reason], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: 'Request submitted successfully' });
  });
});




app.get('/api/employee-leaves/:username', (req, res) => {
  const { username } = req.params;
  const query = `
      SELECT 
          MONTH(StartDate) AS month,
          SUM(DATEDIFF(EndDate, StartDate) + 1) AS total_leave_days
      FROM 
          \`leave-request\`
      WHERE 
          Username = ?
      GROUP BY 
          MONTH(StartDate)
      ORDER BY 
          MONTH(StartDate)
  `;

  db.query(query, [username], (error, results) => {
      if (error) {
          console.error('Error fetching leaves data:', error);
          res.status(500).send('Internal Server Error');
          return;
      }

      const leaveData = results.map(row => ({
          month: row.month,
          total_leave_days: row.total_leave_days
      }));

      res.json(leaveData);
  });
});




app.get('/api/organization', (req, res) => {
  const query = "SELECT * FROM Organization LIMIT 1";
  db.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(result[0]);
  });
});

// Save organization details
app.post('/api/organization', (req, res) => {
  const { OrganizationName, Address, Description, Contact, RegistrationNumber, EstablishedDate, Founder, IndustryType } = req.body;
  const query = `
      INSERT INTO Organization (OrganizationName, Address, Description, Contact, RegistrationNumber, EstablishedDate, Founder, IndustryType)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
          OrganizationName = VALUES(OrganizationName),
          Address = VALUES(Address),
          Description = VALUES(Description),
          Contact = VALUES(Contact),
          RegistrationNumber = VALUES(RegistrationNumber),
          EstablishedDate = VALUES(EstablishedDate),
          Founder = VALUES(Founder),
          IndustryType = VALUES(IndustryType)
  `;
  const values = [OrganizationName, Address, Description, Contact, RegistrationNumber, EstablishedDate, Founder, IndustryType];

  db.query(query, values, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send({ message: 'Organization details saved successfully' });
  });
});

// Update organization details
app.put('/api/organization', (req, res) => {
  const { OrganizationName, Address, Description, Contact, RegistrationNumber, EstablishedDate, Founder, IndustryType } = req.body;
  const query = `
      UPDATE Organization
      SET OrganizationName = ?, Address = ?, Description = ?, Contact = ?, RegistrationNumber = ?, EstablishedDate = ?, Founder = ?, IndustryType = ?
      WHERE id = 1
  `;
  const values = [OrganizationName, Address, Description, Contact, RegistrationNumber, EstablishedDate, Founder, IndustryType];

  db.query(query, values, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send({ message: 'Organization details updated successfully' });
  });
});



app.get('/api/weekoffs', (req, res) => {
  const query = "SELECT * FROM Weekoff";
  db.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json(result);
  });
});

// Add a new week off
app.post('/api/weekoffs', (req, res) => {
  const { days, description } = req.body;
  const query = "INSERT INTO Weekoff (days, description) VALUES (?, ?)";
  db.query(query, [days.join(', '), description], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json({ id: result.insertId, days, description });
  });
});

// Update a week off
app.put('/api/weekoffs/:id', (req, res) => {
  const { id } = req.params;
  const { days, description } = req.body;
  const query = "UPDATE Weekoff SET days = ?, description = ? WHERE id = ?";
  db.query(query, [days.join(', '), description, id], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json({ id, days, description });
  });
});

// Delete a week off
app.delete('/api/weekoffs/:id', (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Weekoff WHERE id = ?";
  db.query(query, [id], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.sendStatus(204);
  });
});




app.get('/feedbackemployeenames', (req, res) => {
  const query = 'SELECT EmployeeID, EmployeeName FROM employee_details';
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
 
 
app.post('/continuousfeedback', (req, res) => {
  const {
    EmployeeName,
    Username,
    Communication,
    Teamwork,
    Meetingdeadlines,
    Punctuality,
    Leadership,
    Overallrating,
    Givenby,
    Quickaction,
    Comment
  } = req.body;
 
  const query = `INSERT INTO Feedback (EmployeeName, Username, Communication, Teamwork, Meetingdeadlines, Punctuality, Leadership, Overallrating, Givenby, Quickaction, Comment)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
 
  db.query(
    query,
    [EmployeeName, Username, Communication, Teamwork, Meetingdeadlines, Punctuality, Leadership, Overallrating, Givenby, Quickaction, Comment],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Feedback submitted successfully' });
      }
    }
  );
});
 
 















app.post("/meetings", async (req, res) => {
  try {
    const { endDate, duration,name } = req.body;
    const startDate = endDate
    // Check if endDate and duration are present and valid
    if (!endDate || !duration || isNaN(duration)) {
      throw new Error("Invalid or missing data");
    }
 
    const indiaDateTime = moment.utc(endDate).tz("Asia/Kolkata");
 
    // Check if indiaDateTime is a valid date
    if (!indiaDateTime.isValid()) {
      throw new Error("Invalid date provided");
    }
 
    const newEndDate = indiaDateTime.add(Number(duration), "minutes").toISOString().slice(0, -5) + ".000Z";
 
    // Perform API call here using newEndDate
    const response = await fetch("https://api.whereby.dev/v1/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endDate: newEndDate,
        fields: ["hostRoomUrl"],
      }),
    });
 
    const data = await response.json();
 
    // Save data to the database
    const {   roomName, roomUrl, meetingId, hostRoomUrl } = data;
 
    db.query(
      `INSERT INTO whereby_host (name, startDate, endDate, roomName, roomUrl, meetingId, hostRoomUrl) VALUES (?, ?, ?, ?, ?, ?, ? )`,
      [name, startDate, newEndDate, roomName, roomUrl, meetingId, hostRoomUrl],
      (error, results) => {
        if (error) {
          console.error("Error inserting into database:", error);
          res.status(500).json({ success: false, message: "Error booking meeting" });
        } else {
          res.status(200).json({ success: true, message: "Meeting booked successfully", endDate: newEndDate });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Error booking meeting" });
  }
});
 
 
app.get("/host", async (req, res) => {
  const query = "SELECT * FROM whereby_host";
 
  db.query(query, (error, results) => {
    if (error) {
      console.error("Host error:", error);
      res.status(500).json({ success: false, message: "Error fetching host data" });
    } else {
      res.status(200).json({ success: true, message: "Host data Fetched", data: results });
    }
  });
});
 
 
 
 
app.delete("/deletmeeting/:meetingId", async (req, res) => {
  const { meetingId } = req.params;
  try {
      // Delete the meeting from Whereby API
      const response = await fetch(`https://api.whereby.dev/v1/meetings/${meetingId}`, {
          method: 'DELETE',
          headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
          },
      });
 
      if (!response.ok) {
          console.log(`Failed to delete meeting from Whereby. Status: ${response.status}`);
          return res.status(response.status).json({ error: 'Failed to delete meeting from Whereby' });
      }
 
      // If meeting is successfully deleted from Whereby, delete related data from your database
      db.query('DELETE FROM whereby_host WHERE meetingId = ?', [meetingId], (error, results) => {
          if (error) {
              console.error('Error deleting meeting data from database:', error);
              return res.status(500).json({ error: 'Internal server error' });
          }
          // Respond with 204 No Content on successful deletion
          res.status(204).end();
      });
  } catch (error) {
      console.error('Error deleting meeting:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
 
 
async function checkExpiredMeetings() {
  const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
 
  db.query(
    `SELECT * FROM whereby_host WHERE endDate < ?`,
    [now],
    async (error, results) => {
      if (error) {
        console.error('Error checking expired meetings:', error);
        return;
      }
 
      for (const meeting of results) {
        const {
          name,
          startDate,
          endDate,
          roomName,
          roomUrl,
          meetingId,
          hostRoomUrl
        } = meeting;
 
        db.query(
          `INSERT INTO meetings_attended (name, startDate, endDate, roomName, roomUrl, meetingId, hostRoomUrl) VALUES (?, ?, ?, ?, ?, ?, ? )`,
          [name, startDate, endDate, roomName, roomUrl, meetingId, hostRoomUrl],
          (insertError, insertResults) => {
            if (insertError) {
              console.error('Error moving expired meeting to meetings_attended:', insertError);
            } else {
              // Delete expired meeting from whereby_host table
              db.query(
                `DELETE FROM whereby_host WHERE meetingId = ?`,
                [meetingId],
                (deleteError, deleteResults) => {
                  if (deleteError) {
                    console.error('Error deleting expired meeting from whereby_host:', deleteError);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
}
 
 
setInterval(checkExpiredMeetings, 60 * 60 * 1000);
 
app.get("/attendedmeetings", async (req, res) => {
  const query = "SELECT * FROM meetings_attended";
 
  db.query(query, (error, results) => {
    if (error) {
      console.error("Host error:", error);
      res.status(500).json({ success: false, message: "Error fetching host data" });
    } else {
      res.status(200).json({ success: true, message: "Host data Fetched", data: results });
    }
  });
});
 


app.post("/OnetoOnemeeting", async (req, res) => {
  try {
    const { endDate, duration, name, employeeId } = req.body;
    const startDate = endDate;
 
    // Check if endDate, duration, and employeeId are present and valid
    if (!endDate || !duration || isNaN(duration) || !employeeId) {
      throw new Error("Invalid or missing data");
    }
 
    const indiaDateTime = moment.utc(endDate).tz("Asia/Kolkata");
 
    // Check if indiaDateTime is a valid date
    if (!indiaDateTime.isValid()) {
      throw new Error("Invalid date provided");
    }
 
    const newEndDate = indiaDateTime.add(Number(duration), "minutes").toISOString().slice(0, -5) + ".000Z";
 
    // Perform API call here using newEndDate
    const response = await fetch("https://api.whereby.dev/v1/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endDate: newEndDate,
        fields: ["hostRoomUrl"],
      }),
    });
 
    const data = await response.json();
 
    // Save data to the database
    const { roomName, roomUrl, meetingId, hostRoomUrl } = data;
 
    // Insert data into whereby_host table (optional if you still want to keep it)
    // Your existing code here...
 
    // Insert data into OnetoOne table
    db.query(
      `INSERT INTO OnetoOne (Username, startDate, endDate, meetingId) VALUES (?, ?, ?, ?)`,
      [employeeId, startDate, newEndDate, meetingId],
      (error, results) => {
        if (error) {
          console.error("Error inserting into OnetoOne table:", error);
          res.status(500).json({ success: false, message: "Error booking meeting" });
        } else {
          res.status(200).json({ success: true, message: "Meeting booked successfully", endDate: newEndDate });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Error booking meeting" });
  }
});
 
 
 

app.get('/AllEmployeesPIP', (req, res) => {
  const queryAllEmployees = `
    SELECT
    EmployeeID,
      CONCAT(First_Name, IFNULL(CONCAT(' ', Middle_Name), ''), ' ', Last_Name) AS Applicant_Name,
      Job_Position,
      Department
    FROM
      employee_details
  `;
 
  db.query(queryAllEmployees, (error, results) => {
    if (error) {
      console.error('Error querying all employees:', error);
      res.status(500).json({ error: 'Server error' });
      return;
    }
 
    res.json(results);
  });
});
 
 
app.post('/addToPIP', (req, res) => {
  const { EmployeeID, Applicant_Name, Job_Position, Department } = req.body;
  const query = `
    INSERT INTO PIP (Username, EmployeeName, Job_Position, Department)
    VALUES (?, ?, ?, ?)
  `;
 
  db.query(query, [EmployeeID, Applicant_Name, Job_Position, Department], (error, results) => {
    if (error) {
      console.error('Error inserting into PIP:', error);
      res.status(500).json({ error: 'Server error' });
      return;
    }
 
    res.json({ success: true });
  });
});
 
app.post('/addToAppraisals', (req, res) => {
  const { EmployeeID, Applicant_Name, Job_Position, Department } = req.body;
  const query = `
    INSERT INTO Appraisal (Username, Employee_Name, Job_Position, Department)
    VALUES (?, ?, ?, ?)
  `;
 
  db.query(query, [EmployeeID, Applicant_Name, Job_Position, Department], (error, results) => {
    if (error) {
      console.error('Error inserting into Appraisals:', error);
      res.status(500).json({ error: 'Server error' });
      return;
    }
 
    res.json({ success: true });
  });
});
 
app.get('/AllEmployeesPIPData', (req, res) => {
  const queryAllEmployees = `
    SELECT
    Username,
      EmployeeName,
      Department,
      ReportingManager,
      InitiatedBy,
      Start_Date,
      End_Date
    FROM
      PIP
      WHERE
      PIPCompleted != 'yes';
  `;
 
  db.query(queryAllEmployees, (error, results) => {
    if (error) {
      console.error('Error querying all employees from PIP:', error);
      res.status(500).json({ error: 'Server error' });
      return;
    }
 
    // Calculate PIP duration
    const dataWithDuration = results.map(row => {
      const startDate = new Date(row.Start_Date);
      const endDate = new Date(row.End_Date);
      const pipDuration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)); // Duration in days
      return { ...row, PIP_Duration: pipDuration };
    });
 
    res.json(dataWithDuration);
  });
});
 
 
 
app.post('/updatePIPData', (req, res) => {
  const { reportingManager, initiatedBy, startDate, endDate, pipCompleted, employeeId } = req.body;
 
  const updateQuery = `
    UPDATE PIP
    SET ReportingManager = ?, InitiatedBy = ?, Start_Date = ?, End_Date = ?, PIPCompleted = ?
    WHERE Username = ?
  `;
 
  db.query(updateQuery, [reportingManager, initiatedBy, startDate, endDate, pipCompleted, employeeId], (error, results) => {
    if (error) {
      console.error('Error updating PIP data:', error);
      res.status(500).json({ success: false, error: 'Server error' });
      return;
    }
 
    res.json({ success: true });
  });
});
 
 
 
app.get('/CompletedEmployeesPIPData', (req, res) => {
  const queryCompletedEmployees = `
    SELECT
    Username,
      EmployeeName,
      Department,
      ReportingManager,
      InitiatedBy,
      Start_Date,
      End_Date
    FROM
      PIP
    WHERE
      PIPCompleted = 'yes'
  `;
 
  db.query(queryCompletedEmployees, (error, results) => {
    if (error) {
      console.error('Error querying completed employees from PIP:', error);
      res.status(500).json({ error: 'Server error' });
      return;
    }
 
    // Calculate PIP duration
    const dataWithDuration = results.map(row => {
      const startDate = new Date(row.Start_Date);
      const endDate = new Date(row.End_Date);
      const pipDuration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)); // Duration in days
      return { ...row, PIP_Duration: pipDuration };
    });
 
    res.json(dataWithDuration);
  });
});
 
 
app.get('/AppraisalData', (req, res) => {
  const query = `
    SELECT Username, Employee_Name, Job_Position, Department
    FROM Appraisal
  `;
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching appraisal data:', error);
      res.status(500).json({ success: false, message: 'Error fetching appraisal data' });
      return;
    }
    res.json(results);
  });
});
 
// Endpoint for deleting a row from the "Appraisal" table
app.delete('/deleteAppraisal/:employeeID', (req, res) => {
  const employeeID = req.params.employeeID;
  const query = `
    DELETE FROM Appraisal
    WHERE Username = ?
  `;
  db.query(query, [employeeID], (error, results) => {
    if (error) {
      console.error('Error deleting employee from appraisal:', error);
      res.status(500).json({ success: false, message: 'Error deleting employee from appraisal' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ success: false, message: `Employee with ID ${employeeID} not found in appraisal` });
      return;
    }
    res.json({ success: true, message: `Employee with ID ${employeeID} deleted successfully from appraisal` });
  });
});
 
 
 
 




app.post('/holidays/import', (req, res) => {
  const holidays = req.body.holidays;
  const values = holidays.map(({ Name, Date, Description }) => [Name, Date, Description]);
  const query = "INSERT INTO Holidays (Name, Date, Description) VALUES ?";
  db.query(query, [values], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});



app.post('/request-otp', (req, res) => {
  const { username } = req.body;

  db.query('SELECT Email_ID FROM employee_details WHERE EmployeeID = ?', [ username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const email = results[0].Email_ID;
    const otp = generateOTP();

    smtpClient.sendMail({
      from: 'js5698723@gmail.com',
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is ${otp}`
    }, (error, info) => {
      if (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
      } else {
        console.log('OTP sent:', info.response);

        db.query('UPDATE employee_details SET otp = ? WHERE EmployeeID = ?', [otp,  username], (err, result) => {
          if (err) {
            console.error('Error saving OTP:', err);
            return res.status(500).json({ success: false, message: 'Failed to save OTP' });
          }
          res.json({ success: true, message: 'OTP sent successfully' });
        });
      }
    });
  });
});

app.post('/reset-password', (req, res) => {
  const { username, newPassword, otp } = req.body;

  db.query('SELECT otp FROM employee_details WHERE EmployeeID = ?', [ username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    if (results[0].otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    db.query('UPDATE employee_details SET Password = ? WHERE EmployeeID = ?', [newPassword,  username], (err, result) => {
      if (err) {
        console.error('Error resetting password:', err);
        return res.status(500).json({ success: false, message: 'Failed to reset password' });
      }

      db.query('UPDATE employee_details SET otp = NULL WHERE EmployeeID = ?', [ username], (err, result) => {
        if (err) {
          console.error('Error clearing OTP:', err);
          return res.status(500).json({ success: false, message: 'Failed to clear OTP' });
        }
        res.json({ success: true, message: 'Password reset successfully' });
      });
    });
  });
});






app.post('/verify-otp', (req, res) => {
  const { username, otp } = req.body;
  db.query('SELECT otp FROM employee_details WHERE EmployeeID = ?', [username], (err, results) => {
    if (err || results.length === 0 || results[0].otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    res.json({ success: true, message: 'OTP verified' });
  });
});

app.post('/reset-password', (req, res) => {
  const { username, newPassword, otp } = req.body;
  db.query('SELECT otp FROM employee_details WHERE EmployeeID = ?', [username], (err, results) => {
    if (err || results.length === 0 || results[0].otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    db.query('UPDATE employees SET Password = ? WHERE EmployeeID = ?', [newPassword, username], (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Error resetting password' });
      res.json({ success: true, message: 'Password reset successfully' });
    });
  });
});



app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT EmployeeID, Password, First_Name, Role FROM employee_details WHERE EmployeeID = ?', [username], (err, results) => {
    if (err || results.length === 0 || results[0].Password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const { EmployeeID, First_Name, Role } = results[0];
    const token = generateToken(EmployeeID); // Implement your token generation function

    // Send success response with token, first name, and role
    res.json({ success: true, token, firstName: First_Name, role: Role });
  });
});





app.get('/all-attendance', (req, res) => {
  const query = 'SELECT * FROM Attendance';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching attendance data');
    } else {
      res.json(results);
    }
  });
});

app.put('/update-attendance/:id', (req, res) => {
  const { id } = req.params;
  const { date, check_in, check_out, working_hours } = req.body;
  const query = 'UPDATE Attendance SET date = ?, Check_In = ?, Check_Out = ?, Working_hours = ? WHERE id = ?';
  db.query(query, [date, check_in, check_out, working_hours, id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating attendance record');
    } else {
      res.send('Attendance record updated successfully');
    }
  });
});




app.delete('/delete-attendance/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Attendance WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting attendance record');
    } else {
      res.send('Attendance record deleted successfully');
    }
  });
});








app.get('/offerLettersnotinitiated', (req, res) => {
  const query = `
    SELECT *
    FROM OfferLetter
    WHERE Applicant_ID NOT IN (SELECT Applicant_ID FROM OnboardingHrms)
  `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});
 
 
 
 
// Endpoint to initiate onboarding
app.post('/initiateOnboardingnow', (req, res) => {
  const { id } = req.body;
  const query = `
    INSERT INTO OnboardingHrms (Applicant_ID, Applicant_Name, Onboarding_Date, Job_Position, Phone_Number, Email_ID, Status)
    SELECT Applicant_ID, Applicant_Name, Onboarding_Date, Job_Position, Phone_Number, Email_ID, 'Initiated'
    FROM OfferLetter WHERE Applicant_ID = ?`;
 
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error initiating onboarding:', err);
      res.status(500).json({ message: 'Error initiating onboarding' });
    } else {
      res.status(200).json({ message: 'Onboarding initiated successfully' });
    }
  });
});
 
// Endpoint to skip onboarding
app.post('/skipOnboardingnow', (req, res) => {
  const { id } = req.body;
  const query = `
    INSERT INTO OnboardingHrms (Applicant_ID, Applicant_Name, Onboarding_Date, Job_Position, Phone_Number, Email_ID, Status)
    SELECT Applicant_ID, Applicant_Name, Onboarding_Date, Job_Position, Phone_Number, Email_ID, 'Skipped'
    FROM OfferLetter WHERE Applicant_ID = ?`;
 
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error skipping onboarding:', err);
      res.status(500).json({ message: 'Error skipping onboarding' });
    } else {
      res.status(200).json({ message: 'Onboarding skipped successfully' });
    }
  });
});
 
// Endpoint to cancel onboarding
app.post('/cancelOnboardingnow', (req, res) => {
  const { id } = req.body;
  const query = `
    INSERT INTO OnboardingHrms (Applicant_ID, Applicant_Name, Onboarding_Date, Job_Position, Phone_Number, Email_ID, Status)
    SELECT Applicant_ID, Applicant_Name, Onboarding_Date, Job_Position, Phone_Number, Email_ID, 'Cancelled'
    FROM OfferLetter WHERE Applicant_ID = ?`;
 
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error cancelling onboarding:', err);
      res.status(500).json({ message: 'Error cancelling onboarding' });
    } else {
      res.status(200).json({ message: 'Onboarding cancelled successfully' });
    }
  });
});
 
 
 

// Route to fetch data from the database where status is 'initiated'
app.get('/initiatedData', (req, res) => {
  const query = "SELECT Applicant_ID, Applicant_Name, Onboarding_Date, Job_Position, Phone_Number, Email_ID, Status FROM OnboardingHrms WHERE Status = 'initiated'";
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching initiated data from database:', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});
 
 
 
 
// Route to search for initiated data based on input
app.post('/searchInitiatedData', (req, res) => {
  const { searchText } = req.body;
 
  // Construct the SQL query to search for initiated data
  const query = `
    SELECT * FROM OnboardingHrms
    WHERE Status = 'initiated'
    AND (Username LIKE '%${searchText}%'
         OR EmployeeName LIKE '%${searchText}%'
         OR Department LIKE '%${searchText}%'
         OR Location LIKE '%${searchText}%')
  `;
 
  // Execute the query
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error searching for initiated data:', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(results); // Send the filtered data as response
    }
  });
});
 
 
// Route to fetch data from the database where status is 'skipped'
app.get('/skippedData', (req, res) => {
  const query = "SELECT Applicant_ID, Applicant_Name, Onboarding_Date, Job_Position, Phone_Number, Email_ID, Status FROM OnboardingHrms WHERE Status = 'skipped'";
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching skipped data from database:', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});
 
 
 
// Route to search for skipped data based on input
app.post('/searchSkippedData', (req, res) => {
  const { searchText } = req.body;
 
  // Construct the SQL query to search for skipped data
  const query = `
    SELECT * FROM OnboardingHrms
    WHERE Status = 'skipped'
    AND (Username LIKE '%${searchText}%'
         OR EmployeeName LIKE '%${searchText}%'
         OR Department LIKE '%${searchText}%'
         OR Location LIKE '%${searchText}%')
  `;
 
  // Execute the query
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error searching for skipped data:', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(results); // Send the filtered data as response
    }
  });
});
 
 
// Route to fetch data from the database where status is 'cancelled'
app.get('/cancelledData', (req, res) => {
  const query = "SELECT Applicant_ID, Applicant_Name, Onboarding_Date, Job_Position, Phone_Number, Email_ID, Status FROM OnboardingHrms WHERE Status = 'cancelled'";
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching cancelled data from database:', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});
 
 
// Route to search for cancelled data based on input
app.post('/searchCancelledData', (req, res) => {
  const { searchText } = req.body;
 
  // Construct the SQL query to search for cancelled data
  const query = `
    SELECT * FROM OnboardingHrms
    WHERE Status = 'cancelled'
    AND (Username LIKE '%${searchText}%'
         OR EmployeeName LIKE '%${searchText}%'
         OR Department LIKE '%${searchText}%'
         OR Location LIKE '%${searchText}%')
  `;
 
  // Execute the query
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error searching for cancelled data:', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(results); // Send the filtered data as response
    }
  });
});
 

app.get('/pieChartData', async (req, res) => {
  try {
    // Query to count accepted offers
    const queryAcceptedOffers = `
      SELECT COUNT(*) AS acceptedCount
      FROM OfferLetter
    `;
   
    // Query to count total applicants
    const queryTotalApplicants = `
      SELECT COUNT(*) AS totalApplicants
      FROM Applicants
    `;
 
    // Execute both queries in parallel
    const [acceptedResults, totalResults] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(queryAcceptedOffers, (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(queryTotalApplicants, (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      })
    ]);
 
    // Extract counts from results
    const acceptedCount = acceptedResults[0].acceptedCount;
    const totalApplicants = totalResults[0].totalApplicants;
 
    // Calculate rejected count (total applicants - accepted count)
    const rejectedCount = totalApplicants - acceptedCount;
 
    // Calculate percentages
    const acceptedPercentage = (acceptedCount / totalApplicants) * 100;
    const rejectedPercentage = (rejectedCount / totalApplicants) * 100;
 
    // Respond with data
    res.json({
      acceptedPercentage,
      rejectedPercentage
    });
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 

// app.get('/OpeningsOverview', (req, res) => {
//   const queryTotalApplicants = "SELECT COUNT(Applicant_ID) AS totalApplicants FROM Applicants";
//   const queryTotalOpenings = "SELECT SUM(Num_of_openings) AS totalOpenings FROM JobOpenings";
//   const queryScheduledInterviews = "SELECT COUNT(Interview_Date) AS scheduledInterviews FROM Interview_Schedule WHERE Interview_Date > CURDATE()";
//   const queryReleasedOffers = "SELECT COUNT(Applicant_ID) AS releasedOffers FROM OfferLetter";
//   const queryApplicantsInProgress = `
//     SELECT
//       AT.Applicant_ID,
//       CONCAT(A.First_Name, IFNULL(CONCAT(' ', A.Middle_Name), ''), ' ', A.Last_Name) AS Applicant_Name,
//       A.Job_Position,
//       A.Gender,
//       A.Email_ID,
//       A.Phone_Number,
//       A.AppliedDate
//     FROM
//       Applicant_Tracking AS AT
//     INNER JOIN
//       Applicants AS A ON AT.Applicant_ID = A.Applicant_ID
//     WHERE
//       AT.Interviews_Completed <> 'Yes'
//   `;
 
//   db.query(queryTotalApplicants, (errorTotalApplicants, resultsTotalApplicants) => {
//     if (errorTotalApplicants) {
//       console.error('Error querying total applicants:', errorTotalApplicants);
//       res.status(500).json({ error: 'Server error' });
//       return;
//     }
//     const totalApplicants = resultsTotalApplicants[0].totalApplicants;
 
//     db.query(queryTotalOpenings, (errorTotalOpenings, resultsTotalOpenings) => {
//       if (errorTotalOpenings) {
//         console.error('Error querying total openings:', errorTotalOpenings);
//         res.status(500).json({ error: 'Server error' });
//         return;
//       }
//       const totalOpenings = resultsTotalOpenings[0].totalOpenings;
 
//       db.query(queryScheduledInterviews, (errorScheduledInterviews, resultsScheduledInterviews) => {
//         if (errorScheduledInterviews) {
//           console.error('Error querying scheduled interviews:', errorScheduledInterviews);
//           res.status(500).json({ error: 'Server error' });
//           return;
//         }
//         const scheduledInterviews = resultsScheduledInterviews[0].scheduledInterviews;
 
//         db.query(queryReleasedOffers, (errorReleasedOffers, resultsReleasedOffers) => {
//           if (errorReleasedOffers) {
//             console.error('Error querying released offers:', errorReleasedOffers);
//             res.status(500).json({ error: 'Server error' });
//             return;
//           }
//           const releasedOffers = resultsReleasedOffers[0].releasedOffers;
 
//           db.query(queryApplicantsInProgress, (errorApplicantsInProgress, resultsApplicantsInProgress) => {
//             if (errorApplicantsInProgress) {
//               console.error('Error querying applicants in progress:', errorApplicantsInProgress);
//               res.status(500).json({ error: 'Server error' });
//               return;
//             }
 
//             res.json({
//               totalApplicants,
//               totalOpenings,
//               scheduledInterviews,
//               releasedOffers,
//               applicantsInProgress: resultsApplicantsInProgress
//             });
//           });
//         });
//       });
//     });
//   });
// });




 



 
 
 
// Fetch round details for a specific applicant and round number


app.get("/host", async (req, res) => {
  const query = "SELECT * FROM whereby_host";
 
  db.query(query, (error, results) => {
    if (error) {
      console.error("Host error:", error);
      res.status(500).json({ success: false, message: "Error fetching host data" });
    } else {
      res.status(200).json({ success: true, message: "Host data Fetched", data: results });
    }
  });
});
 
 



app.get("/interview-details", async (req, res) => {
  try {
    const query = `
      SELECT
        wh.meetingId,
        wh.name AS roomName,
        wh.startDate,
        wh.roomUrl,
        ais.Applicant_ID,
        ais.Applicant_Name,
        ais.Job_ID,
        ais.Round_Name,
        ais.Interviewer_Name
      FROM
        whereby_host wh
      LEFT JOIN
        Applicant_Interview_Schedule ais ON wh.meetingId = ais.meetingId
    `;
   
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching interview details:", error);
        res.status(500).json({ success: false, message: "Error fetching interview details" });
      } else {
        res.status(200).json({ success: true, data: results });
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching interview details" });
  }
});
 
 

// Endpoint to fetch all applicants
app.get('/applicantsinterview', (req, res) => {
  const sql = 'SELECT Applicant_ID, First_Name, Last_Name, Job_ID FROM Applicants';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching applicants:', err);
      res.status(500).json({ success: false, message: 'Error fetching applicants' });
      return;
    }
    res.json({ success: true, data: result });
  });
});
 
// Endpoint to fetch a specific applicant's details based on Applicant_ID
app.get('/applicantsinterview/:id', (req, res) => {
  const applicantId = req.params.id;
  const sql = 'SELECT Applicant_ID, First_Name, Last_Name FROM Applicants WHERE Applicant_ID = ?';
  db.query(sql, [applicantId], (err, result) => {
    if (err) {
      console.error('Error fetching applicant details:', err);
      res.status(500).json({ success: false, message: 'Error fetching applicant details' });
      return;
    }
    res.json({ success: true, data: result[0] });
  });
});
 



// Endpoint to fetch the job ID based on the selected Applicant_ID
app.get('/jobidinterview/:id', (req, res) => {
  const applicantId = req.params.id;
  const sql = 'SELECT Job_ID FROM Applicants WHERE Applicant_ID = ?';
  db.query(sql, [applicantId], (err, result) => {
    if (err) {
      console.error('Error fetching job ID:', err);
      res.status(500).json({ success: false, message: 'Error fetching job ID' });
      return;
    }
    res.json({ success: true, data: result[0] });
  });
});
 


// Endpoint to fetch interview rounds based on the Job_ID
app.get('/roundsinterview/:jobid', (req, res) => {
  const jobId = req.params.jobid;
  const sql = 'SELECT Round_1, Round_2, Round_3, Round_4, Round_5 FROM Interviewmapping WHERE Job_ID = ?';
  db.query(sql, [jobId], (err, result) => {
    if (err) {
      console.error('Error fetching rounds:', err);
      res.status(500).json({ success: false, message: 'Error fetching rounds' });
      return;
    }
    res.json({ success: true, data: result[0] });
  });
});
 



// Endpoint to get interviewer names
app.get('/interviewernames', (req, res) => {
  const sql = `
    SELECT CONCAT(First_Name, ' ', Last_Name) AS name
    FROM employee_details
    WHERE LOWER(Role) = 'hr' OR LOWER(Role) = 'admin'
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send({ success: true, data: result });
  });
});
 
 

app.post("/meetingsinterview", async (req, res) => {
  try {
    const { endDate, duration, name, applicantId, applicantName, jobId, roundName, interviewerName } = req.body;
    const startDate = endDate;
   
    // Check if endDate and duration are present and valid
    if (!endDate || !duration || isNaN(duration)) {
      throw new Error("Invalid or missing data");
    }
 
    const indiaDateTime = moment.utc(endDate).tz("Asia/Kolkata");
 
    // Check if indiaDateTime is a valid date
    if (!indiaDateTime.isValid()) {
      throw new Error("Invalid date provided");
    }
 
    const newEndDate = indiaDateTime.add(Number(duration), "minutes").toISOString().slice(0, -5) + ".000Z";
 
    // Perform API call here using newEndDate
    const response = await fetch("https://api.whereby.dev/v1/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endDate: newEndDate,
        fields: ["hostRoomUrl"],
      }),
    });
 
    const data = await response.json();
 
    
    const { roomName, roomUrl, meetingId, hostRoomUrl } = data;
 
    db.query(
      `INSERT INTO whereby_host (name, startDate, endDate, roomName, roomUrl, meetingId, hostRoomUrl) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, startDate, newEndDate, roomName, roomUrl, meetingId, hostRoomUrl],
      (error, results) => {
        if (error) {
          console.error("Error inserting into database:", error);
          res.status(500).json({ success: false, message: "Error booking meeting" });
        } else {
          // Insert into Applicant_Interview_Schedule table
          const insertApplicantScheduleQuery = `INSERT INTO Applicant_Interview_Schedule (meetingId, startDate, endDate, Applicant_ID, Applicant_Name, Job_ID, Round_Name, Interviewer_Name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          const newEndDateForSchedule = indiaDateTime.add(Number(duration), "minutes").format("YYYY-MM-DD HH:mm:ss");
          db.query(
            insertApplicantScheduleQuery,
            [meetingId, startDate, newEndDateForSchedule, applicantId, applicantName, jobId, roundName, interviewerName],
            (error, results) => {
              if (error) {
                console.error("Error inserting into Applicant_Interview_Schedule:", error);
                res.status(500).json({ success: false, message: "Error booking meeting" });
              } else {
                res.status(200).json({ success: true, message: "Meeting booked successfully", endDate: newEndDate });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Error booking meeting" });
  }
});
 





app.delete("/deletmeeting/:meetingId", async (req, res) => {
  const { meetingId } = req.params;
  try {
      // Delete the meeting from Whereby API
      const response = await fetch(`https://api.whereby.dev/v1/meetings/${meetingId}`, {
          method: 'DELETE',
          headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
          },
      });
 
      if (!response.ok) {
          console.log(`Failed to delete meeting from Whereby. Status: ${response.status}`);
          return res.status(response.status).json({ error: 'Failed to delete meeting from Whereby' });
      }
 
      // If meeting is successfully deleted from Whereby, delete related data from your database
      db.query('DELETE FROM whereby_host WHERE meetingId = ?', [meetingId], (error, results) => {
          if (error) {
              console.error('Error deleting meeting data from database:', error);
              return res.status(500).json({ error: 'Internal server error' });
          }
          // Respond with 204 No Content on successful deletion
          res.status(204).end();
      });
  } catch (error) {
      console.error('Error deleting meeting:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
 




app.get("/attendedmeetings", async (req, res) => {
  const query = "SELECT * FROM meetings_attended";
 
  db.query(query, (error, results) => {
    if (error) {
      console.error("Host error:", error);
      res.status(500).json({ success: false, message: "Error fetching host data" });
    } else {
      res.status(200).json({ success: true, message: "Host data Fetched", data: results });
    }
  });
});
 




app.get('/OfferLetterApplicants', (req, res) => {
  const query = `
    SELECT
      ta.Applicant_ID AS applicantId,
      CONCAT(a.First_Name, ' ', IFNULL(a.Middle_Name, ''), ' ', a.Last_Name) AS applicantName,
      a.Job_Position AS jobPosition,
      a.Email_ID AS emailId,
      a.Phone_Number AS phoneNumber,
      a.Role AS role
    FROM
      tracking_an_applicant ta
    JOIN
      Applicants a ON ta.Applicant_ID = a.Applicant_ID
    WHERE
      ta.Qualified = 'Yes'
      AND ta.Applicant_ID NOT IN (SELECT Applicant_ID FROM OfferLetter)
  `;
 
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
      return;
    }
    res.json(results);
  });
});

app.post('/generate-pdf', async (req, res) => {
  const { selectedEmployees, startDate, salary } = req.body;
 
  if (!selectedEmployees.length || !startDate || !salary) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  try {
    const fileNames = [];
    const logoPath = path.join(__dirname, 'logo.png');
    const addressText = 'Hyderabad | Gachibowli | Kompally | USA - Delaware\nE: info@yatayati.com | W: www.yatayati.com';
 
    for (const employee of selectedEmployees) {
      const fileName = `offer_letter_${employee.applicantId}_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, 'offerletterpdf', fileName);
 
      const doc = new PDFDocument({ margin: 50 });
      doc.pipe(fs.createWriteStream(filePath));
 
      // Function to add the company logo at the top and the address at the bottom of each page
      const addHeaderAndFooter = () => {
        // Add the footer line
        doc.moveTo(50, doc.page.height - 50).lineTo(doc.page.width - 50, doc.page.height - 50).stroke();
 
        // Add the footer text (company address) at the bottom
        // doc.fontSize(10).text(addressText, 20, doc.page.height - 20, { align: 'center', width: doc.page.width - 10 });
      };
 
      // Function to add content to the current page
      const addPageContent = (pageNumber) => {
        if (pageNumber > 1) {
          doc.addPage(); // Add a new page for subsequent content
        }
 
        // Add header and footer on each page
        doc.image(logoPath, doc.page.width - 170, 50, { fit: [120, 60], align: 'right' });
 
        // Page-specific content
        const headingColor = 'navy'; // Color for headings
        const salaryColor = 'green'; // Color for salary
        const joiningDateColor = 'blue'; // Color for joining date
        const companyColor = 'darkred'; // Color for company name
 
        if (pageNumber === 1) {
          // Content for the first page
          doc.fontSize(18).font('Helvetica-Bold').fillColor(headingColor).text('Appointment cum Offer Letter', { align: 'center' }).moveDown(2);
          doc.fontSize(12).font('Helvetica').fillColor('black').text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' }).moveDown(2);
          doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text(`Name: ${employee.applicantName}`).moveDown(0.5);
          doc.fontSize(12).font('Helvetica').fillColor('black').text(`Address: ${employee.address}`).moveDown(1);
          doc.fontSize(12).font('Helvetica-Bold').fillColor(companyColor).text(`Subject: Appointment for the Position of ${employee.jobPosition}`).moveDown(2);
          doc.fontSize(12).font('Helvetica').fillColor('black').text(`Dear ${employee.applicantName},`, { align: 'left' }).moveDown(1);
          doc.fontSize(12).font('Helvetica').fillColor('black').text(`We are pleased to offer you the position of "Jr Software Developer" with `, { align: 'justify' })
            .font('Helvetica-Bold').fillColor(companyColor).text('Yatayati Info Solution Private Ltd. Hyderabad', { align: 'justify' }).font('Helvetica')
            .fillColor('black').text(` on the following terms and conditions:`, { align: 'justify' }).moveDown(2);
 
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`1. Commencement of employment`).moveDown(0.5);
          doc.fillColor(joiningDateColor).text(`Your employment will be effective, as of ${startDate}.`).moveDown(2);
 
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`2. Job title`).moveDown(0.5);
          doc.fillColor('black').text(`Your job title will be Jr Software Developer and you will report to Ms. Jennifer. After successful completion of your Probation Period of six months including three months of training you can move to your suitable location as per company relocation norms & policies.`).moveDown(2);
         
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`3. Salary`).moveDown(0.5);
          doc.fillColor('black').text(`Your all-inclusive annual target compensation (on a cost to company basis) will be ${salary} which would comprise your salary, applicable statutory benefits, bonus, if any, and/or any incentives as applicable to you. Your compensation shall be paid on a monthly basis, in arrears. The Company shall deduct tax at source at the time of making payment.`).moveDown(2);
         
        } else if (pageNumber === 2) {
          // Content for the second page
          // doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`3. Salary`).moveDown(0.5);
          // doc.fillColor('black').text(`Your all-inclusive annual target compensation (on a cost to company basis) will be ${salary} which would comprise your salary, applicable statutory benefits, bonus, if any, and/or any incentives as applicable to you. Your compensation shall be paid on a monthly basis, in arrears. The Company shall deduct tax at source at the time of making payment.`).moveDown(2);
          // doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`4. Place of posting`).moveDown(0.5);
          doc.fillColor('black').text(`You will be posted at Hyderabad, Telangana. You may however be required to work at any place of business which the Company has, or may later acquire.`).moveDown(2);
 
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`5. Hours of Work`).moveDown(0.5);
          doc.fillColor('black').text(`The normal working days are Monday through Saturday. You will be required to work for such hours as necessary for the proper discharge of your duties to the Company. The normal working hours are from 10:00am to 6:00pm and you are expected to work not less than 9 hours each day, and if necessary for additional hours depending on your responsibilities.`).moveDown(2);
 
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`6. Leave/Holidays`).moveDown(0.5);
          doc.fillColor('black').text(`6.1 You are entitled to casual leave of 5 days/year.`).moveDown(1);
          doc.text(`6.2 You are entitled to 1 Sick leave working day of paid sick leave.`).moveDown(1);
          doc.text(`6.3 The Company shall notify a list of declared holidays in the beginning of each year.`).moveDown(2);
 
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`7. Nature of duties`).moveDown(0.5);
          doc.fillColor('black').text(`You will perform to the best of your ability all the duties as are inherent in your post and such additional duties as the company may call upon you to perform, from time to time. Your specific duties are set out in Schedule II hereto.`).moveDown(2);
 
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`8. Company property`).moveDown(0.5);
          doc.fillColor('black').text(`You will always maintain in good condition Company property, which may be entrusted to you for oﬃcial use during the course of your employment and shall return all such property to the Company prior to relinquishment of your charge, failing which the cost of the same will be recovered from you by the Company.`).moveDown(2);
         
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`9. Borrowing/accepting gifts`).moveDown(0.5);
          doc.fillColor('black').text(`You will not borrow or accept any money, gifts, reward or compensation for your personal gains from or otherwise place yourself under pecuniary obligation to any person/client with whom you may be having oﬃcial dealings.`).moveDown(2);
       
 
        } else if (pageNumber === 3) {
          // Content for the third page
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`10. Termination`).moveDown(0.5);
          doc.fillColor('black').text(`10.1 Your appointment can be terminated by the Company, without any reason, by giving you not less than 1 months’ prior notice in writing or salary in lieu thereof. For the purpose of this clause, salary shall mean basic salary.`).moveDown(1.5);
          doc.text(`10.2 You may terminate your employment with the Company, without any cause, by giving no less than 2 months’ prior notice or salary for unsaved period, let after adjustment of pending leaves, as on date.`).moveDown(1.5);
          doc.text(`10.3 The Company reserves the right to terminate your employment summarily without any notice period or termination payment, if it has reasonable ground to believe you are guilty of misconduct or negligence, or have committed any fundamental breach of contract or caused any loss to the Company.`).moveDown(2);
 
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`11. Confidentiality`).moveDown(0.5);
          doc.fillColor('black').text(`11.1 During the course of your employment with the Company, you will have access to information about the Company’s business, operations, systems, and other material. You shall keep all such information confidential and will not disclose it to any third party, directly or indirectly, except with prior written consent of the Company.`).moveDown(1.5);
          doc.text(`11.2 Upon the termination of your employment with the Company, you shall deliver to the Company all documents, records, and property of the Company in your possession.`).moveDown(2);
 
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`12. Governing law`).moveDown(0.5);
          doc.fillColor('black').text(`12.1 The terms and conditions of this letter shall be governed and construed in accordance with the laws of India. You hereby submit to the exclusive jurisdiction of the courts of Hyderabad in respect of any dispute arising out of or in connection with this letter.`).moveDown(2);
 
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`13. Acceptance of appointment`).moveDown(0.5);
          doc.fillColor('black').text(`Please sign and return the duplicate copy of this letter as a token of your acceptance of the terms and conditions of your appointment.`).moveDown(2);
        }else if (pageNumber === 4) {
          doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(`Yours faithfully,`).moveDown(0.5);
          doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text(`Sai Krupa`).moveDown(0.5);
          doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text(`CEO & Manager`).moveDown(2);
          doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text(`Yatayati Info Solution Private Ltd.`).moveDown(0.5);
          doc.fontSize(12).font('Helvetica').fillColor('black').text(`I have read and understood the terms and conditions of the appointment as contained in this letter and accept the same.`).moveDown(2);
          doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text(`Signature: ___________________`).moveDown(0.5);
          doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text(`Date: ___________________`);
        }
 
        addHeaderAndFooter();
      };
 
      // Add content for each page
      addPageContent(1); // First page
      addPageContent(2); // Second page
      addPageContent(3); // Third page
      addPageContent(4);
 
      doc.end();
      fileNames.push(fileName);
    }
 
    res.status(200).json({ fileNames });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'An error occurred while generating the PDF' });
  }
});
 
 



app.post('/insert-into-db', async (req, res) => {
  const { selectedEmployees, startDate, salary, fileNames } = req.body;
 
  if (!selectedEmployees.length || !startDate || !salary || !fileNames.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  try {
    const insertPromises = selectedEmployees.map(async (employee, index) => {
      const fileName = fileNames[index];
      const filePath = path.join(__dirname, 'offerletterpdf', fileName);
 
      const query = `
        INSERT INTO OfferLetter (
          Applicant_ID, Applicant_Name, Job_Position, Email_ID, Phone_Number, Onboarding_Date, Salary, pdf_file_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        employee.applicantId,
        employee.applicantName,
        employee.jobPosition,
        employee.emailId,
        employee.phoneNumber,
        startDate,
        salary,
        fileName
      ];
 
      await new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
          if (error) {
            return reject(error);
          }
          console.log('Values inserted into OfferLetter:', results);
          resolve(results);
        });
      });
 
      const mailOptions = {
        from: 'js5698723@gmail.com',
        to: employee.emailId,
        subject: 'Your Offer Letter',
        text: `Dear ${employee.applicantName},\n\nPlease find attached your offer letter for the position of ${employee.jobPosition}.\n\nBest regards,\nHR Admin`,
        attachments: [
          {
            filename: fileName,
            path: filePath
          }
        ]
      };
 
      await transporter.sendMail(mailOptions);
    });
 
    await Promise.all(insertPromises);
    res.json({ message: 'Values inserted into OfferLetter table and emails sent successfully.' });
  } catch (error) {
    console.error('Error inserting values into OfferLetter table and sending emails:', error);
    res.status(500).json({ error: 'Failed to insert values into OfferLetter table and send emails' });
  }
});
 





// Endpoint to get Job details based on Job ID
app.get('/jobidinterviewmapping/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const sql = 'SELECT Job_ID, Job_Position, Department FROM JobOpenings WHERE Job_ID = ?';
  db.query(sql, [jobId], (err, result) => {
    if (err) throw err;
    res.send(result[0]);  // Assuming Job_ID is unique, hence sending only the first result
  });
});
 
app.post('/interviewmappingvalues', (req, res) => {
  const { jobId, departmentId, positionId, interviewTypeId, rounds, roundNames } = req.body;
 
  // Map the interview type ID to its corresponding string value
  const interviewTypeMap = {
    1: 'Online Interview',
    2: 'Offline Interview'
  };
  const interviewType = interviewTypeMap[interviewTypeId] || 'Unknown';
 
  // Ensure that roundNames has exactly 5 elements
  const extendedRoundNames = [...roundNames, '', '', '', '', ''].slice(0, 5);
 
  const sql = `
    INSERT INTO Interviewmapping (
      Job_ID, Job_Position, Department, Interview_Type, Num_Of_Rounds,
      Round_1, Round_2, Round_3, Round_4, Round_5
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
 
  const values = [
    jobId, positionId, departmentId, interviewType, parseInt(rounds, 10),  // Ensure rounds is correctly parsed
    ...extendedRoundNames
  ];
 
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting interview mapping:', err);
      return res.status(500).send({ message: 'Error inserting interview mapping' });
    }
    res.send({ message: 'Interview mapping inserted successfully' });
  });
});
 
 



// Endpoint to get Job details based on Job ID
app.get('/jobidinterviewmapping/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const sql = 'SELECT Job_ID, Job_Position, Department FROM JobOpenings WHERE Job_ID = ?';
  db.query(sql, [jobId], (err, result) => {
    if (err) throw err;
    res.send(result[0]);  // Assuming Job_ID is unique, hence sending only the first result
  });
});
 
app.post('/interviewmappingvalues', (req, res) => {
  const { jobId, departmentId, positionId, interviewTypeId, rounds, roundNames } = req.body;
 
  // Map the interview type ID to its corresponding string value
  const interviewTypeMap = {
    1: 'Online Interview',
    2: 'Offline Interview'
  };
  const interviewType = interviewTypeMap[interviewTypeId] || 'Unknown';
 
  // Ensure that roundNames has exactly 5 elements
  const extendedRoundNames = [...roundNames, '', '', '', '', ''].slice(0, 5);
 
  const sql = `
    INSERT INTO Interviewmapping (
      Job_ID, Job_Position, Department, Interview_Type, Num_Of_Rounds,
      Round_1, Round_2, Round_3, Round_4, Round_5
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
 
  const values = [
    jobId, positionId, departmentId, interviewType, parseInt(rounds, 10),  // Ensure rounds is correctly parsed
    ...extendedRoundNames
  ];
 
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting interview mapping:', err);
      return res.status(500).send({ message: 'Error inserting interview mapping' });
    }
    res.send({ message: 'Interview mapping inserted successfully' });
  });
});
 
 

app.get('/api/clients', (req, res) => {
  db.query('SELECT * FROM ClientManagement', (err, results) => {
    if (err) {
      console.error('Error fetching clients:', err);
      res.status(500).json({ message: 'Error fetching clients' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/api/clients', (req, res) => {
  const { clientName, clientEmail, clientPhone, address, description } = req.body;

  const sql = `INSERT INTO ClientManagement (ClientName, Email, PhoneNumber, Address, Description) VALUES (?, ?, ?, ?, ?)`;
  const values = [clientName, clientEmail, clientPhone, address, description];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error creating client:', err);
      res.status(500).json({ success: false, message: 'Error creating client' });
    } else {
      console.log('Client created successfully');
      const newClient = { ...req.body, clientId: result.insertId };
      res.status(201).json(newClient);
    }
  });
});

app.put('/api/clients/:clientId', (req, res) => {
  const clientId = req.params.clientId;
  const { clientName, clientEmail, clientPhone, address, description } = req.body;

  const sql = `UPDATE ClientManagement SET ClientName = ?, Email = ?, PhoneNumber = ?, Address = ?, Description = ? WHERE Client_ID = ?`;
  const values = [clientName, clientEmail, clientPhone, address, description, clientId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating client:', err);
      res.status(500).json({ success: false, message: 'Error updating client' });
    } else {
      console.log('Client updated successfully');
      res.status(200).json({ success: true, message: 'Client updated successfully' });
    }
  });
});

app.delete('/api/clients/:clientId', (req, res) => {
  const clientId = req.params.clientId;

  db.query('DELETE FROM ClientManagement WHERE Client_ID = ?', [clientId], (err, result) => {
    if (err) {
      console.error('Error deleting client:', err);
      res.status(500).json({ success: false, message: 'Error deleting client' });
    } else {
      console.log('Client deleted successfully');
      res.status(200).json({ success: true, message: 'Client deleted successfully' });
    }
  });
});
  
  app.post("/employees", (req, res) => {
     const { Employee_ID, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager } = req.body;
     const sql = "INSERT INTO ProjectManagement (Employee_ID, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
     db.query(sql, [Employee_ID, Employee_Name, Project_ID, Client_ID, Client_Name, ProjectName, Duration, Start_Date, End_Date, ProjectManager], (err, result) => {
         if (err) {
             console.error(err);
             res.status(500).json({ message: "Internal server error" });
         } else {
             res.status(200).json({ message: "Employee added successfully" });
         }
     });
 });
  




 // Fetch all employees API endpoint
 app.get("/employees", (req, res) => {
     const sql = "SELECT * FROM ProjectManagement";
     db.query(sql, (err, result) => {
         if (err) {
             console.error(err);
             res.status(500).json({ message: "Internal server error" });
         } else {
             res.status(200).json(result);
         }
     });
 });
  


 
 app.get('/api/clients', (req, res) => {
   db.query('SELECT * FROM clients', (err, results) => {
     if (err) {
       console.error('Error fetching clients:', err);
       res.status(500).send('Error fetching clients');
     } else {
       res.json(results);
     }
   });
 });
  
 app.post('/api/clients', (req, res) => {
   const { clientName, clientEmail, clientPhone, address, description } = req.body;
   const query = 'INSERT INTO clients (clientName, clientEmail, clientPhone, address, description) VALUES (?, ?, ?, ?, ?)';
   db.query(query, [clientName, clientEmail, clientPhone, address, description], (err, result) => {
     if (err) {
       console.error('Error adding client:', err);
       res.status(500).send('Error adding client');
     } else {
       res.json({ insertId: result.insertId }); // Return the insertId for new client
     }
   });
 });
  
 app.put('/api/clients/:id', (req, res) => {
   const { clientName, clientEmail, clientPhone, address, description } = req.body;
   const query = 'UPDATE clients SET clientName = ?, clientEmail = ?, clientPhone = ?, address = ?, description = ? WHERE clientId = ?';
   db.query(query, [clientName, clientEmail, clientPhone, address, description, req.params.id], (err, result) => {
     if (err) {
       console.error('Error updating client:', err);
       res.status(500).send('Error updating client');
     } else {
       res.send('Client updated successfully');
     }
   });
 });
  
 app.delete('/api/clients/:id', (req, res) => {
   const query = 'DELETE FROM clients WHERE clientId = ?';
   db.query(query, [req.params.id], (err, result) => {
     if (err) {
       console.error('Error deleting client:', err);
       res.status(500).send('Error deleting client');
     } else {
       res.send('Client deleted successfully');
     }
   });
 });
  
 // Project Routes
 app.get('/api/projects', (req, res) => {
   db.query('SELECT * FROM projects', (err, results) => {
     if (err) {
       console.error('Error fetching projects:', err);
       res.status(500).send('Error fetching projects');
     } else {
       res.json(results);
     }
   });
 });
  
 app.post('/api/projects', (req, res) => {
   const { projectName, clientName, projectDescription, projectManager, startDate, endDate, status, priority } = req.body;
   const query = 'INSERT INTO projects (projectName, clientName, projectDescription, projectManager, startDate, endDate, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
   db.query(query, [projectName, clientName, projectDescription, projectManager, startDate, endDate, status, priority], (err, result) => {
     if (err) {
       console.error('Error adding project:', err);
       res.status(500).send('Error adding project');
     } else {
       res.json({ projectId: result.insertId }); // Return the projectId
     }
   });
 });
  
 app.put('/api/projects/:id', (req, res) => {
   const { projectName, clientName, projectDescription, projectManager, startDate, endDate, status, priority } = req.body;
   const query = 'UPDATE projects SET projectName = ?, clientName = ?, projectDescription = ?, projectManager = ?, startDate = ?, endDate = ?, status = ?, priority = ? WHERE projectId = ?';
   db.query(query, [projectName, clientName, projectDescription, projectManager, startDate, endDate, status, priority, req.params.id], (err, result) => {
     if (err) {
       console.error('Error updating project:', err);
       res.status(500).send('Error updating project');
     } else {
       res.send('Project updated successfully');
     }
   });
 });
  
 app.delete('/api/projects/:id', (req, res) => {
   const query = 'DELETE FROM projects WHERE projectId = ?';
   db.query(query, [req.params.id], (err, result) => {
     if (err) {
       console.error('Error deleting project:', err);
       res.status(500).send('Error deleting project');
     } else {
       res.send('Project deleted successfully');
     }
   });
 });



// Add this endpoint in your backend
app.get('/api/project-count', (req, res) => {
  const query = 'SELECT COUNT(*) AS totalProjects FROM projects';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching project count:', err);
      res.status(500).send('Error fetching project count');
    } else {
      res.json({ totalProjects: result[0].totalProjects });
    }
  });
});






  

 app.get('/api/employee_details', (req, res) => {
   db.query('SELECT EmployeeID, EmployeeName FROM employee_details', (err, results) => {
     if (err) {
       console.error('Error fetching employee details:', err);
       res.status(500).send('Error fetching employee details');
     } else {
       res.json(results);
     }
   });
 });
  
 // Assignment Routes
 app.get('/api/assignments', (req, res) => {
   db.query('SELECT * FROM Projects_Assign', (err, results) => {
     if (err) {
       console.error('Error fetching assignments:', err);
       res.status(500).send('Error fetching assignments');
     } else {
       res.json(results);
     }
   });
 });
  
 app.post('/api/assignments', (req, res) => {
  const { clientId, projectId, employeeIds, startDate, endDate, AssignedDate } = req.body;
  const employeeIdArray = employeeIds.split(',').map(id => id.trim()); // Split and trim EmployeeIDs

  const query = 'INSERT INTO Projects_Assign (clientId, projectId, EmployeeID, startDate, endDate, AssignedDate) VALUES ?';
  const values = employeeIdArray.map(employeeId => [clientId, projectId, employeeId, startDate, endDate, AssignedDate]);

  db.query(query, [values], (err, result) => {
      if (err) {
          console.error('Error adding assignment:', err);
          res.status(500).send('Error adding assignment');
      } else {
          res.json({ assignmentId: result.insertId });
      }
  });
});

  
 app.put('/api/assignments/:id', (req, res) => {
   const { clientId, projectId, employeeId, startDate, endDate } = req.body;
   const query = 'UPDATE Projects_Assign SET clientId = ?, projectId = ?, EmployeeID = ?, startDate = ?, endDate = ? WHERE assignmentId = ?';
   db.query(query, [clientId, projectId, employeeId, startDate, endDate, req.params.id], (err, result) => {
     if (err) {
       console.error('Error updating assignment:', err);
       res.status(500).send('Error updating assignment');
     } else {
       res.send('Assignment updated successfully');
     }
   });
 });
  
 app.delete('/api/assignments/:id', (req, res) => {
   const query = 'DELETE FROM Projects_Assign WHERE assignmentId = ?';
   db.query(query, [req.params.id], (err, result) => {
     if (err) {
       console.error('Error deleting assignment:', err);
       res.status(500).send('Error deleting assignment');
     } else {
       res.send('Assignment deleted successfully');
     }
   });
 });
  

 


 app.post('/uploadprofilepic', verifyToken, upload.single('profile_pic'), (req, res) => {
   const { username } = req.user;
   if (!req.file) {
     return res.status(400).json({ success: false, message: 'No file uploaded' });
   }
  
   const profilePicPath = req.file.filename; // Save only the filename, not the full path
  
   const query = 'UPDATE employee_details SET Profile_pic = ? WHERE EmployeeID = ?';
   db.query(query, [profilePicPath, username], (error, results) => {
     if (error) {
       return res.status(500).json({ success: false, message: 'Error updating profile picture' });
     }
     res.json({ success: true, message: 'Profile picture updated successfully', profilePicPath });
   });
 });
  
  
 app.delete('/deleteprofilepic', verifyToken, (req, res) => {
   const { username } = req.user;
  
   const query = 'UPDATE employee_details SET Profile_pic = NULL WHERE EmployeeID = ?';
   db.query(query, [username], (error, results) => {
     if (error) {
       res.status(500).json({ success: false, message: 'Error deleting profile picture' });
     } else {
       res.json({ success: true, message: 'Profile picture deleted successfully' });
     }
   });
 });
  
  

 // Route to fetch about section data
 app.get('/aboutsectiondata', verifyToken, (req, res) => {
   const { username } = req.user;
   const query = 'SELECT About, Interests, Hobbies, JobLove, TeamInsights, PositiveNotes FROM employee_details WHERE EmployeeID = ?';
  
   db.query(query, [username], (error, results) => {
     if (error) {
       res.status(500).json({ success: false, message: 'Database error' });
     } else if (results.length > 0) {
       res.json({ success: true, data: results[0] });
     } else {
       res.json({ success: false, message: 'No data found' });
     }
   });
 });
  
 // Route to update about section data
 app.put('/aboutsectiondata', verifyToken, (req, res) => {
   const { username } = req.user;
   const { section, value } = req.body;
   const query = `UPDATE employee_details SET ${section} = ? WHERE EmployeeID = ?`;
  
   db.query(query, [value, username], (error, results) => {
     if (error) {
       res.status(500).json({ success: false, message: 'Database error' });
     } else {
       res.json({ success: true, message: 'Data updated successfully' });
     }
   });
 });
  
  
  
  
 // Route to fetch about section data
 app.get('/profilesectiondata', verifyToken, (req, res) => {
   const { username } = req.user;
   const query = 'SELECT First_Name, Last_Name, Gender, Date_Of_Birth, Marital_Status, Bloodgroup, Email_ID, Personalemail, Address, Phone_Number FROM employee_details WHERE EmployeeID = ?';
  
   db.query(query, [username], (error, results) => {
     if (error) {
       res.status(500).json({ success: false, message: 'Database error' });
     } else if (results.length > 0) {
       res.json({ success: true, data: results[0] });
     } else {
       res.json({ success: false, message: 'No data found' });
     }
   });
 });
  
 // Route to update about section data
 app.put('/profilesectiondata', verifyToken, (req, res) => {
   const { username } = req.user;
   const { section, value } = req.body;
   const query = `UPDATE employee_details SET ${section} = ? WHERE EmployeeID = ?`;
  
   db.query(query, [value, username], (error, results) => {
     if (error) {
       res.status(500).json({ success: false, message: 'Database error' });
     } else {
       res.json({ success: true, message: 'Data updated successfully' });
     }
   });
 });
  
  
  
  
  
 // Route to fetch about section data
 app.get('/jobsectiondata', verifyToken, (req, res) => {
   const { username } = req.user;
   const query = `
     SELECT
       ed.Job_Position,
       ed.Department,
       ed.Joining_Date,
       ed.Shift_ID,
       s.StartTime,
       s.EndTime,
       (SELECT o.OrganizationName FROM Organization o LIMIT 1) AS OrganizationName,
       (SELECT o.Description FROM Organization o LIMIT 1) AS Description,
       (SELECT o.Address FROM Organization o LIMIT 1) AS Address,
       (SELECT o.Contact FROM Organization o LIMIT 1) AS Contact
     FROM employee_details ed
     JOIN Shifts s ON ed.Shift_ID = s.Shift_ID
     WHERE ed.EmployeeID = ?
   `;
   db.query(query, [username], (error, results) => {
     if (error) {
       res.status(500).json({ success: false, message: 'Database error' });
     } else if (results.length > 0) {
       res.json({ success: true, data: results[0] });
     } else {
       res.json({ success: false, message: 'No data found' });
     }
   });
 });
  
  
 // Route to update asset condition
 app.put('/updateassetcondition', verifyToken, (req, res) => {
   const { AssetID, CurrentCondition } = req.body;
   const query = `UPDATE Assets SET CurrentCondition = ? WHERE AssetID = ?`;
  
   db.query(query, [CurrentCondition, AssetID], (error, results) => {
     if (error) {
       res.status(500).json({ success: false, message: 'Database error' });
     } else {
       res.json({ success: true, message: 'Condition updated successfully' });
     }
   });
 });
  
  
 // Route to fetch about section data
 app.get('/assetsectiondata', verifyToken, (req, res) => {
   const { username } = req.user;
   const query = `
     SELECT
       a.AssetID,
       a.AssetType,
       a.AssetName,
       a.AssetCategory,
       a.AssignedOn,
       a.CurrentCondition
     FROM employee_details ed
     JOIN Assets a ON ed.EmployeeID = a.Username
     WHERE ed.EmployeeID = ?
   `;
   db.query(query, [username], (error, results) => {
     if (error) {
       res.status(500).json({ success: false, message: 'Database error' });
     } else if (results.length > 0) {
       res.json({ success: true, data: results });
     } else {
       res.json({ success: false, message: 'No data found' });
     }
   });
 });
  
  
 app.get('/employeeprofile', verifyToken, (req, res) => {
   const { username } = req.user;
   const query = 'SELECT EmployeeName, Email_ID, Phone_Number, Job_Position, Department, EmployeeID, Address, Bloodgroup, Profile_pic FROM employee_details WHERE EmployeeID = ?';
  
   db.query(query, [username], (error, results) => {
     if (error) {
       res.status(500).json({ success: false, message: 'Error fetching employee details' });
     } else if (results.length > 0) {
       res.json({ success: true, employee: results[0] });
     } else {
       res.json({ success: false, message: 'Employee not found' });
     }
   });
 });
  



 app.post('/uploadprofilepic', verifyToken, upload.single('profile_pic'), (req, res) => {
   const { username } = req.user;
   if (!req.file) {
     return res.status(400).json({ success: false, message: 'No file uploaded' });
   }
  
   const profilePicPath = req.file.filename; // Save only the filename, not the full path
  
   const query = 'UPDATE employee_details SET Profile_pic = ? WHERE EmployeeID = ?';
   db.query(query, [profilePicPath, username], (error, results) => {
     if (error) {
       return res.status(500).json({ success: false, message: 'Error updating profile picture' });
     }
     res.json({ success: true, message: 'Profile picture updated successfully', profilePicPath });
   });
 });
  
  
 app.delete('/deleteprofilepic', verifyToken, (req, res) => {
   const { username } = req.user;
  
   const query = 'UPDATE employee_details SET Profile_pic = NULL WHERE EmployeeID = ?';
   db.query(query, [username], (error, results) => {
     if (error) {
       res.status(500).json({ success: false, message: 'Error deleting profile picture' });
     } else {
       res.json({ success: true, message: 'Profile picture deleted successfully' });
     }
   });
 });
  
  
 app.get('/jobidaddemployee', (req, res) => {
  const sql = 'SELECT Job_ID FROM JobOpenings';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
 

app.post('/addapplicant', uploadResume.single('resume'), (req, res) => {
  const {
    Job_ID, First_Name, Middle_Name, Last_Name,
    Phone_Number, Gender, Date_of_Birth, Marital_Status, Address, Email_ID, AppliedDate, Role
  } = req.body;
 
  const fetchJobDetailsQuery = 'SELECT Job_Position, Department FROM JobOpenings WHERE Job_ID = ?';
 
  db.query(fetchJobDetailsQuery, [Job_ID], (err, jobResult) => {
    if (err) {
      console.error('Error fetching job details:', err);
      res.status(500).send('Failed to fetch job details');
      return;
    }
 
    if (jobResult.length === 0) {
      res.status(404).send('Job ID not found');
      return;
    }
 
    const { Job_Position, Department } = jobResult[0];
    const Password = generateRandomPassword();
    // Check if resume was uploaded successfully
  const resumeFileName = req.file ? req.file.filename : null;
  if (!resumeFileName && req.body.resume) {
    console.error('Resume upload failed');
    res.status(500).send('Resume upload failed');
    return;
  }
 
    const insertApplicantQuery = `
  INSERT INTO Applicants (Job_ID, Job_Position, First_Name, Middle_Name, Last_Name, Phone_Number, Gender, Date_of_Birth, Marital_Status, Address, Email_ID, AppliedDate, Department, Role, Password, Resume)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
 
db.query(insertApplicantQuery, [
  Job_ID, Job_Position, First_Name, Middle_Name, Last_Name, Phone_Number, Gender, Date_of_Birth,
  Marital_Status, Address, Email_ID, AppliedDate, Department, Role, Password, resumeFileName
], (err, result) => {
  if (err) {
    console.error('Error inserting applicant:', err.sqlMessage); // Use sqlMessage to get a more detailed error
    res.status(500).send('Failed to add applicant');
    return;
  }
 
      const Applicant_ID = result.insertId;
 
      const mailOptions = {
        from: 'js5698723@gmail.com',
        to: Email_ID,
        subject: 'Your Application Details',
        text: `Dear ${First_Name},
 
Thank you for applying to our company. Below are your login details:
 
Username: ${Applicant_ID}
Password: ${Password}
 
Best regards,
Company HR`
      };
 
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).send('Applicant added but failed to send email');
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send('Applicant added successfully and email sent');
        }
      });
    });
  });
});
 


// Endpoint to fetch all departments
app.get('/departmentsforjobopening', (req, res) => {
  const query = 'SELECT DepartmentID, DepartmentName FROM Department';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
 
      return;
    }
    res.json(results);
  });
});
 
 
 
 
// Endpoint to fetch positions based on department ID
app.get('/positionsforjobopening/:departmentId', (req, res) => {
  const departmentId = req.params.departmentId;
  const query = 'SELECT PositionName FROM Positions WHERE DepartmentID = ?';
  db.query(query, [departmentId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});
 
 


// Route to add a job opening to the JobOpenings table
app.post('/addJobOpening', (req, res) => {
  const {
    jobPosition,
    department,
    departmentId,
    numberOfOpenings,
    salary,
    lastDate,
    description
  } = req.body;
 
  // Query to find the current maximum Job_ID
  const getMaxJobIdQuery = 'SELECT MAX(Job_ID) AS maxJobId FROM JobOpenings';
 
  db.query(getMaxJobIdQuery, (error, results) => {
    if (error) {
      console.error('Error fetching max Job_ID:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
 
    // Calculate the new Job_ID
    const newJobId = results[0].maxJobId ? results[0].maxJobId + 1 : 1001;
 
    // Construct the SQL query to insert data into the JobOpenings table
    const insertQuery = `
      INSERT INTO JobOpenings (Job_ID, Job_Position, Department, Department_ID, Num_of_openings, Salary, Last_date, Description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
 
    // Execute the query with the new Job_ID
    db.query(insertQuery, [newJobId, jobPosition, department, departmentId, numberOfOpenings, salary, lastDate, description], (error, results) => {
      if (error) {
        console.error('Error adding job opening:', error);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.json({ message: 'Job opening added successfully' });
      }
    });
  });
});
 
 

app.get('/jobpositiondata', (req, res) => {
  const sql = `
    SELECT
      JobOpenings.Job_ID,
      JobOpenings.Job_Position,
      JobOpenings.Num_of_openings,
      JobOpenings.Description,
      JobOpenings.Last_date,
      COUNT(Applicants.Applicant_ID) AS Num_of_Applicants
    FROM
      JobOpenings
    LEFT JOIN
      Applicants
    ON
      JobOpenings.Job_ID = Applicants.Job_ID
    GROUP BY
      JobOpenings.Job_ID
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching job position data:', err);
      res.status(500).json({ success: false, message: 'Error fetching job position data' });
      return;
    }
    res.json(result);
  });
});



app.get('/jobdetailspopup/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const sql = `
    SELECT
      Job_Position,
      Department,
      Salary,
      Description
    FROM
      JobOpenings
    WHERE
      Job_ID = ?
  `;
  db.query(sql, [jobId], (err, result) => {
    if (err) {
      console.error('Error fetching job details:', err);
      res.status(500).json({ success: false, message: 'Error fetching job details' });
      return;
    }
    res.json(result[0]); // Assuming result[0] has the job details
  });
});
 


app.get('/applicantsbasedonjobposition/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const sql = `
    SELECT
      Applicant_ID,
      First_Name,
      Middle_Name,
      Last_Name,
      Phone_Number,
      Email_ID,
      Gender,
      AppliedDate
    FROM
      Applicants
    WHERE
      Job_ID = ?
  `;
  db.query(sql, jobId, (err, result) => {
    if (err) {
      console.error('Error fetching applicants:', err);
      res.status(500).json({ success: false, message: 'Error fetching applicants' });
      return;
    }
    res.json(result);
  });
});
 

app.post('/insertOrUpdateApplicantTracking', (req, res) => {
  const {
    Applicant_ID,
    Applicant_Name,
    Job_ID,
    Round_1 = null,
    Round_2 = null,
    Round_3 = null,
    Round_4 = null,
    Round_5 = null,
    Round_1_rating = null,
    Round_2_rating = null,
    Round_3_rating = null,
    Round_4_rating = null,
    Round_5_rating = null,
    Qualified = null
  } = req.body;
 
  const sql = `
    INSERT INTO tracking_an_applicant (Applicant_ID, Applicant_Name, Job_ID, Round_1, Round_2, Round_3, Round_4, Round_5, Round_1_rating, Round_2_rating, Round_3_rating, Round_4_rating, Round_5_rating, Qualified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      Applicant_Name = VALUES(Applicant_Name),
      Job_ID = VALUES(Job_ID),
      Round_1 = VALUES(Round_1),
      Round_2 = VALUES(Round_2),
      Round_3 = VALUES(Round_3),
      Round_4 = VALUES(Round_4),
      Round_5 = VALUES(Round_5),
      Round_1_rating = VALUES(Round_1_rating),
      Round_2_rating = VALUES(Round_2_rating),
      Round_3_rating = VALUES(Round_3_rating),
      Round_4_rating = VALUES(Round_4_rating),
      Round_5_rating = VALUES(Round_5_rating),
      Qualified = VALUES(Qualified)
  `;
 
  const values = [
    Applicant_ID,
    Applicant_Name,
    Job_ID,
    Round_1,
    Round_2,
    Round_3,
    Round_4,
    Round_5,
    Round_1_rating,
    Round_2_rating,
    Round_3_rating,
    Round_4_rating,
    Round_5_rating,
    Qualified
  ];
 
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting or updating applicant tracking:', err);
      res.status(500).json({ success: false, message: 'Error inserting or updating applicant tracking' });
      return;
    }
    res.json({ success: true, message: 'Applicant tracking inserted or updated successfully' });
  });
});
 




app.get('/interviewmappingapplicanttracking/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const sql = `
    SELECT
      Num_Of_Rounds,
      Round_1,
      Round_2,
      Round_3,
      Round_4,
      Round_5
    FROM
      Interviewmapping
    WHERE
      Job_ID = ?
  `;
  db.query(sql, jobId, (err, result) => {
    if (err) {
      console.error('Error fetching interview mapping data:', err);
      res.status(500).json({ success: false, message: 'Error fetching interview mapping data' });
      return;
    }
    res.json(result[0]);
  });
});
 


app.get('/jobidinterviewmapping', (req, res) => {
  const sql = 'SELECT Job_ID FROM JobOpenings';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});




 
// Endpoint to get all interview mappings
app.get('/interviewmappings', (req, res) => {
  const sql = `
    SELECT Job_ID, Job_Position, Department, Interview_Type, Num_Of_Rounds,
           Round_1, Round_2, Round_3, Round_4, Round_5
    FROM Interviewmapping
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching interview mappings:', err);
      return res.status(500).send({ message: 'Error fetching interview mappings' });
    }
    res.send(result);
  });
});

// Endpoint to get Job details based on Job ID
app.get('/jobidinterviewmapping/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const sql = 'SELECT Job_ID, Job_Position, Department FROM JobOpenings WHERE Job_ID = ?';
  db.query(sql, [jobId], (err, result) => {
    if (err) throw err;
    res.send(result[0]);  // Assuming Job_ID is unique, hence sending only the first result
  });
});
 



app.post('/interviewmappingvalues', (req, res) => {
  const { jobId, departmentId, positionId, interviewTypeId, rounds, roundNames } = req.body;
 
  // Map the interview type ID to its corresponding string value
  const interviewTypeMap = {
    1: 'Online Interview',
    2: 'Offline Interview'
  };
  const interviewType = interviewTypeMap[interviewTypeId] || 'Unknown';
 
  // Ensure that roundNames has exactly 5 elements
  const extendedRoundNames = [...roundNames, '', '', '', '', ''].slice(0, 5);
 
  const sql = `
    INSERT INTO Interviewmapping (
      Job_ID, Job_Position, Department, Interview_Type, Num_Of_Rounds,
      Round_1, Round_2, Round_3, Round_4, Round_5
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
 
  const values = [
    jobId, positionId, departmentId, interviewType, parseInt(rounds, 10),  // Ensure rounds is correctly parsed
    ...extendedRoundNames
  ];
 
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting interview mapping:', err);
      return res.status(500).send({ message: 'Error inserting interview mapping' });
    }
    res.send({ message: 'Interview mapping inserted successfully' });
  });
});
 



// Endpoint to get all interview mappings
app.get('/interviewmappings', (req, res) => {
  const sql = `
    SELECT Job_ID, Job_Position, Department, Interview_Type, Num_Of_Rounds,
           Round_1, Round_2, Round_3, Round_4, Round_5
    FROM Interviewmapping
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching interview mappings:', err);
      return res.status(500).send({ message: 'Error fetching interview mappings' });
    }
    res.send(result);
  });
});
 



app.put('/interviewmappings/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const { positionId, departmentId, interviewTypeId, rounds, roundNames } = req.body;
 
  const interviewTypeMap = {
    1: 'Online Interview',
    2: 'Offline Interview'
  };
  const interviewType = interviewTypeMap[interviewTypeId] || 'Unknown';
 
  const extendedRoundNames = [...roundNames, '', '', '', '', ''].slice(0, 5);
 
  const sql = `
    UPDATE Interviewmapping
    SET Job_Position = ?, Department = ?, Interview_Type = ?, Num_Of_Rounds = ?,
        Round_1 = ?, Round_2 = ?, Round_3 = ?, Round_4 = ?, Round_5 = ?
    WHERE Job_ID = ?
  `;
 
  const values = [
    positionId, departmentId, interviewType, parseInt(rounds, 10),
    ...extendedRoundNames, jobId
  ];
 
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating interview mapping:', err);
      return res.status(500).send({ message: 'Error updating interview mapping' });
    }
    res.send({ message: 'Interview mapping updated successfully' });
  });
});

app.delete('/interviewmappings/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const sql = 'DELETE FROM Interviewmapping WHERE Job_ID = ?';
  db.query(sql, [jobId], (err, result) => {
    if (err) {
      console.error('Error deleting interview mapping:', err);
      return res.status(500).send({ message: 'Error deleting interview mapping' });
    }
    res.send({ message: 'Interview mapping deleted successfully' });
  });
});
 




app.get('/OpeningsOverview', (req, res) => {
   const queryTotalApplicants = "SELECT COUNT(Applicant_ID) AS totalApplicants FROM Applicants";
   const queryTotalOpenings = "SELECT SUM(Num_of_openings) AS totalOpenings FROM JobOpenings";
  const queryScheduledInterviews = "SELECT COUNT(endDate) AS scheduledInterviews FROM Applicant_Interview_Schedule WHERE endDate > CURDATE()";
  const queryReleasedOffers = `
  SELECT COUNT(ol.Applicant_ID) AS releasedOffers
  FROM OfferLetter ol
  WHERE ol.Applicant_ID NOT IN (SELECT oh.Applicant_ID FROM OnboardingHrms oh);
`;
 
 
 
  const queryApplicantsInProgress = `
   SELECT
      TA.Applicant_ID,
      CONCAT(A.First_Name, IFNULL(CONCAT(' ', A.Middle_Name), ''), ' ', A.Last_Name) AS Applicant_Name,
       A.Job_Position,
       A.Gender,
      A.Email_ID,
      A.Phone_Number,
       A.AppliedDate
     FROM
       tracking_an_applicant AS TA
     INNER JOIN
       Applicants AS A ON TA.Applicant_ID = A.Applicant_ID
  `;
 
  db.query(queryTotalApplicants, (errorTotalApplicants, resultsTotalApplicants) => {
    if (errorTotalApplicants) {
      console.error('Error querying total applicants:', errorTotalApplicants);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    const totalApplicants = resultsTotalApplicants[0].totalApplicants;
 
    db.query(queryTotalOpenings, (errorTotalOpenings, resultsTotalOpenings) => {
      if (errorTotalOpenings) {
        console.error('Error querying total openings:', errorTotalOpenings);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      const totalOpenings = resultsTotalOpenings[0].totalOpenings;
 
      db.query(queryScheduledInterviews, (errorScheduledInterviews, resultsScheduledInterviews) => {
        if (errorScheduledInterviews) {
          console.error('Error querying scheduled interviews:', errorScheduledInterviews);
          res.status(500).json({ error: 'Server error' });
          return;
        }
        const scheduledInterviews = resultsScheduledInterviews[0].scheduledInterviews;
 
        db.query(queryReleasedOffers, (errorReleasedOffers, resultsReleasedOffers) => {
          if (errorReleasedOffers) {
            console.error('Error querying released offers:', errorReleasedOffers);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          const releasedOffers = resultsReleasedOffers[0].releasedOffers;
 
          db.query(queryApplicantsInProgress, (errorApplicantsInProgress, resultsApplicantsInProgress) => {
            if (errorApplicantsInProgress) {
              console.error('Error querying applicants in progress:', errorApplicantsInProgress);
              res.status(500).json({ error: 'Server error' });
              return;
            }
 
            res.json({
              totalApplicants,
              totalOpenings,
              scheduledInterviews,
              releasedOffers,
              applicantsInProgress: resultsApplicantsInProgress
            });
          });
        });
      });
    });
  });
});




// Endpoint to fetch shifts
app.get('/employeeshift', (req, res) => {
  const query = 'SELECT Shift_ID FROM Shifts';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});




app.get('/onboardinghrmsapplicantid', (req, res) => {
  const query = 'SELECT Applicant_ID, Applicant_Name FROM OnboardingHrms WHERE Status = ?';
  const status = ['Initiated'];
  db.query(query, status, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});
 

app.get('/applicantDetails/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT First_Name, Middle_Name, Last_Name, Phone_Number, Email_ID, Gender, Job_Position, Department, Role, Date_of_Birth, Marital_Status, Address FROM Applicants WHERE Applicant_ID = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Applicant not found' });
      return;
    }
    res.json(results[0]);
  });
});
 
 
app.get('/userCount', (req, res) => {
  const query = 'SELECT COUNT(*) AS count FROM employee_details';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results[0]);
  });
});
 

 



app.post('/createEmployee', (req, res) => {
  const {
    First_Name,
    Middle_Name,
    Last_Name,
    Phone_Number,
    Email_ID,
    Gender,
    Job_Position,
    Department,
    Role,
    Joining_Date,
    EmployeeID,
    Shift,
    Date_of_Birth,
    Marital_Status,
    Address,
  } = req.body;
 
  
  const Password = generateRandomPassword();
 
  const query = `
    INSERT INTO employee_details (First_Name, Middle_Name, Last_Name, Phone_Number, Email_ID, Gender, Job_Position, Department, Role, EmployeeName, Joining_Date, EmployeeID, Password, Shift_ID, Date_of_Birth, Marital_Status, Address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
 
  db.query(
    query,
    [First_Name, Middle_Name, Last_Name, Phone_Number, Email_ID, Gender, Job_Position, Department, Role, `${First_Name} ${Last_Name}`, Joining_Date, EmployeeID, Password, Shift, Date_of_Birth, Marital_Status, Address],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
 
     
      const fetchEmployeeQuery = 'SELECT EmployeeName FROM employee_details WHERE EmployeeID = ?';
      db.query(fetchEmployeeQuery, [EmployeeID], (fetchErr, fetchResults) => {
        if (fetchErr) {
          console.error('Error fetching employee details:', fetchErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
 
        if (fetchResults.length === 0) {
          res.status(404).json({ error: 'Employee not found' });
          return;
        }
 
        const { EmployeeName } = fetchResults[0];
 
       
        const shiftQuery = 'SELECT StartTime, EndTime, ShiftType FROM Shifts WHERE Shift_ID = ?';
        db.query(shiftQuery, [Shift], (shiftErr, shiftResults) => {
          if (shiftErr) {
            console.error('Error fetching shift details:', shiftErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
 
          if (shiftResults.length === 0) {
            res.status(404).json({ error: 'Shift not found' });
            return;
          }
 
          const { StartTime, EndTime, ShiftType } = shiftResults[0];
 
          res.json({ employeeId: EmployeeID, employeeName: EmployeeName, password: Password, shiftDetails: { StartTime, EndTime, ShiftType } });
 
          
          sendWelcomeEmail(Email_ID, EmployeeName, EmployeeID, Password, { StartTime, EndTime, ShiftType });
        });
      });
    }
  );
});
 

const sendWelcomeEmail = async (Email_ID, EmployeeName, EmployeeID, Password, shiftDetails) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'js5698723@gmail.com',
      pass: 'oqgd vhvw rnyz vrls',
    },
  });
 
  const mailOptions = {
    from: 'js5698723@gmail.com',
    to: Email_ID,
    subject: 'Welcome to the Company',
    text: `Dear ${EmployeeName},
 
    Welcome to the company! Here are your login credentials and shift details:
 
    Employee ID: ${EmployeeID}
    Password: ${Password}
    Shift Start Time: ${shiftDetails.StartTime}
    Shift End Time: ${shiftDetails.EndTime}
    Shift Type: ${shiftDetails.ShiftType}
 
    Please keep this information secure.
 
    Best regards,
    The Company`
  };
 
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
 
 

app.post('/addEmployeeAssets', (req, res) => {
  const { AssetID, AssetName, AssetCategory, AssetType, Username, EmployeeName, AssignedOn, CurrentCondition } = req.body;
 
  const query = `
    INSERT INTO Assets (AssetID, AssetName, AssetCategory, AssetType, Username, EmployeeName, AssignedOn, CurrentCondition)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
 
  const values = [AssetID, AssetName, AssetCategory, AssetType, Username, EmployeeName, AssignedOn, CurrentCondition];
 
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.status(200).json({ message: 'Data inserted successfully' });
  });
});
 
 


app.get('/employeeassetemployeeid', (req, res) => {
  const query = 'SELECT EmployeeID, EmployeeName FROM employee_details';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});
 
 
app.get('/employeeassetdropdown', (req, res) => {
  const query = `
    SELECT AssetID, AssetName, Category, AssetType
    FROM OrganisationAssets
    WHERE NOT EXISTS (
      SELECT 1
      FROM Assets
      WHERE OrganisationAssets.AssetID = Assets.AssetID
    )
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});
 




// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 