import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  Snackbar,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import styles from "./resetpassword.styles";
import { ChangeEvent, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMatch = useMediaQuery("(min-width:600px)");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  useEffect(() => {
    const token = searchParams.get("token");
    axiosInstance
      .post("api/reset/password/checktoken", {
        token,
      })
      .then((data) => {
        if (data.status !== 200) toast.warn(data.data.msg);
      })
      .catch((e: AxiosError<{ success: boolean; msg: string }>) => {
        toast.warn(e.response?.data?.msg);
        console.error("errrrr", e);
        navigate("/login");
      });
  }, [searchParams, navigate]);

  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setSnackbarMessage("Passwords do not match. Please try again.");
        setSnackbarOpen(true);
        return;
      }

      const response = await axiosInstance.post(
        "/api/reset/password/resetpassword",
        {
          token: searchParams.get("token"),
          password1: password,
          password2: confirmPassword,
        }
      );

      if (response.data.success) {
        setSnackbarMessage(
          "Password reset successfully. You can now login with your new password."
        );
        setSnackbarOpen(true);
        navigate("/login");
      } else {
        setSnackbarMessage("Failed to reset password. Please try again.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error occurred during password reset:", error);
      setSnackbarMessage("An error occurred. Please try again later.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box
        style={
          isMatch
            ? styles.largerScreen.headerRectangle
            : styles.smallerScreen.headerRectangle
        }
      ></Box>
      <Box
        style={
          isMatch
            ? styles.largerScreen.headerTriangle
            : styles.smallerScreen.headerTriangle
        }
      ></Box>
      <Box
        style={
          isMatch
            ? styles.largerScreen.resetPasswordText
            : styles.smallerScreen.resetPasswordText
        }
      >
        <Box
          style={
            isMatch
              ? styles.largerScreen.loginForm
              : styles.smallerScreen.loginForm
          }
        >
          <Typography
            variant="body1"
            style={{
              marginBottom: "8px",
              textAlign: "center",
              fontSize: "18px",
              color: "#32675B",
            }}
          >
            RESET PASSWORD
          </Typography>
          <TextField
            label="New password"
            variant="filled"
            style={
              isMatch
                ? styles.largerScreen.inputArea
                : styles.smallerScreen.inputArea
            }
            type="password"
            onChange={handlePasswordChange}
            value={password}
            autoComplete="off"
            InputProps={{
              endAdornment: <LockIcon color="action" />,
              disableUnderline: true,
              sx: { borderRadius: "10px" },
            }}
          />
          <TextField
            label="Confirm New Password"
            variant="filled"
            type="password"
            style={
              isMatch
                ? styles.largerScreen.inputArea
                : styles.smallerScreen.inputArea
            }
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
            autoComplete="off"
            InputProps={{
              endAdornment: <LockIcon color="action" />,
              disableUnderline: true,
              sx: { borderRadius: "10px" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={
              isMatch
                ? styles.largerScreen.loginButton
                : styles.smallerScreen.loginButton
            }
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
};

export default ResetPassword;
