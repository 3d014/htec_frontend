import axiosInstance from "../../api/axiosInstance";
import Category from "../../models/category";

const fetchCategories = async (setterFunction:  React.Dispatch<React.SetStateAction<Category[]>>) => {
    try {
        const response = await axiosInstance.get('/api/categories', {
            headers: { Authorization: localStorage.getItem('token') }
        });
        const data: Category[] = response.data;
        setterFunction(data)
    } catch (error) {
        console.error('Error fetching categories', error);
    }
}

export default fetchCategories;
