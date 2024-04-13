import styles from "./email_sent.styles"
import { Box,useMediaQuery, Typography} from "@mui/material"
import EmailIcon from '@mui/icons-material/Email';
import { MuiDrawer } from "../../skeleton/components/drawer/MuiDrawer";

const EmailSent = () => {
    const successMessage = 'Email has been sent successfully!';
    const message = 'Please check your inbox and follow the instructions to reset your password.'
  const isMatch = useMediaQuery('(min-width:600px)')
    return <>
          <MuiDrawer></MuiDrawer>
         <Box style={isMatch ? styles.largerScreen.headerRectangle : styles.smallerScreen.headerRectangle}></Box>
      <Box style={isMatch ? styles.largerScreen.headerTriangle : styles.smallerScreen.headerTriangle}></Box>    
      <Box style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      <Box style={isMatch ? styles.largerScreen.textBox : styles.smallerScreen.textBox}>
        <EmailIcon color= 'success' fontSize="large"></EmailIcon>
        <Typography variant="body1" style={{ marginBottom: '8px', textAlign: 'center', fontSize: '22px', color: '#32675B', fontWeight: 'bold' }}>{successMessage}</Typography>
        <Typography variant="body1" style={{ marginBottom: '8px', textAlign: 'center', fontSize: '18px', color: '#32675B' }}>{message}</Typography>
        </Box>
        </Box>
    </>
}

export default EmailSent;