import axiosInstance from "../../api/axiosInstance";
import Budget from "../../models/budget";
import { v4 as uuidv4 } from "uuid";
import dayjs from 'dayjs';
import { toast } from "react-toastify";

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const fetchBudget = async (  
    setterFunction: React.Dispatch<React.SetStateAction<Budget[]>>,
) => {
  try {
    const response = await axiosInstance.get('/api/budget', {  
    headers: { Authorization: localStorage.getItem('token') },
    });
    const budgets: Budget[] = response.data.budget 
      setterFunction(budgets)
      if(response.data.newBudgetCreated){
      return  toast('New monthly budget is created, you should add Allowed budget value for this month as soon as possible. You can change the value until the end of the month ',
        {autoClose:15000}
      )
    }
  } catch (error) {
    console.error('Error fetching or creating budget', error);
  }
}

export default fetchBudget;
