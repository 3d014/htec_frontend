interface InvoiceItem{
    invoiceItemId:string,
    invoiceId:string,
    productCode:string,
    productId:string,
    quantity:number|null,
    priceWithoutPdv:number|null,
    priceWithPdv:number|null,
    sumWithoutPdv:number|null,
    sumWithPdv:number|null,
    discount:number|null
}