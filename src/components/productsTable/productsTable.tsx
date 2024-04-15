import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Product {
    id: number;
    name: string;
    cijena: number;
}

interface ProductTableProps {
    products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
    const renderTableHeaders = () => {
        // useEffect(()=>{console.log(products)},[])
        if (products.length === 0) return null;
        
        // Extract the keys (field names) from the first product object
        const headers = Object.keys(products[0]);

        return (
            <TableRow>
                {headers.map((header,index) => (
                    <TableCell sx={{
                        backgroundColor:'#D0FBE8',
                        fontWeight:'bold',
                        color:"#32675B",
                        borderRight: index !== headers.length - 1 ? '1px solid' : 'none',
                        width: `${100 / headers.length}%`,
                        
                        borderBottom:'1px solid'
                    }} key={header}>{header}</TableCell>
                ))}
            </TableRow>
        );
    };

    return (
        <TableContainer component={Paper} sx={{width:'80%',border:'1px solid ',borderRadius:'25px',boxShadow:'10px 23px 75px -6px rgba(175,242,218,1)'}}>
            <Table sx={{}}>
                <TableHead>
                    {renderTableHeaders()}
                </TableHead>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow key={index}>
                             {Object.values(product).map((value, cellIndex, arr) => (
                                <TableCell
                                    key={cellIndex}
                                    sx={{
                                        borderRight: cellIndex !== arr.length - 1 ? '1px solid' : 'none' ,
                                        borderBottom:'1px solid',
                                        width: `${100 / arr.length}%`
                                    }}
                                >
                                    {value}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
        </TableContainer>
    );
}

export default ProductTable;
