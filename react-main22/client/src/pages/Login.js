import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress } from '@mui/material';
import AlertMessage from "./AlertMessage";
import { showWelcomeAlert } from "./showWelcomeAlert";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setAlertSeverity("warning");
      setAlertMessage("Please fill in all fields.");
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/login", {
        username,
        password,
      });
      if (response.data.success) {
        const role = response.data.role;
        const firstName = response.data.firstName;
        showWelcomeAlert(firstName); // Display SweetAlert welcome dialog
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);
        Cookies.set("token", response.data.token);
        setTimeout(() => {
          navigate(`/${role.toLowerCase()}`, { state: { username: firstName, role } });
        }, 2000); // Navigate after 2 seconds
      } else {
        setAlertSeverity("error");
        setAlertMessage("Invalid credentials");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAlertSeverity("error");
      setAlertMessage("An error occurred during login. Please try again later.");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordOpen = () => {
    setOtpStep(1); // Reset the OTP step to the first step
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setOtp("");
    setNewPassword("");
  };

  const handleRequestOtp = async () => {
    if (!username) {
      setAlertSeverity("warning");
      setAlertMessage("Please enter your username.");
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/request-otp', { username });
      if (response.data.success) {
        setAlertSeverity('success');
        setAlertMessage('OTP sent successfully.');
        setAlertOpen(true);
        setOtpStep(2);
      } else {
        setAlertSeverity('error');
        setAlertMessage('User not found.');
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage('An error occurred while requesting OTP.');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/verify-otp', { username, otp });
      if (response.data.success) {
        setAlertSeverity('success');
        setAlertMessage('OTP verified successfully.');
        setAlertOpen(true);
        setOtpStep(3);
      } else {
        setAlertSeverity('error');
        setAlertMessage('Invalid OTP.');
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage('An error occurred during OTP verification.');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setAlertSeverity('warning');
      setAlertMessage('Please enter your new password.');
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/reset-password', { username, newPassword, otp });
      if (response.data.success) {
        setAlertSeverity('success');
        setAlertMessage('Password reset successfully.');
        setAlertOpen(true);
        handleForgotPasswordClose();
      } else {
        setAlertSeverity('error');
        setAlertMessage('Failed to reset password.');
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage('An error occurred during password reset.');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <div className="login-title">Login</div>
          <p>welcome to the page</p>
         
          <div className="input-container">
            <FaUser className="input-icon" />
            <TextField
              className="input"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="input-container">
            <FaLock className="input-icon" />
            <TextField
              className="input"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <FaEye
                    className="eye-icon"
                    onClick={togglePasswordVisibility}
                    size={20}
                  />
                )
              }}
            />
          </div>
          <Button
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
          <span className="forgot-password" onClick={handleForgotPasswordOpen}>
            Forgot Password?
          </span>
        </div>
      </div>
      {/* Alert Dialog */}
      <AlertMessage
        open={alertOpen}
        onClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onClose={handleForgotPasswordClose}>
        <DialogTitle className="dialog-title">
          {otpStep === 1 ? 'Forgot Password' : otpStep === 2 ? 'Verify OTP' : 'Reset Password'}
        </DialogTitle>
        <DialogContent>
          {otpStep === 1 && (
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRequestOtp()}
            />
          )}
          {otpStep === 2 && (
            <>
              <TextField
                label="OTP"
                variant="outlined"
                fullWidth
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyOtp()}
              />
            </>
          )}
          {otpStep === 3 && (
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
            />
          )}
        </DialogContent>
        <DialogActions>
          {otpStep === 1 && (
            <Button onClick={handleRequestOtp} color="primary">
              Request OTP
            </Button>
          )}
          {otpStep === 2 && (
            <Button onClick={handleVerifyOtp} color="primary">
              Verify OTP
            </Button>
          )}
          {otpStep === 3 && (
            <Button onClick={handleResetPassword} color="primary">
              Reset Password
            </Button>
          )}
          <Button onClick={handleForgotPasswordClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginPage;
