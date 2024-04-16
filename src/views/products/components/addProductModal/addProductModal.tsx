import { Box, Button, TextField, Modal, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import styles from './addProductsModal.styles';
import { Product } from '../../../../models/product';


interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product:Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave }) => {
    const [productName, setProductName] = useState('');
    const [productId, setProductId] = useState<number>(parseInt(''));
    const [productMeasure, setProductMeasure] = useState('');

    const handleSaveProduct = () => {
        const product:Product={id:productId,
            name:productName,
            measureUnit:productMeasure}

        onSave(product);
        setProductName('')
        setProductId(parseInt(''))
        setProductMeasure('')
        onClose();
    };

    const isSmallScreen = useMediaQuery("(max-width:600px)");

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
                    label="Id"
                    placeholder='Id'
                    type='number'
                    value={productId}
                    onChange={(e) => setProductId(parseInt(e.target.value))}
                    fullWidth
                />
                <TextField
                    sx={isSmallScreen ? styles.smallerScreen.textField : styles.largerScreen.textField}
                    label="Mjerna jedinica"
                    value={productMeasure}
                    onChange={(e) => setProductMeasure(e.target.value)}
                    fullWidth
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
