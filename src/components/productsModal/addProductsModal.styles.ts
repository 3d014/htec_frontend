interface AddProductModalStyles {
    largerScreen: {
        modal: {
        };
        textField: {
           
        };
        button: {
          
        };
    };
    smallerScreen: {
        modal: {
           
        };
        textField: {
            
        };
        button: {
           
        };
    };
}

const styles: AddProductModalStyles = {
    largerScreen: {
        modal: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#D0FBE8',
            boxShadow: 24,
            p: 4,
            width: '400px',
            borderRadius:'10px',
            color: '#32675B',
        },
        textField: { backgroundColor:'white',
            color: '#32675B',
            margin: '5px',
        },
        button: {
            marginTop: '10px',
            backgroundColor: '#32675B',
        },
    },
    smallerScreen: {
        modal: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#D0FBE8',
            boxShadow: 24,
            p: 4,
            width: '200px',
            borderRadius: '10px',
            color: '#32675B',
        },
        textField: {
            backgroundColor:'white',
            color: '#32675B',
            margin: '5px',
        },
        button: {
            marginTop: '10px',
            backgroundColor: '#32675B',
        },
    },
};

export default styles;
