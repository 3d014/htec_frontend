import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import Budget from "../../models/budget";

let initialBudget:Budget={
    budgetId:'',
    month:'',
    year:'',
    totalBudget:0,
    spentBudget:0

}
const fetchBudgetForMonthYear = async (
    year: number,
    month: string,
    setterFunction: React.Dispatch<React.SetStateAction<Budget >>
) => {
    try {
        const response = await axiosInstance.get(`/api/budget/${year}/${month}`, {
            headers: { Authorization: localStorage.getItem('token') }
        });

        const budget: Budget = response.data.budget;
        setterFunction(budget);
    } catch (error) {
        setterFunction(initialBudget)
        return toast('Budget for selected period is not available',{
            autoClose:3500
        })
        
    }
};

export default fetchBudgetForMonthYear;