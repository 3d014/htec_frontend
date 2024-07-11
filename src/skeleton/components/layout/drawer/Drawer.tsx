import { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import RoutesData from "../../../../providers/routeProvider";
import { Button, List, ListItem, ListItemText, Drawer as MuiDrawer } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from "../../../../api/axiosInstance";


interface DrawerProps {

    isDrawerOpen: boolean;
    toggleDrawer: () => void
  }
const Drawer: React.FC<DrawerProps>  = ({isDrawerOpen,toggleDrawer}) => {
    const {auth}=useAuth()
    const navigationItems = RoutesData.filter(route => route.isNavigation && route.roles.some(role => auth?.roles?.includes(role)));
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [hoveredItem, setHoveredItem] = useState<string>(''); // State to track hovered item
    const navigate=useNavigate()
    const location = useLocation();
    
    const { setAuth } = useAuth();

    const handleItemClick = (path: string) => {
        setSelectedItem(path);
        navigate(path);
        toggleDrawer(); // Close the drawer after navigating
    };
   

    useEffect(() => {
        const currentRoute = RoutesData.find(route => route.path === location.pathname);
        if (currentRoute && currentRoute.isNavigation) {
            setSelectedItem(currentRoute.path);
        } else {
            setSelectedItem('');
        }
    }, [location.pathname]);

    return (
        <MuiDrawer
            anchor="left"
            open={isDrawerOpen}
            onClose={toggleDrawer}
            PaperProps={{
                sx: {
                    width: "50%",
                    backgroundColor: "#FFFFFF",
                    color: "#000000", // Black text color by default
                    fontWeight: "bold",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    padding:'10px'
                },
            }}
        >
            <List>
            {navigationItems.map((item) => (
                    <ListItem
                        onClick={() => {
                            handleItemClick(item.path);
                        }}
                        key={item.id}
                        sx={{
                            backgroundColor: selectedItem === item.path ? "#C4DCB3" : hoveredItem === item.path ? "#C4DCB3" : "white", // Updated background color logic
                            color: selectedItem === item.path ? "#FFFFFF" : "#000000", // White text color when selected
                            '&:hover': {
                                backgroundColor: selectedItem === item.path ? "#C4DCB3" : "#FFFFFF", // Background color changes only for non-selected items
                                color: selectedItem === item.path ? "#FFFFFF" : "#000000", // Text color changes only for non-selected items
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Slightly darker shadow on hover
                            },
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Slight shadow by default
                            borderRadius: "20px",
                            margin: "10px 0", // Margins for spacing between items
                            padding: "10px", // Padding for better spacing
                            textAlign: "center", // Center the text
                            fontFamily: "Poppins, sans-serif", // Set font to Poppins
                            fontWeight: 500, // Set font weight to 500
                            fontSize: "16px", // Set font size to 16px
                            lineHeight: "24px", // Set line height to 24px
                            letterSpacing: "0.05em", // Set letter spacing to 5%
                        }}
                        onMouseEnter={() => setHoveredItem(item.path)} // Set hovered item on mouse enter
                        onMouseLeave={() => setHoveredItem('')} // Clear hovered item on mouse leave
                    >
                        <ListItemText
                            primary={item.routeName}
                            sx={{
                                textAlign: "center", // Center text inside the ListItemText
                                fontWeight: "inherit", // Inherit font weight from parent ListItem
                                fontSize: "inherit", // Inherit font size from parent ListItem
                                lineHeight: "inherit", // Inherit line height from parent ListItem
                                letterSpacing: "inherit", // Inherit letter spacing from parent ListItem
                            }}
                        />
                    </ListItem>
                ))}
            </List>
            <Button onClick={async () => {
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
        }} variant='contained' sx={{alignSelf:'center',justifySelf:'center',margin:'20px',background:'#E0F6FF',color:'#1C1C1C','&:hover': {
      backgroundColor: '#fff',
      color: '#3c52b2',
  },}}> Logout
  </Button>
        </MuiDrawer>
    );
}

export default Drawer