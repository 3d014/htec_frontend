import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import styles from "./login.styles";
import { ChangeEvent, useState } from "react";

import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { AuthState } from "../../models/authorization";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();

  const isMatch = useMediaQuery("(min-width:600px)");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setAuth } = useAuth();

  const handleEmailChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setEmail(e.target.value);
  };
  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedToken: any = jwtDecode(token);

        setAuth((prevAuth: AuthState | null) => ({
          ...prevAuth,
          email: email,
          accessToken: token,
          roles: decodedToken.roles || [],
        }));

        navigate("/home");
      } else {
        console.error(response.data.msg);
      }
    } catch (error) {
      console.error("Error occured during login:", error);
      if (error instanceof AxiosError) toast.error(error.response?.data.msg);
    }
  };

  return (
    <>
      <Box
        style={
          isMatch
            ? styles.largerScreen.headerRectangle
            : styles.smallerScreen.headerRectangle
        }
      >
        {" "}
      </Box>
      <Box
        style={
          isMatch
            ? styles.largerScreen.headerTriangle
            : styles.smallerScreen.headerTriangle
        }
      ></Box>

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          style={
            isMatch
              ? styles.largerScreen.loginForm
              : styles.smallerScreen.loginForm
          }
        >
          <TextField
            label="Email"
            style={
              isMatch
                ? styles.largerScreen.inputArea
                : styles.smallerScreen.inputArea
            }
            variant="filled"
            onChange={handleEmailChange}
            value={email}
            type="email"
            autoComplete="off"
            InputProps={{
              endAdornment: <AccountCircleIcon color="action" />,
              disableUnderline: true,
              sx: { borderRadius: "10px" },
            }}
          />
          <Box
            style={
              isMatch
                ? styles.largerScreen.forgotPasswordWrapper
                : styles.smallerScreen.forgotPasswordWrapper
            }
          >
            <TextField
              label="Password"
              variant="filled"
              type="password"
              style={
                isMatch
                  ? styles.largerScreen.inputArea
                  : styles.smallerScreen.inputArea
              }
              onChange={handlePasswordChange}
              value={password}
              autoComplete="off"
              InputProps={{
                endAdornment: <LockIcon color="action" />,
                disableUnderline: true,
                sx: { borderRadius: "10px" },
              }}
            />

            <Button
              variant="text"
              style={
                isMatch
                  ? styles.largerScreen.forgotPasswordButton
                  : styles.smallerScreen.forgotPasswordButton
              }
              onClick={() => {
                navigate("/forgotpassword");
              }}
            >
              Forgot password?
            </Button>
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit}
            style={
              isMatch
                ? styles.largerScreen.loginButton
                : styles.smallerScreen.loginButton
            }
          >
            Login
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Login;
