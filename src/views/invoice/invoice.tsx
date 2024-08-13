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
import InvoiceUploader from "./invoiceUploader/invoiceUploader";

const initialInvoice:Invoice={
    invoiceId:'',
    vendorId:'',
    invoiceNumber:'',
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
    const [scanInvoiceFlag,setScanInvoiceFlag]=useState(false)

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

        items.forEach(item => {
            if (item.priceWithoutPdv != null && item.quantity != null && item.priceWithPdv != null) {
                const itemTotalWithoutPdv = item.priceWithoutPdv * item.quantity;
                const itemTotalWithPdv = item.priceWithPdv * item.quantity;
                totalWithoutPdv += itemTotalWithoutPdv;
                totalWithPdv += itemTotalWithPdv;
            }
        });
    
        const pdvValue = totalWithPdv - totalWithoutPdv;
    
        setNewInvoice(prevInvoice => ({
            ...prevInvoice,
            totalValueWithoutPdv: totalWithoutPdv,
            totalValueWithPdv: totalWithPdv,
            pdvValue: pdvValue
        }));
    };
    
    
    const handleAddNewInvoice=()=>{
        setIsModalOpen(!isModalOpen)
        
    }


    const handleModalClose = () => {
      // Zatvori modal
      setIsModalOpen(false);
      
      // Ne resetuj invoiceItems i productsData, samo zatvori modal
    };
 
    const handleVendorChange = (vendor:Vendor) => {
      if (!vendor) {
        setInvoiceItems(prevState => ({
          ...prevState,
          vendor: null,
        }));
      } else {
        setInvoiceItems(prevState => ({
          ...prevState,
          vendor: vendor,
        }));
      }
    };
    
    const handleSelectedVendor=(vendor:Vendor)=>{
      setSelectedVendor(vendor);
      setNewInvoice((prevInvoice) => ({
          ...prevInvoice,
          vendorId: vendor ? vendor.vendorId : ''
      }));
       
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

  const handleProductChange = (selectedProduct: Product | null, invoiceItemId: string) => {
    const updatedInvoiceItems = invoiceItems.map(item => {
        if (item.invoiceItemId !== invoiceItemId) {
            return item;
        } else {
            return { ...item, productId: selectedProduct?.productId ?? "" };
        }
    });

    const selectedProductsIds = updatedInvoiceItems.map(item => item.productId);

    const notPickedProducts = stationaryProducts.filter(product => 
        !selectedProductsIds.includes(product.productId ?? "")
    );

    setInvoiceItems(updatedInvoiceItems);
    setProductsData(notPickedProducts);
    calculateTotals(updatedInvoiceItems);

    // Provjera validacije i prikazivanje toast obavijesti
    if (!selectedProduct) {
        toast.error('The product has been removed. Please select a product.');
    }
};


 




    
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
        // Ensure value is at least 1, default to 1 if not provided or invalid
        const newValue = (value > 0) ? value : 1;
    
        setInvoiceItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = { ...updatedItems[index], quantity: newValue };
            calculateTotals(updatedItems); // Recalculate totals with updated quantity
            return updatedItems;
        });
    };
    
    
    
    const handleDiscountChange = (value: number, index: number) => {
        setInvoiceItems(prevItems => {
          const updatedItems = [...prevItems];
          const item = updatedItems[index];
      
          // Check if originalPriceWithPdv is null or undefined and set it to priceWithPdv if necessary
          if (item.originalPriceWithPdv == null && item.priceWithPdv != null) {
            item.originalPriceWithPdv = item.priceWithPdv;
          }
      
          // Calculate the discounted price with PDV, using 0 as a default value if originalPriceWithPdv is null or undefined
          const discountedPriceWithPdv = (item.originalPriceWithPdv ?? 0) * ((100 - value) / 100);
      
          // Update the item with the discount and the new price with PDV
          updatedItems[index] = {
            ...item,
            discount: value,
            priceWithPdv: discountedPriceWithPdv
          };
      
          // Recalculate the totals
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
    
        // Optionally: Reset quantity of remaining items to 1 if needed
        // const updatedItems = updatedInvoiceItems.map(item => ({
        //     ...item,
        //     quantity: item.quantity && item.quantity > 0 ? item.quantity : 1
        // }));
    
        // Update the invoice items and products data
        setInvoiceItems(updatedInvoiceItems);
    
        // Update the products data if necessary
        const selectedProductsIds = updatedInvoiceItems.map(item => item.productId);
        const notPickedProducts = stationaryProducts.filter(product => !selectedProductsIds.includes(product.productId ?? ""));
        setProductsData(notPickedProducts);
    
        calculateTotals(updatedInvoiceItems);
    };
    

    const handleSubmit = async () => {
      const issueDate = dayjs(dateOfIssue);
      const paymentDate = dayjs(dateOfPayment);
  
      // Calculate the difference in days
      const diffInDays = paymentDate.diff(issueDate, 'day');
  
      if (diffInDays < 0) {
          toast('Date of payment cannot be before date of issue');
          return;
      }
  
      if (!selectedVendor) {
          toast("Please select a vendor");
          return;
      }
  
      if (invoiceItems.length === 0) {
          toast('Please, add invoice items');
          return;
      }
  
      if (!newInvoice.invoiceNumber) {
          toast('Please add Invoice Number');
          return;
      }
  
      // Filter out invoice items with empty productId
      const invalidProductItems = invoiceItems.filter(item => !item.productId.trim());
  
      if (invalidProductItems.length > 0) {
          toast("Please select a product for all invoice items");
          return;
      }
  
      const emptyFields = invoiceItems.some(item =>
          !item.productId || 
          item.productCode.trim() === '' ||
          item.priceWithoutPdv == null || Number.isNaN(item.priceWithoutPdv) ||
          item.quantity == null || Number.isNaN(item.quantity) ||
          item.discount == null || Number.isNaN(item.discount)
      );
  
      if (emptyFields) {
          toast("Please fill in all fields for invoice items");
          return;
      }
  
      const quantityValidator = invoiceItems.some(item => item.quantity < 1);
  
      if (quantityValidator) {
          toast("Quantity must be 1 or more");
          return;
      }
  
      try {
          const newInvoiceId = uuidv4();
          const updatedInvoice: Invoice = {
              vendorId: selectedVendor.vendorId,
              invoiceId: newInvoiceId,
              invoiceNumber: newInvoice.invoiceNumber,
              dateOfIssue: dateOfIssue ? dateOfIssue.toDate() : new Date(),
              dateOfPayment: dateOfPayment ? dateOfPayment.toDate() : new Date(),
              totalValueWithoutPdv: newInvoice.totalValueWithoutPdv,
              totalValueWithPdv: newInvoice.totalValueWithPdv,
              pdvValue: newInvoice.pdvValue,
              invoiceItems: invoiceItems
                  .filter(item => item.productId.trim() !== "") // Filter out items with empty productId
                  .map(item => ({
                      ...item,
                      invoiceId: newInvoiceId,
                      sumWithoutPdv: item.priceWithoutPdv !== null ? item.priceWithoutPdv * (item.quantity || 0) : null,
                      sumWithPdv: item.priceWithPdv !== null ? item.priceWithPdv * (item.quantity || 0) : null
                  }))
          };
  
          await axiosInstance.post('/api/invoices', updatedInvoice, {
              headers: { Authorization: localStorage.getItem('token') }
          });
  
          // Reset state after successful submission
          setSelectedVendor(initialVendor);
          setInvoiceItems([]);
          setDateOfIssue(dayjs());
          setDateOfPayment(dayjs());
          setIsModalOpen(false);
          fetchInvoices(setInvoicesData);
          setNewInvoice(initialInvoice);
          setProductsData(stationaryProducts);
  
      } catch (error) {
          console.error("Error submitting invoice:", error);
      }
  };
  
  
  
    const handleInvoiceOverviewClose=()=>{
        setIsInvoiceShown(false)
        setSelectedInvoice(null)
    }


    const  handleShowInvoice=(invoice:Invoice)=>{
        setIsInvoiceShown(true)
        setSelectedInvoice(invoice)


    }
    const handleInvoiceNumberChange=(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        const updatedInvoice={...newInvoice,invoiceNumber:e.target.value}
        setNewInvoice(updatedInvoice)
    }


    const handleScanInvoice=()=>{
        setScanInvoiceFlag(true)
    }
    const handleCloseScanInvoice=()=>{
        setScanInvoiceFlag(false)
        
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
            getHeader:()=>'Invoice Number',
            getValue:(invoice:Invoice)=>invoice.invoiceNumber
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
    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>

        
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <h1>Invoices</h1>
        </Box>

        <Box sx={{display:'flex',margin:'20px',flexDirection:'row',gap:'10px',justifyContent:'space-between',width:'70%'}}>
        
        <Button sx={{width:'200px'}} variant={'contained'} onClick={handleAddNewInvoice} >Add new invoice</Button>
        <Button sx={{width:'200px'}} variant={'contained'} onClick={handleScanInvoice} >Scan new invoice</Button>
        
        </Box>

        {selectedInvoice && <InvoiceOverview isOpen={isInvoiceShown} onClose={handleInvoiceOverviewClose} invoice={selectedInvoice}
        vendors={vendorData}
        products={productsData} />}
     
        {scanInvoiceFlag&&<InvoiceUploader isOpen={scanInvoiceFlag} onClose={handleCloseScanInvoice} ></InvoiceUploader>}
        

        
        <GenericModal isOpen={isModalOpen} onClose={handleModalClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Autocomplete
    options={vendorData || []}
    getOptionLabel={(option) => option.vendorName}
    value={selectedVendor || null}  // Postavi vrijednost na null kada nema izabranog vendora
    renderInput={(params) => <TextField {...params} label="Vendor" />}
    onChange={(_e, newValue) => {
        if (newValue) {
            handleSelectedVendor(newValue);  // Ako postoji novi vendor, postavi ga
        } else {
            // Ako je vendor uklonjen, postavi selectedVendor na undefined
            setSelectedVendor(undefined);
            // Možemo dodati dodatnu logiku ovdje ako je potrebno, ali bez `setFormValues` i `validateForm`
        }
    }}
    sx={{ margin: '5px', backgroundColor: 'white' }}
/>


        <TextField
          label="Invoice Number"
          placeholder="Invoice Number"
          sx={{ margin: '5px', backgroundColor: 'white' }}
          value={newInvoice.invoiceNumber}
          onChange={(e) => handleInvoiceNumberChange(e)}
        />

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <DatePicker
            label="Date of issue"
            value={dateOfIssue}
            maxDate={dayjs()}
            onChange={(newValue) => setDateOfIssue(newValue)}
            sx={{ backgroundColor: 'white', marginTop: '5px' }}
          />
          <DatePicker
            label="Date of payment"
            value={dateOfPayment}
            minDate={dateOfIssue || undefined}
            maxDate={dayjs()}
            onChange={(newValue) => setDateOfPayment(newValue)}
            sx={{ backgroundColor: 'white', marginTop: '5px' }}
          />
        </Box>

        {invoiceItems.map((item, index) => (
          <Box
            key={item.invoiceItemId}
            sx={{
              margin: '5px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid grey',
              borderRadius: '10px',
              padding: '5px',
            }}
          >
            <Autocomplete
              key={`${item.invoiceItemId}-product`}
              options={productsData}
              renderInput={(params) => <TextField {...params} label="Product" />}
              getOptionLabel={(option) => option.productName}
              onChange={(_e, newValue) => {
              handleProductChange(newValue, item.invoiceItemId);
        }}
          sx={{ backgroundColor: 'white', marginTop: '10px', fontSize: '12px', width: '200px' }}
            />

            <TextField
              label="Product Code"
              value={item.productCode || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  handleProductCodeChange(value, index);
                }
              }}
              sx={{ backgroundColor: 'white', marginTop: '10px', fontSize: '12px', width: '150px' }}
            />

            <TextField
              label="Price Without PDV"
              type="number"
              inputProps={{ min: 0 }}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  handlePriceWithoutPdvChange(value, index);
                }
              }}
              sx={{ backgroundColor: 'white', marginTop: '10px', width: '150px' }}
            />
            <TextField
            label="Quantity"
            type="number"
            inputProps={{ min: 1 }}
              onChange={(e) => {
              const value = e.target.value;
                // Ako je polje prazno ili nulti, postavi na 1
               if (value === '' || parseFloat(value) === 0) {
                   handleQuantityChange(1, index);
                } else {
                const numericValue = parseFloat(value);
                if (!isNaN(numericValue)) {
                 handleQuantityChange(Math.max(1, numericValue), index);
      }
    }
  }}
  sx={{ backgroundColor: 'white', marginTop: '10px', width: '150px' }}
/>




            <TextField
              label="Discount (%)"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  value = Math.max(0, Math.min(100, value)); // Clamp value between 0 and 100
                  handleDiscountChange(value, index);
                }
              }}
              sx={{ backgroundColor: 'white', marginTop: '10px', width: '150px' }}
            />

            <Box sx={{ flexGrow: '4', display: 'flex', justifyContent: 'flex-end', paddingRight: '30px' }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'red', borderRadius: '100px' }}
                onClick={() => {
                  handleRemoveInvoiceItem(item);
                }}
              >
                X
              </Button>
            </Box>
          </Box>
        ))}

        <Button
          sx={{ alignSelf: 'flex-end', margin: '10px', fontSize: '12px', fontWeight: 'bold' }}
          variant="contained"
          onClick={() => {
            handleAddInvoiceItem();
          }}
        >
          Add new Invoice item
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <TextField
            label="Total value without PDV (KM)"
            placeholder="Total value without PDV"
            value={newInvoice.totalValueWithoutPdv.toFixed(2)}
            InputProps={{
              readOnly: true,
            }}
            sx={{ marginTop: '10px', backgroundColor: 'white', width: '200px' }}
          />
          <TextField
            label="Total value with PDV (KM)"
            placeholder="Total value with PDV"
            value={newInvoice.totalValueWithPdv.toFixed(2)}
            InputProps={{
              readOnly: true,
            }}
            sx={{ marginTop: '10px', backgroundColor: 'white', width: '200px' }}
          />
        </Box>
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