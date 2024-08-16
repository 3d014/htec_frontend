import { Box, Button, TextField} from "@mui/material"
import Category from "../../models/category"
import { useEffect, useState } from "react"
import axiosInstance from "../../api/axiosInstance"
import { Columns } from "../../models/columns"
import DeleteIcon from '@mui/icons-material/Delete'
import GenericTable from "../../components/table/genericTable"
import GenericModal from "../../components/modal/genericModal"
import fetchCategories from "../../utils/fetchFunctions/fetchCategories"
import EditIcon from '@mui/icons-material/Edit';
import { toast } from "react-toastify"


const initialCategory:Category={ 
    categoryId:'',
    categoryName:''
}
const Categories=()=>{
   
    const [deleteFlag,setDeleteFlag]=useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category>(initialCategory)
    const [categoriesData,setCategoriesData]=useState<Category[]>([initialCategory])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [newCategory,setNewCategory]=useState<Category>(initialCategory)

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false)
    }
    

    const handleSubmitCategory=async ()=>{
        if(categoriesData.map(category=>category.categoryName.toLowerCase()).includes(newCategory.categoryName.toLowerCase())){
            toast('Category with that name already exists')
            return
        }
            if(newCategory.categoryName==''||newCategory.categoryName==null ||newCategory.categoryName.trim()==''){
                toast('Please enter the category name')
                return
            }
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

    const handleSaveEditCategory = async (newCategory: Category) => {
      
        if(categoriesData.map(category=>category.categoryName.toLowerCase()).includes(newCategory.categoryName.toLowerCase())){
            toast('Category with that name already exists')
            return
        }
        if(newCategory.categoryName==''||newCategory.categoryName==null ||newCategory.categoryName.trim()==''){
            toast('Please enter the category name')
            return
        }
        try {
            await axiosInstance.put('/api/categories', newCategory, {
                headers: { Authorization: localStorage.getItem('token') }
            })
            fetchCategories(setCategoriesData)
            setNewCategory(initialCategory)
            setIsEditModalOpen(false)
            
        } catch(error) {
            console.error('Error saving vendor:', error)
        }
    }
    const handleDeleteCategory = async (category:Category)=>{
        const {categoryId}=category
        if (categoryId){
            await axiosInstance.delete('/api/categories',{headers:{Authorization:localStorage.getItem('token')},data:{categoryId}})
            const filteredCategories: Category[] = categoriesData.filter(item => category.categoryId !== item.categoryId)
            setCategoriesData(filteredCategories)
            setDeleteFlag(!deleteFlag)
        }
        
    }

    const handleEditCategory = async (category: Category) => {
        setCurrentCategory(category)
        setIsEditModalOpen(true)
    }

    
    
    
    useEffect(()=>{
        fetchCategories(setCategoriesData)
    },[])

    const handleAddCategory=()=>{
        setIsModalOpen(true)
    }
    const config:Columns<Category>[]=[
        {getHeader:()=>'Settings',
         getValue:
         (Category:Category) =>
         <> {deleteFlag? <div style={{width:'50px',height:"20px"}}>
            <Button size='small' onClick={()=>{handleDeleteCategory(Category)}}>
                <DeleteIcon sx={{color:'#A82B24'}}/>
            </Button></div> :
            <div style={{width:'50px',height:"20px"}}>
                <Button size='small' onClick={()=>{handleEditCategory(Category)}}>
                    <EditIcon sx={{color:'#32675B'}}/>
                </Button>
                </div>}</>
        },
        {getHeader:()=>'Category Name',
            getValue:(Category:Category)=>Category.categoryName
        },{getHeader:()=>'Category Budget percangate',
            getValue:(Category:Category)=>'50%'
        }
    ]
    return <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <h1>Categories</h1>
        <Box sx={{display:'flex',flexDirection:"column",alignItems:'center',justifyContent:'center'}}>
            <GenericTable config={config} data={categoriesData}></GenericTable>
            <Box sx={{margin:'5px',display:'flex',gap:'10px'}}>
                <Button variant='contained' sx={{backgroundColor:"#32675B"}} onClick={handleAddCategory}>Add</Button>
                <Button variant='contained' sx={deleteFlag?{backgroundColor:"#A82B24"}:{backgroundColor:"#32675B"}} onClick={() => {setDeleteFlag(!deleteFlag)}}>Delete</Button>
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
        <GenericModal isOpen={isEditModalOpen} onClose={handleEditModalClose}>
            <h3>Add Category name</h3>
            <TextField label="Category Name" sx={{backgroundColor:'white',color: '#32675B',margin: '5px'}} value={currentCategory.categoryName} onChange={(e)=>{
                let tempCategory:Category={
                    categoryId:currentCategory.categoryId,
                    categoryName:e.target.value
                }
                setCurrentCategory(tempCategory)}} />
            <Button variant='contained' sx={{backgroundColor:"#32675B",":hover":{backgroundColor:'#32675B'}}} onClick = {() => handleSaveEditCategory(currentCategory)}>Submit</Button>
        </GenericModal>

    </Box>
}



export default Categories