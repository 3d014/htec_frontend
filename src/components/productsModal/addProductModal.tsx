import { Box, Button, TextField, Modal, useMediaQuery, Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './addProductsModal.styles';
import { Product } from '../../models/product';
import { toast } from 'react-toastify';
import Category from '../../models/category';
import axiosInstance from '../../api/axiosInstance';


interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product:Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave }) => {
    const [productName, setProductName] = useState('');
    
    const [productMeasure, setProductMeasure] = useState('');

    const handleSaveProduct = () => {
      
        
      
        const product:Product={

            productName,
            measuringUnit:productMeasure,
        categoryId:selectedCategory?.categoryId}

            if (!product.productName || !product.measuringUnit){

                toast.error('polja ne mogu biti prazna')
                return
            }

        onSave(product);
        setProductName('')
        
        setProductMeasure('')
        onClose();
    };
    const [categoriesData,setCategoriesData]=useState<Category[]>([{
        categoryId:'',
        categoryName:''
    }])
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);


    useEffect(()=>{
        fetchCategories()
    },[])
    

    const fetchCategories=async ()=>{
        try{
            const response=await axiosInstance.get('/api/categories',{
                headers:{Authorization:localStorage.getItem('token')}
            })
            const data:Category[]=response.data
            setCategoriesData(data)
        } catch(error){
            console.error('Error fetching categories',error)
        }
    }

    const isSmallScreen = useMediaQuery("(max-width:600px)");

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={isSmallScreen ? styles.smallerScreen.modal : styles.largerScreen.modal}>
                <TextField
                    sx={isSmallScreen ? styles.smallerScreen.textField : styles.largerScreen.textField}
                    label="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    fullWidth
                />

                
                
                <TextField
                    sx={isSmallScreen ? styles.smallerScreen.textField : styles.largerScreen.textField}
                    label="Mjerna jedinica"
                    value={productMeasure}
                    onChange={(e) => setProductMeasure(e.target.value)}
                    fullWidth
                />

                <Autocomplete sx={{backgroundColor: "white", color: "#32675B", margin: "5px"}}
                    options={categoriesData}
                    value={selectedCategory}
                    onChange={(event, newValue) => {
                        setSelectedCategory(newValue);
                    }}
                    getOptionLabel={(option) => option.categoryName}
                    renderInput={(params) => <TextField {...params} 
                    label="Category" />}></Autocomplete>
                <Button
                    variant="contained"
                    onClick={handleSaveProduct}
                    sx={isSmallScreen ? styles.smallerScreen.button : styles.largerScreen.button}
                >
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

export default AddProductModal;
