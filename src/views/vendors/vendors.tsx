import {Autocomplete, Box, Button, Chip, FormControlLabel, Switch, TextField } from "@mui/material"
import GenericTable from "../../components/table/genericTable"
import Vendor from "../../models/vendors";
import { Columns } from "../../models/columns";
import DeleteIcon from '@mui/icons-material/Delete'
import GenericModal from "../../components/modal/genericModal";
import axiosInstance from '../../api/axiosInstance';
import { useEffect, useState } from 'react'
import fetchVendors from "../../utils/fetchFunctions/fetchVendors";


const initialVendor:Vendor={
  vendorId:'',
    vendorName: '',
    vendorAddress: '',
    vendorIdentificationNumber: '',
    supportsAvans:false,
    vendorPDVNumber: '',
    vendorCity: '',
    vendorTelephoneNumber: [],
    vendorEmail: [],
    vendorTransactionNumber: []
}

const Vendors = ()=>{

   
    const [vendorData,setVendorData]=useState<Vendor[]>([])

    const [deleteFlag,setDeleteFlag]=useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentEmailValue,setCurrentEmailValue]=useState<string>('')

    function handleAddEmail(newEmail:string){
      
        if(newEmail) setNewVendor((prevVendor) => ({ ...prevVendor, vendorEmail: [...prevVendor.vendorEmail, newEmail] }))
     
    }
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleAddVendor = () => {
        setIsModalOpen(true);
    };

   
    const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string>("");
  
    function handleAddPhoneNumber(newTelephoneNumber: string) {
        if(newTelephoneNumber) setNewVendor((prevVendor) => ({ ...prevVendor, vendorTelephoneNumber: [...prevVendor.vendorTelephoneNumber, newTelephoneNumber] }))
    }



    
    const [currentTransactionNumber, setCurrentTransactionNumber] = useState<string>("");

function handleAddTransactionNumber(newTransactionNumber: string) {
    if(newTransactionNumber) setNewVendor((prevVendor) => ({ ...prevVendor, vendorTransactionNumber: [...prevVendor.vendorTransactionNumber, newTransactionNumber] }))
}


