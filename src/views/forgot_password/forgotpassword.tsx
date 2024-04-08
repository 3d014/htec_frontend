import styles from "./forgotpassword.styles"
import { Box, Button, TextField, Typography, useMediaQuery, Snackbar } from "@mui/material"
import EmailIcon from '@mui/icons-material/Email';
import { ChangeEvent, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const isMatch = useMediaQuery('(min-width:600px)')
  const [email, setEmail] = useState<string>('')
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmitForgotPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/forgotpassword', {
        email: email,
      });

      if (response.data.success) {
        setSnackbarMessage("Email sent successfully.");
        setSnackbarOpen(true);
        navigate('/login'); // Preusmjerite korisnika na stranicu za prijavu nakon što pošaljete zahtjev za zaboravljenu lozinku
      } else {
        setSnackbarMessage("Failed to send email. Please try again.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error occurred during forgot password:', error);
      setSnackbarMessage("An error occurred. Please try again later.");
      setSnackbarOpen(true);
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box style={isMatch ? styles.largerScreen.headerRectangle : styles.smallerScreen.headerRectangle}></Box>
      <Box style={isMatch ? styles.largerScreen.headerTriangle : styles.smallerScreen.headerTriangle}></Box>
      <Box style={isMatch ? styles.largerScreen.forgotPasswordText : styles.smallerScreen.forgotPasswordText}>
        <Box style={isMatch ? styles.largerScreen.loginForm : styles.smallerScreen.loginForm}>
          <Typography variant="body1" style={{ marginBottom: '8px', textAlign: 'center', fontSize: '18px', color: '#32675B' }}>FORGOT PASSWORD?</Typography>
          <Typography variant="body1" style={{ marginBottom: '8px', textAlign: 'center', fontSize: '12px', color: '#32675B' }}>Enter your email address and we will send you the instructions to reset your password.</Typography>
          <TextField
            label="Email"
            style={isMatch ? styles.largerScreen.inputArea : styles.smallerScreen.inputArea}
            variant='filled'
            onChange={handleEmailChange}
            value={email}
            type='email'
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <EmailIcon color="action" />
              ),
              disableUnderline: true,
              sx: { borderRadius: '10px' },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmitForgotPassword}
            style={isMatch ? styles.largerScreen.loginButton : styles.smallerScreen.loginButton}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
}

export default ForgetPassword;
