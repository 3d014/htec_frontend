import axiosInstance from "../../api/axiosInstance";
import  MeasuringUnit  from "../../models/measuringUnit";

const fetchMeasuringUnits = async (measuringUnitsStateSetter:React.Dispatch<React.SetStateAction<MeasuringUnit[]>>) => {
    try {
        const response = await axiosInstance.get('/api/measuringUnits',{headers:{Authorization:localStorage.getItem('token')}})
        
        const data: MeasuringUnit[] = await response.data;
        
        measuringUnitsStateSetter(data);
       if(true){}
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export default fetchMeasuringUnits