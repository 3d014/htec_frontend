import { List, ListItem, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from "../../../../hooks/useAuth";
import RoutesData from "../../../../providers/routeProvider";
import { useEffect, useState } from "react";

const Navigation = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const navigationItems = RoutesData.filter(route => route.isNavigation && route.roles.some(role => auth?.roles?.includes(role)));

    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const location = useLocation();
    const handleItemClick = (path: string, itemName: string) => {
        setSelectedItem(itemName);
        navigate(path);
    };
    useEffect(() => {
        const currentRoute = RoutesData.find(route => route.path === location.pathname);
        if (currentRoute && currentRoute.isNavigation) {
            setSelectedItem(currentRoute.routeName);
        } else {
            setSelectedItem(null);
        }
    }, [location.pathname]);

    return (<>
        <List sx={{  height: '100%', backgroundColor: "#FFFFFF", borderRight: '1px solid', color: '#000000', padding: '10px' }}>
            {navigationItems.map(item => (
                <ListItem 
                sx={{ 
                    borderBottom: '1px solid #E0E0E0', 
                    borderTop: '1px solid #E0E0E0', 
                    borderRadius: '20px', 
                    cursor: 'pointer', 
                    marginBottom: '10px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Increased shadow by default
                    backgroundColor: selectedItem === item.routeName ? "#C4DCB3" : "white", // Updated selected background color
                    color: selectedItem === item.routeName ? "white" : "#000000", // Updated text color when selected
                    textAlign: 'center', // Center the text
                    '&:hover': {
                        boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.3)', // Increased shadow on hover
                    },
                    fontFamily: 'Poppins, sans-serif', // Set font to Poppins
                    fontWeight: 500, // Set font weight to 500
                    fontSize: '16px', // Set font size to 16px
                    lineHeight: '24px', // Set line height to 24px
                    letterSpacing: '0.05em', // Set letter spacing to 5%
                    padding: '10px', // Added padding for better spacing
                }} 
                key={item.id} 
                onClick={() => handleItemClick(item.path, item.routeName)}
            >
                <ListItemText 
                    primary={item.routeName} 
                    sx={{ 
                        textAlign: 'center', // Center text inside the ListItemText
                        fontWeight: 'inherit', // Inherit font weight from parent ListItem
                        fontSize: 'inherit', // Inherit font size from parent ListItem
                        lineHeight: 'inherit', // Inherit line height from parent ListItem
                        letterSpacing: 'inherit', // Inherit letter spacing from parent ListItem
                    }} 
                />
            </ListItem>
            ))}
        </List>
        </>
    );
}

export default Navigation;


