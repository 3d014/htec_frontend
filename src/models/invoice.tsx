interface Invoice{
   invoiceId:string,
   vendorId:string,
   invoiceNumber:string,
   dateOfIssue:Date,
   dateOfPayment:Date,
   totalValueWithoutPdv:Number,
   totalValueWithPdv:Number,
   pdvValue:Number,
   invoiceItems:InvoiceItem[]
}

export default Invoice