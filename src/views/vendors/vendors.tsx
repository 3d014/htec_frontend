import { Autocomplete, Box, Button, Chip, TextField } from "@mui/material"
import GenericTable from "../../components/table/genericTable"
import Vendor from "../../models/vendors";
import { Columns } from "../../models/columns";
import DeleteIcon from '@mui/icons-material/Delete'
import GenericModal from "./modal/genericModal";
import axiosInstance from '../../api/axiosInstance';
import { useEffect, useState } from 'react'

const Vendors = ()=>{

   
    const [vendorData,setVendorData]=useState<Vendor[]>([{name:'test0',
    address:'test1',
    identificationNUmber:'',
    categories:'',
    PDVNumber:'',
    City:'',
    TelephoneNumber:[],
    email:[],
    TransactionNumber:['test2','test3']}])
    const deleteFlag=false

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentEmailValue,setCurrentEmailValue]=useState<string>('')


    function handleAddEmail(newEmail:string){
        if(newEmail) setNewVendor((prevVendor) => ({ ...prevVendor, email: [...prevVendor.email, newEmail] }))
     
    }
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleAddVendor = () => {
        setIsModalOpen(true);
    };

   
    const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string>("");
  
    function handleAddPhoneNumber(newTelephoneNumber: string) {
        if(newTelephoneNumber) setNewVendor((prevVendor) => ({ ...prevVendor, TelephoneNumber: [...prevVendor.TelephoneNumber, newTelephoneNumber] }))
    }


    
    const [currentTransactionNumber, setCurrentTransactionNumber] = useState<string>("");

function handleAddTransactionNumber(newTransactionNumber: string) {
    if(newTransactionNumber) setNewVendor((prevVendor) => ({ ...prevVendor, TransactionNumber: [...prevVendor.TransactionNumber, newTransactionNumber] }))
}


const [newVendor,setNewVendor]=useState<Vendor>(
        {
            name:'',
            address:'',
            identificationNUmber:'',
            categories:'',
            PDVNumber:'',
            City:'',
            TelephoneNumber:[],
            email:[],
            TransactionNumber:[]
        }
    )

 const handleDeleteVendor = async (vendor: Vendor) => {
        const { identificationNUmber } = vendor; 
        if (identificationNUmber) {
            try {
                await axiosInstance.delete(`/api/vendors/${identificationNUmber}`, {
                    headers: { Authorization: localStorage.getItem('token') }
                });
                const filteredVendors: Vendor[] = vendorData.filter(item => item.identificationNUmber !== identificationNUmber);
                setVendorData(filteredVendors);
            } catch (error) {
                console.error('Error deleting vendor:', error);
            }
        }
    };

    const fetchVendors = async () => {
        try {
            const response = await axiosInstance.get('/api/vendors', {
                headers: { Authorization: localStorage.getItem('token') }
            });
            const data: Vendor[] = response.data;
            setVendorData(data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleSaveVendor = async (newVendor: Vendor) => {
        try {
            await axiosInstance.post('/api/vendors', newVendor, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            fetchVendors();
        } catch (error) {
            console.error('Error saving vendor:', error);
        }
    };

    
    function handleSubmit() {
       
        setVendorData(prevData => [...prevData, newVendor]);
  
        setNewVendor({
            name: '',
            address: '',
            identificationNUmber: '',
            categories:'',
            PDVNumber: '',
            City: '',
            TelephoneNumber: [],
            email: [],
            TransactionNumber: []
        });
        setCurrentEmailValue('')
        setCurrentPhoneNumber('')
        setCurrentTransactionNumber('')
    }
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
            getValue:(Vendor:Vendor)=>Vendor.TransactionNumber[0]
        },
        {
            getHeader:()=>'Address',
            getValue:(Vendor:Vendor)=>Vendor.address
        }
        

    ];

 return <Box sx={{display:'flex',flexDirection:'column',margin:'5%',alignItems:'center',centerItems:"center"}}>
    <h1>Vendori</h1>
    <GenericTable config={config} data={vendorData}></GenericTable>

    <Box sx={{  marginTop: '20px' }}>
                    <Button variant="contained"  style={{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={handleAddVendor}>Add Vendor</Button>
                    <Button variant="contained" color="secondary" style={{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={()=>{}}>Delete Vendor</Button>
    </Box>
    <GenericModal isOpen={isModalOpen} onClose={handleModalClose} >
     
    <TextField label='Name'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newVendor.name}
         onChange={(e)=>{setNewVendor({...newVendor,name:e.target.value})}}
         > naxiv</TextField>

        <TextField label='Address'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newVendor.address}
         onChange={(e)=>{setNewVendor({...newVendor,address:e.target.value})}}
         > naxiv</TextField>
        <TextField label='Identification number'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newVendor.identificationNUmber}
         onChange={(e)=>{
            console.log(newVendor)
            setNewVendor({...newVendor,identificationNUmber:e.target.value})}}> naxiv</TextField>
        <TextField label='Category'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newVendor.categories}
         onChange={(e)=>{setNewVendor({...newVendor,categories:e.target.value})}}
         > naxiv</TextField>
        <TextField label='PDV Number'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}}
        value={newVendor.PDVNumber}
        onChange={(e)=>{setNewVendor({...newVendor,PDVNumber:e.target.value})}}
        > naxiv</TextField>
        <TextField label='City'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}}
        value={newVendor.City}
        onChange={(e)=>{setNewVendor({...newVendor,City:e.target.value})}}
        > naxiv</TextField>
         
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
            {newVendor.email.slice(0, 1).map(item=><Chip key={item}
                tabIndex={-1}
                label={item}>

                </Chip>
            )}
            {newVendor.email.length > 1 && <Chip label={`+${newVendor.email.length - 1}`} />}
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
                  {newVendor.TelephoneNumber.slice(0, 1).map((item) => (
                    <Chip key={item} tabIndex={-1} label={item} />
                  ))}
                  {newVendor.TelephoneNumber.length > 1 && <Chip label={`+${newVendor.TelephoneNumber.length - 1}`} />}
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
        {newVendor.TransactionNumber.slice(0, 1).map((item) => (
          <Chip key={item} tabIndex={-1} label={item} />
        ))}
        {newVendor.TransactionNumber.length > 1 && <Chip label={`+${newVendor.TransactionNumber.length - 1}`} />}
      </>
    ),
  }}
/>
            <Button onClick={handleSubmit}>Submit</Button>

    </GenericModal>
 </Box>   
}

export default Vendors