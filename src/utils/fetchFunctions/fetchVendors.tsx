import axiosInstance from "../../api/axiosInstance";
import Vendor from "../../models/vendors";

const fetchVendors = async (vendorStateSetter:React.Dispatch<React.SetStateAction<Vendor[]>>) => {
    try {
        const response = await axiosInstance.get('/api/vendors', {
            headers: { Authorization: localStorage.getItem('token') }
        });
        const data: Vendor[] = response.data;
        vendorStateSetter(data);
    } catch (error) {
        console.error('Error fetching vendors:', error);
    }
};

export default fetchVendors