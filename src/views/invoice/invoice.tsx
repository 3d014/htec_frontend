import { Autocomplete, Box, Button, TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {v4 as uuidv4} from 'uuid'
import GenericModal from "../../components/modal/genericModal";

import Vendor from "../../models/vendors";
import Invoice from "../../models/invoice";

import fetchVendors from "../../utils/fetchFunctions/fetchVendors";

import { Product } from "../../models/product";
import fetchProducts from "../../utils/fetchFunctions/fetchProducts";
import axiosInstance from "../../api/axiosInstance";
import GenericTable from "../../components/table/genericTable";
import fetchInvoices from "../../utils/fetchFunctions/fetchInvoices";
import { Columns } from "../../models/columns";
import dayjs, { Dayjs } from "dayjs";

const initialInvoice:Invoice={
    invoiceId:'',
    vendorId:'',
    dateOfIssue:new Date(),
    dateOfPayment:new Date(),
    TotalValueWithoutPdv:0,
    TotalValueWithPdv:0,
    pdvValue:0,
    invoiceItems:[]
}

const initialInvoiceItem:InvoiceItem={
    invoiceId:'',
    invoiceItemId:'',
    priceWithoutPdv:0,
    priceWithPdv:0,
    productCode:'',
    productId:'',
    discount:0,
    sumWithoutPdv:0,
    sumWithPdv:0,
    quantity:0


}


const initialProduct:Product={ 
    categoryId:'',
    productName:'',
    productId:'',
    measuringUnit:''
}

const initialVendor:Vendor={
    vendorId:'',
      vendorName: '',
      vendorAddress: '',
      vendorIdentificationNumber: '',
      vendorCategoryId:'',
      vendorPDVNumber: '',
      vendorCity: '',
      vendorTelephoneNumber: [],
      vendorEmail: [],
      vendorTransactionNumber: []
  }

const Invoices=()=>{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vendorData,setVendorData]=useState<Vendor[]>([])
    const [selectedVendor,setSelectedVendor]=useState<Vendor>()


    const [invoicesData,setInvoicesData]=useState<Invoice[]>([])

    const [newInvoice,setNewInvoice]=useState<Invoice>(initialInvoice)
    const [invoiceItems,setInvoiceItems]=useState<InvoiceItem[]>([])

     const [dateOfIssue, setDateOfIssue] = useState<Dayjs|null>(dayjs());
    const [dateOfPayment, setDateOfPayment] = useState<Dayjs|null>(dayjs());

    const [productsData,setProductsData]=useState<Product[]>([])

    const calculateTotals = (items: InvoiceItem[]) => {
        let totalWithoutPdv = 0;
        let totalWithPdv = 0;
        let pdvValue = 0;
        
        items.forEach(item => {
          const itemTotalWithoutPdv = item.priceWithoutPdv * item.quantity;
          const itemTotalWithPdv = item.priceWithPdv * item.quantity;
          totalWithoutPdv += itemTotalWithoutPdv 
          totalWithPdv += itemTotalWithPdv 
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
    };

    const handleSelectedVendor=(vendor:Vendor)=>{
        setSelectedVendor(vendor)
        setNewInvoice((prevInvoice)=>({
            ...prevInvoice,vendorId:vendor.vendorId})
        )
       
    }

    const handleAddInvoiceItem=()=>{
        let newInvoiceItem:InvoiceItem={ invoiceId:'',
        invoiceItemId:uuidv4(),
        priceWithoutPdv:0,
        priceWithPdv:0,
        productCode:'',
        productId:'',
        discount:0,
        sumWithoutPdv:0,
        sumWithPdv:0,
        quantity:0}
        setInvoiceItems(prevItems=>{return [...prevItems,newInvoiceItem]})
    }

    const handleProductChange=(product:Product,index:number)=>{
        setInvoiceItems(prevItems=>{
            const updatedItems=[...prevItems]
            updatedItems[index]={...updatedItems[index],productId:product.productId||''}
            calculateTotals(updatedItems);
            return updatedItems
        })
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
            const updatedItems = [...prevItems];
            updatedItems[index] = { ...updatedItems[index], productCode: value };
            calculateTotals(updatedItems);
            return updatedItems;
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

    const handleSubmit =async () => {

        
       
        if (!selectedVendor) {
            alert("Please select a vendor");
            return;
        }

      
        const emptyFields = invoiceItems.some(
            (item) =>
                !item.productId ||
                !item.priceWithoutPdv ||
                !item.quantity ||
                !item.discount
        );
        if (emptyFields) {
            alert("Please fill in all fields for invoice items");
            return;
        }

       

        try {
            
      const updatedInvoice: Invoice = {
        vendorId: selectedVendor.vendorId,
        invoiceId: '',
        dateOfIssue:dateOfIssue?dateOfIssue.toDate():new Date() ,
        dateOfPayment:dateOfPayment?dateOfPayment.toDate():new Date(),
        TotalValueWithoutPdv: newInvoice.TotalValueWithoutPdv   ,
        TotalValueWithPdv: newInvoice.TotalValueWithPdv,
        pdvValue: newInvoice.pdvValue,
        invoiceItems: invoiceItems
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

    } catch (error) {
      console.error("Error submitting invoice:", error);
    }


    }

    useEffect(()=>{
        fetchVendors(setVendorData)
        fetchProducts(setProductsData)
        fetchInvoices(setInvoicesData)
    },[])



    const config: Columns<Invoice>[] = [
        
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

        <Box sx={{display:'flex',alignItems:'center',justifyContent:'flex-end',margin:'20px'}}>
        
        <Button variant={'contained'} onClick={handleAddNewInvoice} >Add new invoice</Button>
            
        </Box>
        
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
                    <TextField label='Total value without PDV' placeholder="Total value without PDV" value={newInvoice.TotalValueWithoutPdv} InputProps={{
            readOnly: true,
          }} sx={{marginTop:'10px',backgroundColor:'white'}}></TextField>
                    <TextField label='Total value with PDV' placeholder="Total value with PDV" value={newInvoice.TotalValueWithPdv} InputProps={{
            readOnly: true,
          }} sx={{marginTop:'10px',backgroundColor:'white'}}></TextField>
                
                </Box>
                <Button sx={{alignSelf:'flex-end',margin:'10px',fontSize:'12px',fontWeight:'bold'}} variant="contained" onClick={()=>{handleAddInvoiceItem()}}>Add new Invoice item</Button>
                {invoiceItems.map((_item,index)=>{
                    return <Box key={index} sx={{margin:'5px',display:'flex',flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',gap:'10px',border:'1px solid grey',borderRadius:'10px',padding:'5px'}}>
                    <Autocomplete key={index} options={productsData} 
                        renderInput={(params)=><TextField {...params} label='Product'></TextField>}
                        getOptionLabel={(option)=>option.productName}
                        onChange={(_e,newValue)=>{
                            if(newValue) handleProductChange(newValue,index)}
                        }

                        sx={{backgroundColor:'white',marginTop:'10px',fontSize:'12px',width:'200px'}}
                    />
                    

                    <TextField label='Product Code'  onChange={(e) => handleProductCodeChange(e.target.value, index)} sx={{backgroundColor:'white',marginTop:'10px',fontSize:'12px',width:'150px'}}></TextField>
                    <TextField label='Price Without PDV' type='number' onChange={(e) => handlePriceWithoutPdvChange(parseFloat(e.target.value), index)} sx={{backgroundColor:'white',marginTop:'10px',width:'150px'}}></TextField>
                    <TextField label='Quantity' type='number' onChange={(e) => handleQuantityChange(parseFloat(e.target.value), index)} sx={{backgroundColor:'white',marginTop:'10px',width:'150px'}}></TextField>
                    <TextField label='Discount' type='number' onChange={(e) => handleDiscountChange(parseFloat(e.target.value), index)} sx={{backgroundColor:'white',marginTop:'10px',width:'150px'}}></TextField>
                   
                    </Box>
            })}
            </Box>
             
            

           
            
            <Button onClick={handleSubmit}>Submit</Button>
        </GenericModal>  

        <Box sx={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Box >
            <GenericTable config={config} data={invoicesData}></GenericTable>
            </Box>
        </Box>

       
    </Box>
    </>
}


export default Invoices