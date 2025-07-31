# HRMS Full Stack Application - Single Deployment

Complete HRMS (Human Resource Management System) with React frontend and Node.js backend, designed for single URL deployment on Render.

## 🏗️ Project Structure

```
HRMS-project/
├── package.json              # Root package.json with deployment scripts
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore file
├── README.md                # This file
├── backend/                 # Node.js Express backend
│   ├── server.js            # Main server file (serves API + React build)
│   ├── package.json         # Backend dependencies
│   ├── logo.png             # Company logo for PDFs
│   ├── applicantresume/     # Resume uploads
│   ├── offerletterpdf/      # Generated offer letters
│   └── profilepicture/      # Profile picture uploads
└── client/                  # React frontend
    ├── package.json         # Client dependencies
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        ├── Employee/        # Employee-specific components
        ├── HR/             # HR-specific components
        ├── pages/          # Shared pages
        ├── App.js
        └── index.js
```

## 🚀 **Render Deployment Instructions**

### **Step 1: Repository Setup**
Your repository is already configured at: `https://github.com/Santhosh-majji/HRMS-project.git`

### **Step 2: Create Render Web Service**
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select repository: **`Santhosh-majji/HRMS-project`**

### **Step 3: Configure Deployment Settings**
```
Name: hrms-fullstack
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: (leave empty)

Build Command: npm install && npm run install-client && npm run build-client
Start Command: npm start
```

### **Step 4: Environment Variables**
Add these in Render dashboard under **"Environment"**:

```bash
# Database Configuration
DB_HOST=your-mysql-host
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name

# Server Configuration
PORT=5000

# Email Configuration (for OTP)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

# JWT Secret
JWT_SECRET=your-random-secret-key-here
```

### **Step 5: Database Setup Options**

#### **Option A: Railway MySQL (Recommended)**
1. Go to [railway.app](https://railway.app)
2. Create account and new project
3. Click **"Add Service"** → **"Database"** → **"MySQL"**
4. Copy connection details to Render environment variables

#### **Option B: PlanetScale MySQL**
1. Go to [planetscale.com](https://planetscale.com)
2. Create free account and database
3. Get connection string and add to Render env vars

#### **Option C: Render PostgreSQL**
1. In Render dashboard → **"New +"** → **"PostgreSQL"**
2. Create database
3. Update backend code to use PostgreSQL instead of MySQL

### **Step 6: Deploy**
1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Your app will be available at: `https://your-app-name.onrender.com`

## 🔧 **Local Development**

### **Prerequisites**
- Node.js 16+ installed
- MySQL database running
- Git installed

### **Setup Instructions**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Santhosh-majji/HRMS-project.git
   cd HRMS-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   npm run install-client
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Build client:**
   ```bash
   npm run build-client
   ```

5. **Start the application:**
   ```bash
   npm start
   ```

6. **Access the application:**
   - Frontend + Backend: `http://localhost:5000`

## 📡 **API Endpoints**

### **Authentication**
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/request-otp` - Request OTP for password reset
- `POST /api/reset-password` - Reset password with OTP

### **Employee Management**
- `GET /api/employees` - Get all employees
- `POST /api/createEmployee` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### **Attendance**
- `GET /api/all-attendance` - Get all attendance records
- `POST /api/checkin` - Employee check-in
- `POST /api/checkout` - Employee check-out
- `PUT /api/update-attendance/:id` - Update attendance record

### **Leave Management**
- `GET /api/leave-request` - Get all leave requests
- `POST /api/leave-request` - Submit leave request
- `PUT /api/leave-request-approve/:id` - Approve leave
- `PUT /api/leave-request-reject/:id` - Reject leave

### **Performance Management**
- `GET /api/AllEmployeesPIPData` - Get PIP data
- `POST /api/updatePIPData` - Update PIP data
- `GET /api/AppraisalData` - Get appraisal data

### **Holidays**
- `GET /api/holidays` - Get holidays
- `POST /api/holidays` - Add holiday
- `PUT /api/holidays/:id` - Update holiday
- `DELETE /api/holidays/:id` - Delete holiday

## 🛠️ **Package.json Scripts**

### **Root Level**
- `npm start` - Start the production server
- `npm run install-client` - Install React dependencies
- `npm run build-client` - Build React app for production
- `npm run dev` - Start development server with nodemon

### **Client Level**
- `npm start` - Start React development server
- `npm run build` - Build React app
- `npm test` - Run tests

## 🔒 **Security Features**
- JWT-based authentication
- Password hashing with bcrypt
- OTP-based password reset
- CORS protection
- Input validation
- SQL injection prevention

## 📱 **Features**

### **HR Dashboard**
- Employee management
- Attendance tracking
- Leave management
- Performance reviews (PIP)
- Onboarding process
- Interview scheduling
- Offer letter generation

### **Employee Dashboard**
- Personal profile management
- Attendance tracking
- Leave requests
- Performance metrics
- Project assignments
- Asset management

### **Admin Features**
- Organization settings
- Department management
- Position management
- Holiday management
- Asset management
- Reports and analytics

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Build fails on Render:**
   - Check if all dependencies are in package.json
   - Verify Node.js version compatibility
   - Check build logs for specific errors

2. **Database connection fails:**
   - Verify environment variables are set correctly
   - Check database host accessibility
   - Ensure database credentials are correct

3. **API calls fail:**
   - Check if routes have `/api/` prefix
   - Verify CORS settings
   - Check network tab in browser dev tools

4. **React app doesn't load:**
   - Ensure build was successful
   - Check if static files are being served correctly
   - Verify catch-all route is working

## 📞 **Support**

For deployment issues or questions:
1. Check Render build logs
2. Verify environment variables
3. Test API endpoints individually
4. Check database connectivity

## 🎯 **Production Checklist**

- [ ] Environment variables configured
- [ ] Database connected and accessible
- [ ] Build completes successfully
- [ ] All API endpoints working
- [ ] Authentication flow working
- [ ] File uploads working (if applicable)
- [ ] Email functionality working (OTP)
- [ ] Performance optimized
- [ ] Security measures in place

---

**🎉 Your HRMS application is now ready for single URL deployment on Render!**

**Expected URL**: `https://your-app-name.onrender.com`