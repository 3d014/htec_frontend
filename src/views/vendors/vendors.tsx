  import { Box, Button, Chip, FormControlLabel, Switch, TextField } from "@mui/material"
  import GenericTable from "../../components/table/genericTable"
  import Vendor from "../../models/vendors";
  import { Columns } from "../../models/columns";
  import DeleteIcon from '@mui/icons-material/Delete'
  import GenericModal from "../../components/modal/genericModal";
  import axiosInstance from '../../api/axiosInstance';
  import { useEffect, useState } from 'react'
  import fetchVendors from "../../utils/fetchFunctions/fetchVendors";
  import EditIcon from '@mui/icons-material/Edit';
  import { toast } from "react-toastify";


  const initialVendor:Vendor={
    vendorId:'',
      vendorName: '',
      vendorAddress: '',
      vendorIdentificationNumber: '',
      supportsAvans:false,
      vendorPDVNumber: '',
      vendorCity: '',
      vendorTelephone: [],
      vendorEmail: [],
      vendorTransactionNumber: []
  }

  const Vendors = ()=>{

    
      const [vendorData,setVendorData]=useState<Vendor[]>([])

      const [deleteFlag,setDeleteFlag]=useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isEditModalOpen, setIsEditModalOpen] = useState(false)
      const [currentEmailValue,setCurrentEmailValue]=useState<string>('')
      const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string>("");

      function handleAddEmail(newEmail:string){
        
          if(newEmail) setNewVendor((prevVendor) => ({ ...prevVendor, vendorEmail: [...prevVendor.vendorEmail, newEmail] }))
        
      }
      const handleModalClose = () => {
          setIsModalOpen(false);
          setIsEditModalOpen(false)
      };

      const handleAddVendor = () => {
          setNewVendor(initialVendor)
          setIsModalOpen(true);
      };

    
      function handleAddPhoneNumber(newTelephoneNumber: string) {
        if(newTelephoneNumber) {
            setNewVendor((prevVendor) => ({
                ...prevVendor,
                vendorTelephone: [...prevVendor.vendorTelephone, newTelephoneNumber]
            }));
            setCurrentPhoneNumber("")
            
        }
        
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

      const handleSaveVendor = async (vendor: Vendor) => {

        if (!vendor.vendorAddress || !vendor.vendorCity || !vendor.vendorPDVNumber || !vendor.vendorIdentificationNumber || (vendor.vendorTelephone.length==0) || (vendor.vendorEmail.length==0) || (vendor.vendorTransactionNumber.length==0)) {
          toast.error("Fields can't be empty");
          console.log('newVendor',newVendor)
          console.log('vendor',vendor)
          return;
      }

        if(vendorData.map(vendorItem=>vendorItem.vendorName.toLowerCase()).includes(vendor.vendorName)){
          toast.error("Vendor with that name already exists")
          return
        }
          try {
              await axiosInstance.post('/api/vendors', newVendor, {
                  headers: { Authorization: localStorage.getItem('token') }
              });
              fetchVendors(setVendorData);
              console.log('await new vendor',newVendor)
          } catch (error) {
              console.error('Error saving vendor:', error);
          }
          setNewVendor(initialVendor);
          setCurrentEmailValue('')
          setCurrentPhoneNumber('')
          setCurrentTransactionNumber('')
          setIsModalOpen(!isModalOpen)
      };

      const handleEditVendor =  (vendor: Vendor) => {
        setNewVendor({
          ...initialVendor, // Start with default values
          ...vendor // Override with actual vendor values
      });
        setIsEditModalOpen(true)
      }

    

      const handleUpdateVendor = async (vendor: Vendor) => {
        if (!vendor.vendorAddress || !vendor.vendorCity || !vendor.vendorPDVNumber || !vendor.vendorIdentificationNumber || (vendor.vendorTelephone.length==0) || (vendor.vendorEmail.length==0) || (vendor.vendorTransactionNumber.length==0)) {
        toast.error("Fields can't be empty");
          return;
        }

        if(vendorData.map(vendorItem=>vendorItem.vendorName.toLowerCase()).includes(vendor.vendorName)){
          if(newVendor.vendorId!==vendor.vendorId){
            toast.error("Vendor with that name already exists")
            return
          }
         
        }
      
        try {
          await axiosInstance.put(`/api/vendors`, vendor, {
            headers: { Authorization: localStorage.getItem('token') }
          });
      
          // Update the local vendor data
          setVendorData(prevVendors => {
            return prevVendors.map(v => (v.vendorId === vendor.vendorId ? vendor : v));
          });
      
          toast.success("Vendor updated successfully");
      
          // Reset the modal state
          setIsEditModalOpen(false);
          setNewVendor(initialVendor);
          setCurrentEmailValue('');
          setCurrentPhoneNumber('');
          setCurrentTransactionNumber('');
        } catch (error) {
          console.error('Error updating vendor:', error);
          toast.error("Failed to update vendor");
        }
      };
      
      

      const config: Columns<Vendor>[] = [
          {   
              getHeader: () => 'Settings',
              getValue: (vendor: Vendor) =><> {deleteFlag? <div style={{width:'50px',height:"20px"}}>
                <Button size='small' onClick={()=>{handleDeleteVendor(vendor)}}><DeleteIcon sx={{color:'#A82B24'}}/>
                </Button></div>:<div style={{width:'50px',height:"20px"}}>
                  <Button size='small' onClick={()=>{handleEditVendor(vendor)}}>
              <EditIcon sx={{color:'#32675B'}}/>
          </Button></div>}</>
          },
        
          { 
              getHeader: () => 'Name', 
              getValue: (Vendor: Vendor) => Vendor.vendorName
          },
          {
              getHeader:()=>'Transaction number',
              getValue:(Vendor:Vendor)=>Vendor.vendorTransactionNumber[0]},
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
                          <Button variant="contained" color="secondary" style={!deleteFlag?{ marginLeft: '10px',backgroundColor:"#32675B"}:{ marginLeft: '10px',backgroundColor:"#A82B24" }} onClick={()=>{setDeleteFlag(!deleteFlag)}}>Delete Vendor</Button>
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
                    {newVendor.vendorTelephone.slice(0, 1).map((item) => (
                      <Chip key={item} tabIndex={-1} label={item} />
                    ))}
                    {newVendor.vendorTelephone.length > 1 && <Chip label={`+${newVendor.vendorTelephone.length - 1}`} />}
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


      <GenericModal isOpen={isEditModalOpen} onClose={handleModalClose} >
      
      <TextField label='Name'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newVendor.vendorName}
          onChange={(e)=>{setNewVendor({...newVendor,vendorName:e.target.value})}}
          ></TextField>

          <TextField label='Address'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newVendor.vendorAddress}
          onChange={(e)=>{setNewVendor({...newVendor,vendorAddress:e.target.value})}}
          ></TextField>
          <TextField label='Identification number'sx={{ backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newVendor.vendorIdentificationNumber}
          onChange={(e)=>{
        
              setNewVendor({...newVendor,vendorIdentificationNumber:e.target.value})}}> Name</TextField>
        
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
                    {newVendor.vendorTelephone.slice(0, 1).map((item) => (
                      <Chip key={item} tabIndex={-1} label={item} />
                    ))}
                    {newVendor.vendorTelephone.length > 1 && <Chip label={`+${newVendor.vendorTelephone.length - 1}`} />}
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

    
              <Button onClick={()=>{
                if(!isEditModalOpen)
                  {handleSaveVendor(newVendor)}
                else {
                  handleUpdateVendor(newVendor)
                }
                
                }}>Submit</Button>

      </GenericModal>
  </Box>   
  }

  export default Vendors