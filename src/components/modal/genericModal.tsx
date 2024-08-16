import { Box, Dialog, useMediaQuery } from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear'
import styles from "./modal.styles"


type ModalProps={
    isOpen:boolean
    onClose:()=>void
    
    children:React.ReactNode
}

const genericModal: React.FC<ModalProps> = ({ isOpen, onClose,children })=>{
    const isSmallScreen = useMediaQuery("(max-width:600px)");
    
    

    return <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth='md' sx={{display:'flex',justifyContent:'center',alignItems:'center'}} >
    
       <ClearIcon sx={{alignSelf:'flex-end',margin:'5px',cursor:'pointer'}} onClick={()=>{onClose()}}></ClearIcon>

        <Box sx={isSmallScreen?styles.smallerScreen.modal : styles.largerScreen.modal}>
            {children} 
        </Box> 
    </Dialog>
}

export default genericModal