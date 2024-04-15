import { Button } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  return (
    <>
      Home
      <Button
        onClick={async () => {
          try {
            const response = await axiosInstance.post("/api/auth/logout", {
              token: localStorage.getItem("token"),
            });

            if (response.status === 200) {
              localStorage.removeItem("token");
              setAuth(null);
              navigate("/home");
            } else {
              console.error(response.data.msg);
            }
          } catch (error) {
            console.error("Error occured during logout:", error);
          }
        }}
      >
        Log out
      </Button>
    </>
  );
};

export default Home;
