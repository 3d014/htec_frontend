import { Box, Button, TextField, Modal, useMediaQuery, Autocomplete, createFilterOptions } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './addProductsModal.styles';
import { Product } from '../../models/product';
import { toast } from 'react-toastify';
import Category from '../../models/category';
import { v4 as uuidv4 } from "uuid";
import fetchCategories from '../../utils/fetchFunctions/fetchCategories';
import fetchProducts from '../../utils/fetchFunctions/fetchProducts';
import MeasuringUnit from '../../models/measuringUnit';
import fetchMeasuringUnits from '../../utils/fetchFunctions/fetchMeasuringUnits';
import addMeasuringUnit from '../../utils/fetchFunctions/addMeasuringUnit';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    initialProduct: Product | null;
    isEdit: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave, initialProduct, isEdit }) => {
    let measureId=uuidv4()
    const [productId, setProductId] = useState<string | undefined>(undefined);
    const [productName, setProductName] = useState('');
    const [productMeasure, setProductMeasure] = useState<MeasuringUnit | null>({measuringUnitName:'',measuringUnitId:measureId});

    const [productsData, setProductsData] = useState<Product[]>([]);
    const [measuringUnitsData, setMeasuringUnitsData] = useState<MeasuringUnit[]>([]);

    const [measuringUnitInputValue, setMeasuringUnitInputValue] = useState<string>('');
     
    const handleSaveProduct = () => {
        const product: Product = {
            productId,
            productName,
            measuringUnit: productMeasure?.measuringUnitName || '',
            categoryId: selectedCategory?.categoryId
        };

        if (!product.productName || !product.measuringUnit || !product.categoryId) {
            toast.error("Fields can't be empty");
            return;
        }

        if (!isEdit) {
            if (productsData.map(product => product.productName.toLowerCase()).includes(product.productName.toLowerCase())) {
                toast.error("Product already exists");
                return;
            }
        }

        onSave(product);
        setProductName('');
        setProductMeasure({ measuringUnitId: measureId, measuringUnitName: '' });
       
        onClose();
        setSelectedCategory(null);
    };

    const [categoriesData, setCategoriesData] = useState<Category[]>([{
        categoryId: '',
        categoryName: ''
    }]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect( () => {
        fetchProducts(setProductsData);
        fetchCategories(setCategoriesData);
        fetchMeasuringUnits(setMeasuringUnitsData);
        
        if (initialProduct) {
            let id=measuringUnitsData.find((unit)=>{unit.measuringUnitName==initialProduct.measuringUnit})
            setProductId(initialProduct.productId);
            setProductName(initialProduct.productName);
            setProductMeasure({
                measuringUnitName: initialProduct.measuringUnit,
                measuringUnitId: id?.measuringUnitId

            });
            const selectedCategory = categoriesData.find(category => category.categoryId === initialProduct.categoryId) || null;
            setSelectedCategory(selectedCategory);
        } else {
            setProductId(undefined);
            setProductName('');
            
            setProductMeasure({ measuringUnitName: '' , measuringUnitId:measureId});
            setSelectedCategory(null);
        }
    }, [initialProduct]);
    useEffect(() => {
        fetchMeasuringUnits(setMeasuringUnitsData);
    }, []);

    const isSmallScreen = useMediaQuery("(max-width:600px)");

    const filter = createFilterOptions<MeasuringUnit>();

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

                <Autocomplete
                
                    sx={isSmallScreen ? styles.smallerScreen.textField : styles.largerScreen.textField}
                    options={measuringUnitsData}
                    value={productMeasure}
                    inputValue={measuringUnitInputValue}
                    onInputChange={(_, newInputValue) => setMeasuringUnitInputValue(newInputValue)}
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                        return option;
                    }
                    if (option && option.measuringUnitName) {
                        return option.measuringUnitName;
                    }
                    return '';
                    }
                    }
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        const { inputValue } = params;
                        // Suggest the creation of a new measuring unit if it doesn't already exist
                        if (inputValue !== '' && !options.some(option => option.measuringUnitName === inputValue) && inputValue.trim()!=='') {
                            filtered.push({
                                measuringUnitId: measureId,
                                measuringUnitName: inputValue
                            });
                        }
                        return filtered;
                    }}
                    renderInput={(params) => <TextField {...params} label='Measuring Unit' />}
                    renderOption={(props, option) => (
                        <Box component="li" {...props}  key={option.measuringUnitId || uuidv4()}>
                            {option.measuringUnitId === measureId ? (
                                <Button
                                    onClick={async () => {
                                        const newUnit = await addMeasuringUnit(measuringUnitInputValue,measureId);
                                        setMeasuringUnitsData([...measuringUnitsData, newUnit]);
                                        setProductMeasure(newUnit);
                                        fetchMeasuringUnits(setMeasuringUnitsData)
                                    }}
                                >
                                    Add new measuring unit "{measuringUnitInputValue}"
                                </Button>
                            ) : (
                                option.measuringUnitName
                            )}
                        </Box>
                    )}
                    freeSolo
                    
                    onChange={(_event, newValue) => {
                        if(typeof newValue==='string'){}
                        else setProductMeasure(newValue)}}
                        
               
                />

                <Autocomplete
                    sx={{ backgroundColor: "white", color: "#32675B", margin: "5px" }}
                    options={categoriesData}
                    value={selectedCategory}
                    onChange={(_event, newValue) => setSelectedCategory(newValue)}
                    getOptionLabel={(option) => option.categoryName}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                />

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
