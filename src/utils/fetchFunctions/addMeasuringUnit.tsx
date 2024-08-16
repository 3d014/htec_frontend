import axiosInstance from "../../api/axiosInstance";
import { toast } from 'react-toastify';
import MeasuringUnit from '../../models/measuringUnit';

const addMeasuringUnit = async (measuringUnitName: string,measureId:string): Promise<MeasuringUnit> => {
    try {
        let measuringUnitId=measureId
        const response = await axiosInstance.post('api/measuringUnits', 
            { measuringUnitName,measuringUnitId }, 
            { headers: { Authorization: localStorage.getItem('token') } }
        );

        if (response.data.success) {
            toast.success(`Measuring unit "${measuringUnitName}" added successfully`);
            return {
                measuringUnitId: response.data.measuringUnitId,
                measuringUnitName: response.data.measuringUnitName
            };
        } else {
            throw new Error(response.data.message || 'Failed to add measuring unit');
        }
    } catch (error: any) {
        toast.error(error.message || 'Failed to add measuring unit');
        return { measuringUnitId: '', measuringUnitName: '' }
    }
};

export default addMeasuringUnit;
