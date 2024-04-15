import { Box, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import headerStyles from './header.styles';
import Drawer from '../drawer/Drawer';

interface HeaderProps {
  toggleDrawer: () => void;
  isDrawerOpen: boolean;
}
const Header: React.FC<HeaderProps> = ({ toggleDrawer, isDrawerOpen }) => {
  const isMatch= useMediaQuery('(min-width:600px)')


  return (<Box sx={{display:'flex',backgroundColor:'#32675B'}}>
      <Box sx={isMatch?headerStyles.largerScreen.htecLogo:headerStyles.smallerScreen.htecLogo}>
      </Box>
      <Box sx={isMatch?headerStyles.largerScreen.emptyBox:headerStyles.smallerScreen.emptyBox}></Box>
      
      {isMatch?<></>:
        <Box sx={{backgroundColor:'#32675B',height:'80px',
        width:'10%',display:'flex',justifyContent:'center',alignItems:'center'}}><MenuIcon onClick={toggleDrawer} ></MenuIcon></Box>
      }
      {isMatch?<></>:<Drawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}></Drawer>}
    </Box>
     
  )
}

export default Header