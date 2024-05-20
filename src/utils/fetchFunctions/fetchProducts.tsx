import axiosInstance from "../../api/axiosInstance";
import { Product } from "../../models/product";

const fetchProductsData = async (productsStateSetter:React.Dispatch<React.SetStateAction<Product[]>>) => {
    try {
        const response = await axiosInstance.get('/api/products',{headers:{Authorization:localStorage.getItem('token')}})
        
        const data: Product[] = response.data;
        
        productsStateSetter(data);
       
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export default fetchProductsData