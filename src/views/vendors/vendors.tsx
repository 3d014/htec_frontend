import { Box, Button } from "@mui/material"
import GenericTable from "../../components/table/genericTable"
import Vendor from "../../models/vendors";
import { Columns } from "../../models/columns";
import DeleteIcon from '@mui/icons-material/Delete'

const Vendors = ()=>{

    const data :Vendor[]=[{name:'Belamionix',
    address:'kozara 25'
    }]
    const deleteFlag=false


    const config: Columns<Vendor>[] = [
        {   
            getHeader: () => 'Settings',
            getValue: (_vendor: Vendor) =><> {deleteFlag? <div style={{width:'50px',height:"20px"}}><Button size='small' onClick={()=>{console.log('')}}><DeleteIcon sx={{color:'#32675B'}}/></Button></div>:<div style={{width:'50px',height:"20px"}}></div>}</>
        },
       
        { 
            getHeader: () => 'Name', 
            getValue: (Vendor: Vendor) => Vendor.name
        },
        {
            getHeader:()=>'Transaction number',
            getValue:(Vendor:Vendor)=>Vendor.TransactionNumber
        },
        {
            getHeader:()=>'Address',
            getValue:(Vendor:Vendor)=>Vendor.address
        }
        

    ];

 return <Box sx={{display:'flex',flexDirection:'column',margin:'5%',alignItems:'center',centerItems:"center"}}>
    <h1>Vendori</h1>
    <GenericTable config={config} data={data}></GenericTable>

    <Box sx={{  marginTop: '20px' }}>
                    <Button variant="contained"  style={{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={()=>{}}>Add Product</Button>
                    <Button variant="contained" color="secondary" style={{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={()=>{}}>Delete Product</Button>
            </Box>
 </Box>   
}

export default Vendors