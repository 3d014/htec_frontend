import axiosInstance from "../../api/axiosInstance";
import Invoice from "../../models/invoice";

const fetchCategories = async (setterFunction:  React.Dispatch<React.SetStateAction<Invoice[]>>) => {
    try {
        const response = await axiosInstance.get('/api/invoices', {
            headers: { Authorization: localStorage.getItem('token') }
        });
        const data: Invoice[] = response.data;
        setterFunction(data)
    } catch (error) {
        console.error('Error fetching categories', error);
    }
}

export default fetchCategories;
