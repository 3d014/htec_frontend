import { Box, Grid, useMediaQuery } from "@mui/material"
import  { ReactNode, useState } from "react"
import Header from "./header/header"
import Navigation from "./navigation/Navigation"

const Layout=({ children }: { children: ReactNode })=>{
    const isMatch= useMediaQuery('(min-width:600px)')

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

    return<Box sx={{display:'flex',flexDirection:'column'}}>
      <Header toggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} />

        {/* <Grid style={{}} container spacing={2}>
        {isMatch?<Grid item xs={isMatch?2:0} sx={{background:'green',height:'100vh'}}>sablon</Grid>:<></>}
        <Grid item xs={isMatch?10:12} sx={{background:'white'}}>{children}</Grid> */}

    {/* </Grid> */}


        <Box sx={{display:'flex',width:'100%    '}}>
            {isMatch?<Box sx={isMatch?{width:'20%',backgroundColor:'grey',height:'100vh'}:{}}><Navigation></Navigation></Box>:<></>}
            <Box sx={isMatch?{backgroundColor:'white',width:'80%'}:{backgroundColor:'white',width:'100%'}}>{children}</Box>

        </Box>
    </Box>
}
export default Layout