const [newVendor,setNewVendor]=useState<Vendor>(initialVendor)



 const handleDeleteVendor = async (vendor: Vendor) => {
        const { vendorId } = vendor; 
        if (vendorId) {
            try {
                await axiosInstance.delete(`/api/vendors`, {
                    headers: { Authorization: localStorage.getItem('token') },
                    data:{vendorId}
                });
                const filteredVendors: Vendor[] = vendorData.filter(item => item.vendorId !== vendorId);
                setVendorData(filteredVendors);
            } catch (error) {
                console.error('Error deleting vendor:', error);
            }
        }
    };





    useEffect(() => {
        fetchVendors(setVendorData);
      
    }, []);

    const handleSaveVendor = async (newVendor: Vendor) => {
        try {
            await axiosInstance.post('/api/vendors', newVendor, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            fetchVendors(setVendorData);
        } catch (error) {
            console.error('Error saving vendor:', error);
        }
        setNewVendor(initialVendor);
        setCurrentEmailValue('')
        setCurrentPhoneNumber('')
        setCurrentTransactionNumber('')
        setIsModalOpen(!isModalOpen)
    };

    

    const config: Columns<Vendor>[] = [
        {   
            getHeader: () => 'Settings',
            getValue: (vendor: Vendor) =><> {deleteFlag? <div style={{width:'50px',height:"20px"}}><Button size='small' onClick={()=>{handleDeleteVendor(vendor)}}><DeleteIcon sx={{color:'#32675B'}}/></Button></div>:<div style={{width:'50px',height:"20px"}}></div>}</>
        },
       
        { 
            getHeader: () => 'Name', 
            getValue: (Vendor: Vendor) => Vendor.vendorName
        },
        {
            getHeader:()=>'Transaction number',
            getValue:(Vendor:Vendor)=>Vendor.vendorTransactionNumber[0]        },
        {
          getHeader:()=>'Email',
          getValue:(Vendor:Vendor)=>Vendor.vendorEmail[0]
        },
        {
            getHeader:()=>'Address',
            getValue:(Vendor:Vendor)=>Vendor.vendorAddress
        },
        {
          getHeader:()=>'Avans',
          getValue:(Vendor:Vendor)=>{
            if(Vendor.supportsAvans){return 'Supports'}
              else {
                return "Doesn't support"
              }
          }
        }
        
        

    ];

 return <Box sx={{display:'flex',flexDirection:'column',margin:'5%',alignItems:'center',centerItems:"center"}}>
    <h1>Vendors</h1>
    <GenericTable config={config} data={vendorData}></GenericTable>

    <Box sx={{  marginTop: '20px' }}>
                    <Button variant="contained"  style={{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={handleAddVendor}>Add Vendor</Button>
                    <Button variant="contained" color="secondary" style={{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={()=>{setDeleteFlag(!deleteFlag)}}>Delete Vendor</Button>
    </Box>
    <GenericModal isOpen={isModalOpen} onClose={handleModalClose} >
     
    <TextField label='Name'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newVendor.vendorName}
         onChange={(e)=>{setNewVendor({...newVendor,vendorName:e.target.value})}}
         ></TextField>

        <TextField label='Address'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newVendor.vendorAddress}
         onChange={(e)=>{setNewVendor({...newVendor,vendorAddress:e.target.value})}}
         ></TextField>
        <TextField label='Identification number'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newVendor.vendorIdentificationNumber}
         onChange={(e)=>{
            console.log(newVendor)
            setNewVendor({...newVendor,vendorIdentificationNumber:e.target.value})}}> naxiv</TextField>
       
        <TextField label='PDV Number'sx=
        {{ backgroundColor:'white',color: '#32675B',margin: '5px'}}
        value={newVendor.vendorPDVNumber}
        onChange={(e)=>{setNewVendor({...newVendor,vendorPDVNumber:e.target.value})}}
        ></TextField>
        <TextField label='City'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}}
        value={newVendor.vendorCity}
        onChange={(e)=>{setNewVendor({...newVendor,vendorCity:e.target.value})}}
        ></TextField>
         
        <TextField label='Email' placeholder="Email" sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}}  
        value={currentEmailValue} onChange={(e)=>{setCurrentEmailValue(e.target.value)}} 
        InputProps={{
            
            endAdornment: 
            <Button 
                 onClick={()=>
                    {
                        handleAddEmail(currentEmailValue)
                        setCurrentEmailValue('') }
                    }>
                add
            </Button>,
            startAdornment:(<>
            {newVendor.vendorEmail.slice(0, 1).map(item=><Chip key={item}
                tabIndex={-1}
                label={item}>

                </Chip>
            )}
            {newVendor.vendorEmail.length > 1 && <Chip label={`+${newVendor.vendorEmail.length - 1}`} />}
            </>),

            
            }
            
            }>

            </TextField>

            <TextField
            label="Telephone"
            placeholder="Telephone"
            sx={{ backgroundColor: "white", color: "#32675B", margin: "5px" }}
            value={currentPhoneNumber}
            onChange={(e) => setCurrentPhoneNumber(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button
                  onClick={() => {
                    handleAddPhoneNumber(currentPhoneNumber);
                    setCurrentPhoneNumber("");
                  }}
                >
                  add
                </Button>
              ),
              startAdornment: (
                <>
                  {newVendor.vendorTelephoneNumber.slice(0, 1).map((item) => (
                    <Chip key={item} tabIndex={-1} label={item} />
                  ))}
                  {newVendor.vendorTelephoneNumber.length > 1 && <Chip label={`+${newVendor.vendorTelephoneNumber.length - 1}`} />}
                </>
              ),
            }}
          />
  <TextField
  label="Transaction Number"
  placeholder="Transaction Number"
  sx={{ backgroundColor: "white", color: "#32675B", margin: "5px" }}
  value={currentTransactionNumber}
  onChange={(e) => setCurrentTransactionNumber(e.target.value)}
  InputProps={{
    endAdornment: (
      <Button
        onClick={() => {
          handleAddTransactionNumber(currentTransactionNumber);
          setCurrentTransactionNumber("");
        }}
      >
        add
      </Button>
    ),
    startAdornment: (
      <>
        {newVendor.vendorTransactionNumber?.slice(0, 1).map((item) => (
          <Chip key={item} tabIndex={-1} label={item} />
        ))}
        {newVendor.vendorTransactionNumber.length > 1 && <Chip label={`+${newVendor.vendorTransactionNumber.length - 1}`} />}
      </>
    ),
  }}
/>


 <FormControlLabel
                control={
                    <Switch
                        checked={newVendor.supportsAvans}
                        onChange={(e) => setNewVendor({ ...newVendor, supportsAvans: e.target.checked })}
                    />
                }
                label="Supports Avans"
                sx={{ backgroundColor: "white", color: "#32675B", margin: "5px" }}
            />

  
            <Button onClick={()=>{handleSaveVendor(newVendor)}}>Submit</Button>

    </GenericModal>
 </Box>   
}

export default Vendors