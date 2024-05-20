interface InvoiceItem{
    invoiceItemId:string,
    invoiceId:string,
    productCode:string,
    productId:string,
    quantity:number,
    priceWithoutPdv:number,
    priceWithPdv:number,
    sumWithoutPdv:number,
    sumWithPdv:number,
    discount:number
}