import { Box, Dialog } from "@mui/material"
import Invoice from "../../models/invoice"

import dayjs from "dayjs";
import Vendor from "../../models/vendors";
import { Product } from "../../models/product";
import { useEffect, useState } from "react";
import fetchInvoiceWithItems from "../../utils/fetchFunctions/fetchInvoiceWithItems";
import { Columns } from "../../models/columns";
import GenericTable from "../table/genericTable";


interface InvoiceOverviewProps {
    invoice: Invoice,
    isOpen:boolean,
    onClose:()=>void,
    vendors:Vendor[],
    products:Product[]
}


const InvoiceOverview=({ invoice ,isOpen,onClose,vendors,products }: InvoiceOverviewProps)=>{
    const[InvoiceWithItems,setInvoiceWithItems]=useState<Invoice>(invoice)
    const selectedVendor = vendors.find(vendor => vendor.vendorId === invoice.vendorId);

    useEffect(() => {
        console.log(invoice)
        fetchInvoiceWithItems(setInvoiceWithItems,InvoiceWithItems.invoiceId)
    
    }, []);
    








    const config:Columns<InvoiceItem>[]=[
        {
            getHeader:()=>'Product Code',
            getValue:(item:InvoiceItem)=>{
              
                return <span style={{textAlign:'right'}}>{item.productCode}</span>}
        },
        {
            getHeader:()=>'Name',
            getValue:(item:InvoiceItem)=>{
               const product= products.find((product)=>product.productId==item.productId)
                return <span style={{textAlign:'right'}}>{product&& product.productName}</span>}
        },{
            getHeader:()=>'Measuring unit',
            getValue:(item:InvoiceItem)=>{
                const product= products.find((product)=>product.productId==item.productId)
                return <span style={{textAlign:'right'}}>{product&&product.measuringUnit}</span>}
        },{
            getHeader:()=>'Quantity',
            getValue:(item:InvoiceItem)=>{
              
                return <span style={{textAlign:'right'}}>{item.quantity}</span>}
        },{
            getHeader:()=>'Price (KM)',
            getValue:(item:InvoiceItem)=>{
              
                return <span style={{textAlign:'right'}}>{item.priceWithPdv}</span>}
        },{
            getHeader:()=>'Discount (%)',
            getValue:(item:InvoiceItem)=>{
              
                return <span style={{textAlign:'right'}}>{item.discount}</span>}
        },{
            getHeader:()=>'Price without PDV',
            getValue:(item:InvoiceItem)=>{
              
                return <span style={{textAlign:'right'}}>{item.priceWithoutPdv}</span>}
        },
        {
            getHeader:()=>'Total (KM)',
            getValue:(item:InvoiceItem)=>{
              
                return <span style={{textAlign:'right'}}>{item.sumWithPdv}</span>}
        },

    ]
    return(
        <>

        <Dialog open={isOpen} onClose={onClose}  maxWidth='xl'>
        <Box sx={{backgroundColor:'white', display:'flex',padding:'20px',gap:'10px',flexDirection:'column'}}>
        <div style={{fontSize:'30px',fontWeight:'bold'}}>{selectedVendor&& selectedVendor.vendorName}</div>
        {selectedVendor ? (
                        <Box>
                            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                <Box>
                                    
                                    <div>{selectedVendor.vendorAddress}, {selectedVendor.vendorCity}</div>
                                    <div>Ident.broj - {selectedVendor.vendorIdentificationNumber}</div>
                                </Box>
                                <Box>
                                    
                                    {selectedVendor.vendorTransactionNumber.map((transaction, index) => (
                                        <div key={index}>TRN : {transaction}</div>
                                    ))}
                                    <div>Pdv number:{selectedVendor.vendorPDVNumber}</div>
                                </Box>
                            </Box>
                            <Box sx={{display:'flex',justifyContent:'space-between',marginTop:'10px'}}>
                                <Box>
                                {selectedVendor.vendorTelephone.map((number,index)=>{
                                 return   <div key={`${index}+telephone`}>Telephone: {number}</div>
                                })}
                                </Box>

                                <Box>
                                {selectedVendor.vendorEmail.map((mail,index)=>{
                                 return   <div key={`${index}+mail`}>Mail: {mail}</div>
                                })}
                                </Box>
                            </Box>

                        </Box>
                    ) : (
                        <Box>No vendor details available</Box>
                    )}
           
           
           <div style={{width:'100%',border:'1px solid'}}></div>
           
            <Box sx={{display:'flex', justifyContent:'space-between',gap:'100px'}}>
            <Box>
            <div>Date of Issue : <span>{dayjs(invoice.dateOfIssue).format('DD.MM.YYYY')}</span> </div>
            <div>Date of payment : <span>{dayjs(invoice.dateOfPayment).format('DD.MM.YYYY')}</span> </div>
            </Box>
            <Box>
                <div style={{fontSize:'24px'}}>HTEC doo Sarajevo</div>
                <div>Address: Maglajska br.1, Sarajevo</div>
                <div>Ptt:71000</div>
                <div>ID num: 4201597400004</div>
                <div>PDV num: 201597400004</div>
            </Box>

           </Box>
           <div style={{width:'100%',border:'1px solid'}}></div>

           <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {InvoiceWithItems.invoiceItems&& <GenericTable config={config} data={InvoiceWithItems.invoiceItems}></GenericTable>}
                    </Box>
                    
            <Box sx={{display:'flex', alignItems:'flex-end',flexDirection:'column'}}>
                <div>Total without PDV: {`${invoice.totalValueWithoutPdv}`}</div>
                <div>PDV Value: {`${invoice.pdvValue}`}</div>
                <div>Total with PDV: {`${invoice.totalValueWithPdv}`}</div>
            </Box>
            
        

        </Box>
        
        </Dialog>

        </>
    )
}

export default InvoiceOverview