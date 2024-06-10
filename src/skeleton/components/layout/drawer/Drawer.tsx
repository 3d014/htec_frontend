import useAuth from "../../../../hooks/useAuth";
import RoutesData from "../../../../providers/routeProvider";
import { List, ListItem, ListItemText, Drawer as MuiDrawer } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface DrawerProps {
    isDrawerOpen: boolean;
    toggleDrawer: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isDrawerOpen, toggleDrawer }) => {
    const { auth } = useAuth();
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [hoveredItem, setHoveredItem] = useState<string>(''); // State to track hovered item
    const navigationItems = RoutesData.filter(route => route.isNavigation && route.roles.some(role => auth?.roles?.includes(role)));
    const navigate = useNavigate();

    const handleItemClick = (path: string) => {
        setSelectedItem(path);
        navigate(path);
        toggleDrawer(); // Close the drawer after navigating
    };

    return (
        <MuiDrawer
            anchor="left"
            open={isDrawerOpen}
            onClose={toggleDrawer}
            PaperProps={{
                sx: {
                    width: "40%",
                    backgroundColor: "#FFFFFF",
                    color: "#000000", // Black text color by default
                    fontWeight: "bold",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
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
        </MuiDrawer>
    );
};

export default Drawer;
