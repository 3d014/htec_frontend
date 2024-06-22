import axiosInstance from "../../api/axiosInstance";
import { Product,ProductSumMap } from "../../models/product";

const fetchProductSum = async (productsStateSetter:React.Dispatch<React.SetStateAction<ProductSumMap>>) => {
    try {
        const response = await axiosInstance.get('/api/invoices/invoice/productSum',{headers:{Authorization:localStorage.getItem('token')}})
        
        const data: ProductSumMap = response.data;
        
        productsStateSetter(data);
       
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export default fetchProductSum