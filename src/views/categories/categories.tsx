import { Box, Button, TextField} from "@mui/material"
import Category from "../../models/category"
import { useEffect, useState } from "react"
import axiosInstance from "../../api/axiosInstance"
import { Columns } from "../../models/columns"
import DeleteIcon from '@mui/icons-material/Delete'
import GenericTable from "../../components/table/genericTable"
import GenericModal from "../../components/modal/genericModal"
import fetchCategories from "../../utils/fetchFunctions/fetchCategories"

const initialCategory:Category={ 
    categoryId:'',
    categoryName:''
}
const Categories=()=>{
   
    const [deleteFlag,_setDeleteFlag]=useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [categoriesData,setCategoriesData]=useState<Category[]>([initialCategory])

    const [newCategory,setNewCategory]=useState<Category>(initialCategory)

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    

    const handleSubmitCategory=async ()=>{
        try {
            await axiosInstance.post('/api/categories', newCategory, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            fetchCategories(setCategoriesData);
            
        } catch (error) {
            console.error('Error saving vendor:', error);
        }
        setNewCategory(initialCategory)
        setIsModalOpen(false)
        
    };

    
    
    
    useEffect(()=>{
        fetchCategories(setCategoriesData)
    },[])

    const handleAddCategory=()=>{
        setIsModalOpen(true)
    }
    const config:Columns<Category>[]=[
        {getHeader:()=>'Settings',
         getValue:(_Category:Category)=><> {deleteFlag? <div style={{width:'50px',height:"20px"}}><Button size='small' onClick={()=>{console.log('')}}><DeleteIcon sx={{color:'#32675B'}}/></Button></div>:<div style={{width:'50px',height:"20px"}}></div>}</>
        },
        {getHeader:()=>'Category Name',
            getValue:(Category:Category)=>Category.categoryName
        }
    ]
    return <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <h1>Categories</h1>
        <Box sx={{display:'flex',flexDirection:"column",alignItems:'center',justifyContent:'center'}}>
            <GenericTable config={config} data={categoriesData}></GenericTable>
            <Box sx={{margin:'5px',display:'flex',gap:'10px'}}>
                <Button variant='contained' sx={{backgroundColor:"#32675B"}} onClick={handleAddCategory}>Add</Button>
                <Button variant='contained' sx={{backgroundColor:"#32675B"}}>Delete</Button>
            </Box>
        </Box>

        <GenericModal isOpen={isModalOpen} onClose={handleModalClose}>
            <h3>Add Category name</h3>
            <TextField label="Category Name" sx={{backgroundColor:'white',color: '#32675B',margin: '5px'}} value={newCategory.categoryName} onChange={(e)=>{
                let tempCategory:Category={
                    categoryId:'',
                    categoryName:e.target.value
                }
                setNewCategory(tempCategory)}} />
            <Button variant='contained' sx={{backgroundColor:"#32675B",":hover":{backgroundColor:'#32675B'}}} onClick={handleSubmitCategory}>Submit</Button>
        </GenericModal>


    </Box>
}



export default Categories