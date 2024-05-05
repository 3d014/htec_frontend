import { useEffect, useState } from 'react'
import { Box, Button, useMediaQuery } from '@mui/material'
import styles from './products.styles'
import AddProductModal from '../../components/genericModal/addProductModal'
import { Columns } from '../../models/columns'
import GenericTable from '../../components/table/genericTable'
import { Product } from '../../models/product'
import axiosInstance from '../../api/axiosInstance'
import DeleteIcon from '@mui/icons-material/Delete'






const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const isMatch= useMediaQuery('(min-width:600px)')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteFlag,setDeleteFlag]=useState(false)

    const config: Columns<Product>[] = [
        {   
            getHeader: () => 'Settings',
            getValue: (product: Product) =><> {deleteFlag? <div style={{width:'50px',height:"20px"}}><Button size='small' onClick={()=>{handleDeleteProduct(product)}}><DeleteIcon sx={{color:'#32675B'}}/></Button></div>:<div style={{width:'50px',height:"20px"}}></div>}</>
        },
       
        { 
            getHeader: () => 'Name', 
            getValue: (product: Product) => product.productName 
        },
        { 
            getHeader: () => 'Unit of measure', 
            getValue: (product: Product) => product.measuringUnit
        },
        { 
            getHeader: () => 'Category', 
            getValue: (_product: Product) => <>refreshments</>
        }
    ];

    const handleDeleteProduct=async (product:Product)=>{
        const {productId}=product
        if (productId){
            await axiosInstance.delete('/api/products',{headers:{Authorization:localStorage.getItem('token')},data:{productId}})
            const filteredProducts:Product[]=products.filter(item=>product.productId!==item.productId)
            setProducts(filteredProducts)
            setDeleteFlag(!deleteFlag)
        }
        
    }
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/api/products',{headers:{Authorization:localStorage.getItem('token')}})
            
            const data: Product[] = response.data;
            console.log('products',data)
            setProducts(data);
           
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {

        fetchData()
        
    }, []);
    const handleAddProduct = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSaveProduct = async (newProduct:Product) => {
      
        

        await axiosInstance.post('/api/products',{...newProduct},{headers:{Authorization:localStorage.getItem('token')}})
        fetchData()
    
       
    };


    return (<Box sx={isMatch?styles.largerScreen.body:styles.smallerScreen.body}>
        <Box sx={isMatch?styles.largerScreen.proizvodi:styles.smallerScreen.proizvodi}> Proizvodi </Box>
        <Box sx={{width:'100%', display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
       
            {<GenericTable data={products} config={config}/>}  
           
           
           
           
            <Box sx={{  marginTop: '20px' }}>
                    <Button variant="contained"  style={{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={handleAddProduct}>Add Product</Button>
                    <Button variant="contained" color="secondary" style={{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={()=>{setDeleteFlag(!deleteFlag)}}>Delete Product</Button>
                </Box>
        </Box>
      
        <AddProductModal isOpen={isModalOpen} onClose={handleModalClose} onSave={handleSaveProduct} />
        
        
        </Box>
    );
}

export default Products;
