import { useEffect, useState } from "react";
import GenericTable from "../../components/table/genericTable";
import { Columns } from "../../models/columns";
import Invoice from "../../models/invoice";
import { Product, ProductSumMap } from "../../models/product";
import fetchProducts from "../../utils/fetchFunctions/fetchProducts";
import { Box } from "@mui/material";
import Category from "../../models/category";
import fetchCategories from "../../utils/fetchFunctions/fetchCategories";
import fetchInvoices from "../../utils/fetchFunctions/fetchInvoices";

import axiosInstance from "../../api/axiosInstance";
import fetchProductSum from "../../utils/fetchFunctions/fetchProductSum";
import Budgets from "../budget/budget";


const initialProductSum:ProductSumMap={
  
}

const Home = () => {

  
  const [productsData,setProductsData]=useState<Product[]>([])
  const [categoriesData,setCategoriesData]=useState<Category[]>([])
  const [invoicesData,setInvoicesData]=useState<Invoice[]>([])
  const [productSum,setProductSum]=useState<ProductSumMap>(initialProductSum)
  
  const config: Columns<Product>[] = [
    {
      getHeader:()=>{return 'Product Name'},
      getValue:(product:Product)=>{return product.productName}
    },
    {
      getHeader:()=>{return "Category"},
      getValue:(product:Product)=>{
        const category=categoriesData.find((category)=>category.categoryId==product.categoryId)
        if(category) {return category.categoryName}
        else { return ''}
      }
    },
    {
      getHeader: () => { return 'Total expenditure ( KM )' },
      getValue: (product: Product) => {
        const productId = product.productId;
        if (productId !== undefined && productSum[productId as unknown as number]) {
          return productSum[productId as unknown as number].productSum;
        }
        return '0.00';
      }
    }
  ]


  useEffect(()=>{
    fetchProducts(setProductsData)
    fetchCategories(setCategoriesData)
    fetchInvoices(setInvoicesData)
    fetchProductSum(setProductSum)
 
  
   
  },[])
  return (
    <>
      <Box sx={{width:'90%',display:'flex',flexDirection:'column',alignItems:'center'}}>
       
        <Box sx={{padding:'20px'}}>
          <Budgets></Budgets>
        </Box>

        <Box sx={{padding:'50px'}}>
        <GenericTable config={config} data={productsData}></GenericTable>
        </Box>

      </Box>
      
      </>
  );
};

export default Home;
