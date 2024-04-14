import React from 'react';
import {Drawer, Box, Typography, ListItemText, useMediaQuery, useTheme, IconButton, Divider} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import styles from "../../../views/test/test.styles"
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from "react-router-dom";
import { UserDrawerItems } from "./user";
import MenuIcon from '@mui/icons-material/Menu';
export const MuiDrawer = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMdUp = useMediaQuery('(min-width:600px)');
    const [open, setOpen] = React.useState(false);

  const isMatch = useMediaQuery('(min-width:600px)')
    return (
        <>
        <Box style={isMatch ? styles.largerScreen.headerRectangle : styles.smallerScreen.headerRectangle}> 
         <IconButton
            color='inherit'
            aria-label='logo'
            edge="end"
            size='large'
            style={{display: !isMatch ? "inline flex": "none", marginLeft: '90%'}}
            onClick={() => setOpen(!open)}
          ><MenuIcon /></IconButton></Box> 
          <Box style={{borderTop: '2px solid black', marginTop: '2px'}}></Box>
        <Drawer anchor='left' 
                variant={isMdUp? 'permanent' : 'temporary'} 
                open={open} onClose={() => setOpen(false)}
                sx={{
                    '&.MuiDrawer-root .MuiDrawer-paper': { marginTop: '110px', border:'2px solid black', width: '20%', borderTop: 2, marginLeft: '7px' }
                  }}>
                
        
            <List >
                {UserDrawerItems.map((element, index) => (
                   
                <ListItem key={element.id} 
                            sx={{
                            borderTop: 1,
                            borderRight: 0,
                            borderBottom:0,
                            borderLeft: 0,
                            ...(index === UserDrawerItems.length - 1 && {
                                borderBottom: 1
                            }),
                            ...(index === 0 && {
                                borderTop: 0
                            })
                            }}
                            alignItems='center'
                    >
                    <ListItemButton onClick={() => { navigate(element.route)}}>
                    <ListItemText sx={{textAlign:'center'}}>{element.label}</ListItemText>
                    </ListItemButton>
                </ListItem>
                 
                
                ))}
            </List>
        </Drawer>
        </>
    )
}