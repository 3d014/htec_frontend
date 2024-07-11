import { Box, useMediaQuery, Grid } from "@mui/material";
import { ReactNode, useState } from "react";
import Header from "./header/header";
import Navigation from "./navigation/Navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const isMatch = useMediaQuery("(min-width:600px)");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header toggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} />
      <Grid container sx={{ flexGrow: 1, height: "calc(100vh - 64px)" }}>
        {isMatch && (
          <Grid
            item
            xs={2}
            sx={{
              backgroundColor: "black",
              height: "100%",
              
            }}
          >
            <Navigation />
          </Grid>
        )}
        <Grid
          item
          xs={isMatch ? 10 : 12}
          sx={{
            backgroundColor: "white",
            height: "100%",
            overflowY: "auto"
          }}
        >
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
