import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import ProductTable from '../../components/productsTable/productsTable';
import { Box, Button, useMediaQuery } from '@mui/material';
import styles from './products.styles';
import AddProductModal from './components/addProductModal/addProductModal';



interface Product {
    id: number;
    name: string;
    cijena: number;
}

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const isMatch= useMediaQuery('(min-width:600px)')
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/api/products');
                const data: Product[] = response.data;
                setProducts(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleAddProduct = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSaveProduct = (name: string, price: string, description: string) => {
        // Implement logic to save the product
        console.log('Saving product:', { name, price, description });
        // For demo purposes, just closing the modal
        setIsModalOpen(false);
    };


    return (<Box sx={isMatch?styles.largerScreen.body:styles.smallerScreen.body}>
        <Box sx={isMatch?styles.largerScreen.proizvodi:styles.smallerScreen.proizvodi}> Proizvodi </Box>
        <Box sx={{width:'100%', display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <ProductTable products={products} />
           
           
           
           
            <Box sx={{  marginTop: '20px' }}>
                    <Button variant="contained"  style={{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={handleAddProduct}>Add Product</Button>
                    <Button variant="contained" color="secondary" style={{ marginLeft: '10px',backgroundColor:"#32675B" }}>Delete Product</Button>
                </Box>
        </Box>
      
        <AddProductModal isOpen={isModalOpen} onClose={handleModalClose} onSave={handleSaveProduct} />
        
        </Box>
    );
}

export default Products;
