import axiosInstance from "../../api/axiosInstance";
import Invoice from "../../models/invoice";

const fetchInvoiceWithItems = async (setterFunction:  React.Dispatch<React.SetStateAction<Invoice>>,invoiceId:string) => {
    try {
        const response = await axiosInstance.get('/api/invoices/invoiceItems', {
            headers: { Authorization: localStorage.getItem('token') },
            params:{invoiceId:invoiceId}
        });
        const data: InvoiceItem[] = response.data;
        setterFunction((prevInvoice)=>{
            const updatedInvoice={...prevInvoice,invoiceItems:data}
            return updatedInvoice
        })
    } catch (error) {
        console.error('Error fetching invoice', error);
    }
}

export default fetchInvoiceWithItems;
