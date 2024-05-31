 interface Vendor {
    vendorName:string,
    vendorId:string,
    vendorAddress:string,
    vendorIdentificationNumber:string,
    vendorPDVNumber:string,
    vendorCity:string,
    vendorTelephoneNumber:string[]
    vendorEmail:string[],
    vendorTransactionNumber:string[],
    supportsAvans:boolean
}

export default Vendor