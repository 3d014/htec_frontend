import ClearIcon from '@mui/icons-material/Clear'
import { Box, Button, Dialog, TextField } from "@mui/material"
import { useState } from 'react'
import axiosInstance from '../../../api/axiosInstance'

interface InvoiceUploaderProps{
    onClose:()=>void,
    isOpen:boolean

}
const InvoiceUploader=(props:InvoiceUploaderProps)=>{
    const [isCalculating,setIsCalculating]=useState(false)
    const [selectedFile,setSelectedFile]=useState<any>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          setSelectedFile(e.target.files[0]);
        }
      }

    
    const handleUploadInvoice=async ()=>{
        if (selectedFile) {
            const formData = new FormData()
            
            formData.append('file', selectedFile);
            await axiosInstance.post('/api/invoices/uploadInvoice',formData, {
                headers: { Authorization: localStorage.getItem('token') }
              })
            // You can now use formData for your upload logic
        } else {
            console.error('No file selected');
        }
    }

    return <Dialog  fullWidth open={props.isOpen} onClose={()=>{
        props.onClose()
        setSelectedFile(null)
    }
    }>
        <ClearIcon sx={{alignSelf:'flex-end',margin:'5px',cursor:'pointer'}} onClick={()=>{props.onClose()}}></ClearIcon>
        <Box sx={{height:'200px',padding:'20px'}}>
        
        {
        !isCalculating && <Box sx={{display:'flex',flexDirection:'column',justifyContent:'space-between',height:'100%'}}>
            <TextField type="file" 
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{handleFileChange(e)}}
            
            inputProps={{ accept: '.pdf,.jpeg,.jpg,.png' }}
        ></TextField>
            <Button variant='contained' disabled={!selectedFile} onClick={()=>{
                setIsCalculating(true)
                handleUploadInvoice()

            }
        }>Calculate and Fill the invoice</Button>

        </Box>
        
        }
        </Box>
    </Dialog>
}


export default InvoiceUploader