import { useEffect, useState } from 'react'
import { Box, Button, useMediaQuery } from '@mui/material'
import styles from './products.styles'
import AddProductModal from '../../components/productsModal/addProductModal'
import { Columns } from '../../models/columns'
import GenericTable from '../../components/table/genericTable'
import { Product } from '../../models/product'
import axiosInstance from '../../api/axiosInstance'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit';
import Category from '../../models/category'
import fetchCategories from '../../utils/fetchFunctions/fetchCategories'
import fetchProductsData from '../../utils/fetchFunctions/fetchProducts'

const initialCategory:Category={ categoryId:'',
categoryName:''}




const Products = () => {
    const [productsData, setProductsData] = useState<Product[]>([]);
    const isMatch= useMediaQuery('(min-width:600px)')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteFlag,setDeleteFlag]=useState(false)
    const [initialProduct, setInitialProduct] = useState<Product | null>(null);
    const [categoriesData,setCategoriesData]=useState<Category[]>([initialCategory])
    const [editFlag,setEditFlag]=useState<boolean>(false)
    const config: Columns<Product>[] = [
        {   
            getHeader: () => 'Settings',
            getValue: (product: Product) =>
            <> {deleteFlag? 
            <div style={{width:'50px',height:"20px"}}>
                <Button size='small' onClick={()=>{handleDeleteProduct(product)}}>
                    <DeleteIcon sx={{color:'#A82B24'}}/>
                </Button>
            </div>
            : <div style={{width:'50px',height:"20px"}}>
                <Button size='small' onClick={()=>{handleEditProduct(product)}}>
                    <EditIcon sx={{color:'#32675B'}}/>
                </Button>
                </div>}</>
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
            getValue: (product: Product) => categoriesData.map(category=>{
                if(product.categoryId==category.categoryId) return category.categoryName
            })
        }
    ];

    

    const handleDeleteProduct=async (product:Product)=>{
        const {productId}=product
        if (productId){
            await axiosInstance.delete('/api/products',{headers:{Authorization:localStorage.getItem('token')},data:{productId}})
            const filteredProducts:Product[]=productsData.filter(item=>product.productId!==item.productId)
            setProductsData(filteredProducts)
            setDeleteFlag(!deleteFlag)
        }
        
    }
   
    const handleEditProduct = async (product: Product) => {
        setInitialProduct(product);
        setEditFlag(true)
        setIsModalOpen(true);
    }

 
    useEffect(() => {

        fetchProductsData(setProductsData)
        fetchCategories(setCategoriesData)
        
    }, []);
    const handleAddProduct = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setInitialProduct(null);
    };

    const handleSaveProduct = async (newProduct:Product) => {
        if(initialProduct) {
            await axiosInstance.put('/api/products', {...newProduct}, {headers:{Authorization:localStorage.getItem('token')}})
        } else {
        await axiosInstance.post('/api/products',{...newProduct},{headers:{Authorization:localStorage.getItem('token')}})
        }
        fetchProductsData(setProductsData)
    };


    return (<Box sx={isMatch?styles.largerScreen.body:styles.smallerScreen.body}>
        <Box sx={isMatch?styles.largerScreen.proizvodi:styles.smallerScreen.proizvodi}> Proizvodi </Box>
        <Box sx={{width:'90%',margin:'30px', display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
       
            {<GenericTable data={productsData} config={config}/>}  
           
           
           
           
            <Box sx={{  marginTop: '20px' }}>
                    <Button variant="contained"  style={{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={handleAddProduct}>Add Product</Button>
                    <Button variant="contained" color="secondary" style={deleteFlag?{marginLeft: '10px',backgroundColor:"#A82B24" }:{ marginLeft: '10px',backgroundColor:"#32675B" }} onClick={()=>{setDeleteFlag(!deleteFlag)}}>Delete Product</Button>
                </Box>
        </Box>
      
        <AddProductModal isOpen={isModalOpen} onClose={handleModalClose} onSave={handleSaveProduct} initialProduct={initialProduct} isEdit={editFlag}/>
        
        </Box>
    );
}

export default Products;