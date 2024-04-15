import useAuth from "../../../../hooks/useAuth";
import RoutesData from "../../../../providers/routeProvider";
import { List, ListItem, ListItemText, Drawer as MuiDrawer } from "@mui/material";
import { Navigate, useNavigate } from 'react-router-dom';
interface DrawerProps {

    isDrawerOpen: boolean;
    toggleDrawer: () => void
  }
const Drawer: React.FC<DrawerProps>  = ({isDrawerOpen,toggleDrawer}) => {
    const {auth}=useAuth()
    const navigationItems = RoutesData.filter(route => route.isNavigation && route.roles.some(role => auth.roles?.includes(role)));
    const navigate=useNavigate()

    const handleItemClick = (path: string) => {
        navigate(path);
        toggleDrawer(); // Close the drawer after navigating
    };


    return (
        <MuiDrawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer} PaperProps={{
            sx: { width: "40%",background:'#32675B',color:'#D0FBE8',fontWeight:'bold' },
          }}>
            <List>
                {navigationItems.map(item => (
                    <ListItem onClick={()=>{handleItemClick(item.path)}} key={item.id}>
                        <ListItemText primary={item.routeName} />
                    </ListItem>
                ))}
            </List>
        </MuiDrawer>
    );
}

export default Drawer