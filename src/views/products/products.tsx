import { useEffect, useState } from 'react';
// import axiosInstance from '../../api/axiosInstance';

import { Box, Button, useMediaQuery } from '@mui/material';
import styles from './products.styles';
import AddProductModal from './components/addProductModal/addProductModal';
import { Columns } from '../../models/columns';
import GenericTable from '../../components/table/genericTable';
import { Product } from '../../models/product';






const config: Columns<Product>[] = [
    {   
        getHeader: () => 'Settings',
        getValue: (_product: Product) => <>Setting</>
    },
    { 
        getHeader: () => 'ID', 
        getValue: (product: Product) => product.id 
    },
    { 
        getHeader: () => 'Name', 
        getValue: (product: Product) => product.name 
    },
    { 
        getHeader: () => 'Mjerna jedinica', 
        getValue: (product: Product) => product.measureUnit
    }
];


const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const isMatch= useMediaQuery('(min-width:600px)')
    const [isModalOpen, setIsModalOpen] = useState(false);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axiosInstance.get('/api/products');
    //             const data: Product[] = response.data;
    //             setProducts(data);
    //             console.log(data)
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    useEffect(()=>{
        setProducts([
            { id: 1, name: 'milka cokolada 300g', measureUnit: 'kom' },
            { id: 2, name: 'coca cola 0.33l', measureUnit: 'kom' },
            { id: 3, name: 'toalet papir violeta 6+2', measureUnit:'paket' }, // dodati get za proizvode umjesto ovog hard codinga
        ])
    },[])

    const handleAddProduct = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSaveProduct = (newProduct:Product) => {
      
        
        setProducts([...products,newProduct])
    
       
    };


    return (<Box sx={isMatch?styles.largerScreen.body:styles.smallerScreen.body}>
        <Box sx={isMatch?styles.largerScreen.proizvodi:styles.smallerScreen.proizvodi}> Proizvodi </Box>
        <Box sx={{width:'100%', display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
       
            {<GenericTable data={products} config={config}/>}  
           
           
           
           
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
