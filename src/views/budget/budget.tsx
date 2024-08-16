import { Box, Button, Container, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Vendor from "../../models/vendors";
import fetchVendors from "../../utils/fetchFunctions/fetchVendors";
import fetchBudget from "../../utils/fetchFunctions/fetchBudget";
import Budget from "../../models/budget";
import dayjs from "dayjs";
import GenericModal from "../../components/modal/genericModal";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import fetchBudgetForMonthYear from "../../utils/fetchFunctions/fetchBudgetForMonthYear";
import { Check } from "@mui/icons-material";
import Category from "../../models/category";
import fetchCategories from "../../utils/fetchFunctions/fetchCategories";



const generateMonthNames = (): string[] => {
    const monthsArray: string[] = [];
    for (let i = 0; i < 12; i++) {
        const month = dayjs().month(i).format('MMMM');
        monthsArray.push(month);
    }
    return monthsArray;
};  

const generateYearRange = (startYear: number, endYear: number): number[] => {
    const years: number[] = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }
    return years;
};

let initialBudget: Budget = {
    budgetId: '',
    month: '',
    year: '',
    totalBudget: 0,
    spentBudget: 0
}

const Budgets = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [budget, setBudget] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [months, setMonths] = useState<string[]>(generateMonthNames());
    const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('MMMM'));
    const [years, setYears] = useState<number[]>(generateYearRange(2020, 2030));
    const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
    const [isCurrentDate, setIsCurrentDate] = useState<boolean>(true);
    const [isAddingBudget, setIsAddingBudget] = useState<boolean>(false);
    const [allowedBudgets, setAllowedBudgets] = useState<{ [categoryId: string]: number }>({});
    const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget>(initialBudget);
    const [budgetExists, setBudgetExists] = useState<boolean>(false);
    const [isChangeBudgetOpen, setIsChangeBudgetOpen] = useState<boolean>(false);
    const [newTotalBudget, setNewTotalBudget] = useState<number | string>('');

    useEffect(() => {
        fetchVendors(setVendors);
        fetchBudget(setBudget);
        fetchCategories(setCategories);
    }, []);

    useEffect(() => {
        fetchBudgetForMonthYear(selectedYear, selectedMonth, setSelectedBudget, setBudgetExists);
    }, [selectedMonth, selectedYear]);

    const checkIfCurrentDate = (month: string, year: number) => {
        const currentMonth = dayjs().format('MMMM');
        const currentYear = dayjs().year();
        setIsCurrentDate(month === currentMonth && year === currentYear);
    };

    const handleChangeMonth = (event: SelectChangeEvent<string>) => {
        setSelectedMonth(event.target.value as string);
        checkIfCurrentDate(event.target.value as string, selectedYear);
    };

    const handleChangeYear = (event: SelectChangeEvent<number>) => {
        setSelectedYear(event.target.value as number);
        checkIfCurrentDate(selectedMonth, event.target.value as number);
    };

    const handleSubmitAllowedBudget = async () => {
        try {
            const budgets = Object.keys(allowedBudgets).map(categoryId => ({
                categoryId,
                totalValue: allowedBudgets[categoryId]
            }));
            let budgetData=budgets
            let month=selectedMonth
            let year=selectedYear
            await axiosInstance.post(`/api/budget/`, { budgetData,month,year}, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            setIsConfirmationOpen(false);
            setIsAddingBudget(false);
            fetchBudgetForMonthYear(selectedYear, selectedMonth, setSelectedBudget, setBudgetExists);
        } catch (error) {
            console.error("Error updating budget:", error);
        }
    };
    
    const handleCancelSubmit = () => {
        setIsConfirmationOpen(false);
        setIsAddingBudget(true);
    };
    const handleConfirmSubmit = () => {
        if (Object.values(allowedBudgets).some(value => value <= 0 || isNaN(value))) {
            return toast('Insert allowed budget for all categories');
        }
        setIsAddingBudget(false); // Close the budget modal
        setIsConfirmationOpen(true); // Open the confirmation modal
    };

    
    const handleAllowedBudgetChange = (categoryId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        setAllowedBudgets(prev => ({
            ...prev,
            [categoryId]: value
        }));
    };

    const handleOpenChangeBudget = () => {
        setIsChangeBudgetOpen(true);
    };

    const handleNewTotalBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setNewTotalBudget(value === '' ? '' : parseFloat(value));
    };

    const handleChangeBudget = async () => {
        try {
            await axiosInstance.put(`/api/budget/${selectedYear}/${selectedMonth}`, { totalBudget: newTotalBudget }, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            setIsChangeBudgetOpen(false);
            fetchBudgetForMonthYear(selectedYear, selectedMonth, setSelectedBudget, setBudgetExists);
        } catch (error) {
            console.error("Error changing budget:", error);
        }
    };

    const handleCancelChangeBudget = () => {
        setIsChangeBudgetOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
            <Box sx={{ marginTop: '10px', display: 'flex', flexDirection: 'row', gap: '20px', padding: '20px', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: '20px' }}>
                    <Typography sx={{ backgroundColor: '#32675B', borderRadius: '5px', textAlign: 'center', width: '100px', padding: '20px', color: 'white' }}>MONTH</Typography>
                    <Select
                        value={selectedMonth}
                        onChange={handleChangeMonth}
                        sx={{ width: '200px' }}
                    >
                        {months.map((month, index) => (
                            <MenuItem key={index} value={month}>
                                {month}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: '20px' }}>
                    <Typography sx={{ backgroundColor: '#32675B', borderRadius: '5px', textAlign: 'center', width: '100px', padding: '20px', color: 'white' }}>Year</Typography>
                    <Select
                        value={selectedYear}
                        onChange={handleChangeYear}
                        sx={{ width: '100px' }}
                    >
                        {years.map((year, index) => (
                            <MenuItem key={index} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Button variant="contained" disabled={!isCurrentDate} sx={{ backgroundColor: '#32675B' }} onClick={() => { setIsAddingBudget(true) }}>
                    Add Allowed Budget
                </Button>

                <GenericModal isOpen={isAddingBudget} onClose={() => setIsAddingBudget(false)}>
                    <Typography sx={{ color: 'black', fontSize: '24px', fontWeight: 'bold' }}>
                        {`You are adding allowed budget for ${selectedMonth} / ${selectedYear}`}
                    </Typography>
                    <Typography sx={{ color: 'black', fontStyle: 'italic' }}>
                        Reminder: You can add budget for this month only until the end of the month, after that this option won't be available
                    </Typography>
                        <Box sx={{ marginTop: '20px' }}>
                            {categories.map((category) => (
                        <Box key={category.categoryId} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                             <Typography sx={{ fontWeight: 'bold', flex: '1' }}>{category.categoryName}</Typography>
                                <TextField
                                    sx={{ marginLeft: '10px', flex: '2' ,backgroundColor:'white'}}
                                        margin="normal"
                                        type="number"
                                        value={allowedBudgets[category.categoryId] || ''}
                                        onChange={handleAllowedBudgetChange(category.categoryId)}
                                        onKeyDown={(e) => {
                                     if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                         e.preventDefault();
                        }
                    }}
                />
            </Box>
        ))}
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px' }}>
        <Typography sx={{ width: '150px', backgroundColor: '#32675B', color: 'white', textAlign: 'center', borderRadius: '5px', cursor: 'pointer' }} onClick={handleConfirmSubmit}>
            Submit
        </Typography>
    </Box>
</GenericModal>


                <GenericModal isOpen={isConfirmationOpen} onClose={handleCancelSubmit}>
                    <Typography sx={{ color: 'black', fontSize: '24px', fontWeight: 'bold' }}>
                        Confirm Submission
                    </Typography>
                     <Typography sx={{ color: 'black' }}>
                        Are you sure you want to submit the allowed budget for {selectedMonth} / {selectedYear}?
                     </Typography>
                <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'space-evenly' }}>
                     <Button variant="contained" sx={{ backgroundColor: '#32675B' }} onClick={handleSubmitAllowedBudget}>
                         Yes
                     </Button>
                <Button variant="contained" sx={{ backgroundColor: '#D32F2F' }} onClick={handleCancelSubmit}>
                        No
                </Button>
    </Box>
</GenericModal>

            </Box>

            <Box sx={{ height: '50px', border: '1px solid', display: 'flex', justifyContent: 'space-around', padding: '5px' }}>
                <Box sx={{ display: 'flex' }}>
                    Options to be displayed here
                </Box>
            </Box>
            <Container>
                <Paper sx={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    <Box sx={{ height: '50px' }}>
                        {!isCurrentDate && budgetExists && (
                            <Typography onClick={handleOpenChangeBudget}
                                sx={{ width: '20%', backgroundColor: '#32675B', justifySelf: 'flex-end', borderRadius: '5px', padding: '5px', color: 'white', cursor: 'pointer' }}>
                                Change Total Budget for {selectedBudget.month} / {selectedBudget.year}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '30px', fontWeight: 'bold', borderBottom: '1px solid' }}>
                            Budget for: {selectedMonth} / {selectedYear}
                        </Typography>
                    </Box>
                    <Box sx={{ marginTop: '30px', display: 'flex', justifyContent: 'space-around' }}>
                        <Box>
                            <Typography fontSize={20}>Monthly Budget</Typography>
                            <Typography sx={{}}>{selectedBudget.totalBudget}</Typography>
                        </Box>
                        <Box>
                            <Typography fontSize={20}>Monthly Budget Spent</Typography>
                            <Typography sx={{}}>{selectedBudget.spentBudget}</Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>

            <GenericModal isOpen={isChangeBudgetOpen} onClose={handleCancelChangeBudget}>
                <Typography sx={{ color: 'black', fontSize: '24px', fontWeight: 'bold' }}>
                    Change Total Budget
                </Typography>
                <Typography sx={{ color: 'black' }}>
                    Enter the new total budget for {selectedMonth} / {selectedYear}:
                </Typography>
                <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'space-evenly' }}>
                    <TextField
                        sx={{ justifyContent: 'center', backgroundColor: 'white' }}
                        margin="normal"
                        type="number"
                        onKeyDown={(e) => {
                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                e.preventDefault();
                            }
                        }}
                        value={newTotalBudget}
                        onChange={handleNewTotalBudgetChange}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px' }}>
                    <Typography sx={{ width: '150px', backgroundColor: '#32675B', color: 'white', textAlign: 'center', borderRadius: '5px', cursor: 'pointer' }} onClick={handleChangeBudget}>
                        Submit
                    </Typography>
                </Box>
            </GenericModal>
        </Box>
    );
};

export default Budgets;
