import { Box, Button, TextField, Modal } from '@mui/material';
import { useState } from 'react';
import styles from './addProductsModal.styles';


interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, price: string, description: string) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave }) => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');

    const handleSaveProduct = () => {
        onSave(productName, productPrice, productDescription);
        onClose();
    };

    const isSmallScreen = window.innerWidth < 600;

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
                    label="Price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    fullWidth
                />
                <TextField
                    sx={isSmallScreen ? styles.smallerScreen.textField : styles.largerScreen.textField}
                    label="Description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
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
