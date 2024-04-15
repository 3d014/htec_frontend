import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import useAuth from "../../../../hooks/useAuth";
import RoutesData from "../../../../providers/routeProvider";

const Navigation = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const navigationItems = RoutesData.filter(route => route.isNavigation && route.roles.some(role => auth.roles?.includes(role)));

    const handleItemClick = (path: string) => {
        navigate(path);
    };
  

    return (
        <List sx={{width:'100%', height:'100%',backgroundColor:"#D0FBE8",borderRight:'1px solid',color:'#32675B'}}>
            {navigationItems.map(item => (
                <ListItem sx={{borderBottom:'3px solid',borderTop:'2px solid', borderRadius:'10px',cursor:'pointer',marginBottom:'5px'}} key={item.id} onClick={() => handleItemClick(item.path)}>
                    <ListItemText primary={item.routeName} />
                </ListItem>
            ))}
        </List>
    );
}

export default Navigation;
