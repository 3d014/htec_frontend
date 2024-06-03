import { Box, Button, TextField, Modal, useMediaQuery, Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './addProductsModal.styles';
import { Product } from '../../models/product';
import { toast } from 'react-toastify';
import Category from '../../models/category';

import fetchCategories from '../../utils/fetchFunctions/fetchCategories';
import fetchProducts from '../../utils/fetchFunctions/fetchProducts';


interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product:Product) => void;
    initialProduct : Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave, initialProduct}) => {
    const [productId, setProductId] = useState<string | undefined>(undefined)
    const [productName, setProductName] = useState('');
    const [productMeasure, setProductMeasure] = useState('');

    const [productsData,setProductsData] = useState<Product[]>([])
    const handleSaveProduct = () => {
      const product:Product={
            productId,
            productName,
            measuringUnit:productMeasure,
            categoryId:selectedCategory?.categoryId}


            if (!product.productName || !product.measuringUnit|| !product.categoryId){
            toast.error("Fields can't be empty")
                return
            }

            if(productsData.map(product => product.productName.toLowerCase()).includes(product.productName.toLowerCase()))
                {
                    toast.error("Product already exists")
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
        fetchProducts(setProductsData)
        fetchCategories(setCategoriesData)
        if (initialProduct) {
            setProductId(initialProduct.productId)
            setProductName(initialProduct.productName)
            setProductMeasure(initialProduct.measuringUnit)
                if(categoriesData[0].categoryId === initialProduct.categoryId) {
                    setSelectedCategory(categoriesData[0])
                } else {
                    setSelectedCategory(categoriesData[1])
                }
        } else {
            setProductId(undefined)
            setProductName('')
            setProductMeasure('')
            setSelectedCategory(null)
        }
    },[initialProduct])
    

    

    const isSmallScreen = useMediaQuery("(max-width:600px)");
    console.log(productName)
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
                    onChange={(_event, newValue) => {
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