import { Box, Button, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import headerStyles from './header.styles';
import Drawer from '../drawer/Drawer';
import axiosInstance from "../../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";

interface HeaderProps {
  toggleDrawer: () => void;
  isDrawerOpen: boolean;
}
const Header: React.FC<HeaderProps> = ({ toggleDrawer, isDrawerOpen }) => {
  const isMatch= useMediaQuery('(min-width:600px)')
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  return (<Box sx={{display:'flex',backgroundColor:'black',zIndex:'9999'}}>
      <Box sx={isMatch?headerStyles.largerScreen.htecLogo:headerStyles.smallerScreen.htecLogo}>
      </Box>
      <Box sx={isMatch?headerStyles.largerScreen.emptyBox:headerStyles.smallerScreen.emptyBox}></Box>
      {isMatch&&(<Button onClick={async () => {
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
        }} variant='contained' sx={{height:'20%',alignSelf:'center',justifySelf:'center',margin:'20px',background:'#E0F6FF',color:'#1C1C1C','&:hover': {
      backgroundColor: '#fff',
      color: '#3c52b2',
  },}}> Logout
  </Button>)}
      {isMatch?<></>:
        <Box sx={{backgroundColor:'#C1C1C1',height:'50px',
        width:'10%',display:'flex',justifyContent:'center',alignItems:'center'}}><MenuIcon onClick={toggleDrawer} ></MenuIcon></Box>
      }
      {isMatch?<></>:<Drawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}></Drawer>}
    </Box>
     
  )
}

export default Header