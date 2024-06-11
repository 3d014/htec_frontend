import { Autocomplete, Box, Button, TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {v4 as uuidv4} from 'uuid'
import GenericModal from "../../components/modal/genericModal";

import Vendor from "../../models/vendors";
import Invoice from "../../models/invoice";

import fetchVendors from "../../utils/fetchFunctions/fetchVendors";
import DeleteIcon from '@mui/icons-material/Delete'
import { Product } from "../../models/product";
import fetchProducts from "../../utils/fetchFunctions/fetchProducts";
import axiosInstance from "../../api/axiosInstance";
import GenericTable from "../../components/table/genericTable";
import fetchInvoices from "../../utils/fetchFunctions/fetchInvoices";
import { Columns } from "../../models/columns";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import InvoiceOverview from "../../components/invoiceOverview/invoiceOverview";

const initialInvoice:Invoice={
    invoiceId:'',
    vendorId:'',
    dateOfIssue:new Date(),
    dateOfPayment:new Date(),
    totalValueWithoutPdv:0,
    totalValueWithPdv:0,
    pdvValue:0,
    invoiceItems:[]
}

const initialInvoiceItem:InvoiceItem={
    invoiceId:'',
    invoiceItemId:uuidv4(),
    priceWithoutPdv:null,
    priceWithPdv:null,
    productCode:'',
    productId:'',
    discount:null,
    sumWithoutPdv:null,
    sumWithPdv:null,
    quantity:1


}



const initialVendor:Vendor={
    vendorId:'',
      vendorName: '',
      vendorAddress: '',
      vendorIdentificationNumber: '',
      vendorPDVNumber: '',
      vendorCity: '',
      vendorTelephone: [],
      vendorEmail: [],
      vendorTransactionNumber: [],
      supportsAvans: false
  }

const Invoices=()=>{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [overviewModalFlag,setoverviewModalFlag]=useState(true)
    const [vendorData,setVendorData]=useState<Vendor[]>([])
    const [selectedVendor,setSelectedVendor]=useState<Vendor>()
    const [deleteFlag,setDeleteFlag]=useState(false)
    const [isInvoiceShown,setIsInvoiceShown]=useState(false)

    const [invoicesData,setInvoicesData]=useState<Invoice[]>([])

    const [selectedInvoice,setSelectedInvoice]=useState<Invoice|null>(null)
    const [newInvoice,setNewInvoice]=useState<Invoice>(initialInvoice)
    const [invoiceItems,setInvoiceItems]=useState<InvoiceItem[]>([])

    const [dateOfIssue, setDateOfIssue] = useState<Dayjs|null>(dayjs());
    const [dateOfPayment, setDateOfPayment] = useState<Dayjs|null>(dayjs());

    const [productsData,setProductsData]=useState<Product[]>([])
    const [stationaryProducts,setStationaryProducts]=useState<Product[]>([]) 
    const [_selectedProducts,_setSelectedProducts]=useState<Product[]>([])
    

    

    const calculateTotals = (items: InvoiceItem[]) => {
        let totalWithoutPdv = 0;
        let totalWithPdv = 0;
        let pdvValue = 0;
        
        items.forEach(item => {
            if (item.priceWithoutPdv !== null && item.quantity !== null && item.priceWithPdv !== null) {
                const itemTotalWithoutPdv = item.priceWithoutPdv * item.quantity;
                const itemTotalWithPdv = item.priceWithPdv * item.quantity;
                totalWithoutPdv += itemTotalWithoutPdv;
                totalWithPdv += itemTotalWithPdv;
            }
        });
        pdvValue = totalWithPdv - totalWithoutPdv;
    
        setNewInvoice(prevInvoice => ({
          ...prevInvoice,
          TotalValueWithoutPdv: totalWithoutPdv,
          TotalValueWithPdv: totalWithPdv,
          pdvValue: pdvValue
        }));
      };

    const handleAddNewInvoice=()=>{
        setIsModalOpen(!isModalOpen)
        
    }


    const handleModalClose = () => {
        setIsModalOpen(false);
        setProductsData(stationaryProducts)
    };
 
    const handleSelectedVendor=(vendor:Vendor)=>{
        setSelectedVendor(vendor)
        setNewInvoice((prevInvoice)=>({
            ...prevInvoice,vendorId:vendor.vendorId})
        )
       
    }

    const handleAddInvoiceItem = () => {
        setInvoiceItems(prevItems => {
            const newItem: InvoiceItem = {
                ...initialInvoiceItem,
                invoiceItemId: uuidv4() // Generate UUID when adding a new item
            };
            return [...prevItems, newItem];
        });
    };

    const handleProductChange=(selectedProduct:Product,invoiceItemId:string)=>{
        const updatedInvoiceItems = invoiceItems.map(item=>{
            if(item.invoiceItemId!==invoiceItemId){return item}
            else{
                return {...item,productId:selectedProduct.productId||''}
            }
        })
        
        const selectedProductsIds=updatedInvoiceItems.map(item=>{
            return item.productId
        })
        const notPickedProducts = stationaryProducts.filter(product => {
            return !selectedProductsIds.includes(product.productId ?? "");
        });
        
        setInvoiceItems(updatedInvoiceItems)
        setProductsData(notPickedProducts)
        calculateTotals(updatedInvoiceItems)
    }

    
const handlePriceWithoutPdvChange = (value: number, index: number) => {
    setInvoiceItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[index] = { ...updatedItems[index], priceWithoutPdv: value,priceWithPdv:value+value*0.17 };
        calculateTotals(updatedItems);
        return updatedItems;
    });
};

    const handleProductCodeChange = (value: string, index: number) => {
        setInvoiceItems(prevItems => {
            const updatedItems = [...prevItems]
            updatedItems[index] = { ...updatedItems[index], productCode: value }
            calculateTotals(updatedItems)
            return updatedItems
        });

    };

    const handleQuantityChange = (value: number, index: number) => {
        setInvoiceItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = { ...updatedItems[index], quantity: value };
            calculateTotals(updatedItems);
            return updatedItems;
        });
    };
    const handleDiscountChange = (value: number, index: number) => {
        setInvoiceItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = { ...updatedItems[index], discount: value };
            calculateTotals(updatedItems);
            return updatedItems;
        });
    };
    const handleDeleteInvoice=async (invoice:Invoice)=>{
        const {invoiceId}=invoice
        if (invoiceId){
            await axiosInstance.delete('/api/invoices',{headers:{Authorization:localStorage.getItem('token')},data:{invoiceId}})
            const filteredInvoices:Invoice[]=invoicesData.filter(item=>invoice.invoiceId!==item.invoiceId)
            setInvoicesData(filteredInvoices)
            setDeleteFlag(!deleteFlag)
            setoverviewModalFlag(true)
        }
        
    }
    const handleRemoveInvoiceItem = (itemToRemove: InvoiceItem) => {

        const updatedInvoiceItems = invoiceItems.filter(item => item.invoiceItemId !== itemToRemove.invoiceItemId);
      setInvoiceItems(updatedInvoiceItems)

        // setProductsData(prevProducts=>{
        //     let productToAdd=stationaryProducts.find(product=>product.productId===itemToRemove.productId)
        //     if (productToAdd){
        //         let updatedProducts=[...prevProducts,productToAdd]
        //     return updatedProducts
        //     } else {
        //         return prevProducts
        //     }
            
        // })

        const selectedProductsIds=updatedInvoiceItems.map(item=>{
            return item.productId
        })
        const notPickedProducts = stationaryProducts.filter(product => {
            return !selectedProductsIds.includes(product.productId ?? "");
        });

        setProductsData(notPickedProducts)

        calculateTotals(updatedInvoiceItems);
    };

    const handleSubmit =async () => {

        
       
        if (!selectedVendor) {
            toast("Please select a vendor");
            return;
        }

        if(invoiceItems.length==0){
            toast('Please, add invoice items')
            return
        }

        const emptyFields = invoiceItems.some(item =>
            !item.productId ||
            item.productCode.trim() === '' ||
            item.priceWithoutPdv==null ||
            item.quantity==null ||
            item.discount==null
        );
        

        if (emptyFields) {
            toast("Please fill in all fields for invoice items");
            return;
        }

        const quantityValidator=invoiceItems.some(item=>{
            if(item.quantity!=null){
                if(item.quantity<1){
                    return true
                }
            }
        }
        )

        if(quantityValidator){
            toast("Quantity must be 1 or more ")
            return
        }

       

        try {
            const newInvoiceId=uuidv4()
      const updatedInvoice: Invoice = {
        vendorId: selectedVendor.vendorId,
        invoiceId: newInvoiceId,
        dateOfIssue:dateOfIssue?dateOfIssue.toDate():new Date() ,
        dateOfPayment:dateOfPayment?dateOfPayment.toDate():new Date(),
        totalValueWithoutPdv: newInvoice.totalValueWithoutPdv   ,
        totalValueWithPdv: newInvoice.totalValueWithPdv,
        pdvValue: newInvoice.pdvValue,
        invoiceItems: invoiceItems.map(item=>({
            ...item,
            invoiceId:newInvoiceId,
            sumWithoutPdv:item.priceWithoutPdv !== null ? item.priceWithoutPdv * (item.quantity || 0) : null,
            sumWithPdv:item.priceWithPdv !== null ? item.priceWithPdv * (item.quantity || 0) : null
        }))
      };

      await axiosInstance.post('/api/invoices', updatedInvoice, {
        headers: { Authorization: localStorage.getItem('token') }
      });

      // Resetting state after successful submission
      setSelectedVendor(initialVendor);
      setInvoiceItems([]);
      setDateOfIssue(dayjs())
      setDateOfPayment(dayjs())
      setIsModalOpen(false);
      fetchInvoices(setInvoicesData)
      setNewInvoice(initialInvoice)
      setProductsData(stationaryProducts)

    } catch (error) {
      console.error("Error submitting invoice:", error);
    }


    }
    const handleInvoiceOverviewClose=()=>{
        setIsInvoiceShown(false)
        setSelectedInvoice(null)
    }


    const  handleShowInvoice=(invoice:Invoice)=>{
        setIsInvoiceShown(true)
        setSelectedInvoice(invoice)


    }

    useEffect(()=>{
        fetchVendors(setVendorData)
        fetchProducts(setProductsData)
        fetchInvoices(setInvoicesData)
        fetchProducts(setStationaryProducts)
    },[])



    const config: Columns<Invoice>[] = [
        {
            getHeader:() => 'Settings',
            getValue: (invoice: Invoice) =>
                <>
                {
                overviewModalFlag?
                (
                    <div style={{width:'50px',height:"20px"}}>
                        <Button size='small' variant="outlined" style={{color:'white',backgroundColor:'#32675B'}} onClick={()=>{handleShowInvoice(invoice)}}>
                       Show
                        </Button>
                    </div>
            )

                :(deleteFlag? 
                    <div style={{width:'50px',height:"20px"}}>
                        <Button size='small' onClick={()=>{handleDeleteInvoice(invoice)}}>
                            <DeleteIcon sx={{color:'#A82B24'}}/>
                        </Button>
                    </div>
                    : <div style={{width:'50px',height:"20px"}}>
                        </div>)
                }
                
                 {/* {
                    deleteFlag? 
                    <div style={{width:'50px',height:"20px"}}>
                        <Button size='small' onClick={()=>{handleDeleteInvoice(invoice)}}>
                            <DeleteIcon sx={{color:'red'}}/>
                        </Button>
                    </div>
                    : <div style={{width:'50px',height:"20px"}}>
                        </div>
                } */}
                </>
        },
        
        {
            getHeader:()=>'Invoice id',
            getValue:(invoice:Invoice)=>invoice.invoiceId  
        },
        {
            getHeader:()=>'Vendor name',
            getValue:(invoice:Invoice)=>{
                const vendor=vendorData.filter(vendor=>vendor.vendorId==invoice.vendorId)
                if(vendor.length>0) return vendor[0].vendorName
                
            }
        },
        {
            getHeader:()=>'Date of issue',
            getValue:(invoice:Invoice)=>dayjs(invoice.dateOfIssue).format('DD/MM/YYYY').toString()  
        },

        

    ];

    return <>
    <Box sx={{display:'flex',flexDirection:'column'}}>

        
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <h1>Invoices</h1>
        </Box>

        <Box sx={{display:'flex',alignItems:'flex-end',justifyContent:'center',margin:'20px',flexDirection:'column',gap:'10px'}}>
        
        <Button sx={{width:'200px'}} variant={'contained'} onClick={handleAddNewInvoice} >Add new invoice</Button>
        
        </Box>

        {selectedInvoice && <InvoiceOverview isOpen={isInvoiceShown} onClose={handleInvoiceOverviewClose} invoice={selectedInvoice}
        vendors={vendorData}
        products={productsData} />}
     
        
        <GenericModal isOpen={isModalOpen} onClose={handleModalClose}>
            <Box sx={{display:'flex',flexDirection:'column'}}>
                <Autocomplete options={vendorData||null} getOptionLabel={(option)=>option.vendorName}
                    value={selectedVendor||null} 
                    renderInput={(params) => <TextField {...params} label="Vendor" />}
                    onChange={(_e,newValue)=>{
                        if(newValue) handleSelectedVendor(newValue)

                    }}
                    sx={{margin:'5px', backgroundColor:'white'}}

                ></Autocomplete> 

                <Box sx={{width:'100%', display:'flex',justifyContent:'space-between'}}> 
                <DatePicker 
                    label='Date of issue' 
                    value={dateOfIssue}
                    onChange={(newValue) => setDateOfIssue(newValue)} 
                    sx={{backgroundColor:'white',marginTop:'5px'}}
                />
                <DatePicker 
                    
                    label='Date of payment' 
                    value={dateOfPayment}
                    onChange={(newValue) => setDateOfPayment(newValue)} 
                    sx={{backgroundColor:'white',marginTop:'5px'}}
                />
                </Box>
                <Box sx={{width:'100%', display:'flex',justifyContent:'space-between'}}>
                    <TextField label='Total value without PDV' placeholder="Total value without PDV" value={newInvoice.totalValueWithoutPdv} InputProps={{
            readOnly: true,
          }} sx={{marginTop:'10px',backgroundColor:'white'}}></TextField>
                    <TextField label='Total value with PDV' placeholder="Total value with PDV" value={newInvoice.totalValueWithPdv} InputProps={{
            readOnly: true,
          }} sx={{marginTop:'10px',backgroundColor:'white'}}></TextField>
                
                </Box>
                <Button sx={{alignSelf:'flex-end',margin:'10px',fontSize:'12px',fontWeight:'bold'}} variant="contained" onClick={()=>{handleAddInvoiceItem()}}>Add new Invoice item</Button>
               
                {invoiceItems.map((item,index)=>{
                    return <Box key={item.invoiceItemId} sx={{margin:'5px',display:'flex',flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',gap:'10px',border:'1px solid grey',borderRadius:'10px',padding:'5px'}}>
                    <Autocomplete key={`${item.invoiceItemId}-product`} options={productsData} 
                        renderInput={(params)=><TextField {...params} label='Product'></TextField>}
                        getOptionLabel={(option)=>option.productName}
                        onChange={(_e,newValue)=>{
                            if(newValue) handleProductChange(newValue,item.invoiceItemId)}
                        }

                        sx={{backgroundColor:'white',marginTop:'10px',fontSize:'12px',width:'200px'}}
                    />
                    

                    <TextField label='Product Code'  
                        onChange={(e) =>handleProductCodeChange(e.target.value, index)}
                        sx={{backgroundColor:'white',marginTop:'10px',fontSize:'12px',width:'150px'}}>
                    </TextField>
                    <TextField label='Price Without PDV' type='number'
                    onKeyDown={(e)=>{
                        if (e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                        }
                    }}
                        onChange={(e) => handlePriceWithoutPdvChange(parseFloat(e.target.value), index)} 
                        sx={{backgroundColor:'white',marginTop:'10px',width:'150px'}}>
                        </TextField>
                    <TextField label='Quantity' type='number' 
                    onKeyDown={(e)=>{
                        if (e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                        }
                    }}
                        onChange={(e) => handleQuantityChange(parseFloat(e.target.value), index)} 
                        sx={{backgroundColor:'white',marginTop:'10px',width:'150px'}}> 
                    </TextField>
                    <TextField label='Discount' type='number' 
                    onKeyDown={(e)=>{
                        if (e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                        }
                    }}
                        onChange={(e) => {
                            
                            handleDiscountChange(parseFloat(e.target.value), index)}
                        } 
                        sx={{backgroundColor:'white',marginTop:'10px',width:'150px'}}>  
                    </TextField>
                    <Box sx={{flexGrow:'4',display:'flex',justifyContent:'flex-end',paddingRight:'30px'}}>
                        <Button variant="contained" sx={{backgroundColor:'red',borderRadius:'100px'}}
                        onClick={()=>{handleRemoveInvoiceItem(item)}}>X</Button>
                    </Box>
                  
                    </Box>
            })}
            </Box>
             
            

           
            
            <Button onClick={handleSubmit}>Submit</Button>
        </GenericModal>  

   

        <Box sx={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Box sx={{width:'80%'}} >
            {<GenericTable config={config} data={invoicesData}></GenericTable>}

            <Box sx={{  marginTop: '20px' }}>
            <Button variant="contained" color="secondary" style={deleteFlag?{marginLeft: '10px',backgroundColor:"#A82B24"}:{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={()=>{
                setoverviewModalFlag(!overviewModalFlag)
                setDeleteFlag(!deleteFlag)}}>Delete Invoice</Button>
        </Box>

        </Box>
        </Box>
        
    </Box>
    </>
}


export default Invoices